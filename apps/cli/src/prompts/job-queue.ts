import type { Backend, JobQueue } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getJobQueueChoice(jobQueue?: JobQueue, backend?: Backend) {
  if (jobQueue !== undefined) return jobQueue;

  // Job queue requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as JobQueue;
  }

  const options = [
    {
      value: "bullmq" as const,
      label: "BullMQ",
      hint: "Redis-backed job queue for background tasks and scheduling",
    },
    {
      value: "trigger-dev" as const,
      label: "Trigger.dev",
      hint: "Background jobs as code with serverless execution",
    },
    {
      value: "inngest" as const,
      label: "Inngest",
      hint: "Event-driven functions with built-in queuing and scheduling",
    },
    {
      value: "temporal" as const,
      label: "Temporal",
      hint: "Durable workflow orchestration for reliable distributed systems",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip job queue/background worker setup",
    },
  ];

  const response = await navigableSelect<JobQueue>({
    message: "Select job queue solution",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
