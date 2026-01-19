import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

/**
 * Process testing framework dependencies.
 *
 * Adds the appropriate testing framework dependencies based on the selected option:
 * - vitest: Fast unit test framework (default)
 * - jest: Classic testing framework
 * - playwright: E2E testing
 * - vitest-playwright: Both unit and E2E testing
 */
export function processTestingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { testing } = config;

  // Skip if not selected or "none"
  if (!testing || testing === "none") return;

  const packages = {
    server: vfs.exists("apps/server/package.json"),
    web: vfs.exists("apps/web/package.json"),
    api: vfs.exists("packages/api/package.json"),
  };

  const { devDeps } = getTestingDeps(testing);
  if (devDeps.length === 0) return;

  // Add testing dependencies to server package
  if (packages.server) {
    addPackageDependency({
      vfs,
      packagePath: "apps/server/package.json",
      devDependencies: devDeps,
    });
  }

  // Add testing dependencies to web package
  if (packages.web) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      devDependencies: devDeps,
    });
  }

  // Add testing dependencies to API package
  if (packages.api) {
    addPackageDependency({
      vfs,
      packagePath: "packages/api/package.json",
      devDependencies: devDeps,
    });
  }
}

function getTestingDeps(testing: ProjectConfig["testing"]): {
  devDeps: AvailableDependencies[];
} {
  const devDeps: AvailableDependencies[] = [];

  switch (testing) {
    case "jest":
      devDeps.push("jest", "@types/jest", "ts-jest", "@jest/globals");
      break;
    case "cypress":
      devDeps.push("cypress");
      break;
    // vitest, playwright, vitest-playwright are handled elsewhere or are not in the dependency map
    // They may already be included in workspace templates or have their own processors
  }

  return { devDeps };
}
