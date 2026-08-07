import { useState } from "react";
import { useUpdateItemProgress } from "@/api/hooks";
import type { Item, ItemStatus } from "@/api/types";

interface ProgressModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<ItemStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export function ProgressModal({
  item,
  isOpen,
  onClose,
}: ProgressModalProps): JSX.Element | null {
  const updateProgress = useUpdateItemProgress();
  const [progress, setProgress] = useState(item?.progressPercent || 0);
  const [status, setStatus] = useState<ItemStatus>(
    item?.status || "NOT_STARTED",
  );
  const [remarks, setRemarks] = useState(item?.remarks || "");

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProgress.mutate(
      { id: item._id, payload: { progressPercent: progress, status, remarks } },
      {
        onSuccess: () => onClose(),
        onError: (error) => alert(`Failed to update: ${error.message}`),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Progress
          </h2>
          <p className="mt-1 text-sm text-gray-600">{item.name}</p>
          <p className="mt-1 text-sm text-gray-500 font-mono">{item.code}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="progress"
                className="block text-sm font-medium text-gray-700"
              >
                Progress %
              </label>
              <input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700"
              >
                Remarks (optional)
              </label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={updateProgress.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateProgress.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {updateProgress.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
