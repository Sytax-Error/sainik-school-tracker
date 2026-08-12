import type { Request, Response } from "express";
import { getConnectionStatus } from "../utils/mongo.js";

export function healthCheck(req: Request, res: Response): void {
  const mongoStatus = getConnectionStatus() ? "connected" : "disconnected";

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoStatus,
  });
}
