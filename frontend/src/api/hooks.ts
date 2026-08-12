import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type {
  Project,
  Phase,
  Item,
  DashboardSummary,
  PaginatedResponse,
  ItemFilters,
  UpdateProgressPayload,
} from "./types";

const queryKeys = {
  project: ["project"] as const,
  dashboard: ["dashboard"] as const,
  phases: ["phases"] as const,
  phase: (phaseId: string) => ["phase", phaseId] as const,
  items: (filters: ItemFilters) => ["items", filters] as const,
  item: (id: string) => ["item", id] as const,
};

export function useProject() {
  return useQuery({
    queryKey: queryKeys.project,
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Project }>(
        "/project",
      );
      return response.data.data;
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: DashboardSummary;
      }>("/dashboard");
      return response.data.data;
    },
  });
}

export function usePhases() {
  return useQuery({
    queryKey: queryKeys.phases,
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Phase[] }>(
        "/phases",
      );
      return response.data.data;
    },
  });
}

export function usePhase(phaseId: string) {
  return useQuery({
    queryKey: queryKeys.phase(phaseId),
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Phase }>(
        `/phases/${phaseId}`,
      );
      return response.data.data;
    },
    enabled: !!phaseId,
  });
}

export function useItems(filters: ItemFilters = {}) {
  return useQuery({
    queryKey: queryKeys.items(filters),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: PaginatedResponse<Item>;
      }>("/items", filters as Record<string, unknown>);
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: queryKeys.item(id),
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Item }>(
        `/items/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateItemProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProgressPayload;
    }) => {
      const response = await api.patch<{ success: boolean; data: Item }>(
        `/items/${id}/progress`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(queryKeys.item(updatedItem._id), updatedItem);
      // Invalidate all items queries (regardless of filters)
      queryClient.invalidateQueries({ queryKey: ["items"] });
      // Invalidate dashboard and phases
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.phases });
    },
  });
}
