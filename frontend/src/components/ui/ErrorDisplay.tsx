import { type HTMLAttributes, forwardRef } from "react";
import { Button } from "./primitives";

export interface ErrorDisplayProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "inline" | "card" | "page";
}

export const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title = "Something went wrong",
      message = "An unexpected error occurred. Please try again.",
      onRetry,
      retryLabel = "Retry",
      variant = "card",
      className = "",
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      inline:
        "p-4 bg-semantic-danger-light border border-semantic-danger-main/20 rounded-lg",
      card: "p-6 bg-surface-primary border border-surface-border rounded-lg text-center",
      page: "p-8 bg-surface-primary border border-surface-border rounded-lg text-center max-w-md mx-auto",
    };

    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        role="alert"
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-8 h-8 text-semantic-danger-main flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="text-center">
            <h3 className="font-semibold text-text-primary">{title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{message}</p>
          </div>
          {onRetry && (
            <Button
              variant="primary"
              size="sm"
              onClick={onRetry}
              className="mt-2"
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

ErrorDisplay.displayName = "ErrorDisplay";

// Inline error for forms and small areas
export interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({
  message,
  className = "",
}: InlineErrorProps): JSX.Element {
  return (
    <div
      className={`flex items-center gap-2 p-3 bg-semantic-danger-light border border-semantic-danger-main/20 rounded-lg text-sm text-semantic-danger-dark ${className}`}
      role="alert"
    >
      <svg
        className="w-4 h-4 flex-shrink-0 text-semantic-danger-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// Error boundary fallback
export interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-8">
      <ErrorDisplay
        variant="page"
        title="Application Error"
        message={error?.message || "An unexpected error occurred"}
        onRetry={resetErrorBoundary}
        retryLabel="Try Again"
      />
    </div>
  );
}
