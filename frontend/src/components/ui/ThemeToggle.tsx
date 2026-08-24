import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks";
import { cn } from "@/utils/cn";

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-primary-500",
        "border border-surface-border bg-surface-secondary text-text-primary",
        "hover:bg-surface-tertiary",
        "px-3 py-2",
        className,
      )}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
      {showLabel && (
        <span className="ml-2 text-sm">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
