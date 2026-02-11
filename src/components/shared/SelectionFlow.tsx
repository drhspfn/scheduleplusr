"use client";

"use client";

import React, { useEffect, useState } from "react";
import { Select, Button, message, Form } from "antd";
import { scheduleApi } from "@/lib/scheduleApi";
import { useAppStore } from "@/store/useAppStore";
import type { Faculty, Course, Group, Student } from "@/types";

export const SelectionFlow: React.FC<{ onComplete?: () => void }> = ({
  onComplete,
}) => {
  const setStudent = useAppStore((state) => state.setStudent);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    scheduleApi
      .getFaculties()
      .then((f) => setData((prev) => ({ ...prev, faculties: f })));
  }, []);

  const handleFacultyChange = async (id: number) => {
    setSelection({ f: id, c: null, g: null, s: null });
    setLoading(true);
    const courses = await scheduleApi.getCourses(id);
    setData((prev) => ({ ...prev, courses, groups: [], students: [] }));
    setLoading(false);
  };

  const handleCourseChange = async (course: number) => {
    setSelection((prev) => ({ ...prev, c: course, g: null, s: null }));
    setLoading(true);
    const groups = await scheduleApi.getGroups(course, selection.f!);
    setData((prev) => ({ ...prev, groups, students: [] }));
    setLoading(false);
  };

  const handleGroupChange = async (groupId: number) => {
    setSelection((prev) => ({ ...prev, g: groupId, s: null }));
    setLoading(true);
    const students = await scheduleApi.getStudents(groupId);
    setData((prev) => ({ ...prev, students }));
    setLoading(false);
  };

  const handleSubmit = () => {
    if (selection.s) {
      const groupName =
        data.groups.find((g) => g.id === selection.g)?.name || "";
      setStudent(selection.s, groupName);
      message.success("Студента обрано!");
      if (onComplete) onComplete();
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Факультет">
        <Select
          showSearch
          optionFilterProp="label"
          loading={loading && data.faculties.length === 0}
          options={data.faculties.map((f) => ({
            label: f.fullName,
            value: f.id,
          }))}
          onChange={handleFacultyChange}
        />
      </Form.Item>
      <Form.Item label="Курс">
        <Select
          disabled={!selection.f}
          options={data.courses.map((c) => ({
            label: `${c.course} курс`,
            value: c.course,
          }))}
          onChange={handleCourseChange}
        />
      </Form.Item>
      <Form.Item label="Група">
        <Select
          showSearch
          optionFilterProp="label"
          disabled={!selection.c}
          options={data.groups.map((g) => ({ label: g.name, value: g.id }))}
          onChange={handleGroupChange}
        />
      </Form.Item>
      <Form.Item label="Студент">
        <Select
          showSearch
          optionFilterProp="label"
          disabled={!selection.g}
          options={data.students.map((s) => ({
            label: `${s.lastName} ${s.firstName}`,
            value: s.id,
          }))}
          onChange={(v) => setSelection((prev) => ({ ...prev, s: v }))}
        />
      </Form.Item>
      <Button
        type="primary"
        block
        disabled={!selection.s}
        onClick={handleSubmit}
      >
        Зберегти
      </Button>
    </Form>
  );
};
