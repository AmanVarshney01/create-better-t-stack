import path from "node:path";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { log } from "../../utils/logger";

export async function setupStarlight(config: ProjectConfig) {
  const { packageManager, projectDir } = config;

  try {
    log.step("Setting up Starlight docs...");

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

    const starlightInitCommand = getPackageExecutionCommand(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    await $`${{ raw: starlightInitCommand }}`.cwd(appsDir).env({ CI: "true" });

    log.success("Starlight docs setup successfully!");
  } catch (error) {
    log.error("Failed to set up Starlight docs");
    if (error instanceof Error) {
      log.error(error.message);
    }
  }
}
