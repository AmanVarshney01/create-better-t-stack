import fs from "fs-extra";
import path from "node:path";

import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";

type WorkspaceContext = {
  projectName: string;
  workspaceVersion: string;
  options: ProjectConfig;
  commonDeps: AvailableDependencies[];
  commonDevDeps: AvailableDependencies[];
  configDep: Record<string, string>;
  envDep: Record<string, string>;
};

type PackageInfo = {
  dir: string;
  exists: boolean;
};

export async function setupWorkspaceDependencies(projectDir: string, options: ProjectConfig) {
  const { projectName, packageManager, runtime, backend } = options;
  const workspaceVersion = packageManager === "npm" ? "*" : "workspace:*";

  const packages = await detectPackages(projectDir);

  const configDep = packages.config.exists ? { [`@${projectName}/config`]: workspaceVersion } : {};

  const envDep = packages.env.exists ? { [`@${projectName}/env`]: workspaceVersion } : {};

  const ctx: WorkspaceContext = {
    projectName,
    workspaceVersion,
    options,
    commonDeps: ["dotenv", "zod"],
    commonDevDeps: ["typescript"],
    configDep,
    envDep,
  };

  await Promise.all([
    setupEnvPackage(packages.env, packages.infra, ctx),
    setupInfraPackage(packages.infra, ctx),
    setupDbPackage(packages.db, ctx),
    setupAuthPackage(packages.auth, packages.db, ctx),
    setupApiPackage(packages.api, packages.auth, packages.db, ctx),
    setupBackendPackage(packages.backend, ctx),
    setupServerPackage(packages.server, packages.api, packages.auth, packages.db, ctx),
    setupWebPackage(packages.web, packages.api, packages.auth, packages.backend, ctx),
    setupNativePackage(packages.native, packages.api, packages.backend, ctx),
  ]);

  const runtimeDevDeps = getRuntimeDevDeps(runtime, backend);
  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: [...ctx.commonDevDeps, ...runtimeDevDeps],
    customDependencies: envDep,
    customDevDependencies: configDep,
    projectDir,
  });
}

async function detectPackages(projectDir: string): Promise<Record<string, PackageInfo>> {
  const packagePaths = {
    config: "packages/config",
    env: "packages/env",
    infra: "packages/infra",
    db: "packages/db",
    auth: "packages/auth",
    api: "packages/api",
    backend: "packages/backend",
    server: "apps/server",
    web: "apps/web",
    native: "apps/native",
  };

  const entries = await Promise.all(
    Object.entries(packagePaths).map(async ([name, relativePath]) => {
      const dir = path.join(projectDir, relativePath);
      const exists = await fs.pathExists(dir);
      return [name, { dir, exists }] as const;
    }),
  );

  return Object.fromEntries(entries);
}

async function setupEnvPackage(pkg: PackageInfo, infraPkg: PackageInfo, ctx: WorkspaceContext) {
  if (!pkg.exists) return;

  const runtimeDevDeps = getRuntimeDevDeps(ctx.options.runtime, ctx.options.backend);

  const customDevDeps: Record<string, string> = { ...ctx.configDep };
  const isCloudflare =
    ctx.options.serverDeploy === "cloudflare" || ctx.options.webDeploy === "cloudflare";
  if (isCloudflare && infraPkg.exists) {
    customDevDeps[`@${ctx.projectName}/infra`] = ctx.workspaceVersion;
  }

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: [...ctx.commonDevDeps, ...runtimeDevDeps],
    customDevDependencies: customDevDeps,
    projectDir: pkg.dir,
  });
}

