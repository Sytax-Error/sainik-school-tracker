import { useState, useEffect, useMemo, useRef } from "react";
import { Modal, Input, Select, Button } from "./primitives";
import type { Item, ItemStatus, UpdateProgressPayload } from "@/api/types";
import { formatCurrency } from "@/utils/designTokens";

export interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onSave: (payload: UpdateProgressPayload) => void;
  isLoading?: boolean;
}

const statusOptions: { value: ItemStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "CANCELLED", label: "Cancelled" },
];

const getValidQuantityInput = (value: string, maximum: number): string | null => {
  const digitsOnly = value.replace(/\D/g, "");
  const normalizedValue = digitsOnly.replace(/^0+(?=\d)/, "");
  if (normalizedValue === "" || Number(normalizedValue) <= maximum) return normalizedValue;
  return null;
};

const formatEditableNumber = (value: number | null | undefined): string =>
  value != null ? String(value) : "0";

const calculateItemProgress = (item: Item): number => {
  if (item.quantity <= 0) return 0;

  const trackingQty =
    item.acceptedQty ||
    item.testedQty ||
    item.installedQty ||
    item.deliveredQty ||
    0;

  return Math.min(100, Math.round((trackingQty / item.quantity) * 100));
};

export function ItemEditModal({
  isOpen,
  onClose,
  item,
  onSave,
  isLoading = false,
}: ItemEditModalProps): JSX.Element | null {
  const [progressPercent, setProgressPercent] = useState<string>(() => formatEditableNumber(item?.progressPercent));
  const [isProgressOverride, setIsProgressOverride] = useState(false);
  const [status, setStatus] = useState<ItemStatus>(() => item?.status ?? "NOT_STARTED");
  const [remarks, setRemarks] = useState(() => item?.remarks ?? "");
  const [deliveredQty, setDeliveredQty] = useState<string>(() => formatEditableNumber(item?.deliveredQty));
  const [installedQty, setInstalledQty] = useState<string>(() => formatEditableNumber(item?.installedQty));
  const [testedQty, setTestedQty] = useState<string>(() => formatEditableNumber(item?.testedQty));
  const [acceptedQty, setAcceptedQty] = useState<string>(() => formatEditableNumber(item?.acceptedQty));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when modal opens (isOpen becomes true)
  const prevIsOpen = useRef(false);
  useEffect(() => {
    if (!prevIsOpen.current && isOpen && item) {
      // Modal just opened
      setProgressPercent(formatEditableNumber(item.progressPercent));
      setIsProgressOverride(item.progressPercent !== calculateItemProgress(item));
      setStatus(item.status);
      setRemarks(item.remarks || "");
      setDeliveredQty(formatEditableNumber(item.deliveredQty));
      setInstalledQty(formatEditableNumber(item.installedQty));
      setTestedQty(formatEditableNumber(item.testedQty));
      setAcceptedQty(formatEditableNumber(item.acceptedQty));
      setErrors({});
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, item]);

  // Calculate progress based on quantities
  const calculatedProgress = useMemo(() => {
    if (!item) return 0;

    const trackingQty =
      (acceptedQty !== "" ? Number(acceptedQty) : 0) ||
      (testedQty !== "" ? Number(testedQty) : 0) ||
      (installedQty !== "" ? Number(installedQty) : 0) ||
      (deliveredQty !== "" ? Number(deliveredQty) : 0) ||
      0;

    return item.quantity > 0
      ? Math.min(100, Math.round((trackingQty / item.quantity) * 100))
      : 0;
  }, [item, acceptedQty, testedQty, installedQty, deliveredQty]);

  const progressInputValue = isProgressOverride
    ? progressPercent
    : String(calculatedProgress);
  const effectiveProgress = Number(progressInputValue) || 0;
  const effectiveStatus =
    status === "ON_HOLD" || status === "CANCELLED"
      ? status
      : effectiveProgress >= 100
        ? "COMPLETED"
        : effectiveProgress > 0
          ? "IN_PROGRESS"
          : "NOT_STARTED";
  // Validate quantities
  const validateQuantities = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!item) return true;
    const sanctionedQty = item.quantity;

    // Validate sanctionedQty itself
    if (typeof sanctionedQty !== "number" || isNaN(sanctionedQty) || sanctionedQty < 0) {
      console.error("Invalid sanctioned quantity:", sanctionedQty);
      // We'll still proceed with validation but note this is a data issue
    }

    // Check if any tracking quantity exceeds sanctioned quantity
    const quantities = [
      { key: "deliveredQty", value: deliveredQty, label: "Delivered" },
      { key: "installedQty", value: installedQty, label: "Installed" },
      { key: "testedQty", value: testedQty, label: "Tested" },
      { key: "acceptedQty", value: acceptedQty, label: "Accepted" },
    ];

    for (const { key, value, label } of quantities) {
      // Check for null/undefined and empty string, but allow 0 as a valid value
      if (value != null && value !== "" && typeof value !== "boolean") {
        const numValue = Number(value);
        // Check if the value is a valid number
        if (isNaN(numValue)) {
          newErrors[key] = `${label} quantity must be a valid number`;
        } else if (numValue < 0) {
          newErrors[key] = `${label} quantity cannot be negative`;
        } else if (numValue > sanctionedQty) {
          newErrors[key] = `${label} quantity (${numValue}) cannot exceed sanctioned quantity (${sanctionedQty})`;
        }
      }
    }

    // Sequence validation
    const accepted = acceptedQty != null && acceptedQty !== "" && typeof acceptedQty !== "boolean" ? Number(acceptedQty) : undefined;
    const tested = testedQty != null && testedQty !== "" && typeof testedQty !== "boolean" ? Number(testedQty) : undefined;
    const installed = installedQty != null && installedQty !== "" && typeof installedQty !== "boolean" ? Number(installedQty) : undefined;
    const delivered = deliveredQty != null && deliveredQty !== "" && typeof deliveredQty !== "boolean" ? Number(deliveredQty) : undefined;

    if (accepted !== undefined && tested !== undefined && accepted > tested) {
      newErrors.acceptedQty = "Accepted quantity cannot exceed tested quantity";
    }
    if (tested !== undefined && installed !== undefined && tested > installed) {
      newErrors.testedQty = "Tested quantity cannot exceed installed quantity";
    }
    if (installed !== undefined && delivered !== undefined && installed > delivered) {
      newErrors.installedQty = "Installed quantity cannot exceed delivered quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateQuantities()) return;

    const payload: UpdateProgressPayload = {
      progressPercent: progressInputValue !== "" ? Number(progressInputValue) : calculatedProgress,
      status: effectiveStatus,
      remarks: remarks || undefined,
      deliveredQty: deliveredQty !== "" ? Number(deliveredQty) : undefined,
      installedQty: installedQty !== "" ? Number(installedQty) : undefined,
      testedQty: testedQty !== "" ? Number(testedQty) : undefined,
      acceptedQty: acceptedQty !== "" ? Number(acceptedQty) : undefined,
    };

    onSave(payload);
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  const handleReset = () => {
    setProgressPercent("0");
    setIsProgressOverride(false);
    setStatus("NOT_STARTED");
    setRemarks("");
    setDeliveredQty("0");
    setInstalledQty("0");
    setTestedQty("0");
    setAcceptedQty("0");
    setErrors({});
  };

  if (!isOpen || !item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Update Item Progress"
      description={`${item.name} (${item.code})`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Item Info Card */}
        <div className="bg-surface-secondary rounded-md p-3 border border-surface-divider">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-text-secondary text-xs">Sanctioned Qty</p>
              <p className="font-medium text-text-primary">{item.quantity} {item.unit}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Rate</p>
              <p className="font-medium text-text-primary">{formatCurrency(item.rate)}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Amount</p>
              <p className="font-medium text-text-primary">{formatCurrency(item.amount)}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs">Current Progress</p>
              <p className="font-medium text-text-primary">{item.progressPercent}%</p>
            </div>
          </div>
        </div>

        {/* Quantity Tracking Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text-primary">Quantity Tracking</h3>
            <span className="text-xs text-text-tertiary">Optional</span>
          </div>
          <p className="text-xs text-text-secondary">
            Enter quantities to auto-calculate progress. Priority: Accepted  &gt; Tested  &gt; Installed  &gt; Delivered
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Delivered Qty"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={item.quantity}
              step={1}
              value={deliveredQty}
              onChange={(e) => {
                const nextValue = getValidQuantityInput(e.target.value, item.quantity);
                if (nextValue !== null) {
                  setDeliveredQty(nextValue);
                  setIsProgressOverride(false);
                }
              }}
              error={errors.deliveredQty}
              helperText={errors.deliveredQty || " "}
            />
            <Input
              label="Installed Qty"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={item.quantity}
              value={installedQty}
              onChange={(e) => {
                const nextValue = getValidQuantityInput(e.target.value, item.quantity);
                if (nextValue !== null) {
                  setInstalledQty(nextValue);
                  setIsProgressOverride(false);
                }
              }}
              error={errors.installedQty}
              helperText={errors.installedQty || " "}
            />

            <Input
              label="Tested Qty"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={item.quantity}
              value={testedQty}
              onChange={(e) => {
                const nextValue = getValidQuantityInput(e.target.value, item.quantity);
                if (nextValue !== null) {
                  setTestedQty(nextValue);
                  setIsProgressOverride(false);
                }
              }}
              error={errors.testedQty}
              helperText={errors.testedQty || " "}
            />

            <Input
              label="Accepted Qty"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={item.quantity}
              value={acceptedQty}
              onChange={(e) => {
                const nextValue = getValidQuantityInput(e.target.value, item.quantity);
                if (nextValue !== null) {
                  setAcceptedQty(nextValue);
                  setIsProgressOverride(false);
                }
              }}
              error={errors.acceptedQty}
              helperText={errors.acceptedQty || " "}
            />
          </div>
        </div>

        {/* Calculated Progress Display */}
        <div className="bg-surface-secondary rounded-md p-3 border border-surface-divider">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Calculated Progress</p>
              <p className="text-xs text-text-secondary">
                Based on highest tracking quantity entered
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-primary-600">{calculatedProgress}%</p>
              <p className="text-xs text-text-tertiary">of sanctioned quantity</p>
            </div>
          </div>
        </div>

        {/* Manual Progress Override */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Progress % <span className="text-text-tertiary">(override calculated)</span>
            </label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              max={100}
              value={progressInputValue}
              onChange={(e) => {
                const nextValue = getValidQuantityInput(e.target.value, 100);
                if (nextValue !== null) {
                  setProgressPercent(nextValue);
                  setIsProgressOverride(true);
                }
              }}
              className="w-full"
              helperText={`Calculated progress: ${calculatedProgress}%. Edit to override.`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Status
            </label>
            <Select
              value={effectiveStatus}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              options={statusOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Remarks
          </label>
          <textarea
            className="w-full px-3 py-2 border border-surface-divider rounded-md text-sm text-text-primary bg-surface-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional remarks..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-surface-divider">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading}
            size="sm"
          >
            Reset
          </Button>
          <Button variant="ghost" onClick={handleCancel} disabled={isLoading} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} isLoading={isLoading} size="sm">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}