import type { Request, Response } from "express";
import { Project } from "../models/Project.js";
import { Phase } from "../models/Phase.js";
import { Item } from "../models/Item.js";
import { successResponse } from "../utils/apiResponse.js";
import { NotFoundError } from "../errors/index.js";
import { phaseIdParamSchema } from "../validators/schemas.js";

export async function getPhases(req: Request, res: Response): Promise<void> {
  const project = await Project.findOne({ code: "SAINIK" }).lean();
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const phases = await Phase.find({ projectId: project._id })
    .sort({ order: 1 })
    .lean();

  // Get item counts for each phase
  const phaseIds = phases.map((p) => p._id);
  const items = await Item.find({ phaseId: { $in: phaseIds } }).lean();

  const phasesWithCounts = phases.map((phase) => {
    const phaseItems = items.filter((item) => item.phaseId.equals(phase._id));
    const totalValue = phaseItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );
    const completedValue = phaseItems.reduce(
      (sum, item) => sum + (item.valueCompleted || 0),
      0,
    );
    const progressPercent =
      totalValue > 0
        ? Math.round((completedValue / totalValue) * 10000) / 100
        : 0;

    return {
      ...phase,
      itemCount: phaseItems.length,
      totalValue,
      completedValue,
      progressPercent,
    };
  });

  res.json(successResponse(phasesWithCounts));
}

export async function getPhaseById(req: Request, res: Response): Promise<void> {
  const { phaseId } = phaseIdParamSchema.parse(req.params);

  const phase = await Phase.findById(phaseId).lean();
  if (!phase) {
    throw new NotFoundError("Phase not found");
  }

  const items = await Item.find({ phaseId }).lean();
  const totalValue = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const completedValue = items.reduce(
    (sum, item) => sum + (item.valueCompleted || 0),
    0,
  );
  const progressPercent =
    totalValue > 0
      ? Math.round((completedValue / totalValue) * 10000) / 100
      : 0;

  res.json(
    successResponse({
      ...phase,
      itemCount: items.length,
      totalValue,
      completedValue,
      progressPercent,
    }),
  );
}
