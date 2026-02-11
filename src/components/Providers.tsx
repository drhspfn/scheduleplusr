"use client";

import React from "react";
import { ConfigProvider, theme as antTheme, App as AntApp, Layout } from "antd";
import { useAppStore } from "@/store/useAppStore";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { UniversityModal } from "@/components/modals/UniversityModal";
import { StudentModal } from "@/components/modals/StudentModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import dayjs from "dayjs";
import "dayjs/locale/uk";

dayjs.locale("uk");

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, accentColor } = useAppStore();

  return (
    <StyledComponentsRegistry>
      <ConfigProvider
        theme={{
          algorithm:
            theme === "dark"
              ? antTheme.darkAlgorithm
              : antTheme.defaultAlgorithm,
          token: {
            colorPrimary: accentColor,
            borderRadius: 12,
          },
          cssVar: { key: "app" },
        }}
      >
        <AntApp
          style={{
            minHeight: "100vh",
            backgroundColor: theme === "dark" ? "#141414" : "#f5f5f5",
            transition: "background-color 0.3s ease",
          }}
        >
          <Layout style={{ minHeight: "100vh", background: "transparent" }}>
            <AppHeader />
            <Layout.Content
              style={{
                padding: 16,
                minHeight: "calc(100vh - 64px)",
              }}
            >
              {children}
            </Layout.Content>
            <BottomNav />
            <UniversityModal />
            <StudentModal />
            <SettingsModal />
          </Layout>
        </AntApp>
      </ConfigProvider>
    </StyledComponentsRegistry>
  );
}
