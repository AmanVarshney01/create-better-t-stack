import path from "node:path";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { log } from "../../utils/logger";

type WxtTemplate = "vanilla" | "vue" | "react" | "solid" | "svelte";

export async function setupWxt(config: ProjectConfig, template: WxtTemplate = "react") {
  const { packageManager, projectDir } = config;

  try {
    log.info("Setting up WXT...");

    const commandWithArgs = `wxt@latest init extension --template ${template} --pm ${packageManager}`;

    const wxtInitCommand = getPackageExecutionCommand(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    log.step("Running WXT init command...");

    await $`${{ raw: wxtInitCommand }}`.cwd(appsDir).env({ CI: "true" });

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

    log.success("WXT setup complete!");
  } catch (error) {
    log.error("Failed to set up WXT");
    if (error instanceof Error) {
      console.error(pc.red(error.message));
    }
  }
}
