"use client";

import React from "react";
import { Modal, Button, Space, Typography, Divider, Tag } from "antd";
import dayjs from "dayjs";
import type { LessonPeriod } from "@/types";

const { Text, Title } = Typography;

interface LessonDetailsModalProps {
  selectedLesson: {
    lesson: LessonPeriod;
    date: string;
  } | null;
  onClose: () => void;
}

export const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({
  selectedLesson,
  onClose,
}) => {
  const getGoogleCalendarUrl = (lesson: LessonPeriod, date: string) => {
    const start = dayjs(`${date} ${lesson.timeStart}`, "YYYY-MM-DD HH:mm").format("YYYYMMDDTHHmmss");
    const end = dayjs(`${date} ${lesson.timeEnd}`, "YYYY-MM-DD HH:mm").format("YYYYMMDDTHHmmss");
    
    const title = encodeURIComponent(lesson.disciplineFullName);
    const details = encodeURIComponent(
      `Викладач: ${lesson.teachersName}\nТип: ${lesson.typeStr}\n${lesson.notice || ""}`
    );
    const location = encodeURIComponent(lesson.classroom);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  if (!selectedLesson) return null;

  const { lesson, date } = selectedLesson;

  return (
    <Modal
      title="Деталі заняття"
      open={!!selectedLesson}
      onCancel={onClose}
      footer={[
        <Button 
          key="google" 
          type="primary" 
          onClick={() => window.open(getGoogleCalendarUrl(lesson, date), "_blank")}
        >
          Додати в Google Календар
        </Button>,
        <Button 
          key="close" 
          onClick={onClose} 
          style={{ background: "transparent" }}
        >
          Закрити
        </Button>,
      ]}
      styles={{ mask: { backdropFilter: 'blur(4px)' } }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={4}>{lesson.disciplineFullName}</Title>
        <Divider style={{ margin: "12px 0" }} />
        
        <Text><b>Викладач:</b> {lesson.teachersName}</Text>
        <Text><b>Тип:</b> <Tag color="blue">{lesson.typeStr}</Tag></Text>
        <Text><b>Час:</b> {lesson.timeStart} — {lesson.timeEnd}</Text>
        <Text><b>Аудиторія:</b> {lesson.classroom}</Text>
        
        {lesson.notice && (
          <div
            className="lesson-notice-modal"
            style={{ 
              background: "var(--ant-color-fill-tertiary)", 
              padding: 12, 
              borderRadius: 8,
              marginTop: 8
            }}
            dangerouslySetInnerHTML={{ __html: lesson.notice }}
          />
        )}
      </Space>
    </Modal>
  );
};