import { createApp } from "./app.js";
import { connectMongo, disconnectMongo } from "./utils/mongo.js";
import { config } from "./config/index.js";

async function startServer(): Promise<void> {
  try {
    await connectMongo();

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`,
      );
      console.info(
        `Health check: http://localhost:${config.port}/api/v1/health`,
      );
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.info(`${signal} received, shutting down gracefully...`);
      server.close(async () => {
        await disconnectMongo();
        process.exit(0);
      });

      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
