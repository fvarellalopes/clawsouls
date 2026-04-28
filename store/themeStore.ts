import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ColorTheme, getThemeById, applyTheme, colorThemes } from "@/lib/themes";

interface ThemeStore {
  themeId: string;
  setTheme: (id: string) => void;
  getTheme: () => ColorTheme;
  getAllThemes: () => ColorTheme[];
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeId: "cyberpunk",

      setTheme: (id: string) => {
        const theme = getThemeById(id);
        applyTheme(theme);
        set({ themeId: id });
      },

      getTheme: () => getThemeById(get().themeId),

      getAllThemes: () => colorThemes,
    }),
    {
      name: "clawsouls-theme",
      partialize: (state) => ({ themeId: state.themeId }),
    }
  )
);