async function setupInfraPackage(pkg: PackageInfo, ctx: WorkspaceContext) {
  if (!pkg.exists) return;

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupDbPackage(pkg: PackageInfo, ctx: WorkspaceContext) {
  if (!pkg.exists) return;

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDependencies: ctx.envDep,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupAuthPackage(pkg: PackageInfo, dbPkg: PackageInfo, ctx: WorkspaceContext) {
  if (!pkg.exists) return;

  const deps = { ...ctx.envDep };
  if (ctx.options.database !== "none" && dbPkg.exists) {
    deps[`@${ctx.projectName}/db`] = ctx.workspaceVersion;
  }

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDependencies: deps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupApiPackage(
  pkg: PackageInfo,
  authPkg: PackageInfo,
  dbPkg: PackageInfo,
  ctx: WorkspaceContext,
) {
  if (!pkg.exists) return;

  const deps = { ...ctx.envDep };
  if (ctx.options.auth !== "none" && authPkg.exists) {
    deps[`@${ctx.projectName}/auth`] = ctx.workspaceVersion;
  }
  if (ctx.options.database !== "none" && dbPkg.exists) {
    deps[`@${ctx.projectName}/db`] = ctx.workspaceVersion;
  }

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDependencies: deps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupBackendPackage(pkg: PackageInfo, ctx: WorkspaceContext) {
  if (!pkg.exists) return;

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupServerPackage(
  pkg: PackageInfo,
  apiPkg: PackageInfo,
  authPkg: PackageInfo,
  dbPkg: PackageInfo,
  ctx: WorkspaceContext,
) {
  if (!pkg.exists) return;

  const deps = { ...ctx.envDep };
  if (ctx.options.api !== "none" && apiPkg.exists) {
    deps[`@${ctx.projectName}/api`] = ctx.workspaceVersion;
  }
  if (ctx.options.auth !== "none" && authPkg.exists) {
    deps[`@${ctx.projectName}/auth`] = ctx.workspaceVersion;
  }
  if (ctx.options.database !== "none" && dbPkg.exists) {
    deps[`@${ctx.projectName}/db`] = ctx.workspaceVersion;
  }

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: [...ctx.commonDevDeps, "tsdown"],
    customDependencies: deps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupWebPackage(
  pkg: PackageInfo,
  apiPkg: PackageInfo,
  authPkg: PackageInfo,
  backendPkg: PackageInfo,
  ctx: WorkspaceContext,
) {
  if (!pkg.exists) return;

  const deps = { ...ctx.envDep };
  if (ctx.options.api !== "none" && apiPkg.exists) {
    deps[`@${ctx.projectName}/api`] = ctx.workspaceVersion;
  }
  if (ctx.options.auth !== "none" && authPkg.exists) {
    deps[`@${ctx.projectName}/auth`] = ctx.workspaceVersion;
  }
  if (ctx.options.backend === "convex" && backendPkg.exists) {
    deps[`@${ctx.projectName}/backend`] = ctx.workspaceVersion;
  }

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDependencies: deps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

async function setupNativePackage(
  pkg: PackageInfo,
  apiPkg: PackageInfo,
  backendPkg: PackageInfo,
  ctx: WorkspaceContext,
) {
  if (!pkg.exists) return;

  const deps = { ...ctx.envDep };
  if (ctx.options.api !== "none" && apiPkg.exists) {
    deps[`@${ctx.projectName}/api`] = ctx.workspaceVersion;
  }
  if (ctx.options.backend === "convex" && backendPkg.exists) {
    deps[`@${ctx.projectName}/backend`] = ctx.workspaceVersion;
  }

  await addPackageDependency({
    dependencies: ctx.commonDeps,
    devDependencies: ctx.commonDevDeps,
    customDependencies: deps,
    customDevDependencies: ctx.configDep,
    projectDir: pkg.dir,
  });
}

function getRuntimeDevDeps(
  runtime: ProjectConfig["runtime"],
  backend: ProjectConfig["backend"],
): AvailableDependencies[] {
  if (runtime === "none" && backend === "self") {
    return ["@types/node"];
  }
  if (runtime === "node" || runtime === "workers") {
    return ["@types/node"];
  }
  if (runtime === "bun") {
    return ["@types/bun"];
  }
  return [];
}
