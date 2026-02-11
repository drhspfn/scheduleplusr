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
          token: { colorPrimary: accentColor, borderRadius: 12 },
        }}
      >
        <AntApp>
          <Layout style={{ minHeight: "100vh" }}>
            <AppHeader />
            <Layout.Content style={{ padding: 16 }}>{children}</Layout.Content>
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
