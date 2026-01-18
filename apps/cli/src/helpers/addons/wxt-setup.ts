import { isCancel, log, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type WxtTemplate = "vanilla" | "vue" | "react" | "solid" | "svelte";

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

export async function setupWxt(config: ProjectConfig): Promise<WxtSetupResult> {
  const { packageManager, projectDir } = config;

  log.info("Setting up WXT...");

  const template = await select<WxtTemplate>({
    message: "Choose a template",
    options: Object.entries(TEMPLATES).map(([key, template]) => ({
      value: key as WxtTemplate,
      label: template.label,
      hint: template.hint,
    })),
    initialValue: "react",
  });

  if (isCancel(template)) {
    return userCancelled("Operation cancelled");
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
    return initResult;
  }

  const extensionDir = path.join(projectDir, "apps", "extension");
  const packageJsonPath = path.join(extensionDir, "package.json");

  const updatePackageResult = await Result.tryPromise({
    try: async () => {
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = "extension";

        if (packageJson.scripts?.dev) {
          packageJson.scripts.dev = `${packageJson.scripts.dev} --port 5555`;
        }

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "wxt",
        message: `Failed to update package.json: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (updatePackageResult.isErr()) {
    // Log but don't fail - the main setup succeeded
    log.warn(pc.yellow("WXT setup completed but failed to update package.json"));
  }

  s.stop("WXT setup complete!");
  return Result.ok(undefined);
}
