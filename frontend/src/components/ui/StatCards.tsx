import { Card, CardContent, Badge } from "./primitives";
import { formatCurrency, formatPercent } from "@/utils/designTokens";
import { ProgressBar } from "./primitives";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowUpRight, ClipboardList, CircleDollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  formatter?: (value: number) => string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  supportingText?: string;
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
}

export function StatCard({
  title,
  value,
  formatter,
  trend,
  icon,
  supportingText,
  accentColor = "primary",
}: StatCardProps): JSX.Element {
  const displayValue = formatter ? formatter(value as number) : String(value);

  const accentBgStyles = {
    primary: "bg-primary-50",
    success: "bg-semantic-success-light",
    warning: "bg-semantic-warning-light",
    danger: "bg-semantic-danger-light",
    info: "bg-semantic-info-light",
  };

  const accentTextStyles = {
    primary: "text-primary-700",
    success: "text-semantic-success-dark",
    warning: "text-semantic-warning-dark",
    danger: "text-semantic-danger-dark",
    info: "text-semantic-info-dark",
  };

  return (
    <Card
      variant="default"
      padding="md"
      hover
      className="relative overflow-hidden border-surface-border/80 shadow-card hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <CardContent className="relative pt-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">{title}</p>
            {supportingText && <p className="mt-1 text-xs text-text-secondary">{supportingText}</p>}
          </div>
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accentBgStyles[accentColor]} ${accentTextStyles[accentColor]}`}
          >
            {icon || <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />}
          </div>
        </div>
        <p className="mt-6 whitespace-nowrap text-xl font-bold leading-tight tracking-[-0.03em] text-primary-900 sm:text-2xl">
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
  phaseId: string;
  phase: {
    name: string;
    totalValue: number;
    progressPercent: number;
    itemCount: number;
  };
}

export function PhaseSummaryCard({
  phaseId,
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

  const isComplete = phase.progressPercent >= 100;
  const isActive = phase.progressPercent > 0 && !isComplete;

  return (
    <Link
      to={`/phase/${phaseId}`}
      aria-label={`Open ${phase.name}`}
      className="app-reveal block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      <Card
        variant="default"
        padding="md"
        hover
        className="relative overflow-hidden border-surface-border/80 shadow-card transition-transform hover:-translate-y-1 hover:shadow-cardHover"
      >
        <CardContent className="relative pt-0">
          <div className="flex items-start justify-between gap-4 border-b border-surface-divider pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-100 text-primary-500">
                  <ClipboardList className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                </span>
                Phase overview
              </div>
              <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-primary-900">{phase.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isComplete ? "success" : isActive ? "info" : "neutral"} size="sm" dot>
                {isComplete ? "Completed" : isActive ? "Active" : "Not started"}
              </Badge>
              <ArrowUpRight className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-secondary p-4">
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <CircleDollarSign className="h-4 w-4 text-primary-400" aria-hidden="true" />
                Sanctioned value
              </div>
              <p className="mt-2 text-base font-bold text-primary-900">{formatCurrency(phase.totalValue)}</p>
            </div>
            <div className="rounded-xl bg-surface-secondary p-4">
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <ClipboardList className="h-4 w-4 text-primary-400" aria-hidden="true" />
                Items tracked
              </div>
              <p className="mt-2 text-base font-bold text-primary-900">{phase.itemCount}</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-surface-divider bg-surface-secondary/60 p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">Execution progress</p>
                <p className="mt-1 text-xs text-text-secondary">Value-weighted phase completion</p>
              </div>
              <span className={`text-2xl font-bold tracking-[-0.04em] ${progressTextStyles[progressColor]}`}>{formatPercent(phase.progressPercent)}</span>
            </div>
            <div className={progressStyles[progressColor] + " rounded-lg p-1.5"}>
              <ProgressBar value={phase.progressPercent} max={100} variant={progressColor} size="md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
