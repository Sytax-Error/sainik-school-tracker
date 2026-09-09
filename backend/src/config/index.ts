import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  mongodbUri: string;
  corsOrigins: string[];
  nodeEnv: string;
  sourceWorkbookPath: string;
}

function validateEnv(): Config {
  const requiredVars = [
    "PORT",
    "MONGODB_URI",
    "CORS_ORIGIN",
    "NODE_ENV",
    "SOURCE_WORKBOOK_PATH",
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  const port = Number.parseInt(process.env.PORT!, 10);
  if (Number.isNaN(port)) {
    throw new Error("PORT must be a valid number");
  }

  // Support multiple CORS origins (comma-separated)
  const corsOrigins = process.env.CORS_ORIGIN!.split(",").map((o) => o.trim());

  return {
    port,
    mongodbUri: process.env.MONGODB_URI!,
    corsOrigins,
    nodeEnv: process.env.NODE_ENV!,
    sourceWorkbookPath: process.env.SOURCE_WORKBOOK_PATH!,
  };
}

export const config = validateEnv();
