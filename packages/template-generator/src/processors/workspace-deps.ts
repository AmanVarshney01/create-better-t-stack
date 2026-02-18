import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

export function processWorkspaceDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const {
    projectName,
    packageManager,
    runtime,
    backend,
    database,
    auth,
    api,
    serverDeploy,
    webDeploy,
  } = config;

  const workspaceVersion = packageManager === "npm" ? "*" : "workspace:*";
  const webPath = getWebPackagePath(config.frontend);
  const serverPath = getServerPackagePath(config.frontend);
  const packages = {
    config: vfs.exists("packages/config/package.json"),
    env: vfs.exists("packages/env/package.json"),
    infra: vfs.exists("packages/infra/package.json"),
    db: vfs.exists("packages/db/package.json"),
    auth: vfs.exists("packages/auth/package.json"),
    api: vfs.exists("packages/api/package.json"),
    backend: vfs.exists("packages/backend/package.json"),
    server: vfs.exists(serverPath),
    web: vfs.exists(webPath),
    native: vfs.exists("apps/native/package.json"),
  };

  const configDep = packages.config ? { [`@${projectName}/config`]: workspaceVersion } : {};
  const envDep = packages.env ? { [`@${projectName}/env`]: workspaceVersion } : {};
  const isCloudflare = serverDeploy === "cloudflare" || webDeploy === "cloudflare";
  const runtimeDevDeps = getRuntimeDevDeps(runtime, backend);
  const commonDeps: AvailableDependencies[] = ["dotenv", "zod"];
  const commonDevDeps: AvailableDependencies[] = ["typescript", ...runtimeDevDeps];

  addPackageDependency({
    vfs,
    packagePath: "package.json",
    dependencies: commonDeps,
    devDependencies: commonDevDeps,
    customDependencies: envDep,
    customDevDependencies: configDep,
  });

  if (packages.env) {
    const envDevDeps: Record<string, string> = { ...configDep };
    if (isCloudflare && packages.infra) {
      envDevDeps[`@${projectName}/infra`] = workspaceVersion;
    }
    addPackageDependency({
      vfs,
      packagePath: "packages/env/package.json",
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDevDependencies: envDevDeps,
    });
  }

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
      customDependencies: envDep,
      customDevDependencies: configDep,
    });
  }

  if (packages.auth) {
    const authDeps: Record<string, string> = { ...envDep };
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
    const apiPackageDeps: Record<string, string> = { ...envDep };
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
    const serverDeps: Record<string, string> = { ...envDep };
    if (api !== "none" && packages.api) serverDeps[`@${projectName}/api`] = workspaceVersion;
    if (auth !== "none" && packages.auth) serverDeps[`@${projectName}/auth`] = workspaceVersion;
    if (database !== "none" && packages.db) serverDeps[`@${projectName}/db`] = workspaceVersion;
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: commonDeps,
      devDependencies: ["typescript", "tsdown"],
      customDependencies: serverDeps,
      customDevDependencies: configDep,
    });
  }

  if (packages.web) {
    const webPackageDeps: Record<string, string> = { ...envDep };
    if (api !== "none" && packages.api) webPackageDeps[`@${projectName}/api`] = workspaceVersion;
    if (auth !== "none" && packages.auth) webPackageDeps[`@${projectName}/auth`] = workspaceVersion;
    if (backend === "convex" && packages.backend)
      webPackageDeps[`@${projectName}/backend`] = workspaceVersion;
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDependencies: webPackageDeps,
      customDevDependencies: configDep,
    });
  }

  if (packages.native) {
    const nativeDeps: Record<string, string> = { ...envDep };
    if (api !== "none" && packages.api) nativeDeps[`@${projectName}/api`] = workspaceVersion;
    if (backend === "convex" && packages.backend)
      nativeDeps[`@${projectName}/backend`] = workspaceVersion;
    addPackageDependency({
      vfs,
      packagePath: "apps/native/package.json",
      dependencies: commonDeps,
      devDependencies: ["typescript"],
      customDependencies: nativeDeps,
      customDevDependencies: configDep,
    });
  }
}

function getRuntimeDevDeps(
  runtime: ProjectConfig["runtime"],
  backend: ProjectConfig["backend"],
): AvailableDependencies[] {
  if (runtime === "none" && backend === "self") return ["@types/node"];
  if (runtime === "node" || runtime === "workers") return ["@types/node"];
  if (runtime === "bun") return ["@types/bun"];
  return [];
}
