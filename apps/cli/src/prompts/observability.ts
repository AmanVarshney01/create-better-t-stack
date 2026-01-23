import type { Backend, Observability } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getObservabilityChoice(observability?: Observability, backend?: Backend) {
  if (observability !== undefined) return observability;

  // Observability requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as Observability;
  }

  const options = [
    {
      value: "opentelemetry" as const,
      label: "OpenTelemetry",
      hint: "Observability framework for traces, metrics, and logs",
    },
    {
      value: "sentry" as const,
      label: "Sentry",
      hint: "Error tracking and performance monitoring",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip observability/tracing setup",
    },
  ];

  const response = await navigableSelect<Observability>({
    message: "Select observability solution",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
