import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/index.js";
import { errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error("Request error", {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
  }, err);

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    res
      .status(400)
      .json(errorResponse("VALIDATION_ERROR", "Invalid request data", details));
    return;
  }

  if (err instanceof AppError) {
    res
      .status(err._statusCode)
      .json(errorResponse(err._code, err.message, err._details));
    return;
  }

  if (err.name === "MongoServerError" || err.name === "MongooseError") {
    res
      .status(500)
      .json(errorResponse("DATABASE_ERROR", "Database operation failed"));
    return;
  }

  res
    .status(500)
    .json(errorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
}

export function notFoundHandler(req: Request, res: Response): void {
  logger.warn("Route not found", { method: req.method, path: req.path });
  res.status(404).json(errorResponse("NOT_FOUND", "Route not found"));
}
