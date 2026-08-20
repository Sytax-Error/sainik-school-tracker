import { z } from "zod";
import { ITEM_STATUSES } from "../constants/status.js";

const itemStatusEnum = ITEM_STATUSES as unknown as [string, ...string[]];

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const itemFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(itemStatusEnum).optional(),
  phaseId: z.string().optional(),
});

export const itemListQuerySchema =
  paginationQuerySchema.merge(itemFiltersSchema);

export const updateProgressSchema = z.object({
  progressPercent: z.number().int().min(0).max(100).optional(),
  status: z.enum(itemStatusEnum).optional(),
  remarks: z.string().optional(),
  // Tracking quantity fields (optional)
  deliveredQty: z.number().int().min(0).optional(),
  installedQty: z.number().int().min(0).optional(),
  testedQty: z.number().int().min(0).optional(),
  acceptedQty: z.number().int().min(0).optional(),
}).refine(
  (data) => {
    // Validate quantity sequence when provided
    const { deliveredQty, installedQty, testedQty, acceptedQty } = data;
    
    // All quantities must be >= 0 (already enforced by .min(0))
    // No tracking quantity may exceed sanctioned quantity (validated in controller)
    
    // Accepted qty may not exceed tested qty when tested qty is provided
    if (acceptedQty !== undefined && testedQty !== undefined && acceptedQty > testedQty) {
      return false;
    }
    
    // Tested qty may not exceed installed qty when installed qty is provided
    if (testedQty !== undefined && installedQty !== undefined && testedQty > installedQty) {
      return false;
    }
    
    // Installed qty may not exceed delivered qty when delivered qty is provided
    if (installedQty !== undefined && deliveredQty !== undefined && installedQty > deliveredQty) {
      return false;
    }
    
    return true;
  },
  {
    message: "Quantity sequence validation failed: accepted ≤ tested ≤ installed ≤ delivered",
    path: ["quantitySequence"],
  }
);

export const itemIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID"),
});

export const phaseIdParamSchema = z.object({
  phaseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid phase ID"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ItemFilters = z.infer<typeof itemFiltersSchema>;
export type ItemListQuery = z.infer<typeof itemListQuerySchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type ItemIdParam = z.infer<typeof itemIdParamSchema>;
export type PhaseIdParam = z.infer<typeof phaseIdParamSchema>;
