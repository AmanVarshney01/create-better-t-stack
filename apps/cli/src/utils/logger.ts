/**
 * TUI-integrated logging system
 * Provides a global logger that emits events for the TUI to display in real-time
 *
 * Inspired by opencode's Bus event pattern for reliable event delivery
 */

export type LogLevel = "info" | "success" | "warn" | "error" | "step";

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: Date;
}

type LogListener = (entry: LogEntry) => void;

class Logger {
  private listeners: Set<LogListener> = new Set();
  private logs: LogEntry[] = [];
  private idCounter = 0;

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(level: LogLevel, message: string) {
    const entry: LogEntry = {
      id: this.idCounter++,
      level,
      message,
      timestamp: new Date(),
    };
    this.logs.push(entry);

    // Use queueMicrotask to ensure React state updates happen correctly
    // This helps when many logs are emitted in quick succession during async operations
    queueMicrotask(() => {
      for (const listener of this.listeners) {
        try {
          listener(entry);
        } catch (e) {
          // Silently ignore listener errors to prevent breaking the log chain
        }
      }
    });
  }

  info(message: string) {
    this.emit("info", message);
  }

  success(message: string) {
    this.emit("success", message);
  }

  warn(message: string) {
    this.emit("warn", message);
  }

  error(message: string) {
    this.emit("error", message);
  }

  step(message: string) {
    this.emit("step", message);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.idCounter = 0;
  }

  // Get last N logs (useful for display)
  getRecentLogs(count: number = 15): LogEntry[] {
    return this.logs.slice(-count);
  }
}

// Global logger instance
export const logger = new Logger();

// Convenience exports for easy importing
export const log = {
  info: (msg: string) => logger.info(msg),
  success: (msg: string) => logger.success(msg),
  warn: (msg: string) => logger.warn(msg),
  error: (msg: string) => logger.error(msg),
  step: (msg: string) => logger.step(msg),
};
