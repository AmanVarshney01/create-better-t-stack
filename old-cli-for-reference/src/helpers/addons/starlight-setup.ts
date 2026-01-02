import { spinner } from "@clack/prompts";
import consola from "consola";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { getPackageExecutionArgs } from "../../utils/package-runner";

export async function setupStarlight(config: ProjectConfig) {
  const { packageManager, projectDir } = config;
  const s = spinner();

  try {
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

    await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;

    s.stop("Starlight docs setup successfully!");
  } catch (error) {
    s.stop(pc.red("Failed to set up Starlight docs"));
    if (error instanceof Error) {
      consola.error(pc.red(error.message));
    }
  }
}
