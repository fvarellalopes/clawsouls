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
    id: "paper",
    name: "Paper",
    nameKey: "themes.paper.name",
    description: "Warm off-white, ink text, indigo primary — the default",
    descriptionKey: "themes.paper.description",
    emoji: "📄",
    preview: {
      primary: "#4338ca",
      accent: "#e8795a",
      background: "#f8f6f1",
      surface: "#ffffff",
      text: "#1a1614",
    },
    cssVars: {
      "--bg": "#f8f6f1",
      "--fg": "#1a1614",
      "--surface": "#ffffff",
      "--surface-alt": "#f0ede6",
      "--border": "#ddd8ce",
      "--muted-fg": "#6b6560",
      "--primary": "#4338ca",
      "--primary-fg": "#ffffff",
      "--accent": "#e8795a",
      "--accent-fg": "#1a1614",
    },
  },
  {
    id: "clean",
    name: "Clean",
    nameKey: "themes.clean.name",
    description: "Cool white, dark text, blue primary — crisp and professional",
    descriptionKey: "themes.clean.description",
    emoji: "✨",
    preview: {
      primary: "#2563eb",
      accent: "#0891b2",
      background: "#f9fafb",
      surface: "#ffffff",
      text: "#111827",
    },
    cssVars: {
      "--bg": "#f9fafb",
      "--fg": "#111827",
      "--surface": "#ffffff",
      "--surface-alt": "#f3f4f6",
      "--border": "#e5e7eb",
      "--muted-fg": "#6b7280",
      "--primary": "#2563eb",
      "--primary-fg": "#ffffff",
      "--accent": "#0891b2",
      "--accent-fg": "#ffffff",
    },
  },
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
      "--primary-fg": "#ffffff",
      "--accent": "#facc15",
      "--accent-fg": "#0a0514",
      "--bg": "#0a0514",
      "--fg": "#e2d6f8",
      "--surface": "#140d24",
      "--surface-alt": "#1a0f2e",
      "--muted-fg": "#a78bfa",
      "--border": "rgba(168, 85, 247, 0.15)",
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
      "--primary-fg": "#ffffff",
      "--accent": "#2dd4bf",
      "--accent-fg": "#0c1222",
      "--bg": "#0c1222",
      "--fg": "#e0f2fe",
      "--surface": "#111b2e",
      "--surface-alt": "#162033",
      "--muted-fg": "#7dd3fc",
      "--border": "rgba(14, 165, 233, 0.15)",
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
      "--primary-fg": "#ffffff",
      "--accent": "#f59e0b",
      "--accent-fg": "#0a1a0f",
      "--bg": "#0a1a0f",
      "--fg": "#dcfce7",
      "--surface": "#0f2518",
      "--surface-alt": "#143322",
      "--muted-fg": "#86efac",
      "--border": "rgba(34, 197, 94, 0.15)",
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
      "--primary-fg": "#ffffff",
      "--accent": "#ec4899",
      "--accent-fg": "#1a0a0a",
      "--bg": "#1a0a0a",
      "--fg": "#fff7ed",
      "--surface": "#2a1215",
      "--surface-alt": "#3a1a1a",
      "--muted-fg": "#fdba74",
      "--border": "rgba(249, 115, 22, 0.15)",
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
      "--primary-fg": "#0a0a0a",
      "--accent": "#a3a3a3",
      "--accent-fg": "#0a0a0a",
      "--bg": "#0a0a0a",
      "--fg": "#f5f5f5",
      "--surface": "#171717",
      "--surface-alt": "#262626",
      "--muted-fg": "#d4d4d4",
      "--border": "rgba(229, 229, 229, 0.1)",
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
      "--primary-fg": "#ffffff",
      "--accent": "#c084fc",
      "--accent-fg": "#1a0f18",
      "--bg": "#1a0f18",
      "--fg": "#fce7f3",
      "--surface": "#251525",
      "--surface-alt": "#331a33",
      "--muted-fg": "#f9a8d4",
      "--border": "rgba(244, 114, 182, 0.15)",
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
      "--primary-fg": "#ffffff",
      "--accent": "#d97706",
      "--accent-fg": "#0f0505",
      "--bg": "#0f0505",
      "--fg": "#fef2f2",
      "--surface": "#1a0a0a",
      "--surface-alt": "#2a0f0f",
      "--muted-fg": "#fca5a5",
      "--border": "rgba(220, 38, 38, 0.15)",
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
      "--primary-fg": "#000000",
      "--accent": "#4ade80",
      "--accent-fg": "#000000",
      "--bg": "#000000",
      "--fg": "#bbf7d0",
      "--surface": "#0a1a0a",
      "--surface-alt": "#0f2a0f",
      "--muted-fg": "#86efac",
      "--border": "rgba(34, 197, 94, 0.2)",
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
      "--primary-fg": "#0a1628",
      "--accent": "#a5f3fc",
      "--accent-fg": "#0a1628",
      "--bg": "#0a1628",
      "--fg": "#e0f2fe",
      "--surface": "#0f2040",
      "--surface-alt": "#152a50",
      "--muted-fg": "#7dd3fc",
      "--border": "rgba(56, 189, 248, 0.15)",
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
      "--primary-fg": "#ffffff",
      "--accent": "#eab308",
      "--accent-fg": "#0f0520",
      "--bg": "#0f0520",
      "--fg": "#ede9fe",
      "--surface": "#1a0f35",
      "--surface-alt": "#251545",
      "--muted-fg": "#c4b5fd",
      "--border": "rgba(124, 58, 237, 0.15)",
    },
  },
];

