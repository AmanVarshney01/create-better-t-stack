import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

// Fullstack frontends with built-in servers that use backend=none
const FULLSTACK_FRONTENDS: Frontend[] = ["fresh", "qwik", "angular", "redwood"];

export function processLoggingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { logging, backend, frontend } = config;
  if (!logging || logging === "none") return;
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
