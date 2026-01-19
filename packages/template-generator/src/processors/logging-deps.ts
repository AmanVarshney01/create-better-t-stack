import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

export function processLoggingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { logging, backend } = config;
  if (!logging || logging === "none") return;
  if (backend === "none" || backend === "convex") return;

  const serverPath = "apps/server/package.json";

  // Add Pino for pino option
  if (logging === "pino" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["pino", "pino-http"],
      devDependencies: ["pino-pretty"],
    });
  }

  // Add Winston for winston option
  if (logging === "winston" && vfs.exists(serverPath)) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["winston"],
    });
  }
}
