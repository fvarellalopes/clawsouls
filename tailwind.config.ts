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
        bg: "var(--bg)",
        fg: "var(--fg)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        border: "var(--border)",
        "muted-fg": "var(--muted-fg)",
        "subtle-fg": "var(--subtle-fg)",
        primary: {
          DEFAULT: "var(--primary)",
          fg: "var(--primary-fg)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-fg)",
        },
        /* Keep shadcn-compatible tokens mapped to new system */
        background: "var(--bg)",
        foreground: "var(--fg)",
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--fg)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--fg)",
        },
        secondary: {
          DEFAULT: "var(--surface-alt)",
          foreground: "var(--fg)",
        },
        muted: {
          DEFAULT: "var(--surface-alt)",
          foreground: "var(--muted-fg)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-paper)",
        },
        input: "var(--border)",
        ring: "var(--primary)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
