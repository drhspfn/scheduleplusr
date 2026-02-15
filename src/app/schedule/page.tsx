"use client";

import { TimetableDisplay } from "@/components/schedule/TimetableDisplay";
import { useAppStore } from "@/store/useAppStore";
import { Card, Typography } from "antd";
import { SelectionFlow } from "@/components/shared/SelectionFlow";

export default function SchedulePage() {
  const { selectedStudentId } = useAppStore();

  if (!selectedStudentId) {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Typography.Title level={3}>Вітаємо!</Typography.Title>
            <Typography.Text type="secondary">
              Для перегляду розкладу, будь ласка, знайдіть себе у базі.
            </Typography.Text>
          </div>
          <SelectionFlow />
        </Card>
      </div>
    );
  }

  return <TimetableDisplay />;
}
