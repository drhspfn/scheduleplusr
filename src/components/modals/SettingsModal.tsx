"use client";

import React from "react";
import { Modal, List, Typography, Space } from "antd";
import { useAppStore } from "@/store/useAppStore";

export const SettingsModal: React.FC = () => {
  const { modals, toggleModal } = useAppStore();

  return (
    <Modal
      title="Налаштування"
      open={modals.isSettingsOpen}
      onCancel={() => toggleModal("settings", false)}
      footer={null}
    >
      <List split={false}>
        <List.Item style={{ padding: "12px 24px" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
          
            <Typography.Text type="secondary">more</Typography.Text>
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
