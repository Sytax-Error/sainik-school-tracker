import { useDashboard, usePhases, useItems } from "@/api/hooks";
import { ContractPanel, sainikSchoolContractSummary, sainikSchoolContractDetails } from "@/components/ui";
import { StatCard, PhaseSummaryCard } from "@/components/ui/StatCards";
import { ItemTable } from "@/components/ui/ItemTable";
import { Badge, PageHeader } from "@/components/ui/primitives";
import { formatCurrency, formatPercent } from "@/utils/designTokens";
import { useState, useCallback } from "react";
import type { ItemFilters } from "@/api/types";
import { Activity, CircleDollarSign, Gauge, Layers3, Package, TableProperties } from "lucide-react";

function MetricIcon({ type }: { type: "currency" | "progress" | "items" }): JSX.Element {
  if (type === "currency") {
    return <CircleDollarSign className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />;
  }
  if (type === "progress") {
    return <Gauge className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />;
  }
  if (type === "items") {
    return <Package className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />;
  }
  return <Package className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />;
}

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
        <PageHeader title="Dashboard" description="Loading..." />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Failed to load dashboard data"
        />
      </div>
    );
  }

  const phase1 = phases?.find((p) => p.code === "PHASE_1");
  const phase2 = phases?.find((p) => p.code === "PHASE_2");
  const statusCounts = dashboard?.summary?.statusCounts || {};
  const statusSummary = [
    { label: "Not started", value: statusCounts.NOT_STARTED || 0, tone: "neutral" as const },
    { label: "In progress", value: statusCounts.IN_PROGRESS || 0, tone: "info" as const },
    { label: "Completed", value: statusCounts.COMPLETED || 0, tone: "success" as const },
    { label: "On hold", value: statusCounts.ON_HOLD || 0, tone: "warning" as const },
  ];

  return (
    <div className="app-reveal space-y-9">
      <PageHeader
        title="Dashboard"
        description="Live view of project progress, value, and item health"
      />
      <ContractPanel
        summary={sainikSchoolContractSummary}
        details={sainikSchoolContractDetails}
        contractValue={dashboard?.summary?.totalValue}
        contractProgress={dashboard?.summary?.overallProgress}
      />
      <section className="dashboard-status-strip" aria-label="Project snapshot">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600">
              <Activity className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">Sainik School Project</p>
              <p className="text-xs text-text-secondary">Live execution snapshot</p>
            </div>
            <Badge variant="success" size="sm" dot>Live</Badge>
          </div>
          <div className="flex items-center gap-3 border-t border-surface-divider pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">Overall progress</span>
            <span className="text-2xl font-bold tracking-[-0.04em] text-text-primary">{formatPercent(dashboard?.summary?.overallProgress || 0)}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-surface-divider pt-3">
          {statusSummary.map((status) => (
            <div key={status.label} className="flex items-center gap-2">
              <Badge variant={status.tone} size="sm" dot>{status.label}</Badge>
              <span className="text-sm font-bold text-text-primary">{status.value}</span>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="key-metrics-title">
        <div className="mb-4 px-1">
          <h2 id="key-metrics-title" className="text-xl font-bold tracking-[-0.02em] text-text-primary">Key metrics</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
          title="Total Sanctioned Value"
          value={dashboard?.summary?.totalValue || 0}
          formatter={formatCurrency}
          accentColor="primary"
          icon={<MetricIcon type="currency" />}
          supportingText="Total project allocation"
          />
          <StatCard
          title="Overall Progress"
          value={dashboard?.summary?.overallProgress || 0}
          formatter={formatPercent}
          accentColor="success"
          icon={<MetricIcon type="progress" />}
          supportingText="Value-weighted completion"
          />
          <StatCard
          title="Total Items"
          value={dashboard?.summary?.totalItems || 0}
          accentColor="info"
          icon={<MetricIcon type="items" />}
          supportingText="Across all phases"
          />
        </div>
      </section>
      <section aria-labelledby="phase-overview-title">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600">
            <Layers3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Execution map</p>
            <h2 id="phase-overview-title" className="mt-1 text-xl font-bold tracking-[-0.02em] text-text-primary">Phase overview</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PhaseSummaryCard
          phaseId="1"
          phase={{
            name: phase1?.name || "Phase 1",
            totalValue: phase1?.totalValue || 0,
            progressPercent: phase1?.progressPercent || 0,
            itemCount: phase1?.itemCount || 0,
          }}
        />
        <PhaseSummaryCard
          phaseId="2"
          phase={{
            name: phase2?.name || "Phase 2",
            totalValue: phase2?.totalValue || 0,
            progressPercent: phase2?.progressPercent || 0,
            itemCount: phase2?.itemCount || 0,
          }}
        />
        </div>
      </section>
      <section className="space-y-4" aria-labelledby="portfolio-register-title">
        <div className="flex items-center gap-3 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-600">
            <TableProperties className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Portfolio register</p>
            <h2 id="portfolio-register-title" className="mt-1 text-xl font-bold tracking-[-0.02em] text-text-primary">All Items</h2>
          </div>
        </div>
        {itemsLoading ? (
          <div className="p-8 text-center text-text-secondary">
            Loading items...
          </div>
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
            isLoading={itemsLoading}
            error={null}
          />
        )}
      </section>
    </div>
  );
}
