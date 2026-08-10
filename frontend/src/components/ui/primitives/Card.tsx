import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
}

const accentStyles = {
  primary: "bg-gradient-to-r from-primary-500 to-primary-600",
  success: "bg-gradient-to-r from-semantic-success-main to-semantic-success-dark",
  warning: "bg-gradient-to-r from-semantic-warning-main to-semantic-warning-dark",
  danger: "bg-gradient-to-r from-semantic-danger-main to-semantic-danger-dark",
  info: "bg-gradient-to-r from-semantic-info-main to-semantic-info-dark",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      accentColor,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      default: "bg-surface-primary border border-surface-border shadow-card",
      outlined: "bg-surface-primary border border-surface-border",
      elevated: "bg-surface-primary shadow-cardHover border-none",
      gradient: "bg-gradient-to-br from-surface-primary via-surface-primary to-surface-secondary border border-surface-border/50",
    };

    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover
      ? "transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          "rounded-lg",
          hoverStyles,
          className,
          "relative overflow-hidden",
        )}
        {...props}
      >
        {accentColor && (
          <div className={`absolute top-0 left-0 right-0 h-1 ${accentStyles[accentColor]}`} />
        )}
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  ),
);

CardHeader.displayName = "CardHeader";

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-lg font-semibold text-text-primary ${className}`}
      {...props}
    >
      {children}
    </h3>
  ),
);

CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className = "", children, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-text-secondary mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);

CardContent.displayName = "CardContent";

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t border-surface-divider flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = "CardFooter";
