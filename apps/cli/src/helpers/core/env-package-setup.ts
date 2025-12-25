import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupEnvPackageDependencies(
  envDir: string,
  options: ProjectConfig,
  configDep: Record<string, string>,
  infraDep: Record<string, string>,
) {
  const t3EnvDeps = getT3EnvDeps(options);
  const runtimeDevDeps = getRuntimeDevDeps(options.runtime, options.backend);

  await addPackageDependency({
    dependencies: t3EnvDeps,
    devDependencies: ["typescript", ...runtimeDevDeps],
    customDevDependencies: { ...configDep, ...infraDep },
    projectDir: envDir,
  });
}

function getT3EnvDeps(options: ProjectConfig): AvailableDependencies[] {
  const deps: AvailableDependencies[] = ["zod"];
  const { frontend, backend, runtime } = options;

  if (frontend.includes("next")) {
    deps.push("@t3-oss/env-nextjs");
  } else if (frontend.includes("nuxt")) {
    deps.push("@t3-oss/env-nuxt");
  } else {
    deps.push("@t3-oss/env-core");
  }

  const needsServerEnv = backend !== "convex" && backend !== "none" && runtime !== "workers";
  if (needsServerEnv && !deps.includes("@t3-oss/env-core")) {
    deps.push("@t3-oss/env-core");
  }

  return deps;
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
