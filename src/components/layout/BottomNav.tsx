"use client";

import React from "react";
import { Typography } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleModal, modals } = useAppStore();

  const navItems = [
    { key: "/", icon: <HomeOutlined />, label: "Головна" },
    { key: "/schedule", icon: <CalendarOutlined />, label: "Розклад" },
    { key: "profile", icon: <UserOutlined />, label: "Меню", isSheet: true },
  ];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "var(--ant-color-bg-container)",
        borderTop: "1px solid var(--ant-color-border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.key || (item.isSheet && modals.isMobileMenuOpen);
        const color = isActive
          ? "var(--ant-color-primary)"
          : "var(--ant-color-text-description)";

        return (
          <motion.div
            key={item.key}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (item.isSheet) {
                toggleModal("mobileMenu", true);
              } else {
                router.push(item.key);
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              cursor: "pointer",
              color: color,
              position: "relative",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-line"
                style={{
                  position: "absolute",
                  top: -1,
                  width: "32px",
                  height: "3px",
                  borderRadius: "0 0 4px 4px",
                  background: "var(--ant-color-primary)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <Typography.Text
              style={{ fontSize: 10, color: "inherit", marginTop: 2 }}
            >
              {item.label}
            </Typography.Text>
          </motion.div>
        );
      })}
    </div>
  );
};
