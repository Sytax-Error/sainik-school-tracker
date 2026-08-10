/**
 * Design Tokens - Single Source of Truth for UI Design System
 *
 * Related Documentation:
 * - UI_DESIGN_SYSTEM.md: Complete design system specifications
 * - UI_IMPROVEMENT_PLAN.md: Strategic improvement plan (6 focus areas)
 * - UI_COLOR_QUICK_REF.md: Quick reference for daily development
 * - tailwind.config.js: Tailwind theme configuration (mirrors these tokens)
 * - src/styles/index.css: Global base styles
 * - src/components/ui/primitives/: Reusable UI components
 *
 * When modifying tokens:
 * 1. Update this file first
 * 2. Update tailwind.config.js to match
 * 3. Update UI_DESIGN_SYSTEM.md documentation
 * 4. Verify contrast ratios (WCAG AA)
 * 5. Test in all components
 */

export const colors = {
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
} as const;

export const spacing = {
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
} as const;

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export const shadows = {
  card: "0 1px 2px rgb(16 24 40 / 0.04)",
  cardHover: "0 2px 6px rgb(16 24 40 / 0.08)",
  dropdown: "0 8px 16px rgb(16 24 40 / 0.10)",
  modal: "0 20px 40px rgb(16 24 40 / 0.18)",
} as const;

export const transitions = {
  fast: "150ms ease",
  normal: "200ms ease",
  slow: "300ms ease",
} as const;

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
} as const;

// Status style mapping using exact backend status values
export type ItemStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export const statusStyles: Record<
  ItemStatus,
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  NOT_STARTED: { label: "Not Started", tone: "neutral" },
  IN_PROGRESS: { label: "In Progress", tone: "info" },
  COMPLETED: { label: "Completed", tone: "success" },
  ON_HOLD: { label: "On Hold", tone: "warning" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
} as const;

export function getStatusTone(
  status: ItemStatus,
): "neutral" | "info" | "success" | "warning" | "danger" {
  return statusStyles[status]?.tone ?? "neutral";
}

export function getStatusLabel(status: ItemStatus): string {
  return statusStyles[status]?.label ?? status;
}
