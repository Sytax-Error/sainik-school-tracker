/**
 * Tailwind Configuration - Mirrors designTokens.ts
 *
 * Related Documentation:
 * - UI_DESIGN_SYSTEM.md: Complete design system specifications
 * - UI_IMPROVEMENT_PLAN.md: Strategic improvement plan
 * - UI_COLOR_QUICK_REF.md: Quick reference for daily development
 * - src/utils/designTokens.ts: Single source of truth for tokens
 * - src/styles/index.css: Global base styles (defines CSS variables)
 * - src/components/ui/primitives/: Reusable UI components
 *
 * When modifying colors/spacing/typography:
 * 1. Update src/utils/designTokens.ts first
 * 2. Update this file to match
 * 3. Update UI_DESIGN_SYSTEM.md documentation
 *
 * Theme system:
 * - Colors are defined as CSS variables in src/styles/index.css
 * - :root defines light theme variables
 * - .dark defines dark theme variables
 * - This file maps Tailwind color names to those CSS variables
 * - Toggling the .dark class on <html> switches themes
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(var(--color-primary-50))",
          100: "rgb(var(--color-primary-100))",
          200: "rgb(var(--color-primary-200))",
          300: "rgb(var(--color-primary-300))",
          400: "rgb(var(--color-primary-400))",
          500: "rgb(var(--color-primary-500))",
          600: "rgb(var(--color-primary-600))",
          700: "rgb(var(--color-primary-700))",
          800: "rgb(var(--color-primary-800))",
          900: "rgb(var(--color-primary-900))",
        },
        semantic: {
          success: {
            light: "rgb(var(--color-semantic-success-light))",
            main: "rgb(var(--color-semantic-success-main))",
            dark: "rgb(var(--color-semantic-success-dark))",
          },
          warning: {
            light: "rgb(var(--color-semantic-warning-light))",
            main: "rgb(var(--color-semantic-warning-main))",
            dark: "rgb(var(--color-semantic-warning-dark))",
          },
          danger: {
            light: "rgb(var(--color-semantic-danger-light))",
            main: "rgb(var(--color-semantic-danger-main))",
            dark: "rgb(var(--color-semantic-danger-dark))",
          },
          info: {
            light: "rgb(var(--color-semantic-info-light))",
            main: "rgb(var(--color-semantic-info-main))",
            dark: "rgb(var(--color-semantic-info-dark))",
          },
        },
        surface: {
          page: "rgb(var(--color-surface-page))",
          primary: "rgb(var(--color-surface-primary))",
          secondary: "rgb(var(--color-surface-secondary))",
          tertiary: "rgb(var(--color-surface-tertiary))",
          border: "rgb(var(--color-surface-border))",
          divider: "rgb(var(--color-surface-divider))",
        },
        text: {
          primary: "rgb(var(--color-text-primary))",
          secondary: "rgb(var(--color-text-secondary))",
          tertiary: "rgb(var(--color-text-tertiary))",
          inverse: "rgb(var(--color-text-inverse))",
          link: "rgb(var(--color-text-link))",
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
        card: "var(--shadow-card)",
        cardHover: "var(--shadow-card-hover)",
        dropdown: "var(--shadow-dropdown)",
        modal: "var(--shadow-modal)",
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
