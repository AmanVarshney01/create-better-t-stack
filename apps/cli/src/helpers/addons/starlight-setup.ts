import { spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";
import type { AddonSetupContext } from "./types";

import { AddonSetupError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";

export async function setupStarlight(
  config: ProjectConfig,
  context: AddonSetupContext = {},
): Promise<Result<void, AddonSetupError>> {
  const emit = context.collectExternalReport;

  if (shouldSkipExternalCommands()) {
    emit?.({
      addon: "starlight",
      status: "skipped",
      warning: "Skipped because BTS_SKIP_EXTERNAL_COMMANDS or BTS_TEST_MODE is enabled.",
    });
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;
  const s = spinner();

  s.start("Setting up Starlight docs...");

  const starlightArgs = [
    "docs",
    "--template",
    "starlight",
    "--no-install",
    "--add",
    "tailwind",
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
    emit?.({
      addon: "starlight",
      status: "failed",
      commands: [args.join(" ")],
      postChecks: ["apps/docs exists"],
      error: result.error.message,
    });
    return result;
  }

  s.stop("Starlight docs setup successfully!");
  emit?.({
    addon: "starlight",
    status: "success",
    commands: [args.join(" ")],
    postChecks: ["apps/docs exists"],
  });
  return Result.ok(undefined);
}
