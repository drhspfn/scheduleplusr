"use client";

import React from "react";
import { Modal } from "antd";
import { useAppStore } from "@/store/useAppStore";
import { SelectionFlow } from "../shared/SelectionFlow";

export const StudentModal: React.FC = () => {
  const { modals, toggleModal } = useAppStore();

  return (
    <Modal
      title="Пошук студента"
      open={modals.isStudentSearchOpen}
      onCancel={() => toggleModal("student", false)}
      footer={null}
      destroyOnHidden
    >
      <SelectionFlow onComplete={() => toggleModal("student", false)} />
    </Modal>
  );
};
