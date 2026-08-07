import { useParams, Link } from "react-router-dom";
import { usePhase, useItems } from "@/api/hooks";
import { ItemTable } from "@/components/ui/ItemTable";
import { useState, useCallback } from "react";
import type { ItemFilters } from "@/api/types";

export function PhasePage(): JSX.Element {
  const { phaseId } = useParams<{ phaseId: string }>();
  const { data: phase, isLoading: phaseLoading } = usePhase(phaseId || "");
  const [filters, setFiltersState] = useState<ItemFilters>({
    phaseId: phaseId || "",
    search: "",
    status: undefined,
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

  if (phaseLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {phase?.name || `Phase ${phaseId}`}
          </h1>
          <p className="mt-1 text-gray-600">View and update item progress</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
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
            showPhaseColumn={false}
          />
        )}
      </div>
    </div>
  );
}
