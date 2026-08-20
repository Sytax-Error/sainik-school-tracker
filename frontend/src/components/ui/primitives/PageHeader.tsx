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
    return (
      <div ref={ref} className={cn("relative space-y-3 border-b border-surface-divider pb-5", className)} {...props}>
        {accentColor && (
          <div
            className={cn(
              "absolute bottom-0 left-0 h-1 w-14 rounded-full",
              accentColor === "primary" && "bg-primary-500",
              accentColor === "success" && "bg-semantic-success-main",
              accentColor === "warning" && "bg-semantic-warning-main",
              accentColor === "danger" && "bg-semantic-danger-main",
              accentColor === "info" && "bg-semantic-info-main",
            )}
          />
        )}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            className="relative z-10 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary"
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
                    className="transition-colors hover:text-primary-700"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-medium text-text-primary"
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
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-primary-900">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
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
