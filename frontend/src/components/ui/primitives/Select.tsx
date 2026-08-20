import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      accentColor = "primary",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full rounded-lg border bg-surface-primary px-3 py-2.5 text-sm shadow-sm",
              "text-text-primary appearance-none",
              "transition-all duration-200",
              "focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-0",
              "disabled:bg-surface-secondary disabled:cursor-not-allowed",
              "pr-10", // Space for custom arrow
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
                ? `${selectId}-error`
                : helperText
                  ? `${selectId}-helper`
                  : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-tertiary">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-semantic-danger-main"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-1.5 text-sm text-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
