/**
 * Tailwind Configuration - Mirrors designTokens.ts
 *
 * Related Documentation:
 * - UI_DESIGN_SYSTEM.md: Complete design system specifications
 * - UI_IMPROVEMENT_PLAN.md: Strategic improvement plan
 * - UI_COLOR_QUICK_REF.md: Quick reference for daily development
 * - src/utils/designTokens.ts: Single source of truth for tokens
 * - src/styles/index.css: Global base styles
 * - src/components/ui/primitives/: Reusable UI components
 *
 * When modifying colors/spacing/typography:
 * 1. Update src/utils/designTokens.ts first
 * 2. Update this file to match
 * 3. Update UI_DESIGN_SYSTEM.md documentation
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#111c2d",
          100: "#17263b",
          200: "#203451",
          300: "#304a70",
          400: "#476a9d",
          500: "#6d9ff8",
          600: "#4d7fd8",
          700: "#3f67ae",
          800: "#314f87",
          900: "#edf4ff",
        },
        semantic: {
          success: {
            light: "#123b2a",
            main: "#34d399",
            dark: "#a7f3d0",
          },
          warning: {
            light: "#3a2b12",
            main: "#fbbf24",
            dark: "#fde68a",
          },
          danger: {
            light: "#3a1820",
            main: "#fb7185",
            dark: "#fecdd3",
          },
          info: {
            light: "#122c4f",
            main: "#60a5fa",
            dark: "#bfdbfe",
          },
        },
        surface: {
          page: "#0b1220",
          primary: "#111a2a",
          secondary: "#172235",
          tertiary: "#202e43",
          border: "#2a3a52",
          divider: "#223149",
        },
        text: {
          primary: "#f3f7fc",
          secondary: "#aab8cb",
          tertiary: "#718198",
          inverse: "#0b1220",
          link: "#9fc3ff",
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
        card: "0 8px 24px rgb(0 0 0 / 0.18)",
        cardHover: "0 14px 32px rgb(0 0 0 / 0.28)",
        dropdown: "0 12px 28px rgb(0 0 0 / 0.3)",
        modal: "0 24px 60px rgb(0 0 0 / 0.45)",
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
