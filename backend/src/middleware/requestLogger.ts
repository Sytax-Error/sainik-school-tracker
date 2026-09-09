import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    logger.trackApiRequest(req.method, req.path, res.statusCode, durationMs);
  });

  next();
}