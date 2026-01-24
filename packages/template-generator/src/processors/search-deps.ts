import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processSearchDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { search, backend } = config;

  // Skip if not selected or set to "none"
  if (!search || search === "none") return;

  // Skip if no backend to support search (convex has its own search)
  if (backend === "none" || backend === "convex") return;

  // Add server-side search dependencies
  const serverPath = "apps/server/package.json";
  if (vfs.exists(serverPath)) {
    const deps = getSearchDeps(search);
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
      const deps = getSearchDeps(search);
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

function getSearchDeps(search: ProjectConfig["search"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (search) {
    case "meilisearch":
      deps.push("meilisearch");
      break;
    case "typesense":
      deps.push("typesense");
      break;
  }

  return deps;
}
