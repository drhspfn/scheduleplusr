"use client";

import {
  Drawer,
  List,
  Space,
  Typography,
  Avatar,
  Button,
  Switch,
} from "antd";
import {
  UserOutlined,
  BankOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";

export const MobileMenuSheet = () => {
  const {
    modals,
    toggleModal,
    theme,
    setTheme,
    selectedGroupName,
    selectedStudentId,
    setStudent,
    getCurUni,
  } = useAppStore();
  const curUni = getCurUni();

  const handleClose = () => toggleModal("mobileMenu", false);

  return (
    <Drawer
      placement="bottom"
      closable={false}
      onClose={handleClose}
      open={modals.isMobileMenuOpen}
      height="auto"
      styles={{
        body: {
          padding: "12px 16px 32px 16px",
          background: "var(--ant-color-bg-elevated)",
        },
        mask: { backdropFilter: "blur(4px)" },
      }}
      rootStyle={{ zIndex: 1001 }}
    >
      <div
        style={{
          width: 40,
          height: 4,
          background: "var(--ant-color-fill-secondary)",
          borderRadius: 2,
          margin: "0 auto 16px auto",
        }}
      />

      <Space direction="vertical" style={{ width: "100%" }} size={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar
            size={54}
            icon={<UserOutlined />}
            style={{ backgroundColor: "var(--ant-color-primary)" }}
          />
          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {selectedStudentId ? selectedGroupName : "Гість"}
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {selectedStudentId ? "Студент" : "Оберіть свій профіль"}
            </Typography.Text>
          </div>
          {!selectedStudentId && (
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                handleClose();
                toggleModal("student", true);
              }}
            >
              Увійти
            </Button>
          )}
        </div>

        <div
          style={{
            background: "var(--ant-color-fill-alter)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <List itemLayout="horizontal">
            <List.Item style={{ padding: "12px 16px" }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Space>
                  {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
                  <Typography.Text>Темна тема</Typography.Text>
                </Space>
                <Switch
                  checked={theme === "dark"}
                  onChange={(val) => setTheme(val ? "dark" : "light")}
                />
              </Space>
            </List.Item>

            <List.Item
              style={{ padding: "12px 16px", cursor: "pointer" }}
              onClick={() => {
                handleClose();
                toggleModal("uni", true);
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Space>
                  <BankOutlined />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography.Text style={{ fontSize: 13 }}>
                      Університет
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      {curUni.name}
                    </Typography.Text>
                  </div>
                </Space>
                <RightOutlined style={{ fontSize: 10, opacity: 0.5 }} />
              </div>
            </List.Item>

            {selectedStudentId && (
              <List.Item
                style={{ padding: "12px 16px", cursor: "pointer" }}
                onClick={() => {
                  setStudent(null, null);
                  handleClose();
                }}
              >
                <Space>
                  <LogoutOutlined style={{ color: "var(--ant-color-error)" }} />
                  <Typography.Text delete>Вийти з профілю</Typography.Text>
                </Space>
              </List.Item>
            )}
          </List>
        </div>

        <div style={{ textAlign: "center", opacity: 0.5 }}>
          <Typography.Text style={{ fontSize: 10 }}>
            SchedulePlus v1.0 • 2026
          </Typography.Text>
        </div>
      </Space>
    </Drawer>
  );
};
