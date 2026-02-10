export interface University {
  id: string;
  name: string;
  apiUrl: string;
  description?: string;
}

export interface Faculty {
  id: number;
  shortName: string;
  fullName: string;
}
export interface Course {
  course: number;
}
export interface Group {
  id: number;
  name: string;
  course: number;
}
export interface Student {
  id: number;
  firstName: string;
  secondName: string;
  lastName: string;
}

export interface LessonPeriod {
  disciplineFullName: string;
  disciplineShortName: string;
  classroom: string;
  timeStart: string;
  timeEnd: string;
  teachersName: string;
  teachersNameFull?: string;
  typeStr: string;
  notice: string;
}

export interface TimetableDay {
  date: string;
  lessons: { number: number; periods: LessonPeriod[] }[];
}
