import path from "node:path";

import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";

import type { PackageManager } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { AddonSetupError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";
import { createSpinner } from "../../utils/terminal-output";

export async function setupOxlint(
  projectDir: string,
  packageManager: PackageManager,
): Promise<Result<void, AddonSetupError>> {
  return Result.tryPromise({
    try: async () => {
      await addPackageDependency({
        devDependencies: ["oxlint", "oxfmt"],
        projectDir,
      });

      const packageJsonPath = path.join(projectDir, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);

        packageJson.scripts = {
          ...packageJson.scripts,
          check: "oxlint && oxfmt --write",
        };

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }

      if (shouldSkipExternalCommands()) {
        return;
      }

      const s = createSpinner();

      try {
        s.start("Initializing oxlint and oxfmt...");

        const oxlintArgs = getPackageExecutionArgs(packageManager, "oxlint@latest --init");
        await $({ cwd: projectDir, env: { CI: "true" } })`${oxlintArgs}`;

        const oxfmtArgs = getPackageExecutionArgs(packageManager, "oxfmt@latest --init");
        await $({ cwd: projectDir, env: { CI: "true" } })`${oxfmtArgs}`;

        s.stop("oxlint and oxfmt initialized successfully!");
      } catch (error) {
        s.stop("Failed to initialize oxlint and oxfmt");
        throw error;
      }
    },
    catch: (error) =>
      new AddonSetupError({
        addon: "oxlint",
        message: `Failed to set up oxlint: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      }),
  });
}
