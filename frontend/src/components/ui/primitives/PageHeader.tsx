import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Link } from "react-router-dom";
import { Button, type ButtonProps } from "./Button";

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  breadcrumb?: Array<{ label: string; href?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
  };
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      breadcrumb,
      title,
      description,
      action,
      accentColor = "primary",
      className = "",
      ...props
    },
    ref,
  ) => {
    const accentStyles = {
      primary: "bg-gradient-to-r from-primary-500 to-primary-600",
      success:
        "bg-gradient-to-r from-semantic-success-main to-semantic-success-dark",
      warning:
        "bg-gradient-to-r from-semantic-warning-main to-semantic-warning-dark",
      danger:
        "bg-gradient-to-r from-semantic-danger-main to-semantic-danger-dark",
      info: "bg-gradient-to-r from-semantic-info-main to-semantic-info-dark",
    };

    return (
      <div ref={ref} className={cn("space-y-2 relative", className)} {...props}>
        {accentColor && (
          <div
            className={`absolute -top-2 -left-2 -right-2 h-1 rounded-t-lg ${accentStyles[accentColor]} opacity-50`}
          />
        )}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            className="flex items-center gap-1.5 text-sm text-text-tertiary relative z-10"
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-text-primary font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            {description && (
              <p className="mt-1 text-text-secondary">{description}</p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0 mt-2 sm:mt-0">
              <Button
                variant={action.variant || "primary"}
                size={action.size || "md"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

PageHeader.displayName = "PageHeader";
