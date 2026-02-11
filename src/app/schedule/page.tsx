"use client";


import React from "react";
import { TimetableDisplay } from "@/components/schedule/TimetableDisplay";
import { useAppStore } from "@/store/useAppStore";
import { Button, Result } from "antd";

export default function SchedulePage() {
  const { selectedStudentId, toggleModal } = useAppStore();

  if (!selectedStudentId) {
    return (
      <Result
        status="warning"
        title="Студента не обрано"
        subTitle="Будь ласка, оберіть студента для перегляду розкладу."
        extra={
          <Button type="primary" onClick={() => toggleModal("student", true)}>
            Обрати
          </Button>
        }
      />
    );
  }

  return <TimetableDisplay />;
}
