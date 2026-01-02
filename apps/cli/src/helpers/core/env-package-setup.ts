import fs from "fs-extra";
import path from "node:path";

import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupEnvPackageDependencies(projectDir: string, options: ProjectConfig) {
  const envDir = path.join(projectDir, "packages/env");
  if (!(await fs.pathExists(envDir))) return;

  const t3EnvDeps = getT3EnvDeps(options);

  await addPackageDependency({
    dependencies: t3EnvDeps,
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
