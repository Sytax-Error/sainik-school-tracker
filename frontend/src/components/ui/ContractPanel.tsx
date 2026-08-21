import { Card, ProgressBar, Badge } from "./primitives";
import { formatCurrency } from "@/utils/designTokens";
import {
  FileText,
  CalendarDays,
  TableProperties,
  Activity,
  Building2,
  UserRound,
  CircleDollarSign,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export interface ContractSummaryItem {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "info";
}

export interface ContractDetailGroup {
  group: string;
  icon: ReactNode;
  fields: Array<[string, string]>;
  tone?: "primary" | "success" | "warning" | "info";
}

export interface ContractPanelProps {
  summary: ContractSummaryItem[];
  details: ContractDetailGroup[];
  contractValue?: number;
  contractProgress?: number;
  defaultExpanded?: boolean;
}

const toneIconStyles = {
  primary: "text-primary-500 bg-primary-50",
  success: "text-semantic-success-main bg-semantic-success-light",
  warning: "text-semantic-warning-main bg-semantic-warning-light",
  info: "text-semantic-info-main bg-semantic-info-light",
};

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

export function ContractPanel({
  summary,
  details,
  contractValue,
  contractProgress,
  defaultExpanded = false,
}: ContractPanelProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="space-y-5" aria-labelledby="contract-panel-title">
      {/* Panel Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">GeM Contract</p>
            <h2 id="contract-panel-title" className="mt-0.5 text-xl font-bold tracking-[-0.02em] text-text-primary">
              Contract Details
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Procurement information associated with the item register
            </p>
          </div>
        </div>
        <Badge variant="success" size="sm" dot>
          GeM Active Contract
        </Badge>
      </div>

      {/* Contract Health Metrics - Card Band */}
      {(contractValue !== undefined || contractProgress !== undefined) && (
        <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-surface-border bg-surface-primary shadow-card sm:grid-cols-2">
          {contractValue !== undefined && (
            <div className="flex items-center gap-4 border-b border-surface-divider p-5 sm:border-b-0 sm:border-r">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-semantic-success-light text-semantic-success-main">
                <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                  Contract Value
                </p>
                <p className="mt-1 text-xl font-bold text-text-primary">
                  {formatCurrency(contractValue)}
                </p>
              </div>
            </div>
          )}
          {contractProgress !== undefined && (
            <div className="flex items-center gap-4 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-500">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                  Execution Progress
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar
                    value={contractProgress}
                    max={100}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-primary-500 whitespace-nowrap">
                    {contractProgress}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-surface-divider bg-surface-primary p-4 transition-all duration-200 hover:border-primary-300/60 hover:shadow-cardHover"
          >
            <div className="flex items-start gap-3">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  toneIconStyles[item.tone || "primary"]
                }`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-text-primary" title={item.value}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Details Section - Inside a Card */}
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
                <Activity className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary">Contract Details</p>
                <p className="text-xs text-text-tertiary">
                  {details.length} sections · Click to {isExpanded ? "collapse" : "expand"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-text-tertiary transition-transform duration-200 flex-shrink-0 ${
                isExpanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          id="contract-details-content"
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 md:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {details.map((group) => (
                <div
                  key={group.group}
                  className={`rounded-xl border p-5 ${
                    detailToneStyles[group.tone || "primary"]
                  }`}
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-lg ${
                        detailIconStyles[group.tone || "primary"]
                      }`}
                    >
                      {group.icon}
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
    </section>
  );
}

// Pre-configured contract data for the Sainik School project
export const sainikSchoolContractSummary: ContractSummaryItem[] = [
  {
    label: "Contract No.",
    value: "GEMC-511687787388769",
    icon: <FileText className="h-4 w-4 text-primary-500" aria-hidden="true" />,
    tone: "primary",
  },
  {
    label: "Generated Date",
    value: "22-Jul-2026",
    icon: <CalendarDays className="h-4 w-4 text-semantic-success-main" aria-hidden="true" />,
    tone: "success",
  },
  {
    label: "Bid / RA / PBP No.",
    value: "GEM/2026/B/7145781",
    icon: <TableProperties className="h-4 w-4 text-semantic-warning-main" aria-hidden="true" />,
    tone: "warning",
  },
  {
    label: "Procurement Mode",
    value: "Bid",
    icon: <Activity className="h-4 w-4 text-semantic-info-main" aria-hidden="true" />,
    tone: "info",
  },
];

export const sainikSchoolContractDetails: ContractDetailGroup[] = [
  {
    group: "Organisation",
    icon: <Building2 className="h-4 w-4" aria-hidden="true" />,
    tone: "primary",
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
    icon: <UserRound className="h-4 w-4" aria-hidden="true" />,
    tone: "info",
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
    icon: <Building2 className="h-4 w-4" aria-hidden="true" />,
    tone: "success",
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
    icon: <FileText className="h-4 w-4" aria-hidden="true" />,
    tone: "warning",
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