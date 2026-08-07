import mongoose from "mongoose";
import { config } from "../config/index.js";

let isConnected = false;

export async function connectMongo(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.mongodbUri);
    isConnected = true;
    console.info("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectMongo(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.info("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
}

export function getConnectionStatus(): boolean {
  return isConnected;
}
