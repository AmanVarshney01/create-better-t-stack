import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processFileStorageDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { fileStorage, backend } = config;

  // Skip if not selected or set to "none"
  if (!fileStorage || fileStorage === "none") return;

  // Skip if no backend to support file storage (convex has its own storage)
  if (backend === "none" || backend === "convex") return;

  // Add server-side file storage dependencies
  const serverPath = "apps/server/package.json";
  if (vfs.exists(serverPath)) {
    const deps = getFileStorageDeps(fileStorage);
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
      const deps = getFileStorageDeps(fileStorage);
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

function getFileStorageDeps(fileStorage: ProjectConfig["fileStorage"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (fileStorage) {
    case "s3":
      deps.push("@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner");
      break;
    case "r2":
      deps.push("@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner");
      break;
  }

  return deps;
}
