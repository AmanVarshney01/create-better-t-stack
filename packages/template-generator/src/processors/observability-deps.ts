import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

// Fullstack frontends with built-in servers that use backend=none
const FULLSTACK_FRONTENDS: Frontend[] = ["fresh", "qwik", "angular", "redwood"];

export function processObservabilityDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { observability, backend, frontend } = config;
  if (!observability || observability === "none") return;
  if (backend === "convex") return;

  const serverPath = getServerPackagePath(frontend);
  const webPath = getWebPackagePath(frontend);

  // Determine target path: self backend targets web, standalone backend targets server,
  // fullstack frontends (fresh, qwik, etc.) fall back to web
  const hasFullstackFrontend = frontend.some((f) => FULLSTACK_FRONTENDS.includes(f));
  const targetPath =
    backend === "self" && vfs.exists(webPath)
      ? webPath
      : backend !== "none" && vfs.exists(serverPath)
        ? serverPath
        : hasFullstackFrontend && vfs.exists(webPath)
          ? webPath
          : null;

  if (!targetPath) return;

  // Add OpenTelemetry packages
  if (observability === "opentelemetry") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
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
  if (observability === "sentry") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["@sentry/node", "@sentry/profiling-node"],
    });
  }

  // Add Grafana packages (Prometheus metrics for Grafana dashboards)
  if (observability === "grafana") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["prom-client"],
    });
  }
}
