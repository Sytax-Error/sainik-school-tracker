import { formatCurrency, formatPercent } from "@/utils/designTokens";

interface StatCardProps {
  title: string;
  value: string | number;
  formatter?: (value: number) => string;
}

export function StatCard({
  title,
  value,
  formatter,
}: StatCardProps): JSX.Element {
  const displayValue = formatter ? formatter(value as number) : String(value);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{displayValue}</p>
    </div>
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sanctioned Value</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(phase.totalValue)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-primary-600">
            {formatPercent(phase.progressPercent)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items</span>
          <span className="font-medium text-gray-900">{phase.itemCount}</span>
        </div>
      </div>
    </div>
  );
}
