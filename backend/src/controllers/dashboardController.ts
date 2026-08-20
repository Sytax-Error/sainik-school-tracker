import type { Request, Response } from "express";
import { Project } from "../models/Project.js";
import { Phase } from "../models/Phase.js";
import { Item } from "../models/Item.js";
import { successResponse } from "../utils/apiResponse.js";
import { NotFoundError } from "../errors/index.js";

export async function getDashboard(
  _req: Request,
  res: Response,
): Promise<void> {
  const project = await Project.findOne({ code: "SAINIK" }).lean();
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const phases = await Phase.find({ projectId: project._id }).lean();

  const phaseIds = phases.map((p) => p._id);
  const items = await Item.find({ phaseId: { $in: phaseIds } }).lean();

  // Deduplicate items by code to get unique items count
  const uniqueItemsMap = new Map<string, (typeof items)[0]>();
  for (const item of items) {
    if (!uniqueItemsMap.has(item.code)) {
      uniqueItemsMap.set(item.code, item);
    }
  }
  const uniqueItems = Array.from(uniqueItemsMap.values());

  // Phase breakdown - calculate first so we can use it for totalValue
  const phaseBreakdown = phases.map((phase) => {
    const phaseItems = items.filter((item) => item.phaseId.equals(phase._id));
    const phaseValue = phaseItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );
    const phaseCompleted = phaseItems.reduce(
      (sum, item) => sum + (item.valueCompleted || 0),
      0,
    );
    const phaseProgress =
      phaseValue > 0
        ? Math.round((phaseCompleted / phaseValue) * 10000) / 100
        : 0;

    return {
      phaseId: phase._id,
      phaseName: phase.name,
      phaseCode: phase.code,
      totalItems: phaseItems.length,
      totalValue: phaseValue,
      completedValue: phaseCompleted,
      progressPercent: phaseProgress,
    };
  });

  // Calculate aggregates using unique items for item count, but sum of phase values for total value
  const totalItems = uniqueItems.length;
  const totalValue = phaseBreakdown.reduce(
    (sum, phase) => sum + phase.totalValue,
    0,
  );
  const completedValue = uniqueItems.reduce(
    (sum, item) => sum + (item.valueCompleted || 0),
    0,
  );
  const overallProgress =
    totalValue > 0
      ? Math.round((completedValue / totalValue) * 10000) / 100
      : 0;

  // Status breakdown using unique items
  const statusCounts = uniqueItems.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  res.json(
    successResponse({
      project: {
        id: project._id,
        name: project.name,
        code: project.code,
      },
      summary: {
        totalItems,
        totalValue,
        completedValue,
        overallProgress,
        statusCounts,
      },
      phases: phaseBreakdown,
    }),
  );
}
