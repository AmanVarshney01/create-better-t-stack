import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processObservabilityDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { observability, backend } = config;
  if (!observability || observability === "none") return;
  if (backend === "none" || backend === "convex") return;

  const serverPath = "apps/server/package.json";

  // Add OpenTelemetry packages
  if (observability === "opentelemetry" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: [
        "@opentelemetry/api",
        "@opentelemetry/sdk-node",
        "@opentelemetry/auto-instrumentations-node",
        "@opentelemetry/exporter-trace-otlp-http",
        "@opentelemetry/exporter-metrics-otlp-http",
        "@opentelemetry/resources",
        "@opentelemetry/semantic-conventions",
      ],
    });
  }

  // Add Sentry packages
  if (observability === "sentry" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@sentry/node", "@sentry/profiling-node"],
    });
  }
}
