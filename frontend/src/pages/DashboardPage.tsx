import { useDashboard, usePhases, useItems } from "@/api/hooks";
import { StatCard, PhaseSummaryCard } from "@/components/ui/StatCards";
import { ItemTable } from "@/components/ui/ItemTable";
import { Badge, PageHeader } from "@/components/ui/primitives";
import { formatCurrency, formatPercent } from "@/utils/designTokens";
import { useState, useCallback } from "react";
import type { ItemFilters } from "@/api/types";
import { Activity, Building2, CalendarDays, CircleDollarSign, FileText, Gauge, Layers3, Package, TableProperties, UserRound } from "lucide-react";

const contractSummary = [
  { label: "Contract No.", value: "GEMC-511687787388769" },
  { label: "Generated date", value: "22-Jul-2026" },
  { label: "Bid / RA / PBP No.", value: "GEM/2026/B/7145781" },
  { label: "Procurement mode", value: "Bid" },
] as const;

const contractDetails = [
  { group: "Organisation", icon: Building2, fields: [["Type", "Central Autonomous"], ["Ministry", "Ministry of Electronics and Information Technology"], ["Department", "Department of Electronics and Information Technology"], ["Organisation name", "National Informatics Centre Services Incorporated (NICSI)"], ["Office zone", "Hall No. 2 & 3, 6th Floor, NBCC Tower-15, Bhikaji Cama Place, New Delhi-110066"]] },
  { group: "Buyer", icon: UserRound, fields: [["Designation", "HOD GeM Division"], ["Contact", "011-22900512-69012"], ["Email", "gem1-nicsi@nicsi.nic.in"], ["GSTIN", "07AAACN2185J1ZE"], ["Address", "1st Floor, NBCC Tower, 15 Bhikaji Cama Place, South West Delhi, DELHI-110066, India"]] },
  { group: "Seller", icon: Building2, fields: [["GeM Seller ID", "1E15180000102549"], ["Company", "CYGNUS INFORMATION SOLUTIONS PRIVATE LIMITED"], ["Contact", "09987404355"], ["Email", "rajesh@cygnussolutions.co.in"], ["MSME registration", "UDYAM-MH-18-0007992"], ["GSTIN", "09AADCC3852G1ZP (B), 27AADCC3852G1ZR (R)"], ["Address", "1005, 10th Floor, Lodha Supremus, Opp. MTNL Saki Vihar Road, Powai, Mumbai, Maharashtra-400072"]] },
  { group: "Approvals & payment", icon: FileText, fields: [["IFD concurrence", "No"], ["Administrative approval", "MD"], ["Financial approval", "FA"], ["Paying authority", "PAO"], ["Payment mode", "Offline"], ["Payment designation", "GM"], ["Payment email", "gmjk-nicsi@nicsi.nic.in"], ["MII status", "Not Verified"], ["MSME status", "Not Verified"], ["MSE social category", "General"], ["MSE gender", "Male"]] },
] as const;

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
      <section className="dashboard-status-strip" aria-label="Project snapshot">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-400">
              <Activity className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary-900">Sainik School Project</p>
              <p className="text-xs text-text-secondary">Live execution snapshot</p>
            </div>
            <Badge variant="success" size="sm" dot>Live</Badge>
          </div>
          <div className="flex items-center gap-3 border-t border-surface-divider pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">Overall progress</span>
            <span className="text-2xl font-bold tracking-[-0.04em] text-primary-900">{formatPercent(dashboard?.summary?.overallProgress || 0)}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-surface-divider pt-3">
          {statusSummary.map((status) => (
            <div key={status.label} className="flex items-center gap-2">
              <Badge variant={status.tone} size="sm" dot>{status.label}</Badge>
              <span className="text-sm font-bold text-primary-900">{status.value}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="contract-panel" aria-labelledby="contract-details-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-400">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-400">GeM contract</p>
              <h2 id="contract-details-title" className="mt-1 text-xl font-bold tracking-[-0.02em] text-primary-900">Contract details</h2>
              <p className="mt-1 text-sm text-text-secondary">Procurement information associated with the item register.</p>
            </div>
          </div>
          <details className="contract-details">
            <summary>View full details</summary>
            <div className="mt-5 grid gap-6 border-t border-surface-divider pt-5 md:grid-cols-2">
              {contractDetails.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.group}>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-primary-900"><GroupIcon className="h-4 w-4 text-primary-400" aria-hidden="true" />{group.group}</h3>
                    <dl className="mt-3 space-y-2">
                      {group.fields.map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[minmax(100px,0.7fr)_1.3fr] gap-3 text-xs">
                          <dt className="text-text-tertiary">{label}</dt>
                          <dd className="break-words text-text-secondary">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contractSummary.map((field, index) => (
            <div key={field.label} className="contract-summary-cell">
              {index === 1 ? <CalendarDays className="h-4 w-4 text-primary-400" aria-hidden="true" /> : index === 0 ? <FileText className="h-4 w-4 text-primary-400" aria-hidden="true" /> : index === 2 ? <TableProperties className="h-4 w-4 text-primary-400" aria-hidden="true" /> : <Activity className="h-4 w-4 text-primary-400" aria-hidden="true" />}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">{field.label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-primary-900" title={field.value}>{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="key-metrics-title">
        <div className="mb-4 px-1">
          <h2 id="key-metrics-title" className="text-xl font-bold tracking-[-0.02em] text-primary-900">Key metrics</h2>
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
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-400">
            <Layers3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Execution map</p>
            <h2 id="phase-overview-title" className="mt-1 text-xl font-bold tracking-[-0.02em] text-primary-900">Phase overview</h2>
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
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-400">
            <TableProperties className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">Portfolio register</p>
            <h2 id="portfolio-register-title" className="mt-1 text-xl font-bold tracking-[-0.02em] text-primary-900">All Items</h2>
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
