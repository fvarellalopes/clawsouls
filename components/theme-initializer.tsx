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
    console.log("[ThemeInitializer] useEffect fired");
    const theme = getTheme();
    console.log("[ThemeInitializer] theme:", theme?.id);
    if (theme) {
      applyTheme(theme);
      console.log("[ThemeInitializer] applyTheme called, style:", document.documentElement.style.cssText.slice(0, 100));
    }
  }, [getTheme]);

  return null;
}
