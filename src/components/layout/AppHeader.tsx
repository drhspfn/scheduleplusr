"use client";

import React from "react";
import { Layout, Button, Space, Typography, Dropdown, Avatar, MenuProps } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  BankOutlined,
  UserOutlined,
  SwapOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const {
    theme,
    setTheme,
    toggleModal,
    selectedGroupName,
    selectedStudentId,
    setStudent,
    getCurUni,
  } = useAppStore();

  const curUni = getCurUni();

  const profileMenu: MenuProps["items"] = [
    {
      key: "group_info",
      label: <Typography.Text strong>{selectedGroupName}</Typography.Text>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "change_student",
      icon: <UserOutlined />,
      label: "Змінити студента",
      onClick: () => toggleModal("student", true),
    },
    {
      key: "change_uni",
      icon: <SwapOutlined />,
      label: "Змінити ВНЗ",
      onClick: () => toggleModal("uni", true),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Налаштування",
      onClick: () => toggleModal("settings", true),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Вийти",
      onClick: () => setStudent(null, null),
    },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid var(--ant-color-border)", 
        boxShadow: theme === 'dark' ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
      }}
    >
      <Space style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
        <BankOutlined style={{ fontSize: "22px" }} />
        
        <Typography.Text
          strong
          style={{ 
            fontSize: 16, 
            maxWidth: 200, 
            display: "block",
          }}
          ellipsis={{ tooltip: curUni.name }}
        >
          {curUni.name}
        </Typography.Text>
        
        <Button
          type="text"
          size="small"
          icon={<SwapOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            toggleModal("uni", true);
          }}
        />
      </Space>

      <Space>
        {selectedStudentId ? (
          <Dropdown menu={{ items: profileMenu }} trigger={["click"]} placement="bottomRight">
            <Button 
              type="default" 
              style={{ 
                background: 'transparent',
                borderColor: "var(--ant-color-border)",
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8, backgroundColor: 'var(--ant-color-primary)' }} />
              <span className="desktop-only">{selectedGroupName}</span>
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => toggleModal("student", true)}>
            Увійти
          </Button>
        )}

        <Button
          type="text"
          shape="circle"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </Space>
    </Header>
  );
};