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
  message,
} from "antd";
import {
  UnorderedListOutlined,
  TableOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { scheduleApi } from "@/lib/scheduleApi";
import type { TimetableDay, LessonPeriod } from "@/types";
import dayjs, { Dayjs } from "dayjs";
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

  const [tempDates, setTempDates] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
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

  const validateAndSetRange = (start: Dayjs, end: Dayjs) => {
    const diff = end.diff(start, "day");
    if (Math.abs(diff) > 30) {
      message.warning(
        "Максимальний діапазон — 30 днів. Вибрано перші 30 днів.",
      );
      const clampedEnd = start.add(30, "day");
      setDateRange([
        start.format("YYYY-MM-DD"),
        clampedEnd.format("YYYY-MM-DD"),
      ]);
    } else {
      setDateRange([start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")]);
    }
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
      className="grid-scroll-container"
      style={{
        background: "var(--ant-color-bg-container)",
        border: "1px solid var(--ant-color-border-secondary)",
        borderRadius: 12,
        overflow: "auto",
        maxHeight: "80vh",
        position: "relative",
      }}
    >
      <table
        style={{
          borderCollapse: "separate",
          borderSpacing: 0,
          width: "100%",
          minWidth: isMobile ? 600 : 1000,
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                position: "sticky",
                left: 0,
                top: 0,
                zIndex: 10,
                background: "var(--ant-color-bg-elevated)",
                padding: "12px 8px",
                width: isMobile ? 50 : 70,
                borderBottom: "2px solid var(--ant-color-border)",
                borderRight: "2px solid var(--ant-color-border)",
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                №
              </Text>
            </th>
            {data.map((day) => (
              <th
                key={day.date}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  background: "var(--ant-color-bg-container)",
                  padding: "12px 8px",
                  borderBottom: "2px solid var(--ant-color-border)",
                  borderRight: "1px solid var(--ant-color-border-secondary)",
                  minWidth: isMobile ? 140 : 180,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>
                    {dayjs(day.date).format("DD.MM")}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ant-color-text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    {dayjs(day.date).format("dd")}
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
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 4,
                  background: "var(--ant-color-bg-elevated)",
                  textAlign: "center",
                  borderRight: "2px solid var(--ant-color-border)",
                  borderBottom: "1px solid var(--ant-color-border-secondary)",
                  padding: "16px 4px",
                }}
              >
                <b style={{ fontSize: 16 }}>{num}</b>
                <div style={{ fontSize: 10, opacity: 0.6 }}>
                  {
                    data[0]?.lessons.find((l) => l.number === num)?.periods[0]
                      ?.timeStart
                  }
                </div>
              </td>

              {data.map((day) => {
                const lesson = day.lessons.find((l) => l.number === num);
                return (
                  <td
                    key={day.date}
                    style={{
                      padding: 6,
                      borderRight:
                        "1px solid var(--ant-color-border-secondary)",
                      borderBottom:
                        "1px solid var(--ant-color-border-secondary)",
                      verticalAlign: "top",
                    }}
                  >
                    {lesson?.periods.map((p, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setSelectedLesson({ lesson: p, date: day.date })
                        }
                        style={{
                          padding: "8px",
                          background: "var(--ant-color-fill-alter)",
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: "pointer",
                          height: "100%",
                          minHeight: 60,
                          border: "1px solid transparent",
                          transition: "all 0.2s",
                        }}
                        className="grid-cell-hover"
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            lineHeight: 1.2,
                            marginBottom: 4,
                          }}
                        >
                          {isMobile
                            ? p.disciplineShortName || p.disciplineFullName
                            : p.disciplineFullName}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--ant-color-text-secondary)",
                          }}
                        >
                          {p.teachersName.split(" ").slice(0, 2).join(" ")}
                        </div>
                        {p.classroom && (
                          <div
                            style={{
                              marginTop: 4,
                              fontWeight: "bold",
                              fontSize: 10,
                            }}
                          >
                            🚪 {p.classroom}
                          </div>
                        )}
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
      <style>{`
        .grid-scroll-container::-webkit-scrollbar { width: 6px; height: 6px; }
        .grid-scroll-container::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 10px; }
        .grid-cell-hover:hover { border-color: var(--ant-color-primary) !important; background: var(--ant-color-primary-bg) !important; }
      `}</style>
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
                  onChange={(date) => {
                    if (date) {
                      validateAndSetRange(date, dayjs(dateRange[1]));
                    }
                  }}
                  allowClear={false}
                  placeholder="Старт"
                  style={{ flex: 1 }}
                />
                <DatePicker
                  value={dayjs(dateRange[1])}
                  onChange={(date) => {
                    if (date) {
                      validateAndSetRange(dayjs(dateRange[0]), date);
                    }
                  }}
                  allowClear={false}
                  placeholder="Кінець"
                  style={{ flex: 1 }}
                />
              </div>
            ) : (
              <RangePicker
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onCalendarChange={(val) => setTempDates(val)}
                disabledDate={(current) => {
                  if (!tempDates || !tempDates[0] || tempDates[1]) return false;
                  const diff = current.diff(tempDates[0], "day");
                  return Math.abs(diff) > 30;
                }}
                onChange={(dates) => {
                  if (dates?.[0] && dates?.[1]) {
                    setDateRange([
                      dates[0].format("YYYY-MM-DD"),
                      dates[1].format("YYYY-MM-DD"),
                    ]);
                  }
                  setTempDates(null);
                }}
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
