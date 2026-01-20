import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processCachingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { caching, backend } = config;

  // Skip if not selected or set to "none"
  if (!caching || caching === "none") return;

  // Skip if no backend to support caching (convex has its own caching)
  if (backend === "none" || backend === "convex") return;

  // Add server-side caching dependencies
  const serverPath = "apps/server/package.json";
  if (vfs.exists(serverPath)) {
    const deps = getCachingDeps(caching);
    if (deps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: deps,
      });
    }
  }

  // For fullstack frameworks (self), add to web package
  if (backend === "self") {
    const webPath = "apps/web/package.json";
    if (vfs.exists(webPath)) {
      const deps = getCachingDeps(caching);
      if (deps.length > 0) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: deps,
        });
      }
    }
  }
}

function getCachingDeps(caching: ProjectConfig["caching"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (caching) {
    case "upstash-redis":
      deps.push("@upstash/redis");
      break;
  }

  return deps;
}
