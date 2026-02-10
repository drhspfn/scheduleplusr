import axios from "axios";
import { useAppStore } from "../store/useAppStore";
import type { Faculty, Course, Group, Student, TimetableDay } from "../types";

const api = axios.create();

const getBaseUrl = () => {
  const uni = useAppStore.getState().getCurUni();

  if (import.meta.env.PROD) {
    return `https://cors-anywhere.herokuapp.com/${uni.apiUrl}`;
  }

  return `/api/nuzp`;
};

api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export const scheduleApi = {
  getFaculties: () =>
    api.post<Faculty[]>("/list/faculties").then((r) => r.data),
  getCourses: (facultyId: number) =>
    api.post<Course[]>("/list/courses", { facultyId }).then((r) => r.data),
  getGroups: (courseId: number, facultyId: number) =>
    api
      .post<Group[]>("/list/groups", { courseId, facultyId })
      .then((r) => r.data),
  getStudents: (groupId: number) =>
    api
      .post<Student[]>("/list/students-by-group", { groupId })
      .then((r) => r.data),

  getTimetable: (studentId: number, dateStart: string, dateEnd: string) =>
    api
      .post<
        TimetableDay[]
      >("/time-table/student", { studentId, dateStart, dateEnd })
      .then((r) => r.data),
};
