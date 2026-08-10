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
  className?: string;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, action, icon, className = "", ...props }, ref) => {
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
            className="mx-auto mb-4 h-12 w-12 text-text-tertiary"
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
