import type { Config } from "tailwindcss";

/**
 * Tema único del proyecto. Los valores viven como CSS variables en
 * `app/globals.css` (fuente: docs/design-spec.md §3); aquí solo se exponen
 * como clases utilitarias.
 *
 * Breakpoints del grid (1 / 2 / 3 / 4 columnas) ya coinciden con los
 * defaults de Tailwind: <640, sm=640, lg=1024, xl=1280.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        border: "var(--border)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      maxWidth: {
        container: "var(--container)",
      },
      spacing: {
        gutter: "var(--gap)",
        "gutter-lg": "var(--gap-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
