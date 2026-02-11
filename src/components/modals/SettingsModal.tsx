"use client";

import React from "react";
import { Modal, Switch, List, Typography, Space, Divider, Button } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  BankOutlined,
  GlobalOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";

export const SettingsModal: React.FC = () => {
  const { modals, toggleModal, theme, setTheme, getCurUni, accentColor } =
    useAppStore();
  const curUni = getCurUni();

  return (
    <Modal
      title="Налаштування"
      open={modals.isSettingsOpen}
      onCancel={() => toggleModal("settings", false)}
      footer={null}
      styles={{ body: { padding: "12px 0" } }}
    >
      <List split={false}>
        <List.Item style={{ padding: "12px 24px" }}>
          <Space
            orientation="horizontal"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Space>
              {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
              <Typography.Text>Темна тема</Typography.Text>
            </Space>
            <Switch
              checked={theme === "dark"}
              onChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </Space>
        </List.Item>

        <Divider style={{ margin: "4px 0" }} />

        <List.Item style={{ padding: "12px 24px" }}>
          <div style={{ width: "100%" }}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, display: "block", marginBottom: 4 }}
            >
              Ваш навчальний заклад
            </Typography.Text>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Space>
                <BankOutlined style={{ color: accentColor }} />
                <Typography.Text strong>{curUni.name}</Typography.Text>
              </Space>
              <Button
                type="text"
                icon={<SwapOutlined />}
                onClick={() => {
                  toggleModal("settings", false);
                  toggleModal("uni", true);
                }}
              >
                Змінити
              </Button>
            </Space>
          </div>
        </List.Item>

        <Divider style={{ margin: "4px 0" }} />

        <List.Item style={{ padding: "12px 24px" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Space>
              <GlobalOutlined />
              <Typography.Text>Мова додатка</Typography.Text>
            </Space>
            <Typography.Text type="secondary">Українська</Typography.Text>
          </Space>
        </List.Item>
      </List>

      <div style={{ padding: "16px 24px", textAlign: "center" }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          SchedulePlus Reborn v1.0.0
        </Typography.Text>
      </div>
    </Modal>
  );
};
