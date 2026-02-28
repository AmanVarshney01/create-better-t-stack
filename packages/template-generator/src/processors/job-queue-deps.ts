import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processJobQueueDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { jobQueue, backend } = config;

  // Skip if not selected or set to "none"
  if (!jobQueue || jobQueue === "none") return;

  // Skip if no backend to support job queues (convex has its own background jobs)
  if (backend === "none" || backend === "convex") return;

  // Add server-side job queue dependencies
  const serverPath = "apps/server/package.json";
  if (vfs.exists(serverPath)) {
    const deps = getJobQueueDeps(jobQueue);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: deps,
      });
    }
  }
}

function getJobQueueDeps(jobQueue: ProjectConfig["jobQueue"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (jobQueue) {
    case "bullmq":
      deps.push("bullmq");
      break;
    case "trigger-dev":
      deps.push("@trigger.dev/sdk");
      break;
    case "inngest":
      deps.push("inngest");
      break;
    case "temporal":
      deps.push("@temporalio/client");
      deps.push("@temporalio/worker");
      deps.push("@temporalio/workflow");
      deps.push("@temporalio/activity");
      break;
  }

  return deps;
}
