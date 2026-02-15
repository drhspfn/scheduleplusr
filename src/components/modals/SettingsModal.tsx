"use client";

import React from "react";
import { Modal, List, Typography, Space, ColorPicker, Segmented } from "antd";
import { useAppStore } from "@/store/useAppStore";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

export const SettingsModal: React.FC = () => {
  const { modals, toggleModal, theme, setTheme, accentColor, setAccentColor } =
    useAppStore();

  return (
    <Modal
      title="Налаштування"
      open={modals.isSettingsOpen}
      onCancel={() => toggleModal("settings", false)}
      footer={null}
      centered
      width={400}
    >
      <List split={true}>
        <List.Item style={{ padding: "16px 0" }}>
          <Space direction="vertical" style={{ width: "100%" }} size={4}>
            <Typography.Text strong>Тема оформлення</Typography.Text>
            <Segmented
              block
              value={theme}
              onChange={(value) => setTheme(value as "light" | "dark")}
              options={[
                { label: "Світла", value: "light", icon: <SunOutlined /> },
                { label: "Темна", value: "dark", icon: <MoonOutlined /> },
              ]}
            />
          </Space>
        </List.Item>

        <List.Item style={{ padding: "16px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Space direction="vertical" size={0}>
              <Typography.Text strong>Колір акценту</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Основний колір інтерфейсу
              </Typography.Text>
            </Space>

            <ColorPicker
              value={accentColor}
              onChange={(color) => setAccentColor(color.toHexString())}
              showText
              disabledAlpha
              style={{
                width: 150,
               
                justifyContent: "flex-start",
              }}
              presets={[
                {
                  label: "Рекомендовані",
                  colors: [
                    "#1677ff",
                    "#722ed1",
                    "#13c2c2",
                    "#52c41a",
                    "#f5222d",
                    "#fa8c16",
                  ],
                },
              ]}
            />
          </div>
        </List.Item>
      </List>

      <div style={{ padding: "24px 0 8px", textAlign: "center" }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          SchedulePlus Reborn v1.0.0
        </Typography.Text>
      </div>
    </Modal>
  );
};
