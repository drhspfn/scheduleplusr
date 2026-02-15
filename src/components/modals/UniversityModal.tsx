"use client";

import React, { useState } from "react";
import { Modal, List, Input, Avatar, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { UNIVERSITIES } from "@/config/universities";

export const UniversityModal: React.FC = () => {
  const { modals, toggleModal, setUni, selectedUniId } = useAppStore();
  const [search, setSearch] = useState("");

  const filtered = UNIVERSITIES.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      title="Оберіть університет"
      open={modals.isUniSearchOpen}
      onCancel={() => toggleModal("uni", false)}
      footer={null}
    >
      <Input.Search
        placeholder="Пошук ВНЗ..."
        style={{ marginBottom: 16 }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <List
        dataSource={filtered}
        renderItem={(item) => {
          const isSelected = item.id === selectedUniId;
          
          return (
            <List.Item
              style={{
                cursor: "pointer",
                background: isSelected ? "var(--ant-color-primary-bg)" : "transparent",
                borderRadius: 8,
                padding: "8px 12px",
                border: isSelected 
                  ? "1px solid var(--ant-color-primary)" 
                  : "1px solid transparent",
                marginBottom: 4,
                transition: "all 0.2s"
              }}
              onClick={() => setUni(item.id)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<BankOutlined />}
                    style={{ 
                      backgroundColor: isSelected 
                        ? "var(--ant-color-primary)" 
                        : "var(--ant-color-fill-secondary)",
                      color: isSelected ? "#fff" : "var(--ant-color-text-secondary)"
                    }}
                  />
                }
                title={
                  <Typography.Text strong={isSelected}>
                    {item.name}
                  </Typography.Text>
                }
                description={
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {item.description}
                  </Typography.Text>
                }
              />
            </List.Item>
          )
        }}
      />
    </Modal>
  );
};