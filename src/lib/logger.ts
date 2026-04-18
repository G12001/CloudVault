import winston from "winston";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logger instance with safe configuration
const createSafeLogger = () => {
  const transports: winston.transport[] = [];

  // Always add console transport - this works everywhere
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );

  // For serverless environments, we should avoid file transports entirely
  // Check if we're likely in a serverless environment (common serverless platform env vars)
  // Vercel provides VERCEL_ENV which can be 'production', 'preview', or 'development'
  const isServerless =
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.NODE_ENV === "production";

  // Only add file transports if we're NOT in a serverless environment
  // and file logging is explicitly enabled
  if (!isServerless && process.env.ENABLE_FILE_LOGGING !== "false") {
    try {
      transports.push(
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      );
      transports.push(
        new winston.transports.File({
          filename: "logs/combined.log",
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      );
    } catch (error) {
      // If file transport creation fails, log to console and continue with console only
      console.warn("File logging disabled due to error:", error.message);
    }
  } else {
    console.log("File logging disabled - using console transport only");
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    defaultMeta: { service: "cloudvault-api" },
    transports,
    // Silently ignore any errors from transports
    silent: process.env.LOG_SILENT === "true",
  });
};

let logger: winston.Logger;

try {
  logger = createSafeLogger();
} catch (error) {
  // Fallback to simple console logging if Winston fails completely
  console.error(
    "Winston logger failed to initialize, using console fallback:",
    error.message,
  );

  // Create a minimal console-only logger
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  });
}

// Logging utility functions
export const log = {
  // General info logging
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },

  // Warning logging
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },

  // Error logging with optional error object
  error: (message: string, error?: any, meta?: any) => {
    const logData = {
      ...meta,
      ...(error instanceof Error
        ? {
            errorMessage: error.message,
            errorStack: error.stack,
          }
        : { error }),
    };
    logger.error(message, logData);
  },

  // Debug logging for development
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },

  // HTTP request logging
  http: (req: any, res: any, responseTime?: number) => {
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime,
      userAgent: req.headers["user-agent"],
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    };
    logger.info("HTTP request", logData);
  },

  // Database operation logging
  db: (operation: string, collection: string, data?: any, meta?: any) => {
    logger.info(`DB ${operation}`, {
      collection,
      ...data,
      ...meta,
    });
  },

  // File operation logging
  file: (operation: string, fileName: string, userId: string, meta?: any) => {
    logger.info(`File ${operation}`, {
      fileName,
      userId,
      ...meta,
    });
  },

  // Authentication logging
  auth: (action: string, userId: string, meta?: any) => {
    logger.info(`Auth ${action}`, {
      userId,
      ...meta,
    });
  },
};

export default logger;
