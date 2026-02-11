"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Space,
  Divider,
  Empty,
  Spin,
  Tag,
  DatePicker,
  Segmented,
  Modal,
  Button,
  Grid,
} from "antd";
import {
  UnorderedListOutlined,
  TableOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { scheduleApi } from "@/lib/scheduleApi";
import type { TimetableDay, LessonPeriod } from "@/types";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

export const TimetableDisplay: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md && screens.xs !== undefined;

  const {
    selectedStudentId,
    selectedGroupName,
    selectedUniId,
    viewMode,
    setViewMode,
    dateRange,
    setDateRange,
  } = useAppStore();

  const [data, setData] = useState<TimetableDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    lesson: LessonPeriod;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (selectedStudentId && selectedUniId) {
      setLoading(true);
      scheduleApi
        .getTimetable(selectedStudentId, dateRange[0], dateRange[1])
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [selectedStudentId, selectedUniId, dateRange]);

  const allLessonNumbers = useMemo(() => {
    const numbers = new Set<number>();
    data.forEach((day) => day.lessons.forEach((l) => numbers.add(l.number)));
    return Array.from(numbers).sort((a, b) => a - b);
  }, [data]);

  const getGoogleCalendarUrl = (lesson: LessonPeriod, date: string) => {
    const start = dayjs(
      `${date} ${lesson.timeStart}`,
      "YYYY-MM-DD HH:mm",
    ).format("YYYYMMDDTHHmmss");
    const end = dayjs(`${date} ${lesson.timeEnd}`, "YYYY-MM-DD HH:mm").format(
      "YYYYMMDDTHHmmss",
    );

    const title = encodeURIComponent(lesson.disciplineFullName);
    const details = encodeURIComponent(
      `Викладач: ${lesson.teachersName}\nТип: ${lesson.typeStr}\n${lesson.notice || ""}`,
    );
    const location = encodeURIComponent(lesson.classroom);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const exportToICS = () => {
    let icsContent =
      "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SchedulePlusReborn//UA\nCALSCALE:GREGORIAN\n";

    data.forEach((day) => {
      day.lessons.forEach((lesson) => {
        lesson.periods.forEach((p) => {
          const start = dayjs(
            `${day.date} ${p.timeStart}`,
            "YYYY-MM-DD HH:mm",
          ).format("YYYYMMDDTHHmmss");
          const end = dayjs(
            `${day.date} ${p.timeEnd}`,
            "YYYY-MM-DD HH:mm",
          ).format("YYYYMMDDTHHmmss");

          icsContent += "BEGIN:VEVENT\n";
          icsContent += `DTSTART:${start}\n`;
          icsContent += `DTEND:${end}\n`;
          icsContent += `SUMMARY:${p.disciplineFullName}\n`;
          icsContent += `DESCRIPTION:Викладач: ${p.teachersName}, Тип: ${p.typeStr}\n`;
          icsContent += `LOCATION:${p.classroom}\n`;
          icsContent += "END:VEVENT\n";
        });
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `schedule_${selectedGroupName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );

  return (
    <div style={{ paddingBottom: 40 }}>
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: 12 } }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              flex: 1,
              minWidth: isMobile ? "100%" : 280,
            }}
          >
            {isMobile ? (
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <DatePicker
                  value={dayjs(dateRange[0])}
                  onChange={(date) => {
                    if (date)
                      setDateRange([date.format("YYYY-MM-DD"), dateRange[1]]);
                  }}
                  allowClear={false}
                  placeholder="Старт"
                  style={{ flex: 1 }}
                />
                <DatePicker
                  value={dayjs(dateRange[1])}
                  onChange={(date) => {
                    if (date)
                      setDateRange([dateRange[0], date.format("YYYY-MM-DD")]);
                  }}
                  allowClear={false}
                  placeholder="Кінець"
                  style={{ flex: 1 }}
                />
              </div>
            ) : (
              <RangePicker
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([
                      dates[0].format("YYYY-MM-DD"),
                      dates[1].format("YYYY-MM-DD"),
                    ]);
                  }
                }}
                allowClear={false}
                placeholder={["Початок", "Кінець"]}
                style={{ flex: 1, minWidth: 200 }}
              />
            )}
            <Segmented
              value={viewMode}
              onChange={(v) => setViewMode(v as "list" | "grid")}
              options={[
                { value: "list", icon: <UnorderedListOutlined /> },
                { value: "grid", icon: <TableOutlined /> },
              ]}
              style={{
                width: isMobile ? "100%" : "auto",
                display: "flex",
                justifyContent: "center",
              }}
            />
            <Button
              onClick={exportToICS}
              style={{ width: isMobile ? "100%" : "auto" }}
            >
              Експорт .ics (для Google/iOS)
            </Button>
          </div>
          <Text
            strong
            style={{
              whiteSpace: "nowrap",
              width: isMobile ? "100%" : "auto",
              textAlign: isMobile ? "center" : "right",
            }}
          >
            {selectedGroupName}
          </Text>
        </div>
      </Card>

      {data.length === 0 ? (
        <Empty description="Розклад не знайдено для обраного періоду" />
      ) : viewMode === "list" ? (
        renderListView(data, (lesson, date) =>
          setSelectedLesson({ lesson, date }),
        )
      ) : (
        renderGridView(data, allLessonNumbers, (lesson, date) =>
          setSelectedLesson({ lesson, date }),
        )
      )}

      <Modal
        title="Деталі заняття"
        open={!!selectedLesson}
        onCancel={() => setSelectedLesson(null)}
        footer={[
          <Button
            key="google"
            type="primary"
            onClick={() =>
              window.open(
                getGoogleCalendarUrl(
                  selectedLesson!.lesson,
                  selectedLesson!.date,
                ),
                "_blank",
              )
            }
          >
            Додати в Google Календар
          </Button>,
          <Button key="close" onClick={() => setSelectedLesson(null)}>
            Закрити
          </Button>,
        ]}
      >
        {selectedLesson && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>{selectedLesson.lesson.disciplineFullName}</Title>
            <Divider style={{ margin: "12px 0" }} />
            <Text>
              <b>Викладач:</b> {selectedLesson.lesson.teachersName}
            </Text>
            <Text>
              <b>Тип:</b>{" "}
              <Tag color="blue">{selectedLesson.lesson.typeStr}</Tag>
            </Text>
            <Text>
              <b>Час:</b> {selectedLesson.lesson.timeStart} —{" "}
              {selectedLesson.lesson.timeEnd}
            </Text>
            <Text>
              <b>Аудиторія:</b> {selectedLesson.lesson.classroom}
            </Text>
            {selectedLesson.lesson.notice && (
              <div
                className="lesson-notice-modal"
                dangerouslySetInnerHTML={{
                  __html: selectedLesson.lesson.notice,
                }}
              />
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

const renderListView = (
  data: TimetableDay[],
  onShowDetail: (l: LessonPeriod, date: string) => void,
) => (
  <div className="list-view">
    {data.map((day) => (
      <div key={day.date} style={{ marginBottom: 24 }}>
        <Divider orientation="horizontal" plain style={{ margin: "16px 0" }}>
          <span style={{ fontWeight: "bold", fontSize: 16 }}>
            {dayjs(day.date).format("dddd, DD MMMM")}
          </span>
        </Divider>
        <div className="lessons-column">
          {day.lessons.map((lesson) => (
            <Card
              key={lesson.number}
              className="lesson-card-horizontal"
              hoverable
              onClick={() =>
                lesson.periods[0] && onShowDetail(lesson.periods[0], day.date)
              }
              style={{ cursor: "pointer" }}
              styles={{ body: { padding: "12px 16px" } }}
            >
              <div
                className="lesson-flex-container"
                style={{ display: "flex", gap: 16, alignItems: "center" }}
              >
                <div
                  className="time-side"
                  style={{
                    minWidth: 60,
                    textAlign: "center",
                    borderRight: "2px solid var(--ant-color-primary)",
                    paddingRight: 12,
                  }}
                >
                  <Title level={4} style={{ margin: 0, lineHeight: 1 }}>
                    {lesson.number}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {lesson.periods[0]?.timeStart}
                  </Text>
                </div>
                <div className="content-side" style={{ flex: 1 }}>
                  {lesson.periods.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: i === lesson.periods.length - 1 ? 0 : 8,
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          display: "block",
                          lineHeight: 1.2,
                        }}
                      >
                        {p.disciplineFullName}
                      </Text>
                      <Space
                        wrap
                        size={[8, 4]}
                        style={{ fontSize: 12, marginTop: 4 }}
                      >
                        <Tag style={{ margin: 0 }}>{p.typeStr}</Tag>
                        <Text type="secondary">{p.teachersName}</Text>
                        {p.classroom && <Text strong>{p.classroom}</Text>}
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const renderGridView = (
  data: TimetableDay[],
  allLessonNumbers: number[],
  onShowDetail: (l: LessonPeriod, date: string) => void,
) => (
  <div className="grid-container">
    <table className="schedule-table">
      <thead>
        <tr>
          <th className="sticky-col">Пара</th>
          {data.map((day) => (
            <th key={day.date}>
              <div className="date-header">
                <div>{dayjs(day.date).format("DD.MM")}</div>
                <div className="day-name-short">
                  {dayjs(day.date).format("ddd")}
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allLessonNumbers.map((num) => (
          <tr key={num}>
            <td className="lesson-num-cell sticky-col">
              <b>{num}</b>
            </td>
            {data.map((day) => {
              const lesson = day.lessons.find((l) => l.number === num);
              return (
                <td key={day.date} className="lesson-cell">
                  {lesson?.periods.map((p, i) => (
                    <div
                      key={i}
                      className="grid-lesson-item"
                      onClick={() => onShowDetail(p, day.date)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="grid-subject">
                        {p.disciplineShortName || p.disciplineFullName}
                      </div>
                      <div className="grid-teacher">{p.teachersName}</div>
                      <Button
                        type="text"
                        size="small"
                        icon={<InfoCircleOutlined />}
                        className="detail-btn"
                      />
                    </div>
                  ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
