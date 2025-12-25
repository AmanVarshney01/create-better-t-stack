import fs from "fs-extra";
import path from "node:path";

import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupWorkspaceDependencies(projectDir: string, options: ProjectConfig) {
  const { projectName, packageManager, database, auth, api, runtime, backend } = options;
  const workspaceVersion = packageManager === "npm" ? "*" : "workspace:*";

  const commonDeps: AvailableDependencies[] = ["dotenv", "zod"];
  const commonDevDeps: AvailableDependencies[] = ["typescript"];

  const configDir = path.join(projectDir, "packages/config");
  const envDir = path.join(projectDir, "packages/env");
  const dbDir = path.join(projectDir, "packages/db");
  const authDir = path.join(projectDir, "packages/auth");
  const apiDir = path.join(projectDir, "packages/api");
  const backendDir = path.join(projectDir, "packages/backend");
  const serverDir = path.join(projectDir, "apps/server");
  const webDir = path.join(projectDir, "apps/web");
  const nativeDir = path.join(projectDir, "apps/native");

  const [
    configExists,
    envExists,
    dbExists,
    authExists,
    apiExists,
    backendExists,
    serverExists,
    webExists,
    nativeExists,
  ] = await Promise.all([
    fs.pathExists(configDir),
    fs.pathExists(envDir),
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

  const envDep: Record<string, string> = envExists
    ? { [`@${projectName}/env`]: workspaceVersion }
    : {};

  if (envExists) {
    const runtimeDevDeps = getRuntimeDevDeps(runtime, backend);

    // Determine which T3 Env package to use based on frontend
    const t3EnvDeps: AvailableDependencies[] = ["zod"];
    const hasNextJs = options.frontend.includes("next");
    const hasNuxt = options.frontend.includes("nuxt");

    if (hasNextJs) {
      t3EnvDeps.push("@t3-oss/env-nextjs");
    } else if (hasNuxt) {
      t3EnvDeps.push("@t3-oss/env-nuxt");
    } else {
      t3EnvDeps.push("@t3-oss/env-core");
    }

    // Add core for server env if not using Nuxt (which handles it differently)
    if (backend !== "convex" && backend !== "none" && runtime !== "workers") {
      if (!t3EnvDeps.includes("@t3-oss/env-core")) {
        t3EnvDeps.push("@t3-oss/env-core");
      }
    }

    const envDevDeps: Record<string, string> = { ...configDep };
    const isCloudflare =
      options.serverDeploy === "cloudflare" || options.webDeploy === "cloudflare";
    if (isCloudflare) {
      envDevDeps[`@${projectName}/infra`] = workspaceVersion;
    }

    await addPackageDependency({
      dependencies: t3EnvDeps,
      devDependencies: [...commonDevDeps, ...runtimeDevDeps],
      customDevDependencies: envDevDeps,
      projectDir: envDir,
    });
  }

  if (dbExists) {
    await addPackageDependency({
      dependencies: commonDeps,
      devDependencies: commonDevDeps,
      customDependencies: envDep,
      customDevDependencies: configDep,
      projectDir: dbDir,
    });
  }

  if (authExists) {
    const authDeps: Record<string, string> = { ...envDep };
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
    const apiDeps: Record<string, string> = { ...envDep };
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
    const serverDeps: Record<string, string> = { ...envDep };
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
    const webDeps: Record<string, string> = { ...envDep };
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
    const nativeDeps: Record<string, string> = { ...envDep };
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
    customDependencies: envDep,
    customDevDependencies: configDep,
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
