import type { Backend, Caching } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getCachingChoice(caching?: Caching, backend?: Backend) {
  if (caching !== undefined) return caching;

  // Caching requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as Caching;
  }

  const options = [
    {
      value: "upstash-redis" as const,
      label: "Upstash Redis",
      hint: "Serverless Redis with REST API for edge and serverless",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip caching layer setup",
    },
  ];

  const response = await navigableSelect<Caching>({
    message: "Select caching solution",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
