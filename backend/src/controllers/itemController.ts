import type { Request, Response } from "express";
import { Item } from "../models/Item.js";
import { successResponse, paginatedResponse } from "../utils/apiResponse.js";
import { NotFoundError } from "../errors/index.js";
import {
  itemListQuerySchema,
  itemIdParamSchema,
  updateProgressSchema,
} from "../validators/schemas.js";

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

  // First get the current item to calculate valueCompleted
  const currentItem = await Item.findById(id).lean();
  if (!currentItem) {
    throw new NotFoundError("Item not found");
  }

  const valueCompleted = Math.round(
    (input.progressPercent / 100) * (currentItem.amount || 0),
  );

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      $set: {
        progressPercent: input.progressPercent,
        ...(input.status && { status: input.status }),
        ...(input.remarks && { remarks: input.remarks }),
        valueCompleted,
      },
    },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedItem) {
    throw new NotFoundError("Item not found");
  }

  res.json(successResponse(updatedItem));
}
