/**
 * React hook for subscribing to the global logger
 * Updates component state when new logs are emitted
 */
import { useState, useEffect } from "react";
import { logger, type LogEntry } from "../utils/logger";

export function useLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Get existing logs
    setLogs(logger.getLogs());

    // Subscribe to new logs
    const unsubscribe = logger.subscribe((entry) => {
      setLogs((prev) => [...prev, entry]);
    });

    return unsubscribe;
  }, []);

  return logs;
}

// Hook to get only the latest log entry
export function useLatestLog() {
  const [latestLog, setLatestLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    const existing = logger.getLogs();
    if (existing.length > 0) {
      setLatestLog(existing[existing.length - 1]);
    }

    const unsubscribe = logger.subscribe((entry) => {
      setLatestLog(entry);
    });

    return unsubscribe;
  }, []);

  return latestLog;
}
