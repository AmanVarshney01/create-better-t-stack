import path from "node:path";

import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";

import type { ProjectConfig } from "../../types";
import { AddonSetupError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";
import { createSpinner } from "../../utils/terminal-output";

export async function setupStarlight(
  config: ProjectConfig,
): Promise<Result<void, AddonSetupError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;
  const s = createSpinner();

  s.start("Setting up Starlight docs...");

  const starlightArgs = [
    "docs",
    "--template",
    "starlight",
    "--yes",
    "--no-install",
    "--no-git",
    "--skip-houston",
  ];
  const starlightArgsString = starlightArgs.join(" ");

  const commandWithArgs = `create-astro@latest ${starlightArgsString}`;
  const args = getPackageExecutionArgs(packageManager, commandWithArgs);

  const appsDir = path.join(projectDir, "apps");
  await fs.ensureDir(appsDir);

  const result = await Result.tryPromise({
    try: async () => {
      await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "starlight",
        message: `Failed to set up Starlight docs: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (result.isErr()) {
    s.stop("Failed to set up Starlight docs");
    return result;
  }

  s.stop("Starlight docs setup successfully!");
  return Result.ok(undefined);
}
