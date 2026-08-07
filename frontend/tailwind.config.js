/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4fa",
          100: "#d9e7f3",
          200: "#b3cde3",
          300: "#8cb0d3",
          400: "#6693c3",
          500: "#3f76b3",
          600: "#1f3a5f",
          700: "#1b3455",
          800: "#172f4d",
          900: "#132943",
        },
        semantic: {
          success: {
            light: "#dcfce7",
            main: "#22c55e",
            dark: "#166534",
          },
          warning: {
            light: "#fef3c7",
            main: "#f59e0b",
            dark: "#92400e",
          },
          danger: {
            light: "#fee2e2",
            main: "#ef4444",
            dark: "#991b1b",
          },
          info: {
            light: "#dbeafe",
            main: "#3b82f6",
            dark: "#1e40af",
          },
        },
        surface: {
          page: "#f7f8fa",
          primary: "#ffffff",
          secondary: "#f8fafc",
          tertiary: "#f1f5f9",
          border: "#e5e7eb",
          divider: "#e2e8f0",
        },
        text: {
          primary: "#101828",
          secondary: "#667085",
          tertiary: "#98a2b3",
          inverse: "#ffffff",
          link: "#1f3a5f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.25" }],
        "3xl": ["1.875rem", { lineHeight: "1.25" }],
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 24 40 / 0.04)",
        cardHover: "0 2px 6px rgb(16 24 40 / 0.08)",
        dropdown: "0 8px 16px rgb(16 24 40 / 0.10)",
        modal: "0 20px 40px rgb(16 24 40 / 0.18)",
      },
      spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        ease: "ease",
      },
      zIndex: {
        dropdown: 100,
        sticky: 200,
        modal: 300,
        popover: 400,
        tooltip: 500,
      },
    },
  },
  plugins: [],
};
