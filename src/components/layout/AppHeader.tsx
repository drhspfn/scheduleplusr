"use client";

import React from "react";
import { Layout, Button, Space, Typography, theme as antTheme } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  BankOutlined,
  UserOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const {
    theme,
    accentColor,
    setTheme,
    toggleModal,
    selectedGroupName,
    getCurUni,
  } = useAppStore();

  const curUni = getCurUni();

  const { token } = antTheme.useToken();

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
        background: token.colorBgContainer,
        boxShadow:
          theme === "dark"
            ? "0 2px 8px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
      }}
    >
      <Space style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
        <BankOutlined style={{ fontSize: "22px", color: accentColor }} />
        <Typography.Text
          strong
          style={{ fontSize: 16, maxWidth: 200, display: "block" }}
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
        {selectedGroupName ? (
          <Button type="default" onClick={() => toggleModal("student", true)}>
            <UserOutlined /> {selectedGroupName}
          </Button>
        ) : (
          <Button type="primary" onClick={() => toggleModal("student", true)}>
            Увійти
          </Button>
        )}

        <Button
          shape="circle"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </Space>
    </Header>
  );
};
