import path from "node:path";

import { isCancel, select } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

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

const DEFAULT_TEMPLATE: TuiTemplate = "core";
const TUI_LOCKFILES = ["bun.lock", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"] as const;

export function resolveTuiTemplate(config: ProjectConfig): TuiTemplate | undefined {
  const configuredTemplate = config.addonOptions?.opentui?.template;

  if (configuredTemplate) {
    return configuredTemplate;
  }

  if (isSilent()) {
    return DEFAULT_TEMPLATE;
  }

  return undefined;
}

export async function setupTui(config: ProjectConfig): Promise<TuiSetupResult> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;

  cliLog.info("Setting up OpenTUI...");

  let template = resolveTuiTemplate(config);

  if (!template) {
    const selectedTemplate = await select<TuiTemplate>({
      message: "Choose a template",
      options: Object.entries(TEMPLATES).map(([key, templateOption]) => ({
        value: key as TuiTemplate,
        label: templateOption.label,
        hint: templateOption.hint,
      })),
      initialValue: DEFAULT_TEMPLATE,
    });

    if (isCancel(selectedTemplate)) {
      return userCancelled("Operation cancelled");
    }

    template = selectedTemplate;
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

  const s = createSpinner();
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
    cliLog.error(pc.red("Failed to set up OpenTUI"));
    return initResult;
  }

  const postProcessResult = await postProcessTuiWorkspace(path.join(appsDir, "tui"));
  if (postProcessResult.isErr()) {
    s.stop(pc.yellow("OpenTUI setup completed with warnings"));
    cliLog.warn(pc.yellow("OpenTUI setup completed but workspace normalization had warnings"));
    return postProcessResult;
  }

  s.stop("OpenTUI setup complete!");
  return Result.ok(undefined);
}

export async function postProcessTuiWorkspace(
  tuiDir: string,
): Promise<Result<void, AddonSetupError | UserCancelledError>> {
  const packageJsonPath = path.join(tuiDir, "package.json");

  const packageJsonResult = await Result.tryPromise({
    try: async () => {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.scripts = packageJson.scripts || {};

      if (!packageJson.scripts["check-types"]) {
        packageJson.scripts["check-types"] = "tsc --noEmit";
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "tui",
        message: `Failed to normalize OpenTUI package.json: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (packageJsonResult.isErr()) {
    return packageJsonResult;
  }

  for (const lockfile of TUI_LOCKFILES) {
    const lockfilePath = path.join(tuiDir, lockfile);

    const removeLockfileResult = await Result.tryPromise({
      try: async () => {
        if (await fs.pathExists(lockfilePath)) {
          await fs.remove(lockfilePath);
        }
      },
      catch: (e) =>
        new AddonSetupError({
          addon: "tui",
          message: `Failed to remove nested OpenTUI lockfile '${lockfile}': ${e instanceof Error ? e.message : String(e)}`,
          cause: e,
        }),
    });

    if (removeLockfileResult.isErr()) {
      return removeLockfileResult;
    }
  }

  return Result.ok(undefined);
}
