import React from "react";
import { ConfigProvider, Layout, theme as antTheme, App as AntApp } from "antd";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { useAppStore } from "./store/useAppStore";
import { AppHeader } from "./components/layout/AppHeader";
import { UniversityModal } from "./components/modals/UniversityModal";
import { StudentModal } from "./components/modals/StudentModal";
import { SchedulePage } from "./pages/SchedulePage";
import { HomePage } from "./pages/HomePage";
import dayjs from "dayjs";
import "dayjs/locale/uk";

dayjs.locale("uk");

const App: React.FC = () => {
  const { theme, accentColor } = useAppStore();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: { colorPrimary: accentColor, borderRadius: 12 },
      }}
    >
      <AntApp>
        <HashRouter>
          <Layout style={{ minHeight: "100vh" }}>
            <AppHeader />

            <Layout.Content style={{ padding: 16 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout.Content>
            <UniversityModal />
            <StudentModal />
          </Layout>
        </HashRouter>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
