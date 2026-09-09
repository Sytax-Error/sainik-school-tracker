import { config } from "../config/index.js";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = config.nodeEnv !== "production";
  private winstonLogger: winston.Logger;

  constructor() {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Create Winston logger with console and file transports
    this.winstonLogger = winston.createLogger({
      level: this.isDevelopment ? "debug" : "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: "sainik-tracker-backend" },
      transports: [
        // Console transport (for Docker stdout)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : "";
              return `[${timestamp}] [${level}] ${message}${metaStr}`;
            })
          ),
        }),
        // Daily rotate file for all logs
        new DailyRotateFile({
          filename: path.join(logsDir, "application-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "30d",
          zippedArchive: true,
        }),
        // Daily rotate file for errors only
        new DailyRotateFile({
          filename: path.join(logsDir, "error-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          level: "error",
          maxSize: "20m",
          maxFiles: "30d",
          zippedArchive: true,
        }),
        // Daily rotate file for record changes (audit trail)
        new DailyRotateFile({
          filename: path.join(logsDir, "audit-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          level: "info",
          maxSize: "20m",
          maxFiles: "90d",
          zippedArchive: true,
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
            winston.format.json(),
            winston.format((info) => {
              const context = info.context as Record<string, unknown> | undefined;
              return context && typeof context === "object" && context !== null && "operationType" in context && context.operationType === "record_change" ? info : false;
            })()
          ),
        }),
      ],
    });
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    const entry = this.formatMessage(level, message, context, error);
    
    // Log to Winston (handles both console and file)
    this.winstonLogger.log(level, message, entry);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log("error", message, context, error);
  }

  // Specialized logging methods for tracking operations
  trackOperation(operation: string, details: Record<string, unknown>): void {
    this.info(`Operation: ${operation}`, { ...details, operationType: "tracking" });
  }

  trackRecordChange(recordType: string, recordId: string, action: string, changes?: Record<string, unknown>): void {
    this.info(`Record ${action}: ${recordType}`, {
      recordType,
      recordId,
      action,
      changes,
      operationType: "record_change",
    });
  }

  trackApiRequest(method: string, path: string, statusCode: number, durationMs: number, userId?: string): void {
    this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      statusCode,
      durationMs,
      userId,
      operationType: "api_request",
    });
  }

  trackImport(phase: string, itemsProcessed: number, itemsCreated: number, itemsUpdated: number, itemsSkipped: number): void {
    this.info(`Workbook Import: ${phase}`, {
      phase,
      itemsProcessed,
      itemsCreated,
      itemsUpdated,
      itemsSkipped,
      operationType: "import",
    });
  }
}

export const logger = new Logger();