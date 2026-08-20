import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-primary-500",
  success: "bg-semantic-success-main",
  warning: "bg-semantic-warning-main",
  danger: "bg-semantic-danger-main",
  info: "bg-semantic-info-main",
};

const trackStyles = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      showLabel = false,
      label,
      variant = "default",
      size = "md",
      className = "",
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div
          className={cn(
            "w-full overflow-hidden rounded-full border border-primary-200 bg-primary-100/80 p-0.5",
            trackStyles[size],
          )}
        >
          <div
            className={cn(
              variantStyles[variant],
              "rounded-full transition-all duration-500 ease-out",
            )}
            style={{
              width: `${percentage}%`,
              height: "100%",
            }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label || "Progress"}
          />
        </div>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mt-1.5 text-xs text-text-tertiary">
            <span>{label || "Progress"}</span>
            <span className="font-medium text-text-secondary">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";

// Table-specific compact progress bar
export interface TableProgressBarProps {
  value: number;
  max?: number;
  showPercent?: boolean;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function TableProgressBar({
  value,
  max = 100,
  showPercent = true,
  variant = "default",
}: TableProgressBarProps): JSX.Element {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-32">
      <div className="h-2.5 overflow-hidden rounded-full border border-primary-200 bg-primary-100/80 p-0.5">
        <div
          className={`${variantStyles[variant]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showPercent && (
        <span className="text-xs text-text-tertiary mt-1 block text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
