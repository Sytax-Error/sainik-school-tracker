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
  card: "0 8px 24px rgb(0 0 0 / 0.18)",
  cardHover: "0 14px 32px rgb(0 0 0 / 0.28)",
  dropdown: "0 12px 28px rgb(0 0 0 / 0.3)",
  modal: "0 24px 60px rgb(0 0 0 / 0.45)",
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
