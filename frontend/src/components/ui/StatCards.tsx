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
}

export function StatCard({
  title,
  value,
  formatter,
  trend,
}: StatCardProps): JSX.Element {
  const displayValue = formatter ? formatter(value as number) : String(value);

  return (
    <Card variant="default" padding="md" hover>
      <CardContent className="pt-0">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="mt-1 text-3xl font-bold text-text-primary">
          {displayValue}
        </p>
        {trend && (
          <div className="mt-2 flex items-center gap-1.5">
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
  return (
    <Card variant="default" padding="md" hover>
      <CardContent className="pt-0">
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
              <span className="font-medium text-primary-600">
                {formatPercent(phase.progressPercent)}
              </span>
            </div>
            <ProgressBar
              value={phase.progressPercent}
              max={100}
              variant={
                phase.progressPercent === 100
                  ? "success"
                  : phase.progressPercent > 0
                    ? "default"
                    : "default"
              }
            />
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
