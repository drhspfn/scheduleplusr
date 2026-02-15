"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Select, Button, Form, App, Space, Tooltip, theme } from "antd";
import {
  BankOutlined,
  NumberOutlined,
  TeamOutlined,
  UserOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { scheduleApi } from "@/lib/scheduleApi";
import { useAppStore } from "@/store/useAppStore";
import type { Faculty, Course, Group, Student } from "@/types";

type LoadingState = {
  faculties: boolean;
  courses: boolean;
  groups: boolean;
  students: boolean;
  submit: boolean;
};

type ErrorState = {
  faculties: boolean;
  courses: boolean;
  groups: boolean;
  students: boolean;
};

export const SelectionFlow: React.FC<{ onComplete?: () => void }> = ({
  onComplete,
}) => {
  const { message } = App.useApp();
  const { setStudent } = useAppStore();

  const [data, setData] = useState<{
    faculties: Faculty[];
    courses: Course[];
    groups: Group[];
    students: Student[];
  }>({ faculties: [], courses: [], groups: [], students: [] });

  const [selection, setSelection] = useState({
    f: null as number | null,
    c: null as number | null,
    g: null as number | null,
    s: null as number | null,
  });

  const [loading, setLoading] = useState<LoadingState>({
    faculties: false,
    courses: false,
    groups: false,
    students: false,
    submit: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    faculties: false,
    courses: false,
    groups: false,
    students: false,
  });

  const loadData = useCallback(
    async <T,>(
      key: keyof LoadingState,
      fetcher: () => Promise<T>,
      onSuccess: (data: T) => void,
    ) => {
      setLoading((prev) => ({ ...prev, [key]: true }));
      setErrors((prev) => ({ ...prev, [key]: false }));

      try {
        const result = await fetcher();
        onSuccess(result);
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        setErrors((prev) => ({ ...prev, [key]: true }));
        message.error("Не вдалося завантажити дані. Спробуйте ще раз.");
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [message],
  );

  const loadFaculties = useCallback(() => {
    loadData(
      "faculties",
      () => scheduleApi.getFaculties(),
      (f) => setData((prev) => ({ ...prev, faculties: f })),
    );
  }, [loadData]);

  useEffect(() => {
    const init = async () => {
      await loadFaculties();
    };
    init();
  }, [loadFaculties]);

  const handleFacultyChange = (id: number) => {
    setSelection({ f: id, c: null, g: null, s: null });
    setData((prev) => ({ ...prev, courses: [], groups: [], students: [] }));

    loadData(
      "courses",
      () => scheduleApi.getCourses(id),
      (courses) => setData((prev) => ({ ...prev, courses })),
    );
  };

  const handleCourseChange = (course: number) => {
    setSelection((prev) => ({ ...prev, c: course, g: null, s: null }));
    setData((prev) => ({ ...prev, groups: [], students: [] }));

    loadData(
      "groups",
      () => scheduleApi.getGroups(course, selection.f!),
      (groups) => setData((prev) => ({ ...prev, groups })),
    );
  };

  const handleGroupChange = (groupId: number) => {
    setSelection((prev) => ({ ...prev, g: groupId, s: null }));
    setData((prev) => ({ ...prev, students: [] }));

    loadData(
      "students",
      () => scheduleApi.getStudents(groupId),
      (students) => setData((prev) => ({ ...prev, students })),
    );
  };

  const retryCourses = () => selection.f && handleFacultyChange(selection.f);
  const retryGroups = () => selection.c && handleCourseChange(selection.c);
  const retryStudents = () => selection.g && handleGroupChange(selection.g);

  const handleSubmit = () => {
    if (selection.s) {
      setLoading((prev) => ({ ...prev, submit: true }));

      setTimeout(() => {
        const groupName =
          data.groups.find((g) => g.id === selection.g)?.name || "";
        const studentName = data.students.find((s) => s.id === selection.s);

        setStudent(selection.s!, groupName);
        message.success(`Вітаємо, ${studentName?.firstName}! Групу збережено.`);
        setLoading((prev) => ({ ...prev, submit: false }));

        if (onComplete) onComplete();
      }, 400);
    }
  };

  const FieldLabel = ({ text, hasError, onRetry }: any) => (
    <Space>
      <span>{text}</span>
      {hasError && (
        <Tooltip title="Спробувати ще раз">
          <Button
            size="small"
            type="text"
            danger
            icon={<ReloadOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
          />
        </Tooltip>
      )}
    </Space>
  );

  return (
    <Form layout="vertical" requiredMark={false} className="selection-form">
      <Form.Item
        label={
          <FieldLabel
            text="Факультет"
            hasError={errors.faculties}
            onRetry={loadFaculties}
          />
        }
        validateStatus={errors.faculties ? "error" : ""}
      >
        <Select
          placeholder="Оберіть факультет"
          showSearch
          optionFilterProp="label"
          loading={loading.faculties}
          options={data.faculties.map((f: any) => ({
            label: f.fullName,
            value: f.id,
          }))}
          value={selection.f}
          onChange={handleFacultyChange}
          suffixIcon={<BankOutlined />}
        />
      </Form.Item>

      <Form.Item
        label={
          <FieldLabel
            text="Курс"
            hasError={errors.courses}
            onRetry={retryCourses}
          />
        }
        validateStatus={errors.courses ? "error" : ""}
      >
        <Select
          placeholder="Оберіть курс"
          disabled={!selection.f || loading.faculties}
          loading={loading.courses}
          options={data.courses.map((c: any) => ({
            label: `${c.course} курс`,
            value: c.course,
          }))}
          value={selection.c}
          onChange={handleCourseChange}
          suffixIcon={<NumberOutlined />}
        />
      </Form.Item>

      <Form.Item
        label={
          <FieldLabel
            text="Група"
            hasError={errors.groups}
            onRetry={retryGroups}
          />
        }
        validateStatus={errors.groups ? "error" : ""}
      >
        <Select
          placeholder="Оберіть групу"
          showSearch
          optionFilterProp="label"
          disabled={!selection.c || loading.courses}
          loading={loading.groups}
          options={data.groups.map((g: any) => ({
            label: g.name,
            value: g.id,
          }))}
          value={selection.g}
          onChange={handleGroupChange}
          suffixIcon={<TeamOutlined />}
          notFoundContent={
            loading.groups ? "Завантаження..." : "Груп не знайдено"
          }
        />
      </Form.Item>

      <Form.Item
        label={
          <FieldLabel
            text="Студент"
            hasError={errors.students}
            onRetry={retryStudents}
          />
        }
        validateStatus={errors.students ? "error" : ""}
      >
        <Select
          placeholder="Оберіть своє прізвище"
          showSearch
          optionFilterProp="label"
          disabled={!selection.g || loading.groups}
          loading={loading.students}
          options={data.students.map((s: any) => ({
            label: `${s.lastName} ${s.firstName}`,
            value: s.id,
          }))}
          value={selection.s}
          onChange={(v) => setSelection((prev: any) => ({ ...prev, s: v }))}
          suffixIcon={<UserOutlined />}
          notFoundContent={
            loading.students ? "Завантаження..." : "Студентів не знайдено"
          }
        />
      </Form.Item>

      <Button
        type="primary"
        block
        size="large"
        icon={<CheckCircleOutlined />}
        disabled={!selection.s}
        loading={loading.submit}
        onClick={handleSubmit}
        style={{ marginTop: 8 }}
      >
        Зберегти та продовжити
      </Button>
    </Form>
  );
};
