import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
