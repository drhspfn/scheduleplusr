"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Space,
  Divider,
  Empty,
  Tag,
  DatePicker,
  Segmented,
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
import { AppLoader } from "../shared/AppLoader";
import { LessonDetailsModal } from "./LessonDetailsModal";

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
          icsContent += `DTSTART:${start}\nDTEND:${end}\nSUMMARY:${p.disciplineFullName}\n`;
          icsContent += `DESCRIPTION:Викладач: ${p.teachersName}, Тип: ${p.typeStr}\nLOCATION:${p.classroom}\nEND:VEVENT\n`;
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

  const renderListView = () => (
    <div className="list-view">
      {data.map((day) => (
        <div key={day.date} style={{ marginBottom: 24 }}>
          <Divider orientation="horizontal" plain style={{ margin: "16px 0" }}>
            <span style={{ fontWeight: "bold", fontSize: 16 }}>
              {dayjs(day.date).format("dddd, DD MMMM")}
            </span>
          </Divider>
          <div
            className="lessons-column"
            style={{
              border: "1px solid var(--ant-color-border)",
              borderRadius: "var(--ant-border-radius)",
              background: "var(--ant-color-bg-container)",
            }}
          >
            {day.lessons.map((lesson) => (
              <Card
                key={lesson.number}
                className="lesson-card-horizontal"
                hoverable
                onClick={() =>
                  lesson.periods[0] &&
                  setSelectedLesson({
                    lesson: lesson.periods[0],
                    date: day.date,
                  })
                }
                style={{
                  cursor: "pointer",
                  background: "transparent",
                  borderBottom: "1px solid var(--ant-color-split)",
                }}
                styles={{ body: { padding: "12px 16px" } }}
                bordered={false}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div
                    style={{
                      minWidth: 50,
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
                  <div style={{ flex: 1 }}>
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

  const renderGridView = () => (
    <div
      className="grid-container"
      style={{
        background: "var(--ant-color-bg-container)",
        border: "1px solid var(--ant-color-border)",
        borderRadius: "var(--ant-border-radius)",
        overflowX: "auto",
        maxWidth: "100%",
        display: "block",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <table
        className="schedule-table"
        style={{
          borderColor: "var(--ant-color-border-secondary)",
          width: "max-content",
          minWidth: "100%",
        }}
      >
        <thead>
          <tr>
            <th
              className="sticky-col"
              style={{
                background: "var(--ant-color-bg-container)",
                borderColor: "var(--ant-color-border-secondary)",
                width: 50,
                minWidth: 50,
                textAlign: "center",
              }}
            >
              <Text strong>Пара</Text>
            </th>
            {data.map((day) => (
              <th
                key={day.date}
                style={{
                  borderColor: "var(--ant-color-border-secondary)",
                  minWidth: 120,
                }}
              >
                <div className="date-header">
                  <div>{dayjs(day.date).format("DD.MM")}</div>
                  <div
                    className="day-name-short"
                    style={{ color: "var(--ant-color-text-secondary)" }}
                  >
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
              <td
                className="lesson-num-cell sticky-col"
                style={{
                  background: "var(--ant-color-bg-container)",
                  borderColor: "var(--ant-color-border-secondary)",
                  width: 50,
                  minWidth: 50,
                  textAlign: "center",
                }}
              >
                <b style={{ display: "block" }}>{num}</b>
                <span style={{ fontSize: 10, opacity: 0.6 }}>
                  {data[0]?.lessons.find((l) => l.number === num)?.periods[0]
                    ?.timeStart || ""}
                </span>
              </td>
              {data.map((day) => {
                const lesson = day.lessons.find((l) => l.number === num);
                return (
                  <td
                    key={day.date}
                    className="lesson-cell"
                    style={{ borderColor: "var(--ant-color-border-secondary)" }}
                  >
                    {lesson?.periods.map((p, i) => (
                      <div
                        key={i}
                        className="grid-lesson-item"
                        onClick={() =>
                          setSelectedLesson({ lesson: p, date: day.date })
                        }
                        style={{ cursor: "pointer", padding: "8px 4px" }}
                      >
                        <div
                          className="grid-subject"
                          style={{ fontSize: 12, lineHeight: 1.2 }}
                        >
                          {p.disciplineShortName || p.disciplineFullName}
                        </div>
                        <div
                          className="grid-teacher"
                          style={{
                            color: "var(--ant-color-text-secondary)",
                            fontSize: 10,
                          }}
                        >
                          {p.teachersName}
                        </div>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            <InfoCircleOutlined
                              style={{
                                color: "var(--ant-color-text-description)",
                                fontSize: 12,
                              }}
                            />
                          }
                          className="detail-btn"
                          style={{ position: "absolute", right: 2, top: 2 }}
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

  if (loading) return <AppLoader />;

  return (
    <div style={{ paddingBottom: 60 }}>
      <Card
        style={{ marginBottom: 12, borderRadius: 12 }}
        styles={{ body: { padding: 12 } }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            {isMobile ? (
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <DatePicker
                  value={dayjs(dateRange[0])}
                  onChange={(date) =>
                    date &&
                    setDateRange([date.format("YYYY-MM-DD"), dateRange[1]])
                  }
                  allowClear={false}
                  placeholder="Старт"
                  style={{ flex: 1 }}
                />
                <DatePicker
                  value={dayjs(dateRange[1])}
                  onChange={(date) =>
                    date &&
                    setDateRange([dateRange[0], date.format("YYYY-MM-DD")])
                  }
                  allowClear={false}
                  placeholder="Кінець"
                  style={{ flex: 1 }}
                />
              </div>
            ) : (
              <RangePicker
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={(dates) =>
                  dates?.[0] &&
                  dates?.[1] &&
                  setDateRange([
                    dates[0].format("YYYY-MM-DD"),
                    dates[1].format("YYYY-MM-DD"),
                  ])
                }
                allowClear={false}
                style={{ flex: 1 }}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong style={{ color: "var(--ant-color-primary)" }}>
              {selectedGroupName}
            </Text>
            <Button onClick={exportToICS} size="small" type="dashed">
              Експорт .ics
            </Button>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Segmented
          block
          size="large"
          value={viewMode}
          onChange={(v) => setViewMode(v as "list" | "grid")}
          options={[
            { label: "Список", value: "list", icon: <UnorderedListOutlined /> },
            { label: "Таблиця", value: "grid", icon: <TableOutlined /> },
          ]}
        />
      </div>

      {data.length === 0 ? (
        <Empty
          style={{ marginTop: 40 }}
          description="Розклад не знайдено для обраного періоду"
        />
      ) : viewMode === "list" ? (
        renderListView()
      ) : (
        renderGridView()
      )}

      <LessonDetailsModal
        selectedLesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
    </div>
  );
};
