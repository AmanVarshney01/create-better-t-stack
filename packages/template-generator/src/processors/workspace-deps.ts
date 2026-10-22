import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processWorkspaceDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { projectName, packageManager, runtime, orm, backend, database, auth, api, frontend } =
    config;

  const workspaceVersion = packageManager === "npm" ? "*" : "workspace:*";
  const packages = {
    config: vfs.exists("packages/config/package.json"),
    infra: vfs.exists("packages/infra/package.json"),
    db: vfs.exists("packages/db/package.json"),
    auth: vfs.exists("packages/auth/package.json"),
    api: vfs.exists("packages/api/package.json"),
    ui: vfs.exists("packages/ui/package.json"),
    backend: vfs.exists("packages/backend/package.json"),
    server: vfs.exists("apps/server/package.json"),
    web: vfs.exists("apps/web/package.json"),
    native: vfs.exists("apps/native/package.json"),
  };

  const configDep = packages.config ? { [`@${projectName}/config`]: workspaceVersion } : {};
  const uiDep = packages.ui ? { [`@${projectName}/ui`]: workspaceVersion } : {};
  const runtimeDevDeps = getRuntimeDevDeps(runtime);
  const commonDeps: AvailableDependencies[] = ["zod"];
  const commonDevDeps: AvailableDependencies[] = ["typescript", ...runtimeDevDeps];

  addPackageDependency({
    vfs,
    packagePath: "package.json",
    dependencies: commonDeps,
    devDependencies: commonDevDeps,
    customDevDependencies: configDep,
  });

  if (packages.infra) {
    addPackageDependency({
      vfs,
      packagePath: "packages/infra/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDevDependencies: configDep,
    });
  }

  if (packages.db) {
    addPackageDependency({
      vfs,
      packagePath: "packages/db/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDevDependencies: configDep,
    });
  }

  if (packages.auth) {
    const authDeps: Record<string, string> = {};
    if (database !== "none" && packages.db) {
      authDeps[`@${projectName}/db`] = workspaceVersion;
    }
    addPackageDependency({
      vfs,
      packagePath: "packages/auth/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDependencies: authDeps,
      customDevDependencies: configDep,
    });
  }

  if (packages.api) {
    const apiPackageDeps: Record<string, string> = {};
    if (auth !== "none" && packages.auth) {
      apiPackageDeps[`@${projectName}/auth`] = workspaceVersion;
    }
    if (database !== "none" && packages.db) {
      apiPackageDeps[`@${projectName}/db`] = workspaceVersion;
    }
    addPackageDependency({
      vfs,
      packagePath: "packages/api/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDependencies: apiPackageDeps,
      customDevDependencies: configDep,
    });
  }

  if (packages.backend) {
    addPackageDependency({
      vfs,
      packagePath: "packages/backend/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDevDependencies: configDep,
    });
  }

  if (packages.server) {
    const serverDevDependencies: AvailableDependencies[] = ["typescript", "tsdown"];
    if (runtime === "workers" && orm === "prisma") {
      serverDevDependencies.push("unwasm");
    }
    const serverDeps: Record<string, string> = {};
    if (api !== "none" && packages.api) serverDeps[`@${projectName}/api`] = workspaceVersion;
    if (auth !== "none" && packages.auth) serverDeps[`@${projectName}/auth`] = workspaceVersion;
    if (database !== "none" && packages.db) serverDeps[`@${projectName}/db`] = workspaceVersion;
    addPackageDependency({
      vfs,
      packagePath: "apps/server/package.json",
      dependencies: commonDeps,
      devDependencies: serverDevDependencies,
      customDependencies: serverDeps,
      customDevDependencies: configDep,
    });
  }

  if (packages.web) {
    const webPackageDeps = { ...uiDep } satisfies Record<string, string>;

    if (api !== "none" && packages.api) webPackageDeps[`@${projectName}/api`] = workspaceVersion;
    if (
      auth !== "none" &&
      packages.auth &&
      (backend === "self" || (auth === "better-auth" && frontend.includes("solid")))
    ) {
      webPackageDeps[`@${projectName}/auth`] = workspaceVersion;
    }
    if (backend === "self" && packages.db) webPackageDeps[`@${projectName}/db`] = workspaceVersion;
    if (backend === "convex" && packages.backend)
      webPackageDeps[`@${projectName}/backend`] = workspaceVersion;

    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDependencies: webPackageDeps,
      customDevDependencies: configDep,
    });
  }

  if (packages.ui) {
    addPackageDependency({
      vfs,
      packagePath: "packages/ui/package.json",
      devDependencies: ["typescript"],
      customDevDependencies: configDep,
    });
  }

  if (packages.native) {
    const nativeDeps: Record<string, string> = {};
    if (api !== "none" && packages.api) nativeDeps[`@${projectName}/api`] = workspaceVersion;
    if (backend === "convex" && packages.backend)
      nativeDeps[`@${projectName}/backend`] = workspaceVersion;
    addPackageDependency({
      vfs,
      packagePath: "apps/native/package.json",
      dependencies: commonDeps,
      customDependencies: nativeDeps,
      customDevDependencies: configDep,
    });
  }
}

function getRuntimeDevDeps(runtime: ProjectConfig["runtime"]): AvailableDependencies[] {
  if (runtime === "none") return ["@types/node"];
  if (runtime === "node" || runtime === "workers") return ["@types/node"];
  if (runtime === "bun") return ["@types/bun"];
  return [];
}
