import { useDashboard, usePhases, useItems } from "@/api/hooks";
import { StatCard, PhaseSummaryCard } from "@/components/ui/StatCards";
import { ItemTable } from "@/components/ui/ItemTable";
import { formatCurrency, formatPercent } from "@/utils/designTokens";
import { useState, useCallback } from "react";
import type { ItemFilters } from "@/api/types";

export function DashboardPage(): JSX.Element {
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();
  const { data: phases, isLoading: phasesLoading } = usePhases();
  const [filters, setFiltersState] = useState<ItemFilters>({
    search: "",
    status: undefined,
    phaseId: undefined,
    page: 1,
    limit: 20,
    sortBy: "code",
    sortOrder: "asc",
  });

  const { data: itemsData, isLoading: itemsLoading } = useItems(filters);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ItemFilters>) => {
      setFiltersState((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  if (dashboardLoading || phasesLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const phase1 = phases?.find((p) => p.code === "PHASE_1");
  const phase2 = phases?.find((p) => p.code === "PHASE_2");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Overview of project progress and key metrics
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sanctioned Value"
          value={dashboard?.summary?.totalValue || 0}
          formatter={formatCurrency}
        />
        <StatCard
          title="Overall Progress"
          value={dashboard?.summary?.overallProgress || 0}
          formatter={formatPercent}
        />
        <StatCard
          title="Total Items"
          value={dashboard?.summary?.totalItems || 0}
        />
        <StatCard
          title="On Hold Items"
          value={dashboard?.summary?.statusCounts?.ON_HOLD || 0}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhaseSummaryCard
          phase={{
            name: phase1?.name || "Phase 1",
            totalValue: phase1?.totalValue || 0,
            progressPercent: phase1?.progressPercent || 0,
            itemCount: phase1?.itemCount || 0,
          }}
        />
        <PhaseSummaryCard
          phase={{
            name: phase2?.name || "Phase 2",
            totalValue: phase2?.totalValue || 0,
            progressPercent: phase2?.progressPercent || 0,
            itemCount: phase2?.itemCount || 0,
          }}
        />
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Items</h2>
        </div>
        {itemsLoading ? (
          <div className="p-8 text-center text-gray-600">Loading items...</div>
        ) : (
          <ItemTable
            items={itemsData?.items || []}
            pagination={
              itemsData?.pagination || {
                page: 1,
                limit: 20,
                total: 0,
                totalPages: 0,
                hasNext: false,
                hasPrev: false,
              }
            }
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
            showPhaseColumn={true}
            phases={
              phases?.map((p) => ({ id: p._id, name: p.name, code: p.code })) ||
              []
            }
          />
        )}
      </div>
    </div>
  );
}
