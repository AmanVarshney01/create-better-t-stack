import { isCancel, log, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";
import type { AddonSetupContext, WxtTemplate } from "./types";

import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type WxtSetupResult = Result<void, AddonSetupError | UserCancelledError>;

const TEMPLATES = {
  vanilla: {
    label: "Vanilla",
    hint: "Vanilla JavaScript template",
  },
  vue: {
    label: "Vue",
    hint: "Vue.js template",
  },
  react: {
    label: "React",
    hint: "React template",
  },
  solid: {
    label: "Solid",
    hint: "SolidJS template",
  },
  svelte: {
    label: "Svelte",
    hint: "Svelte template",
  },
} as const;

export async function setupWxt(
  config: ProjectConfig,
  context: AddonSetupContext = {},
): Promise<WxtSetupResult> {
  const emit = context.collectExternalReport;

  if (shouldSkipExternalCommands()) {
    emit?.({
      addon: "wxt",
      status: "skipped",
      warning: "Skipped because BTS_SKIP_EXTERNAL_COMMANDS or BTS_TEST_MODE is enabled.",
    });
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;
  const isInteractive = context.interactive ?? true;

  log.info("Setting up WXT...");

  let template: WxtTemplate = context.addonOptions?.wxt?.template ?? "react";

  if (isInteractive) {
    const selectedTemplate = await select<WxtTemplate>({
      message: "Choose a template",
      options: Object.entries(TEMPLATES).map(([key, template]) => ({
        value: key as WxtTemplate,
        label: template.label,
        hint: template.hint,
      })),
      initialValue: template,
    });

    if (isCancel(selectedTemplate)) {
      return userCancelled("Operation cancelled");
    }

    template = selectedTemplate;
  }

  const commandWithArgs = `wxt@latest init extension --template ${template} --pm ${packageManager}`;
  const args = getPackageExecutionArgs(packageManager, commandWithArgs);

  const appsDir = path.join(projectDir, "apps");

  const ensureDirResult = await Result.tryPromise({
    try: () => fs.ensureDir(appsDir),
    catch: (e) =>
      new AddonSetupError({
        addon: "wxt",
        message: `Failed to create directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (ensureDirResult.isErr()) {
    return ensureDirResult;
  }

  const s = spinner();
  s.start("Running WXT init command...");

  const initResult = await Result.tryPromise({
    try: async () => {
      await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;
    },
    catch: (e) => {
      s.stop(pc.red("Failed to run WXT init command"));
      return new AddonSetupError({
        addon: "wxt",
        message: `Failed to set up WXT: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });

  if (initResult.isErr()) {
    log.error(pc.red("Failed to set up WXT"));
    emit?.({
      addon: "wxt",
      status: "failed",
      selectedOptions: { template },
      commands: [args.join(" ")],
      postChecks: [
        "apps/extension/package.json exists",
        "apps/extension/package.json scripts.dev uses --port 5555",
      ],
      error: initResult.error.message,
    });
    return initResult;
  }

  const extensionDir = path.join(projectDir, "apps", "extension");
  const packageJsonPath = path.join(extensionDir, "package.json");

  const updatePackageResult = await Result.tryPromise({
    try: async () => {
      if (!(await fs.pathExists(packageJsonPath))) {
        throw new AddonSetupError({
          addon: "wxt",
          message:
            "WXT generator did not create apps/extension/package.json. Upstream template shape may have changed.",
        });
      }

      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = "extension";

      if (packageJson.scripts?.dev) {
        packageJson.scripts.dev = `${packageJson.scripts.dev} --port 5555`;
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "wxt",
        message: `Failed to update package.json: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (updatePackageResult.isErr()) {
    log.warn(pc.yellow("WXT setup completed but failed to update package.json"));
    s.stop("WXT setup completed with warnings");
    emit?.({
      addon: "wxt",
      status: "warning",
      selectedOptions: { template },
      commands: [args.join(" ")],
      postChecks: [
        "apps/extension/package.json exists",
        "apps/extension/package.json scripts.dev uses --port 5555",
      ],
      warning: updatePackageResult.error.message,
    });
    return Result.ok(undefined);
  }

  s.stop("WXT setup complete!");
  emit?.({
    addon: "wxt",
    status: "success",
    selectedOptions: { template },
    commands: [args.join(" ")],
    postChecks: [
      "apps/extension/package.json exists",
      "apps/extension/package.json scripts.dev uses --port 5555",
    ],
  });
  return Result.ok(undefined);
}
