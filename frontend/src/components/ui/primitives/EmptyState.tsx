import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Button, type ButtonProps } from "./Button";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
  };
  icon?: React.ReactNode;
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const accentStyles = {
  primary: "text-primary-600 bg-primary-50 border-primary-200",
  success:
    "text-semantic-success-main bg-semantic-success-light border-semantic-success-main/20",
  warning:
    "text-semantic-warning-main bg-semantic-warning-light border-semantic-warning-main/20",
  danger:
    "text-semantic-danger-main bg-semantic-danger-light border-semantic-danger-main/20",
  info: "text-semantic-info-main bg-semantic-info-light border-semantic-info-main/20",
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title,
      description,
      action,
      icon,
      accentColor = "primary",
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center py-12 px-4",
          className,
        )}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              "mx-auto mb-4 h-16 w-16 rounded-2xl flex items-center justify-center",
              accentStyles[accentColor],
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            {description}
          </p>
        )}
        {action && (
          <Button
            variant={action.variant || "primary"}
            size={action.size || "sm"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";
