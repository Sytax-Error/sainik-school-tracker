import { useParams } from "react-router-dom";
import { usePhase, usePhases, useItems } from "@/api/hooks";
import { ItemTable } from "@/components/ui/ItemTable";
import { PageHeader } from "@/components/ui/primitives";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
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
    phaseId: undefined,
    search: "",
    status: undefined,
    page: 1,
    limit: 20,
    sortBy: "code",
    sortOrder: "asc",
  });

  // Update filters when actualPhaseId changes
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ItemFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  // Sync phaseId from actualPhaseId when it changes (after phases load)
  // Using a ref to track previous value to avoid unnecessary updates
  const prevActualPhaseId = useRef<string | null>(null);
  const prevFiltersPhaseId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (prevActualPhaseId.current === actualPhaseId) return;
    prevActualPhaseId.current = actualPhaseId;
    if (actualPhaseId && actualPhaseId !== prevFiltersPhaseId.current) {
      prevFiltersPhaseId.current = actualPhaseId;
      setFilters((prev) => ({ ...prev, phaseId: actualPhaseId, page: 1 }));
    }
  }, [actualPhaseId]);

  // Also reset page when URL phaseId changes (for client-side navigation)
  const prevPhaseId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (prevPhaseId.current === phaseId) return;
    prevPhaseId.current = phaseId;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [phaseId]);

  const { data: itemsData, isLoading: itemsLoading } = useItems(filters);

  if (phasesLoading || phaseLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumb={[{ label: "Dashboard", href: "/" }]}
          title="Loading..."
          accentColor="primary"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[{ label: "Dashboard", href: "/" }]}
        title={phase?.name || `Phase ${phaseId}`}
        description="View and update item progress"
        accentColor="primary"
      />
      <section aria-label={`${phase?.name || `Phase ${phaseId}`} items`}>
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
      </section>
    </div>
  );
}
