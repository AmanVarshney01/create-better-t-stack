import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processEnvDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const envPath = "packages/env/package.json";
  if (!vfs.exists(envPath)) return;

  const { frontend, backend, runtime } = config;
  const deps: AvailableDependencies[] = ["zod"];

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

  addPackageDependency({ vfs, packagePath: envPath, dependencies: deps });
}
