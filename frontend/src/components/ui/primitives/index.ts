/**
 * UI Primitives - Reusable Design System Components
 *
 * Related Documentation:
 * - UI_DESIGN_SYSTEM.md: Complete design system specifications
 * - UI_IMPROVEMENT_PLAN.md: Strategic improvement plan
 * - UI_COLOR_QUICK_REF.md: Quick reference for daily development
 * - src/utils/designTokens.ts: Single source of truth for tokens
 * - tailwind.config.js: Tailwind theme configuration
 *
 * All components use design tokens via Tailwind classes.
 * Do not hardcode colors - use the variant/size props.
 */

export { Button, type ButtonProps } from "./Button";
export { Input, type InputProps } from "./Input";
export { Select, type SelectProps, type SelectOption } from "./Select";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from "./Card";
export {
  Badge,
  StatusBadge,
  type BadgeProps,
  type StatusBadgeProps,
} from "./Badge";
export {
  ProgressBar,
  TableProgressBar,
  type ProgressBarProps,
  type TableProgressBarProps,
} from "./ProgressBar";
export {
  Skeleton,
  StatCardSkeleton,
  PhaseCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  FilterBarSkeleton,
  PageHeaderSkeleton,
  type SkeletonProps,
} from "./Skeleton";
export {
  ErrorDisplay,
  InlineError,
  ErrorFallback,
  type ErrorDisplayProps,
  type InlineErrorProps,
  type ErrorFallbackProps,
} from "../ErrorDisplay";
export { EmptyState, type EmptyStateProps } from "./EmptyState";
export { PageHeader, type PageHeaderProps } from "./PageHeader";
