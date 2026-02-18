import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

/**
 * Process validation library dependencies.
 *
 * When Valibot is selected, it adds Valibot to the appropriate packages.
 * Zod is still included by default (via workspace-deps) for internal usage,
 * but Valibot can be used as the primary validation library in user code.
 */
export function processValidationDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { validation, frontend } = config;

  // Skip if not selected, "none", or "zod" (zod is added by workspace-deps already)
  if (!validation || validation === "none" || validation === "zod") return;

  const webPath = getWebPackagePath(frontend);
  const serverPath = getServerPackagePath(frontend);

  const packages = {
    api: vfs.exists("packages/api/package.json"),
    server: vfs.exists(serverPath),
    web: vfs.exists(webPath),
    native: vfs.exists("apps/native/package.json"),
  };

  const deps = getValidationDeps(validation);
  if (deps.length === 0) return;

  // Add validation library to API package (for schema definitions)
  if (packages.api) {
    addPackageDependency({
      vfs,
      packagePath: "packages/api/package.json",
      dependencies: deps,
    });
  }

  // Add to server package (for server-side validation)
  if (packages.server) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: deps,
    });
  }

  // Add to web package (for client-side validation)
  if (packages.web) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: deps,
    });
  }

  // Add to native package (for mobile validation)
  if (packages.native) {
    addPackageDependency({
      vfs,
      packagePath: "apps/native/package.json",
      dependencies: deps,
    });
  }
}

function getValidationDeps(validation: ProjectConfig["validation"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [];

  switch (validation) {
    case "valibot":
      deps.push("valibot");
      break;
    case "arktype":
      deps.push("arktype");
      break;
    case "typebox":
      deps.push("@sinclair/typebox");
      break;
    case "typia":
      deps.push("typia");
      break;
    case "runtypes":
      deps.push("runtypes");
      break;
    case "effect-schema":
      deps.push("@effect/schema");
      deps.push("effect");
      break;
  }

  return deps;
}
