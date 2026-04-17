import winston from "winston";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "cloudvault-api" },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
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
