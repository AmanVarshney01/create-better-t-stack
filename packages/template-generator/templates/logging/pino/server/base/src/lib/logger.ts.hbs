import pino from "pino";
import type { Logger, LoggerOptions } from "pino";

// Log levels: trace, debug, info, warn, error, fatal
const logLevel = (process.env.LOG_LEVEL || "info") as pino.LevelWithSilent;
const isDevelopment = process.env.NODE_ENV !== "production";

// Create logger options
const loggerOptions: LoggerOptions = {
  level: logLevel,
  // Add timestamp formatting
  timestamp: pino.stdTimeFunctions.isoTime,
  // Base context for all logs
  base: {
    env: process.env.NODE_ENV || "development",
  },
};

// Use pino-pretty in development for readable logs
// In production, use raw JSON for better performance and log aggregation
let logger: Logger;

if (isDevelopment && process.env.PINO_PRETTY !== "false") {
  logger = pino({
    ...loggerOptions,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
        singleLine: false,
      },
    },
  });
} else {
  logger = pino(loggerOptions);
}

/**
 * Create a child logger with additional context
 * Useful for adding request IDs, user IDs, or other contextual information
 *
 * @example
 * const requestLogger = createChildLogger({ requestId: 'abc123', userId: 'user456' });
 * requestLogger.info('Processing request');
 */
export function createChildLogger(bindings: Record<string, unknown>): Logger {
  return logger.child(bindings);
}

/**
 * Log levels explained:
 * - trace: Most detailed logging, typically disabled in production
 * - debug: Detailed information useful during development
 * - info: General information about application flow
 * - warn: Warning messages for potentially problematic situations
 * - error: Error messages for failures that don't stop the application
 * - fatal: Critical errors that may cause the application to terminate
 *
 * @example
 * logger.info('Server started');
 * logger.info({ port: 3000 }, 'Server started on port');
 * logger.error({ err: error }, 'Failed to process request');
 * logger.debug({ userId, action }, 'User action logged');
 */
export { logger };

export default logger;
