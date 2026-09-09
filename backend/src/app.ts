import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index.js";
import healthRoutes from "./routes/healthRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import phaseRoutes from "./routes/phaseRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
  app.use(requestLogger);

  // API routes
  app.use("/api/v1", healthRoutes);
  app.use("/api/v1", projectRoutes);
  app.use("/api/v1", dashboardRoutes);
  app.use("/api/v1/phases", phaseRoutes);
  app.use("/api/v1/items", itemRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}
