import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import {
  getStatusTone,
  getStatusLabel,
  type ItemStatus,
} from "@/utils/designTokens";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "info" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles = {
  neutral: {
    bg: "bg-surface-tertiary",
    text: "text-text-secondary",
    dot: "bg-text-tertiary",
    border: "border-surface-border",
  },
  info: {
    bg: "bg-semantic-info-light",
    text: "text-semantic-info-dark",
    dot: "bg-semantic-info-main",
    border: "border-semantic-info-main/20",
  },
  success: {
    bg: "bg-semantic-success-light",
    text: "text-semantic-success-dark",
    dot: "bg-semantic-success-main",
    border: "border-semantic-success-main/20",
  },
  warning: {
    bg: "bg-semantic-warning-light",
    text: "text-semantic-warning-dark",
    dot: "bg-semantic-warning-main",
    border: "border-semantic-warning-main/20",
  },
  danger: {
    bg: "bg-semantic-danger-light",
    text: "text-semantic-danger-dark",
    dot: "bg-semantic-danger-main",
    border: "border-semantic-danger-main/20",
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "neutral",
      size = "md",
      dot = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const styles = variantStyles[variant];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full border",
          styles.bg,
          styles.text,
          styles.border,
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(styles.dot, "rounded-full w-1.5 h-1.5 flex-shrink-0")}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export interface StatusBadgeProps extends Omit<
  BadgeProps,
  "variant" | "children"
> {
  status: ItemStatus;
  showLabel?: boolean;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      status,
      showLabel = true,
      size = "md",
      dot = true,
      className = "",
      ...props
    },
    ref,
  ) => {
    const tone = getStatusTone(status);
    const label = getStatusLabel(status);

    return (
      <Badge
        ref={ref}
        variant={tone}
        size={size}
        dot={dot}
        className={className}
        {...props}
      >
        {showLabel && label}
      </Badge>
    );
  },
);

StatusBadge.displayName = "StatusBadge";
