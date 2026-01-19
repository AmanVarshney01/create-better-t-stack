import winston from "winston";

// Log levels: error, warn, info, http, verbose, debug, silly
const logLevel = process.env.LOG_LEVEL || "info";
const isDevelopment = process.env.NODE_ENV !== "production";

// Custom format for development with colors
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

// JSON format for production
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: isDevelopment ? devFormat : prodFormat,
  defaultMeta: { env: process.env.NODE_ENV || "development" },
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

/**
 * Create a child logger with additional context
 * Useful for adding request IDs, user IDs, or other contextual information
 *
 * @example
 * const requestLogger = createChildLogger({ requestId: 'abc123', userId: 'user456' });
 * requestLogger.info('Processing request');
 */
export function createChildLogger(bindings: Record<string, unknown>): winston.Logger {
  return logger.child(bindings);
}

/**
 * Log levels explained (npm log levels):
 * - error (0): Error messages for failures that don't stop the application
 * - warn (1): Warning messages for potentially problematic situations
 * - info (2): General information about application flow
 * - http (3): HTTP request logging
 * - verbose (4): More detailed than info
 * - debug (5): Detailed information useful during development
 * - silly (6): Most detailed logging
 *
 * @example
 * logger.info('Server started');
 * logger.info('Server started on port', { port: 3000 });
 * logger.error('Failed to process request', { err: error });
 * logger.debug('User action logged', { userId, action });
 */
export { logger };

export default logger;
