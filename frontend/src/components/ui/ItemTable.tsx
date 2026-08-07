import { useState, useMemo, useCallback } from "react";
import { useUpdateItemProgress } from "@/api/hooks";
import type {
  Item,
  ItemStatus,
  PaginatedResponse,
  ItemFilters,
} from "@/api/types";
import { formatCurrency } from "@/utils/designTokens";

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
}

const STATUS_COLORS: Record<ItemStatus, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

const sortableColumns = [
  "code",
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
    sortBy: initialFilters.sortBy || "code",
    sortOrder: initialFilters.sortOrder || "asc",
  });

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
        onSuccess: () => setEditingId(null),
        onError: (error) => alert(`Failed to update: ${error.message}`),
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
      if (localFilters.search) {
        const searchLower = localFilters.search.toLowerCase();
        if (
          !item.code.toLowerCase().includes(searchLower) &&
          !item.name.toLowerCase().includes(searchLower)
        ) {
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
  }, [
    sortedItems,
    localFilters.search,
    localFilters.status,
    localFilters.phaseId,
  ]);

  const renderSortableHeader = (label: string, key: string) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none"
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="search"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by code or name..."
            value={localFilters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="min-w-[150px]">
          <label
            htmlFor="status-filter"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={localFilters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {showPhaseColumn && phases.length > 0 && (
          <div className="min-w-[150px]">
            <label
              htmlFor="phase-filter"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Phase
            </label>
            <select
              id="phase-filter"
              value={localFilters.phaseId || ""}
              onChange={(e) =>
                handleFilterChange("phaseId", e.target.value || undefined)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Phases</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {filteredItems.length} of {items.length} items
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderSortableHeader("Code", "code")}
              {renderSortableHeader("Name", "name")}
              {showPhaseColumn && renderSortableHeader("Phase", "phaseId")}
              {renderSortableHeader("Qty", "quantity")}
              {renderSortableHeader("Rate", "rate")}
              {renderSortableHeader("Amount", "amount")}
              {renderSortableHeader("Status", "status")}
              {renderSortableHeader("Progress", "progressPercent")}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={showPhaseColumn ? 9 : 8}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No items found matching your filters
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.name}
                  </td>
                  {showPhaseColumn && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {getPhaseName(item.phaseId)}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === item._id ? (
                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as ItemStatus)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[item.status]}`}
                      >
                        {STATUS_LABELS[item.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === item._id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editProgress}
                        onChange={(e) =>
                          setEditProgress(Number(e.target.value))
                        }
                        className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 transition-all duration-300"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.progressPercent}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === item._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(item)}
                          disabled={updateProgress.isPending}
                          className="text-xs px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit
                      </button>
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
        <div className="px-4 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {pagination.page * pagination.limit - pagination.limit + 1}{" "}
            to {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            of {pagination.total} items
          </div>
          <div className="flex items-center gap-4">
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
