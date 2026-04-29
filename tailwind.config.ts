import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--foreground-card)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--foreground-popover)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--foreground-primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--foreground-secondary)",
        },
        muted: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--foreground-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--foreground-accent)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--foreground-destructive)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        /* Stitch Cyber Terminal tokens */
        "surface-container": "#201f22",
        "surface-container-low": "#1c1b1d",
        "surface-container-lowest": "#0e0e10",
        "surface-container-high": "#2a2a2c",
        "surface-container-highest": "#353437",
        "surface-dim": "#131315",
        "surface-bright": "#39393b",
        "primary-container": "#facc15",
        "on-primary-fixed": "#3c2f00",
        "on-surface": "#e5e1e4",
        "on-surface-variant": "#d1c6ab",
        "outline": "#9a9078",
        "outline-variant": "#4d4632",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        h1: ["Space Grotesk"],
        h2: ["Space Grotesk"],
        h3: ["Space Grotesk"],
        "label-caps": ["Space Grotesk"],
        "mono-data": ["Space Grotesk"],
        "body-sm": ["Inter"],
        "body-md": ["Inter"],
        "body-lg": ["Inter"],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["36px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        h3: ["24px", { lineHeight: "1.3", letterSpacing: "0em", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "700" }],
        "mono-data": ["14px", { lineHeight: "1.0", fontWeight: "500" }],
        "body-sm": ["14px", { lineHeight: "1.4", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
