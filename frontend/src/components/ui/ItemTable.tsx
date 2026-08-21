import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  ItemEditModal,
} from "./primitives";
import { useToastHelpers } from "./Toast";
import { ListFilter, Pencil, Search } from "lucide-react";

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
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [localFilters, setLocalFilters] = useState<ItemFilters>({
    search: "",
    status: undefined,
    phaseId: initialFilters.phaseId,
    sortBy: initialFilters.sortBy || "name",
    sortOrder: initialFilters.sortOrder || "asc",
  });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const { success, error: showError } = useToastHelpers();

  // Sync localFilters with initialFilters when they change (e.g., page reset from parent)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setLocalFilters((prev) => ({
      ...prev,
      phaseId: initialFilters.phaseId ?? prev.phaseId,
      page: initialFilters.page ?? prev.page,
      limit: initialFilters.limit ?? prev.limit,
      sortBy: initialFilters.sortBy ?? prev.sortBy,
      sortOrder: initialFilters.sortOrder ?? prev.sortOrder,
    }));
  }, [initialFilters]);

  // Use debounced search for filtering, but keep localFilters for other filters
  const effectiveSearch = debouncedSearch;

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
  };

  const handleSave = (payload: {
    progressPercent?: number;
    status?: ItemStatus;
    remarks?: string;
    deliveredQty?: number;
    installedQty?: number;
    testedQty?: number;
    acceptedQty?: number;
  }) => {
    if (!editingItem) return;
    
    updateProgress.mutate(
      {
        id: editingItem._id,
        payload,
      },
      {
        onSuccess: () => {
          setEditingItem(null);
          success(
            "Item updated",
            "Progress, status, quantities, and remarks have been saved",
          );
        },
        onError: (err) => showError("Update failed", err.message),
      },
    );
  };

  const handleCancel = () => setEditingItem(null);

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
    <div className="table-container table-workspace">
      <div className="flex items-center justify-between border-b border-surface-divider px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-primary-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">Item register</span>
        </div>
        <span className="text-xs text-text-tertiary">Search, filter, and update records</span>
      </div>
      {/* Filter Bar */}
      <div className="table-toolbar grid grid-cols-1 items-end gap-3 border-b border-surface-divider p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]">
        <div className="relative min-w-0">
          <Input
            id="search"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            label="Search"
            className="pl-10"
          />
          <Search className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 text-text-tertiary" aria-hidden="true" />
        </div>
        <div className="w-full sm:w-44">
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
          <div className="w-full sm:w-44">
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
        <div className="flex h-11 items-center px-1 text-xs font-medium text-text-tertiary md:justify-end">
          Showing {filteredItems.length} of {pagination.total} items
        </div>
      </div>

      {/* Active Filter Chips */}
      {(effectiveSearch || localFilters.status || localFilters.phaseId) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-primary-100 bg-primary-50/60 px-4 py-2.5">
          <span className="text-xs font-medium text-text-secondary">
            Active filters:
          </span>
          {effectiveSearch && (
            <Badge variant="primary" size="sm" className="gap-1">
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
            <Badge variant="success" size="sm" className="gap-1">
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
            <tr className="border-b border-surface-divider bg-surface-secondary">
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
          <tbody className="divide-y divide-surface-divider">
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
                <tr
                  key={item._id}
                  className="transition-colors duration-150 hover:bg-primary-50/50"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-text-primary">
                    <div className="flex min-w-[220px] items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-100 text-xs font-bold text-primary-500" aria-hidden="true">{item.name.charAt(0).toUpperCase()}</span>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  {showPhaseColumn && (
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      <Badge variant="primary" size="sm">{getPhaseName(item.phaseId)}</Badge>
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-text-primary tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary tabular-nums">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-text-primary tabular-nums">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={item.status} size="md" />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <TableProgressBar
                      value={item.progressPercent}
                      variant={
                        item.status === "COMPLETED"
                          ? "success"
                          : item.status === "IN_PROGRESS"
                            ? "info"
                            : item.status === "ON_HOLD"
                              ? "warning"
                              : item.status === "CANCELLED"
                                ? "danger"
                                : "default"
                      }
                    />
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(item)}
                      disabled={updateProgress.isPending}
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <ItemEditModal
        isOpen={!!editingItem}
        onClose={handleCancel}
        item={editingItem}
        onSave={handleSave}
        isLoading={updateProgress.isPending}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-surface-divider bg-surface-secondary/70 px-4 py-3">
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
