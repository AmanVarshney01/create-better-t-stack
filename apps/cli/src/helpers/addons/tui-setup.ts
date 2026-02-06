import { isCancel, log, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type TuiTemplate = "core" | "react" | "solid";

type TuiSetupResult = Result<void, AddonSetupError | UserCancelledError>;

const TEMPLATES = {
  core: {
    label: "Core",
    hint: "Basic OpenTUI template",
  },
  react: {
    label: "React",
    hint: "React-based OpenTUI template",
  },
  solid: {
    label: "Solid",
    hint: "SolidJS-based OpenTUI template",
  },
} as const;

export async function setupTui(config: ProjectConfig): Promise<TuiSetupResult> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;

  log.info("Setting up OpenTUI...");

  const template = await select<TuiTemplate>({
    message: "Choose a template",
    options: Object.entries(TEMPLATES).map(([key, template]) => ({
      value: key as TuiTemplate,
      label: template.label,
      hint: template.hint,
    })),
    initialValue: "core",
  });

  if (isCancel(template)) {
    return userCancelled("Operation cancelled");
  }

  const commandWithArgs = `create-tui@latest --template ${template} --no-git --no-install tui`;
  const args = getPackageExecutionArgs(packageManager, commandWithArgs);

  const appsDir = path.join(projectDir, "apps");

  const ensureDirResult = await Result.tryPromise({
    try: () => fs.ensureDir(appsDir),
    catch: (e) =>
      new AddonSetupError({
        addon: "tui",
        message: `Failed to create directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (ensureDirResult.isErr()) {
    return ensureDirResult;
  }

  const s = spinner();
  s.start("Running OpenTUI create command...");

  const initResult = await Result.tryPromise({
    try: async () => {
      await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;
    },
    catch: (e) => {
      s.stop(pc.red("Failed to run OpenTUI create command"));
      return new AddonSetupError({
        addon: "tui",
        message: `Failed to set up OpenTUI: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });

  if (initResult.isErr()) {
    log.error(pc.red("Failed to set up OpenTUI"));
    return initResult;
  }

  s.stop("OpenTUI setup complete!");
  return Result.ok(undefined);
}
