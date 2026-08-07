import { useParams, Link } from "react-router-dom";
import { usePhase, usePhases, useItems } from "@/api/hooks";
import { ItemTable } from "@/components/ui/ItemTable";
import { useCallback, useMemo, useState, useEffect } from "react";
import type { ItemFilters } from "@/api/types";

export function PhasePage(): JSX.Element {
  const { phaseId } = useParams<{ phaseId: string }>();

  // First fetch all phases to find the one matching the URL parameter
  const { data: phases, isLoading: phasesLoading } = usePhases();

  // Find the phase that matches the URL parameter (phaseId is "1" or "2")
  const phase = useMemo(() => {
    if (!phases) return null;
    return phases.find((p) => p.code === `PHASE_${phaseId}`) || null;
  }, [phases, phaseId]);

  const actualPhaseId = useMemo(() => phase?._id || "", [phase]);

  const { isLoading: phaseLoading } = usePhase(actualPhaseId);

  // Use state for filters so they can be updated by ItemTable
  const [filters, setFilters] = useState<ItemFilters>({
    phaseId: actualPhaseId,
    search: "",
    status: undefined,
    page: 1,
    limit: 20,
    sortBy: "code",
    sortOrder: "asc",
  });

  // Update filters when actualPhaseId changes (e.g., after phases load)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, phaseId: actualPhaseId }));
  }, [actualPhaseId]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ItemFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const { data: itemsData, isLoading: itemsLoading } = useItems(filters);

  if (phasesLoading || phaseLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/"
              className="text-sm text-text-tertiary hover:text-text-primary"
            >
              Dashboard
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">
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
          <Link
            to="/"
            className="text-sm text-text-tertiary hover:text-text-primary"
          >
            Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-text-primary">
            {phase?.name || `Phase ${phaseId}`}
          </h1>
          <p className="mt-1 text-text-secondary">
            View and update item progress
          </p>
        </div>
      </div>
      <div className="bg-surface-primary rounded-lg border border-surface-border">
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
            showPhaseColumn={false}
            isLoading={itemsLoading}
            error={null}
          />
        )}
      </div>
    </div>
  );
}
