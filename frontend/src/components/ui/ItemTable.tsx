import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks";
import { useUpdateItemProgress } from "@/api/hooks";
import type {
  Item,
  ItemStatus,
  PaginatedResponse,
  ItemFilters,
} from "@/api/types";
import { formatCurrency } from "@/utils/designTokens";
import {
  Input,
  Select,
  StatusBadge,
  Button,
  Badge,
  TableProgressBar,
  FilterBarSkeleton,
  TableSkeleton,
  EmptyState,
} from "./primitives";
import { useToastHelpers } from "./Toast";

interface PhaseOption {
  id: string;
  name: string;
  code: string;
}

interface ItemTableProps {
  items: Item[];
  pagination: PaginatedResponse<Item>["pagination"];
  onFiltersChange: (filters: Partial<ItemFilters>) => void;
  initialFilters?: ItemFilters;
  showPhaseColumn?: boolean;
  phases?: PhaseOption[];
  isLoading?: boolean;
  error?: Error | null;
}

const sortableColumns = [
  "name",
  "quantity",
  "rate",
  "amount",
  "status",
  "progressPercent",
] as const;

export function ItemTable({
  items,
  pagination,
  onFiltersChange,
  initialFilters = {},
  showPhaseColumn = false,
  phases = [],
  isLoading = false,
  error = null,
}: ItemTableProps): JSX.Element {
  const updateProgress = useUpdateItemProgress();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<ItemStatus>("NOT_STARTED");
  const [editRemarks, setEditRemarks] = useState("");
  const [localFilters, setLocalFilters] = useState<ItemFilters>({
    search: "",
    status: undefined,
    phaseId: undefined,
    sortBy: initialFilters.sortBy || "name",
    sortOrder: initialFilters.sortOrder || "asc",
  });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const { success, error: showError } = useToastHelpers();

  // Use debounced search for filtering, but keep localFilters for other filters
  const effectiveSearch = debouncedSearch;

  const handleEditClick = (item: Item) => {
    setEditingId(item._id);
    setEditProgress(item.progressPercent);
    setEditStatus(item.status);
    setEditRemarks(item.remarks || "");
  };

  const handleSave = (item: Item) => {
    updateProgress.mutate(
      {
        id: item._id,
        payload: {
          progressPercent: editProgress,
          status: editStatus,
          remarks: editRemarks,
        },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          success(
            "Item updated",
            "Progress, status, and remarks have been saved",
          );
        },
        onError: (err) => showError("Update failed", err.message),
      },
    );
  };

  const handleCancel = () => setEditingId(null);

  const handleFilterChange = useCallback(
    (key: keyof ItemFilters, value: unknown) => {
      const newFilters = { ...localFilters, [key]: value, page: 1 };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange],
  );

  const handleSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      const newFilters = { ...localFilters, sortBy, sortOrder };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newFilters = { ...localFilters, page };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange],
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      const newFilters = { ...localFilters, limit, page: 1 };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange],
  );

  const sortedItems = useMemo(() => {
    if (
      !sortableColumns.includes(
        localFilters.sortBy as (typeof sortableColumns)[0],
      )
    )
      return items;
    return [...items].sort((a, b) => {
      const aVal = a[localFilters.sortBy as keyof Item];
      const bVal = b[localFilters.sortBy as keyof Item];
      if (aVal === bVal) return 0;
      const result = aVal! < bVal! ? -1 : 1;
      return localFilters.sortOrder === "asc" ? result : -result;
    });
  }, [items, localFilters.sortBy, localFilters.sortOrder]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      if (effectiveSearch) {
        const searchLower = effectiveSearch.toLowerCase();
        if (!item.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (localFilters.status && item.status !== localFilters.status) {
        return false;
      }
      if (localFilters.phaseId && item.phaseId !== localFilters.phaseId) {
        return false;
      }
      return true;
    });
  }, [sortedItems, effectiveSearch, localFilters.status, localFilters.phaseId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="table-container">
        <FilterBarSkeleton />
        <TableSkeleton rows={5} columns={showPhaseColumn ? 8 : 7} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="table-container">
        <div className="p-8 text-center text-semantic-danger-main">
          <p className="font-medium">Failed to load items</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const renderSortableHeader = (label: string, key: string) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-secondary select-none transition-colors"
      onClick={() =>
        handleSort(
          key,
          localFilters.sortBy === key && localFilters.sortOrder === "asc"
            ? "desc"
            : "asc",
        )
      }
    >
      <div className="flex items-center gap-1">
        {label}
        {localFilters.sortBy === key && (
          <span>{localFilters.sortOrder === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </th>
  );

  const getPhaseName = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    return phase ? phase.name : phaseId;
  };

  const statusOptions: { value: string; label: string }[] = [
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ON_HOLD", label: "On Hold" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="table-container">
      {/* Filter Bar */}
      <div className="p-4 border-b border-surface-divider bg-surface-secondary flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Input
            id="search"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            label="Search"
          />
        </div>
        <div className="min-w-[150px]">
          <Select
            id="status-filter"
            value={localFilters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }
            label="Status"
            options={[{ value: "", label: "All Statuses" }, ...statusOptions]}
          />
        </div>
        {showPhaseColumn && phases.length > 0 && (
          <div className="min-w-[150px]">
            <Select
              id="phase-filter"
              value={localFilters.phaseId || ""}
              onChange={(e) =>
                handleFilterChange("phaseId", e.target.value || undefined)
              }
              label="Phase"
              options={[
                { value: "", label: "All Phases" },
                ...phases.map((phase) => ({
                  value: phase.id,
                  label: phase.name,
                })),
              ]}
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>
            Showing {filteredItems.length} of {pagination.total} items
          </span>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(effectiveSearch || localFilters.status || localFilters.phaseId) && (
        <div className="px-4 py-2 border-b border-surface-divider bg-surface-secondary flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-text-secondary">
            Active filters:
          </span>
          {effectiveSearch && (
            <Badge variant="neutral" size="sm" className="gap-1">
              Search: {effectiveSearch}
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  handleFilterChange("search", "");
                }}
                className="ml-1 hover:text-text-primary transition-colors"
                aria-label="Clear search filter"
              >
                ×
              </button>
            </Badge>
          )}
          {localFilters.status && (
            <Badge variant="info" size="sm" className="gap-1">
              Status:{" "}
              {statusOptions.find((s) => s.value === localFilters.status)
                ?.label || localFilters.status}
              <button
                type="button"
                onClick={() => handleFilterChange("status", undefined)}
                className="ml-1 hover:text-text-primary transition-colors"
                aria-label="Clear status filter"
              >
                ×
              </button>
            </Badge>
          )}
          {localFilters.phaseId && showPhaseColumn && (
            <Badge variant="info" size="sm" className="gap-1">
              Phase: {getPhaseName(localFilters.phaseId)}
              <button
                type="button"
                onClick={() => handleFilterChange("phaseId", undefined)}
                className="ml-1 hover:text-text-primary transition-colors"
                aria-label="Clear phase filter"
              >
                ×
              </button>
            </Badge>
          )}
          {(effectiveSearch || localFilters.status || localFilters.phaseId) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                handleFilterChange("search", "");
                handleFilterChange("status", undefined);
                handleFilterChange("phaseId", undefined);
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {renderSortableHeader("Name", "name")}
              {showPhaseColumn && renderSortableHeader("Phase", "phaseId")}
              {renderSortableHeader("Qty", "quantity")}
              {renderSortableHeader("Rate", "rate")}
              {renderSortableHeader("Amount", "amount")}
              {renderSortableHeader("Status", "status")}
              {renderSortableHeader("Progress", "progressPercent")}
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={showPhaseColumn ? 8 : 7}
                  className="px-4 py-12 text-center"
                >
                  <EmptyState
                    title={
                      items.length === 0
                        ? "No items available"
                        : "No items found matching your filters"
                    }
                    description={
                      items.length > 0
                        ? "Try changing your search or removing the selected filters."
                        : undefined
                    }
                    icon={
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                    action={
                      items.length > 0
                        ? {
                            label: "Clear Filters",
                            onClick: () => {
                              setSearchInput("");
                              handleFilterChange("search", "");
                              handleFilterChange("status", undefined);
                              handleFilterChange("phaseId", undefined);
                            },
                            variant: "ghost",
                            size: "sm",
                          }
                        : undefined
                    }
                  />
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {item.name}
                  </td>
                  {showPhaseColumn && (
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {getPhaseName(item.phaseId)}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === item._id ? (
                      <Select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as ItemStatus)
                        }
                        options={statusOptions}
                        className="w-full"
                      />
                    ) : (
                      <StatusBadge status={item.status} size="md" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === item._id ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={editProgress}
                        onChange={(e) =>
                          setEditProgress(Number(e.target.value))
                        }
                        className="w-20"
                      />
                    ) : (
                      <TableProgressBar
                        value={item.progressPercent}
                        variant="default"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === item._id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(item)}
                          disabled={updateProgress.isPending}
                          isLoading={updateProgress.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-surface-divider flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-text-secondary">
            Showing {pagination.page * pagination.limit - pagination.limit + 1}{" "}
            to {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            of {pagination.total} items
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={String(pagination.limit)}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              options={[
                { value: "10", label: "10 per page" },
                { value: "20", label: "20 per page" },
                { value: "50", label: "50 per page" },
                { value: "100", label: "100 per page" },
              ]}
              className="w-auto"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary self-center">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
