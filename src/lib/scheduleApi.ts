import axios from "axios";
import { useAppStore } from "@/store/useAppStore";

const api = axios.create();

const getBaseUrl = () => {
  const { selectedUniId } = useAppStore.getState();
  return `/api/proxy/${selectedUniId}`;
};

api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export const scheduleApi = {
  getFaculties: () => api.post("/list/faculties").then((r) => r.data),
  getCourses: (facultyId: number) =>
    api.post("/list/courses", { facultyId }).then((r) => r.data),
  getGroups: (courseId: number, facultyId: number) =>
    api.post("/list/groups", { courseId, facultyId }).then((r) => r.data),
  getStudents: (groupId: number) =>
    api.post("/list/students-by-group", { groupId }).then((r) => r.data),
  getTimetable: (studentId: number, dateStart: string, dateEnd: string) =>
    api
      .post("/time-table/student", { studentId, dateStart, dateEnd })
      .then((r) => r.data),
};
