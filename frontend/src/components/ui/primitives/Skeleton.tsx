import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const variantStyles = {
  text: "h-4 rounded",
  circular: "rounded-full",
  rectangular: "rounded-md",
};

const animationStyles = {
  pulse: "animate-pulse",
  wave: "animate-[shimmer_1.5s_infinite]",
  none: "",
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width = "100%",
      height,
      animation = "pulse",
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-tertiary",
          variantStyles[variant],
          animationStyles[animation],
          className,
        )}
        style={{
          width,
          height: height || (variant === "text" ? "1rem" : undefined),
        }}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

// Skeleton for stat cards
export function StatCardSkeleton(): JSX.Element {
  return (
    <div className="bg-surface-primary border border-surface-border rounded-lg p-6 animate-pulse">
      <Skeleton variant="text" width="60%" height="14px" />
      <Skeleton variant="text" width="40%" height="32px" className="mt-2" />
    </div>
  );
}

// Skeleton for phase summary cards
export function PhaseCardSkeleton(): JSX.Element {
  return (
    <div className="bg-surface-primary border border-surface-border rounded-lg p-6 animate-pulse">
      <Skeleton variant="text" width="50%" height="20px" />
      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton variant="text" width="40%" height="14px" />
          <Skeleton variant="text" width="30%" height="14px" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" width="40%" height="14px" />
          <Skeleton variant="text" width="30%" height="14px" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" width="40%" height="14px" />
          <Skeleton variant="text" width="30%" height="14px" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({
  columns = 7,
}: {
  columns?: number;
}): JSX.Element {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton
            variant="text"
            width={i === 0 ? "70%" : "50%"}
            height="14px"
          />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for table with multiple rows
export function TableSkeleton({
  rows = 5,
  columns = 7,
}: {
  rows?: number;
  columns?: number;
}): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
              >
                <Skeleton variant="text" width="60%" height="12px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRowSkeleton key={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton for filter bar
export function FilterBarSkeleton(): JSX.Element {
  return (
    <div className="p-4 border-b border-surface-divider bg-surface-secondary flex flex-wrap gap-4 items-end animate-pulse">
      <div className="flex-1 min-w-[200px]">
        <Skeleton variant="text" width="30%" height="14px" className="mb-1.5" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
      <div className="min-w-[150px]">
        <Skeleton variant="text" width="30%" height="14px" className="mb-1.5" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
      <div className="min-w-[150px]">
        <Skeleton variant="text" width="30%" height="14px" className="mb-1.5" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
    </div>
  );
}

// Skeleton for page header
export function PageHeaderSkeleton(): JSX.Element {
  return (
    <div className="space-y-2 animate-pulse">
      <Skeleton variant="text" width="20%" height="14px" />
      <Skeleton variant="text" width="40%" height="28px" />
      <Skeleton variant="text" width="60%" height="16px" />
    </div>
  );
}
