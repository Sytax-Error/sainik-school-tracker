import type { Request, Response } from "express";
import { Item } from "../models/Item.js";
import { successResponse, paginatedResponse } from "../utils/apiResponse.js";
import { NotFoundError } from "../errors/index.js";
import {
  itemListQuerySchema,
  itemIdParamSchema,
  updateProgressSchema,
} from "../validators/schemas.js";
import { logger } from "../utils/logger.js";

export async function getItems(req: Request, res: Response): Promise<void> {
  const query = itemListQuerySchema.parse(req.query);

  const filter: Record<string, unknown> = {};

  if (query.phaseId) {
    filter.phaseId = query.phaseId;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { code: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    filter.status = query.status;
  }

  const sortBy = query.sortBy || "code";
  const sortOrder = query.sortOrder === "desc" ? -1 : 1;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Item.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Item.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, page, limit, total));
}

export async function getItemById(req: Request, res: Response): Promise<void> {
  const { id } = itemIdParamSchema.parse(req.params);

  const item = await Item.findById(id).lean();
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  res.json(successResponse(item));
}

export async function updateItemProgress(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = itemIdParamSchema.parse(req.params);
  const input = updateProgressSchema.parse(req.body);

  // First get the current item to calculate valueCompleted and validate quantities
  const currentItem = await Item.findById(id).lean();
  if (!currentItem) {
    throw new NotFoundError("Item not found");
  }

  // Validate that tracking quantities don't exceed sanctioned quantity
  const sanctionedQty = currentItem.quantity;
  if (input.deliveredQty !== undefined && input.deliveredQty > sanctionedQty) {
    throw new Error(`Delivered quantity (${input.deliveredQty}) cannot exceed sanctioned quantity (${sanctionedQty})`);
  }
  if (input.installedQty !== undefined && input.installedQty > sanctionedQty) {
    throw new Error(`Installed quantity (${input.installedQty}) cannot exceed sanctioned quantity (${sanctionedQty})`);
  }
  if (input.testedQty !== undefined && input.testedQty > sanctionedQty) {
    throw new Error(`Tested quantity (${input.testedQty}) cannot exceed sanctioned quantity (${sanctionedQty})`);
  }
  if (input.acceptedQty !== undefined && input.acceptedQty > sanctionedQty) {
    throw new Error(`Accepted quantity (${input.acceptedQty}) cannot exceed sanctioned quantity (${sanctionedQty})`);
  }

  // Auto-calculate progressPercent based on quantities if not explicitly provided
  let progressPercent = input.progressPercent;
  if (progressPercent === undefined) {
    // Calculate progress based on the highest tracking quantity provided
    // Priority: accepted > tested > installed > delivered
    const trackingQty = input.acceptedQty ?? input.testedQty ?? input.installedQty ?? input.deliveredQty ?? 0;
    if (sanctionedQty > 0) {
      progressPercent = Math.min(100, Math.round((trackingQty / sanctionedQty) * 100));
    } else {
      progressPercent = 0;
    }
  }

  const valueCompleted = Math.round(
    (progressPercent / 100) * (currentItem.amount || 0),
  );

  // Build update object with only provided fields
  const updateFields: Record<string, unknown> = {
    progressPercent,
    valueCompleted,
  };

  const requestedStatus = input.status ?? currentItem.status;
  if (requestedStatus === "ON_HOLD" || requestedStatus === "CANCELLED") {
    updateFields.status = requestedStatus;
  } else if (progressPercent >= 100) {
    updateFields.status = "COMPLETED";
  } else if (progressPercent > 0) {
    updateFields.status = "IN_PROGRESS";
  } else {
    updateFields.status = "NOT_STARTED";
  }
  if (input.remarks !== undefined) updateFields.remarks = input.remarks;
  if (input.deliveredQty !== undefined) updateFields.deliveredQty = input.deliveredQty;
  if (input.installedQty !== undefined) updateFields.installedQty = input.installedQty;
  if (input.testedQty !== undefined) updateFields.testedQty = input.testedQty;
  if (input.acceptedQty !== undefined) updateFields.acceptedQty = input.acceptedQty;

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedItem) {
    throw new NotFoundError("Item not found");
  }

  // Log the record change
  logger.trackRecordChange("Item", id, "progress_update", {
    progressPercent: updatedItem.progressPercent,
    status: updatedItem.status,
    deliveredQty: updatedItem.deliveredQty,
    installedQty: updatedItem.installedQty,
    testedQty: updatedItem.testedQty,
    acceptedQty: updatedItem.acceptedQty,
    remarks: updatedItem.remarks,
  });

  res.json(successResponse(updatedItem));
}
