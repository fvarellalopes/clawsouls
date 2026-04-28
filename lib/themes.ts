/**
 * Color theme presets for ClawSouls.
 * Each theme defines CSS custom properties that override the default purple/gold palette.
 */

export interface ColorTheme {
  id: string;
  name: string;
  nameKey: string; // i18n key
  description: string;
  descriptionKey: string;
  emoji: string;
  preview: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  cssVars: Record<string, string>;
}

export const colorThemes: ColorTheme[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    nameKey: "themes.cyberpunk.name",
    description: "Purple and gold on dark — the default ClawSouls vibe",
    descriptionKey: "themes.cyberpunk.description",
    emoji: "🌃",
    preview: {
      primary: "#a855f7",
      accent: "#facc15",
      background: "#0a0514",
      surface: "#140d24",
      text: "#e2d6f8",
    },
    cssVars: {
      "--primary": "#a855f7",
      "--primary-foreground": "#ffffff",
      "--accent": "#facc15",
      "--accent-foreground": "#0a0514",
      "--background": "#0a0514",
      "--foreground": "#e2d6f8",
      "--card": "#140d24",
      "--card-foreground": "#e2d6f8",
      "--muted": "#1a0f2e",
      "--muted-foreground": "#a78bfa",
      "--border": "rgba(168, 85, 247, 0.15)",
      "--ring": "#a855f7",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    nameKey: "themes.ocean.name",
    description: "Deep blues and teal — calm and focused",
    descriptionKey: "themes.ocean.description",
    emoji: "🌊",
    preview: {
      primary: "#0ea5e9",
      accent: "#2dd4bf",
      background: "#0c1222",
      surface: "#111b2e",
      text: "#e0f2fe",
    },
    cssVars: {
      "--primary": "#0ea5e9",
      "--primary-foreground": "#ffffff",
      "--accent": "#2dd4bf",
      "--accent-foreground": "#0c1222",
      "--background": "#0c1222",
      "--foreground": "#e0f2fe",
      "--card": "#111b2e",
      "--card-foreground": "#e0f2fe",
      "--muted": "#162033",
      "--muted-foreground": "#7dd3fc",
      "--border": "rgba(14, 165, 233, 0.15)",
      "--ring": "#0ea5e9",
    },
  },
  {
    id: "forest",
    name: "Forest",
    nameKey: "themes.forest.name",
    description: "Deep greens and amber — earthy and grounded",
    descriptionKey: "themes.forest.description",
    emoji: "🌲",
    preview: {
      primary: "#22c55e",
      accent: "#f59e0b",
      background: "#0a1a0f",
      surface: "#0f2518",
      text: "#dcfce7",
    },
    cssVars: {
      "--primary": "#22c55e",
      "--primary-foreground": "#ffffff",
      "--accent": "#f59e0b",
      "--accent-foreground": "#0a1a0f",
      "--background": "#0a1a0f",
      "--foreground": "#dcfce7",
      "--card": "#0f2518",
      "--card-foreground": "#dcfce7",
      "--muted": "#143322",
      "--muted-foreground": "#86efac",
      "--border": "rgba(34, 197, 94, 0.15)",
      "--ring": "#22c55e",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    nameKey: "themes.sunset.name",
    description: "Warm oranges and pinks — passionate and dramatic",
    descriptionKey: "themes.sunset.description",
    emoji: "🌅",
    preview: {
      primary: "#f97316",
      accent: "#ec4899",
      background: "#1a0a0a",
      surface: "#2a1215",
      text: "#fff7ed",
    },
    cssVars: {
      "--primary": "#f97316",
      "--primary-foreground": "#ffffff",
      "--accent": "#ec4899",
      "--accent-foreground": "#1a0a0a",
      "--background": "#1a0a0a",
      "--foreground": "#fff7ed",
      "--card": "#2a1215",
      "--card-foreground": "#fff7ed",
      "--muted": "#3a1a1a",
      "--muted-foreground": "#fdba74",
      "--border": "rgba(249, 115, 22, 0.15)",
      "--ring": "#f97316",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    nameKey: "themes.monochrome.name",
    description: "Pure grayscale — minimal and clean",
    descriptionKey: "themes.monochrome.description",
    emoji: "⬛",
    preview: {
      primary: "#e5e5e5",
      accent: "#a3a3a3",
      background: "#0a0a0a",
      surface: "#171717",
      text: "#f5f5f5",
    },
    cssVars: {
      "--primary": "#e5e5e5",
      "--primary-foreground": "#0a0a0a",
      "--accent": "#a3a3a3",
      "--accent-foreground": "#0a0a0a",
      "--background": "#0a0a0a",
      "--foreground": "#f5f5f5",
      "--card": "#171717",
      "--card-foreground": "#f5f5f5",
      "--muted": "#262626",
      "--muted-foreground": "#d4d4d4",
      "--border": "rgba(229, 229, 229, 0.1)",
      "--ring": "#e5e5e5",
    },
  },
  {
    id: "sakura",
    name: "Sakura",
    nameKey: "themes.sakura.name",
    description: "Soft pinks and white — gentle and elegant",
    descriptionKey: "themes.sakura.description",
    emoji: "🌸",
    preview: {
      primary: "#f472b6",
      accent: "#c084fc",
      background: "#1a0f18",
      surface: "#251525",
      text: "#fce7f3",
    },
    cssVars: {
      "--primary": "#f472b6",
      "--primary-foreground": "#ffffff",
      "--accent": "#c084fc",
      "--accent-foreground": "#1a0f18",
      "--background": "#1a0f18",
      "--foreground": "#fce7f3",
      "--card": "#251525",
      "--card-foreground": "#fce7f3",
      "--muted": "#331a33",
      "--muted-foreground": "#f9a8d4",
      "--border": "rgba(244, 114, 182, 0.15)",
      "--ring": "#f472b6",
    },
  },
  {
    id: "blood",
    name: "Bloodborne",
    nameKey: "themes.blood.name",
    description: "Deep reds and gold — dark, gothic, intense",
    descriptionKey: "themes.blood.description",
    emoji: "🩸",
    preview: {
      primary: "#dc2626",
      accent: "#d97706",
      background: "#0f0505",
      surface: "#1a0a0a",
      text: "#fef2f2",
    },
    cssVars: {
      "--primary": "#dc2626",
      "--primary-foreground": "#ffffff",
      "--accent": "#d97706",
      "--accent-foreground": "#0f0505",
      "--background": "#0f0505",
      "--foreground": "#fef2f2",
      "--card": "#1a0a0a",
      "--card-foreground": "#fef2f2",
      "--muted": "#2a0f0f",
      "--muted-foreground": "#fca5a5",
      "--border": "rgba(220, 38, 38, 0.15)",
      "--ring": "#dc2626",
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    nameKey: "themes.matrix.name",
    description: "Neon green on black — hacker aesthetic",
    descriptionKey: "themes.matrix.description",
    emoji: "💊",
    preview: {
      primary: "#22c55e",
      accent: "#4ade80",
      background: "#000000",
      surface: "#0a1a0a",
      text: "#bbf7d0",
    },
    cssVars: {
      "--primary": "#22c55e",
      "--primary-foreground": "#000000",
      "--accent": "#4ade80",
      "--accent-foreground": "#000000",
      "--background": "#000000",
      "--foreground": "#bbf7d0",
      "--card": "#0a1a0a",
      "--card-foreground": "#bbf7d0",
      "--muted": "#0f2a0f",
      "--muted-foreground": "#86efac",
      "--border": "rgba(34, 197, 94, 0.2)",
      "--ring": "#22c55e",
    },
  },
  {
    id: "arctic",
    name: "Arctic",
    nameKey: "themes.arctic.name",
    description: "Ice blue and white — cold, clean, precise",
    descriptionKey: "themes.arctic.description",
    emoji: "❄️",
    preview: {
      primary: "#38bdf8",
      accent: "#a5f3fc",
      background: "#0a1628",
      surface: "#0f2040",
      text: "#e0f2fe",
    },
    cssVars: {
      "--primary": "#38bdf8",
      "--primary-foreground": "#0a1628",
      "--accent": "#a5f3fc",
      "--accent-foreground": "#0a1628",
      "--background": "#0a1628",
      "--foreground": "#e0f2fe",
      "--card": "#0f2040",
      "--card-foreground": "#e0f2fe",
      "--muted": "#152a50",
      "--muted-foreground": "#7dd3fc",
      "--border": "rgba(56, 189, 248, 0.15)",
      "--ring": "#38bdf8",
    },
  },
  {
    id: "royal",
    name: "Royal",
    nameKey: "themes.royal.name",
    description: "Deep purple and gold — regal and majestic",
    descriptionKey: "themes.royal.description",
    emoji: "👑",
    preview: {
      primary: "#7c3aed",
      accent: "#eab308",
      background: "#0f0520",
      surface: "#1a0f35",
      text: "#ede9fe",
    },
    cssVars: {
      "--primary": "#7c3aed",
      "--primary-foreground": "#ffffff",
      "--accent": "#eab308",
      "--accent-foreground": "#0f0520",
      "--background": "#0f0520",
      "--foreground": "#ede9fe",
      "--card": "#1a0f35",
      "--card-foreground": "#ede9fe",
      "--muted": "#251545",
      "--muted-foreground": "#c4b5fd",
      "--border": "rgba(124, 58, 237, 0.15)",
      "--ring": "#7c3aed",
    },
  },
];

/**
 * Get a theme by ID, falling back to cyberpunk.
 */
export function getThemeById(id: string): ColorTheme {
  return colorThemes.find((t) => t.id === id) || colorThemes[0];
}

/**
 * Apply a theme's CSS variables to the document root.
 */
export function applyTheme(theme: ColorTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.cssVars)) {
    root.style.setProperty(key, value);
  }
}

/**
 * Reset to default theme by removing all custom properties.
 */
export function resetTheme(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const defaultTheme = colorThemes[0];
  for (const key of Object.keys(defaultTheme.cssVars)) {
    root.style.removeProperty(key);
  }
}
