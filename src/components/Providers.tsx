"use client";

import React, { useMemo } from "react";
import { ConfigProvider, theme as antTheme, App as AntApp, Layout } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { useAppStore } from "@/store/useAppStore";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { UniversityModal } from "@/components/modals/UniversityModal";
import { StudentModal } from "@/components/modals/StudentModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { MobileMenuSheet } from "./layout/MobileMenuSheet";
import dayjs from "dayjs";
import "dayjs/locale/uk";

dayjs.locale("uk");

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, accentColor } = useAppStore();
  const isDark = theme === "dark";

  const themeConfig = useMemo(() => {
    const bgValue = isDark ? "#1f1f1f" : "#ffffff";

    return {
      algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: accentColor,
        borderRadius: 12,
        colorBgContainer: bgValue,
        colorBgElevated: bgValue,
        colorBgLayout: isDark ? "#000000" : "#f5f5f5",
      },
      components: {
        Layout: {
          headerBg: "var(--ant-color-bg-container)", 
          bodyBg: "var(--ant-color-bg-layout)",
          headerPadding: "0 16px",
        },
        Modal: {
          contentBg: "var(--ant-color-bg-container)",
          headerBg: "var(--ant-color-bg-container)",
        },
        Input: { colorBgContainer: "var(--ant-color-bg-container)" },
        Select: { selectorBg: "var(--ant-color-bg-container)" }
      },
      cssVar: { key: "app", prefix: "ant" },
    };
  }, [isDark, accentColor]);

  return (
    <StyledComponentsRegistry>
      <StyleProvider hashPriority="high" cache={useMemo(() => createCache(), [])}>
        <ConfigProvider theme={themeConfig} key={theme}>
          <AntApp>
            <Layout className={isDark ? "theme-dark" : "theme-light"} style={{ minHeight: "100vh" }}>
              <AppHeader />
              <Layout.Content>{children}</Layout.Content>
              <BottomNav />
              <UniversityModal />
              <StudentModal />
              <SettingsModal />
              <MobileMenuSheet />
            </Layout>
          </AntApp>
        </ConfigProvider>
      </StyleProvider>
    </StyledComponentsRegistry>
  );
}