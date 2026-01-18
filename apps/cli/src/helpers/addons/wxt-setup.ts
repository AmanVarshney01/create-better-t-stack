import { isCancel, log, select, spinner } from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { UserCancelledError } from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type WxtTemplate = "vanilla" | "vue" | "react" | "solid" | "svelte";

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

export async function setupWxt(config: ProjectConfig) {
  const { packageManager, projectDir } = config;

  try {
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

    if (isCancel(template)) throw new UserCancelledError({ message: "Operation cancelled" });

    const commandWithArgs = `wxt@latest init extension --template ${template} --pm ${packageManager}`;
    const args = getPackageExecutionArgs(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    const s = spinner();
    s.start("Running WXT init command...");

    await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;

    const extensionDir = path.join(projectDir, "apps", "extension");
    const packageJsonPath = path.join(extensionDir, "package.json");

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = "extension";

      if (packageJson.scripts?.dev) {
        packageJson.scripts.dev = `${packageJson.scripts.dev} --port 5555`;
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    s.stop("WXT setup complete!");
  } catch (error) {
    log.error(pc.red("Failed to set up WXT"));
    if (error instanceof Error) {
      console.error(pc.red(error.message));
    }
  }
}