/**
 * Get a theme by ID, falling back to paper (light default).
 */
export function getThemeById(id: string): ColorTheme {
  return colorThemes.find((t) => t.id === id) || colorThemes.find((t) => t.id === "paper") || colorThemes[0];
}

/**
 * Apply a theme's CSS variables to the document root.
 * Sets both basic design tokens and derived Tailwind v4 color tokens.
 */
export function applyTheme(theme: ColorTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const v = theme.cssVars;

  // Basic tokens
  for (const [key, value] of Object.entries(v)) {
    root.style.setProperty(key, value);
  }

  // Derived color tokens for Tailwind v4 @theme
  const bg = v["--bg"] ?? "#09090b";
  const fg = v["--fg"] ?? "#e5e1e4";
  const surface = v["--surface"] ?? "#201f22";
  const surfaceAlt = v["--surface-alt"] ?? "#1c1b1d";
  const mutedFg = v["--muted-fg"] ?? "#d1c6ab";
  const border = v["--border"] ?? "rgba(255,255,255,0.1)";
  const primary = v["--primary"] ?? "#facc15";
  const primaryFg = v["--primary-fg"] ?? "#3c2f00";
  const accent = v["--accent"] ?? "#ffecb9";
  const accentFg = v["--accent-fg"] ?? "#3c2f00";

  // Container/surface hierarchy
  root.style.setProperty("--surface-container", surface);
  root.style.setProperty("--surface-container-low", surfaceAlt);
  root.style.setProperty("--surface-container-lowest", darken(bg, 0.15));
  root.style.setProperty("--surface-container-high", lighten(surface, 0.08));
  root.style.setProperty("--surface-container-highest", lighten(surface, 0.12));
  root.style.setProperty("--surface-dim", darken(bg, 0.05));
  root.style.setProperty("--surface-bright", lighten(surface, 0.15));

  // On-surface / variant
  root.style.setProperty("--on-surface", fg);
  root.style.setProperty("--on-surface-variant", mutedFg);

  // Primary container / on-primary-fixed
  root.style.setProperty("--primary-container", primary);
  root.style.setProperty("--on-primary-fixed", primaryFg);

  // Outline tokens
  root.style.setProperty("--outline", mutedFg);
  root.style.setProperty("--outline-variant", interpolate(bg, mutedFg, 0.3));

  // Error tokens (hardcoded defaults stored in CSS)
  root.style.setProperty("--error-container", "#93000a");
  root.style.setProperty("--on-error", "#690005");
  root.style.setProperty("--on-error-container", "#ffdad6");

  // Border subtle
  root.style.setProperty("--border-subtle", border?.replace?.("1)", "0.05)") ?? "rgba(255,255,255,0.05)");

  // Subtle fg
  root.style.setProperty("--subtle-fg", mutedFg);

  // Tailwind v4 direct color tokens (override @theme defaults)
  root.style.setProperty("--color-background", bg);
  root.style.setProperty("--color-foreground", fg);
  root.style.setProperty("--color-surface", surface);
  root.style.setProperty("--color-surface-alt", surfaceAlt);
  root.style.setProperty("--color-muted-fg", mutedFg);
  root.style.setProperty("--color-border", border);
  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-primary-foreground", primaryFg);
  root.style.setProperty("--color-accent", accent);
  root.style.setProperty("--color-accent-foreground", accentFg);
  root.style.setProperty("--color-on-surface", fg);
  root.style.setProperty("--color-on-surface-variant", mutedFg);
  root.style.setProperty("--color-muted", surface);
  root.style.setProperty("--color-muted-foreground", mutedFg);

  // data-theme attribute + color-scheme for native dark/light support
  const isDark = theme.id !== "paper" && theme.id !== "clean";
  root.dataset.theme = isDark ? "dark" : "light";
  root.style.colorScheme = isDark ? "dark" : "light";
}

/**
 * Parse hex color and return [r, g, b]
 */
function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

/**
 * Darken a hex color by a ratio (0 = unchanged, 1 = black)
 */
function darken(hex: string, ratio: number): string {
  if (!hex.startsWith("#") || hex.length < 7) return hex;
  const [r, g, b] = parseHex(hex);
  const nr = Math.round(r * (1 - ratio));
  const ng = Math.round(g * (1 - ratio));
  const nb = Math.round(b * (1 - ratio));
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

/**
 * Lighten a hex color by a ratio (0 = unchanged, 1 = white)
 */
function lighten(hex: string, ratio: number): string {
  if (!hex.startsWith("#") || hex.length < 7) return hex;
  const [r, g, b] = parseHex(hex);
  const nr = Math.min(255, Math.round(r + (255 - r) * ratio));
  const ng = Math.min(255, Math.round(g + (255 - g) * ratio));
  const nb = Math.min(255, Math.round(b + (255 - b) * ratio));
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

/**
 * Interpolate between two hex colors by ratio (0 = first, 1 = second)
 */
function interpolate(hex1: string, hex2: string, ratio: number): string {
  if (!hex1.startsWith("#") || !hex2.startsWith("#")) return hex1;
  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);
  const nr = Math.round(r1 + (r2 - r1) * ratio);
  const ng = Math.round(g1 + (g2 - g1) * ratio);
  const nb = Math.round(b1 + (b2 - b1) * ratio);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
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
