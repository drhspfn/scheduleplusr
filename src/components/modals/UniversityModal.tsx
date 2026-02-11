"use client";

"use client";

import React, { useState } from "react";
import { Modal, List, Input, Avatar } from "antd";
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
        renderItem={(item) => (
          <List.Item
            style={{
              cursor: "pointer",
              background:
                item.id === selectedUniId
                  ? "var(--ant-color-primary-bg)"
                  : "transparent",
              borderRadius: 8,
              padding: "8px 12px",
            }}
            onClick={() => setUni(item.id)}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<BankOutlined />}
                  style={{ backgroundColor: "var(--ant-color-primary)" }}
                />
              }
              title={item.name}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};
