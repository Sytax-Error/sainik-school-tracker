import { Card, CardContent } from "./primitives";
import { formatCurrency, formatPercent } from "@/utils/designTokens";
import { ProgressBar } from "./primitives";

interface StatCardProps {
  title: string;
  value: string | number;
  formatter?: (value: number) => string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
}

export function StatCard({
  title,
  value,
  formatter,
  trend,
  accentColor = "primary",
}: StatCardProps): JSX.Element {
  const displayValue = formatter ? formatter(value as number) : String(value);

  const accentStyles = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    success: "bg-gradient-to-r from-semantic-success-main to-semantic-success-dark",
    warning: "bg-gradient-to-r from-semantic-warning-main to-semantic-warning-dark",
    danger: "bg-gradient-to-r from-semantic-danger-main to-semantic-danger-dark",
    info: "bg-gradient-to-r from-semantic-info-main to-semantic-info-dark",
  };

  const accentBgStyles = {
    primary: "bg-primary-50",
    success: "bg-semantic-success-light",
    warning: "bg-semantic-warning-light",
    danger: "bg-semantic-danger-light",
    info: "bg-semantic-info-light",
  };

  return (
    <Card variant="default" padding="md" hover className="relative overflow-hidden">
      {/* Accent bar at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentStyles[accentColor]}`} />
      <CardContent className="pt-0 relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentBgStyles[accentColor]}`}>
            <div className="w-5 h-5 rounded-full bg-current opacity-20" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-text-primary">
          {displayValue}
        </p>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={`text-xs font-medium ${
                trend.positive !== false
                  ? "text-semantic-success-main"
                  : "text-semantic-danger-main"
              }`}
            >
              {trend.positive !== false ? "▲" : "▼"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-text-tertiary">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PhaseSummaryCardProps {
  phase: {
    name: string;
    totalValue: number;
    progressPercent: number;
    itemCount: number;
  };
}

export function PhaseSummaryCard({
  phase,
}: PhaseSummaryCardProps): JSX.Element {
  const progressColor =
    phase.progressPercent === 100
      ? "success"
      : phase.progressPercent >= 75
        ? "info"
        : phase.progressPercent >= 50
          ? "warning"
          : phase.progressPercent > 0
            ? "info"
            : "info";

  const progressStyles = {
    primary: "bg-primary-50 border-primary-200",
    success: "bg-semantic-success-light border-semantic-success-main/20",
    warning: "bg-semantic-warning-light border-semantic-warning-main/20",
    info: "bg-semantic-info-light border-semantic-info-main/20",
  };

  const progressTextStyles = {
    primary: "text-primary-600",
    success: "text-semantic-success-main",
    warning: "text-semantic-warning-main",
    info: "text-semantic-info-main",
  };

  return (
    <Card variant="default" padding="md" hover className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600`} />
      <CardContent className="pt-0 relative">
        <h3 className="text-lg font-semibold text-text-primary">
          {phase.name}
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Sanctioned Value</span>
            <span className="font-medium text-text-primary">
              {formatCurrency(phase.totalValue)}
            </span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-text-secondary">Progress</span>
              <span className={`font-medium ${progressTextStyles[progressColor]}`}>
                {formatPercent(phase.progressPercent)}
              </span>
            </div>
            <div className={progressStyles[progressColor] + " rounded-lg p-3"}>
              <ProgressBar
                value={phase.progressPercent}
                max={100}
                variant={progressColor}
                size="md"
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Items</span>
            <span className="font-medium text-text-primary">
              {phase.itemCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
