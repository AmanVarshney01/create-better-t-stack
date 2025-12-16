import path from "node:path";
import fs from "fs-extra";
import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupWorkspaceDependencies(projectDir: string, options: ProjectConfig) {
  const { projectName, packageManager, database, auth, api, runtime, backend } = options;
  const workspaceVersion = packageManager === "npm" ? "*" : "workspace:*";

  const commonDeps: AvailableDependencies[] = ["dotenv", "zod"];
  const commonDevDeps: AvailableDependencies[] = ["typescript"];

  const configDir = path.join(projectDir, "packages/config");
  const dbDir = path.join(projectDir, "packages/db");
  const authDir = path.join(projectDir, "packages/auth");
  const apiDir = path.join(projectDir, "packages/api");
  const backendDir = path.join(projectDir, "packages/backend");
  const serverDir = path.join(projectDir, "apps/server");
  const webDir = path.join(projectDir, "apps/web");
  const nativeDir = path.join(projectDir, "apps/native");

  const [
    configExists,
    dbExists,
    authExists,
    apiExists,
    backendExists,
    serverExists,
    webExists,
    nativeExists,
  ] = await Promise.all([
    fs.pathExists(configDir),
    fs.pathExists(dbDir),
    fs.pathExists(authDir),
    fs.pathExists(apiDir),
    fs.pathExists(backendDir),
    fs.pathExists(serverDir),
    fs.pathExists(webDir),
    fs.pathExists(nativeDir),
  ]);

  const configDep: Record<string, string> = configExists
    ? { [`@${projectName}/config`]: workspaceVersion }
    : {};

  if (dbExists) {
    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDevDependencies: configDep,
      projectDir: dbDir,
    });
  }

  if (authExists) {
    const authDeps: Record<string, string> = {};
    if (database !== "none" && dbExists) {
      authDeps[`@${projectName}/db`] = workspaceVersion;
    }

    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDependencies: authDeps,
      customDevDependencies: configDep,
      projectDir: authDir,
    });
  }

  if (apiExists) {
    const apiDeps: Record<string, string> = {};
    if (auth !== "none" && authExists) {
      apiDeps[`@${projectName}/auth`] = workspaceVersion;
    }
    if (database !== "none" && dbExists) {
      apiDeps[`@${projectName}/db`] = workspaceVersion;
    }

    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDependencies: apiDeps,
      customDevDependencies: configDep,
      projectDir: apiDir,
    });
  }

  if (backendExists) {
    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDevDependencies: configDep,
      projectDir: backendDir,
    });
  }

  if (serverExists) {
    const serverDeps: Record<string, string> = {};
    if (api !== "none" && apiExists) {
      serverDeps[`@${projectName}/api`] = workspaceVersion;
    }
    if (auth !== "none" && authExists) {
      serverDeps[`@${projectName}/auth`] = workspaceVersion;
    }
    if (database !== "none" && dbExists) {
      serverDeps[`@${projectName}/db`] = workspaceVersion;
    }

    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: [...commonDevDeps, "tsdown"],
      customDependencies: serverDeps,
      customDevDependencies: configDep,
      projectDir: serverDir,
    });
  }

  if (webExists) {
    const webDeps: Record<string, string> = {};
    if (api !== "none" && apiExists) {
      webDeps[`@${projectName}/api`] = workspaceVersion;
    }
    if (auth !== "none" && authExists) {
      webDeps[`@${projectName}/auth`] = workspaceVersion;
    }
    if (backend === "convex" && backendExists) {
      webDeps[`@${projectName}/backend`] = workspaceVersion;
    }

    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDependencies: webDeps,
      customDevDependencies: configDep,
      projectDir: webDir,
    });
  }

  if (nativeExists) {
    const nativeDeps: Record<string, string> = {};
    if (api !== "none" && apiExists) {
      nativeDeps[`@${projectName}/api`] = workspaceVersion;
    }
    if (backend === "convex" && backendExists) {
      nativeDeps[`@${projectName}/backend`] = workspaceVersion;
    }

    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDependencies: nativeDeps,
      customDevDependencies: configDep,
      projectDir: nativeDir,
    });
  }

  const runtimeDevDeps = getRuntimeDevDeps(runtime, backend);

  await addPackageDependency({
    dependencies: commonDeps,
    devDependencies: [...commonDevDeps, ...runtimeDevDeps],
    projectDir,
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
