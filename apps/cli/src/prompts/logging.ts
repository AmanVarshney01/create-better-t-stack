import type { Backend, Logging } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getLoggingChoice(logging?: Logging, backend?: Backend) {
  if (logging !== undefined) return logging;

  // Logging requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as Logging;
  }

  const options = [
    {
      value: "pino" as const,
      label: "Pino",
      hint: "Fast JSON logger with minimal overhead",
    },
    {
      value: "winston" as const,
      label: "Winston",
      hint: "Flexible logging library with multiple transports",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip logging framework setup",
    },
  ];

  const response = await navigableSelect<Logging>({
    message: "Select logging framework",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
