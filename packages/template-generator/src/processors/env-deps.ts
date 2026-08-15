import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processEnvDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const envPath = "packages/env/package.json";
  if (!vfs.exists(envPath)) return;

  const { frontend, backend, runtime, webDeploy } = config;
  const deps: AvailableDependencies[] = ["zod"];
  const hasNative = frontend.some((value) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(value),
  );
  const hasNextJs = frontend.includes("next");
  const hasNuxt = frontend.includes("nuxt");

  if (hasNextJs) {
    deps.push("@t3-oss/env-nextjs");
  } else if (hasNuxt) {
    deps.push("@t3-oss/env-nuxt");
  }

  const needsCoreEnv = hasNative || (!hasNextJs && !hasNuxt);
  if (needsCoreEnv) {
    deps.push("@t3-oss/env-core");
  }

  const needsServerEnv = backend !== "convex" && backend !== "none" && runtime !== "workers";
  if (needsServerEnv && !deps.includes("@t3-oss/env-core")) {
    deps.push("@t3-oss/env-core");
  }

  if (backend === "self" && webDeploy === "cloudflare" && hasNextJs) {
    deps.push("@opennextjs/cloudflare");
  }

  addPackageDependency({ vfs, packagePath: envPath, dependencies: deps });
}
