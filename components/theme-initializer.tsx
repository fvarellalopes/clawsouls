"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { applyTheme } from "@/lib/themes";

/**
 * Initializes the color theme from persisted state on mount.
 * Renders nothing — just applies CSS variables.
 */
export function ThemeInitializer() {
  const { getTheme } = useThemeStore();

  useEffect(() => {
    const theme = getTheme();
    if (theme) {
      applyTheme(theme);
    }
  }, [getTheme]);

  return null;
}
