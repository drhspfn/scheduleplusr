import React from "react";
import { Typography, Button, Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const { selectedStudentId, toggleModal, getCurUni } = useAppStore();
  const navigate = useNavigate();
  const uni = getCurUni();

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
      <CalendarOutlined
        style={{
          fontSize: 64,
          color: "var(--ant-color-primary)",
          marginBottom: 24,
        }}
      />
      <Typography.Title level={2}>Розклад занять</Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 16 }}>
        Швидкий та зручний перегляд розкладу для
        <br />
        <b>{uni.name}</b>
      </Typography.Text>

      <div style={{ marginTop: 40 }}>
        {selectedStudentId ? (
          <Space direction="vertical">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/schedule")}
            >
              Відкрити мій розклад
            </Button>
            <Button type="link" onClick={() => toggleModal("student", true)}>
              Змінити групу
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={() => toggleModal("student", true)}
          >
            Обрати групу
          </Button>
        )}
      </div>
    </div>
  );
};
