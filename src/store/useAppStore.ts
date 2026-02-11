import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";
import type { University } from "@/types";
import { UNIVERSITIES } from "@/config/universities";

interface AppState {
  theme: "light" | "dark";
  accentColor: string;
  language: "ua" | "en";

  selectedUniId: string;
  selectedStudentId: number | null;
  selectedGroupName: string | null;
  modals: {
    isUniSearchOpen: boolean;
    isStudentSearchOpen: boolean;
    isSettingsOpen: boolean;
  };

  viewMode: "list" | "grid";
  dateRange: [string, string];

  setTheme: (t: "light" | "dark") => void;
  setUni: (id: string) => void;
  setStudent: (id: number | null, groupName: string | null) => void;
  toggleModal: (modal: "uni" | "student" | "settings", isOpen: boolean) => void;
  setViewMode: (mode: "list" | "grid") => void;
  setDateRange: (range: [string, string]) => void;
  getCurUni: () => University;
}

const getSmartDefaultRange = (): [string, string] => {
  const start = dayjs().hour() < 12 ? dayjs() : dayjs().add(1, "day");
  const end = start.add(7, "day");
  return [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")];
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      accentColor: "#1677ff",
      language: "ua",
      selectedUniId: "nuzp",
      selectedStudentId: null,
      selectedGroupName: null,

      modals: {
        isUniSearchOpen: false,
        isStudentSearchOpen: false,
        isSettingsOpen: false,
      },

      viewMode: "list",
      dateRange: getSmartDefaultRange(),

      setTheme: (theme) => set({ theme }),

      setUni: (id) =>
        set({
          selectedUniId: id,
          selectedStudentId: null,
          selectedGroupName: null,
          modals: {
            isUniSearchOpen: false,
            isStudentSearchOpen: false,
            isSettingsOpen: false,
          }, // Закрываем модалки при смене
        }),

      setStudent: (id, groupName) =>
        set({
          selectedStudentId: id,
          selectedGroupName: groupName,
          modals: { ...get().modals, isStudentSearchOpen: false },
        }),

      toggleModal: (modal, isOpen) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [modal === "uni"
              ? "isUniSearchOpen"
              : modal === "student"
                ? "isStudentSearchOpen"
                : "isSettingsOpen"]: isOpen,
          },
        })),

      setViewMode: (viewMode) => set({ viewMode }),
      setDateRange: (dateRange) => set({ dateRange }),

      getCurUni: () =>
        UNIVERSITIES.find((u) => u.id === get().selectedUniId) ||
        UNIVERSITIES[0],
    }),
    {
      name: "unitime-storage-v4",
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        selectedUniId: state.selectedUniId,
        selectedStudentId: state.selectedStudentId,
        selectedGroupName: state.selectedGroupName,
        viewMode: state.viewMode,
        dateRange: state.dateRange,
      }),
    },
  ),
);
