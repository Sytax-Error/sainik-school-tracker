export const ITEM_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const STATUS_LABELS: Record<ItemStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<ItemStatus, string> = {
  NOT_STARTED: "gray",
  IN_PROGRESS: "blue",
  COMPLETED: "green",
  ON_HOLD: "yellow",
  CANCELLED: "red",
};

export function isValidStatus(status: string): status is ItemStatus {
  return ITEM_STATUSES.includes(status as ItemStatus);
}
