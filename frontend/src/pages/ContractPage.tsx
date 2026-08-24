import { useDashboard } from "@/api/hooks";
import {
  Card,
  Badge,
  ProgressBar,
} from "@/components/ui/primitives";
import { formatCurrency } from "@/utils/designTokens";
import { useState } from "react";
import {
  FileText,
  CalendarDays,
  TableProperties,
  Activity,
  Building2,
  UserRound,
  CircleDollarSign,
  ChevronDown,
  Landmark,
  ShieldCheck,
  UserRoundCheck,
  BadgeCheck,
} from "lucide-react";

const detailToneStyles = {
  primary: "bg-primary-50/50 border-primary-200/50",
  success: "bg-semantic-success-light/50 border-semantic-success-main/20",
  warning: "bg-semantic-warning-light/50 border-semantic-warning-main/20",
  info: "bg-semantic-info-light/50 border-semantic-info-main/20",
};

const detailIconStyles = {
  primary: "text-primary-500 bg-primary-50",
  success: "text-semantic-success-main bg-semantic-success-light",
  warning: "text-semantic-warning-main bg-semantic-warning-light",
  info: "text-semantic-info-main bg-semantic-info-light",
};

const summaryCards = [
  {
    label: "Contract No.",
    value: "GEMC-511687787388769",
    icon: FileText,
    tone: "primary" as const,
    badge: "GeM-1",
  },
  {
    label: "Generated Date",
    value: "22-Jul-2026",
    icon: CalendarDays,
    tone: "success" as const,
  },
  {
    label: "Bid / RA / PBP No.",
    value: "GEM/2026/B/7145781",
    icon: TableProperties,
    tone: "warning" as const,
  },
  {
    label: "Procurement Mode",
    value: "Bid",
    icon: Activity,
    tone: "info" as const,
  },
];

const detailGroups = [
  {
    group: "Organisation",
    icon: Landmark,
    tone: "primary" as const,
    fields: [
      ["Type", "Central Autonomous"],
      ["Ministry", "Ministry of Electronics and Information Technology"],
      ["Department", "Department of Electronics and Information Technology"],
      ["Organisation Name", "National Informatics Centre Services Incorporated (NICSI)"],
      ["Office Zone", "Hall No. 2 & 3, 6th Floor, NBCC Tower-15, Bhikaji Cama Place, New Delhi-110066"],
    ],
  },
  {
    group: "Buyer",
    icon: UserRound,
    tone: "info" as const,
    fields: [
      ["Designation", "HOD GeM Division"],
      ["Contact", "011-22900512-69012"],
      ["Email", "gem1-nicsi@nicsi.nic.in"],
      ["GSTIN", "07AAACN2185J1ZE"],
      ["Address", "1st Floor, NBCC Tower, 15 Bhikaji Cama Place, South West Delhi, DELHI-110066, India"],
    ],
  },
  {
    group: "Seller",
    icon: Building2,
    tone: "success" as const,
    fields: [
      ["GeM Seller ID", "1E15180000102549"],
      ["Company", "CYGNUS INFORMATION SOLUTIONS PRIVATE LIMITED"],
      ["Contact", "09987404355"],
      ["Email", "rajesh@cygnussolutions.co.in"],
      ["MSME Registration", "UDYAM-MH-18-0007992"],
      ["GSTIN", "09AADCC3852G1ZP (B), 27AADCC3852G1ZR (R)"],
      ["Address", "1005, 10th Floor, Lodha Supremus, Opp. MTNL Saki Vihar Road, Powai, Mumbai, Maharashtra-400072"],
    ],
  },
  {
    group: "Approvals & Payment",
    icon: ShieldCheck,
    tone: "warning" as const,
    fields: [
      ["IFD Concurrence", "No"],
      ["Administrative Approval", "MD"],
      ["Financial Approval", "FA"],
      ["Paying Authority", "PAO"],
      ["Payment Mode", "Offline"],
      ["Payment Designation", "GM"],
      ["Payment Email", "gmjk-nicsi@nicsi.nic.in"],
      ["MII Status", "Not Verified"],
      ["MSME Status", "Not Verified"],
      ["MSE Social Category", "General"],
      ["MSE Gender", "Male"],
    ],
  },
];

const summaryToneIconStyles = {
  primary: "text-primary-500 bg-primary-50",
  success: "text-semantic-success-main bg-semantic-success-light",
  warning: "text-semantic-warning-main bg-semantic-warning-light",
  info: "text-semantic-info-main bg-semantic-info-light",
};

export function ContractPage(): JSX.Element {
  const { data: dashboard, isLoading } = useDashboard();
  const [isExpanded, setIsExpanded] = useState(true);

  const contractValue = dashboard?.summary?.totalValue;
  const contractProgress = dashboard?.summary?.overallProgress;

  return (
    <div className="space-y-8">
      {/* Page Hero Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">GeM Contract</p>
              <Badge variant="success" size="sm" dot>Active</Badge>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-text-primary">
              Contract Details
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Procurement information associated with the item register
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm" dot>
            GeM-1 Platform
          </Badge>
        </div>
      </div>

      {/* Contract Health Metrics - Card Band */}
      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-surface-border bg-surface-primary shadow-card sm:grid-cols-2">
        <div className="flex items-center gap-4 border-b border-surface-divider p-5 sm:border-b-0 sm:border-r">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-semantic-success-light text-semantic-success-main">
            <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">
              Contract Value
            </p>
            <p className="mt-1 text-2xl font-bold text-text-primary">
              {isLoading ? "Loading..." : formatCurrency(contractValue || 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-500">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">
              Execution Progress
            </p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressBar
                value={contractProgress || 0}
                max={100}
                variant="default"
                size="sm"
                className="flex-1"
              />
              <span className="text-2xl font-bold text-primary-500 whitespace-nowrap">
                {contractProgress || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-surface-divider bg-surface-primary p-4 transition-all duration-200 hover:border-primary-300/60 hover:shadow-cardHover"
          >
            <div className="flex items-start gap-3">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${summaryToneIconStyles[card.tone]
                  }`}
              >
                <card.icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                  {card.label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-text-primary" title={card.value}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Detail Sections */}
      <Card variant="outlined" padding="none" className="overflow-hidden">
        <div className="border-b border-surface-divider bg-surface-secondary/60">
          <button
            type="button"
            className="flex w-full cursor-pointer select-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-tertiary/60"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="contract-details-content"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-500">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary">Detailed Sections</p>
                <p className="text-xs text-text-tertiary">
                  {detailGroups.length} sections · Click to {isExpanded ? "collapse" : "expand"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-text-tertiary transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""
                }`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          id="contract-details-content"
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="p-4 md:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {detailGroups.map((group) => (
                <div
                  key={group.group}
                  className={`rounded-xl border p-5 ${detailToneStyles[group.tone]
                    }`}
                >
                  <h3 className="flex items-center gap-2.5 text-sm font-semibold text-text-primary">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg ${detailIconStyles[group.tone]
                        }`}
                    >
                      <group.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    {group.group}
                  </h3>
                  <dl className="mt-4 space-y-3">
                    {group.fields.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[minmax(110px,0.7fr)_1.3fr] gap-3 text-xs"
                      >
                        <dt className="text-text-tertiary font-medium">{label}</dt>
                        <dd className="break-words text-text-secondary font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Footer note */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
        <UserRoundCheck className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Contract data synchronized with GeM platform · NICSI</span>
      </div>
    </div>
  );
}