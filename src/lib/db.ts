import mongoose from "mongoose";
import { log } from "./logger";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  log.error("MongoDB connection string is missing");
  throw new Error("❌ Missing MONGODB_URI");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      log.debug("MongoDB already connected");
      return;
    }

    log.info("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    log.info("MongoDB connected successfully");

    // Log database connection events
    mongoose.connection.on("error", (error) => {
      log.error("MongoDB connection error", error);
    });

    mongoose.connection.on("disconnected", () => {
      log.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      log.info("MongoDB reconnected");
    });
  } catch (error) {
    log.error("Failed to connect to MongoDB", error);
    throw error;
  }
};
