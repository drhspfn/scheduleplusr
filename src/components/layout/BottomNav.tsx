"use client";

import React from "react";
import { Layout, Typography, Space, theme as antTheme } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { accentColor, theme: currentTheme } = useAppStore();
  const { token } = antTheme.useToken();

  const navItems = [
    { key: "/", icon: <HomeOutlined />, label: "Головна" },
    { key: "/schedule", icon: <CalendarOutlined />, label: "Розклад" },
    { key: "student", icon: <UserOutlined />, label: "Профіль", isModal: true },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Налаштув.",
      isModal: true,
    },
  ];

  const { toggleModal } = useAppStore();

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "var(--bg-container)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.key;
        return (
          <div
            key={item.key}
            onClick={() => {
              if (item.isModal) {
                if (item.key === "student") toggleModal("student", true);
                if (item.key === "settings") toggleModal("settings", true);
              } else {
                router.push(item.key);
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              cursor: "pointer",
              color: isActive ? accentColor : "var(--text)",
              transition: "all 0.3s",
              opacity: isActive ? 1 : 0.45,
            }}
          >
            <span
              style={{
                fontSize: 20,
                color: isActive ? accentColor : "var(--text)",
                opacity: isActive ? 1 : 0.45,
              }}
            >
              {item.icon}
            </span>
            <Typography.Text
              style={{
                fontSize: 10,
                color: isActive ? accentColor : "var(--text)",
                opacity: isActive ? 1 : 0.45,
                marginTop: 4,
              }}
            >
              {item.label}
            </Typography.Text>
          </div>
        );
      })}
    </div>
  );
};
