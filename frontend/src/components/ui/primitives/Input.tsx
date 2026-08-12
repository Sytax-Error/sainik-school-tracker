import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
}

const accentFocusStyles = {
  primary: "focus-visible:ring-primary-500",
  success: "focus-visible:ring-semantic-success-main",
  warning: "focus-visible:ring-semantic-warning-main",
  danger: "focus-visible:ring-semantic-danger-main",
  info: "focus-visible:ring-semantic-info-main",
};

const accentBorderStyles = {
  primary: "hover:border-primary-300",
  success: "hover:border-semantic-success-main/50",
  warning: "hover:border-semantic-warning-main/50",
  danger: "hover:border-semantic-danger-main/50",
  info: "hover:border-semantic-info-main/50",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      accentColor = "primary",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 text-sm bg-surface-primary border rounded-md",
            "text-text-primary placeholder-text-tertiary",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            "disabled:bg-surface-secondary disabled:cursor-not-allowed",
            error
              ? "border-semantic-danger-main focus-visible:ring-semantic-danger-light"
              : "border-surface-border " +
                  accentBorderStyles[accentColor] +
                  " " +
                  accentFocusStyles[accentColor],
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-semantic-danger-main"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
