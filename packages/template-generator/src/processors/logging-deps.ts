import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

// Fullstack frontends with built-in servers that use backend=none
const FULLSTACK_FRONTENDS: Frontend[] = ["fresh", "qwik", "angular", "redwood"];

export function processLoggingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { logging, backend, frontend } = config;
  if (!logging || logging === "none") return;
  if (backend === "convex") return;

  const serverPath = "apps/server/package.json";
  const webPath = "apps/web/package.json";

  // Determine target path: prefer server, fall back to web for fullstack frontends
  const hasFullstackFrontend = frontend.some((f) => FULLSTACK_FRONTENDS.includes(f));
  const targetPath =
    backend !== "none" && vfs.exists(serverPath)
      ? serverPath
      : hasFullstackFrontend && vfs.exists(webPath)
        ? webPath
        : null;

  if (!targetPath) return;

  // Add Pino for pino option
  if (logging === "pino") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["pino", "pino-http"],
      devDependencies: ["pino-pretty"],
    });
  }

  // Add Winston for winston option
  if (logging === "winston") {
    addPackageDependency({
      vfs,
      packagePath: targetPath,
      dependencies: ["winston"],
    });
  }
}
