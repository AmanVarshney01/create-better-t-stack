import { $ } from "execa";
import path from "node:path";

import type { PackageManager } from "../../types";

import { getPackageExecutionArgs } from "../../utils/package-runner";

// having problems running this in convex + better-auth
export async function runConvexCodegen(
  projectDir: string,
  packageManager: PackageManager | null | undefined,
) {
  const backendDir = path.join(projectDir, "packages/backend");
  const args = getPackageExecutionArgs(packageManager, "convex codegen");
  await $({ cwd: backendDir })`${args}`;
}
