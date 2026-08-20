export interface Project {
  _id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Phase {
  _id: string;
  projectId: string;
  code: string;
  name: string;
  order: number;
  description?: string;
  itemCount: number;
  totalValue: number;
  completedValue: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  _id: string;
  projectId: string;
  phaseId: string;
  code: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  // Tracking quantity fields (optional operational details)
  deliveredQty?: number;
  installedQty?: number;
  testedQty?: number;
  acceptedQty?: number;
  status: ItemStatus;
  progressPercent: number;
  valueCompleted: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export interface DashboardSummary {
  project: Project;
  summary: {
    totalValue: number;
    completedValue: number;
    overallProgress: number;
    totalItems: number;
    statusCounts: Record<string, number>;
  };
  phases: PhaseSummary[];
}

export interface PhaseSummary {
  _id: string;
  name: string;
  code: string;
  order: number;
  totalValue: number;
  completedValue: number;
  progressPercent: number;
  itemCount: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ItemFilters {
  search?: string;
  status?: ItemStatus;
  phaseId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateProgressPayload {
  progressPercent?: number;
  status?: ItemStatus;
  remarks?: string;
  // Tracking quantity fields (optional)
  deliveredQty?: number;
  installedQty?: number;
  testedQty?: number;
  acceptedQty?: number;
}
