import type { Request, Response } from "express";
import { Project } from "../models/Project.js";
import { successResponse } from "../utils/apiResponse.js";
import { NotFoundError } from "../errors/index.js";

export async function getCurrentProject(
  _req: Request,
  res: Response,
): Promise<void> {
  const project = await Project.findOne({ code: "SAINIK" }).lean();
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  res.json(successResponse(project));
}
