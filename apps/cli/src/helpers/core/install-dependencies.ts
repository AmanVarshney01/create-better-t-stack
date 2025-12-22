import consola from "consola";
import { $ } from "bun";
import pc from "picocolors";
import type { Addons, PackageManager } from "../../types";
import { log } from "../../utils/logger";

export async function installDependencies({
  projectDir,
  packageManager,
}: {
  projectDir: string;
  packageManager: PackageManager;
  addons?: Addons[];
}) {
  try {
    log.step(`Running ${packageManager} install...`);

    await $`${packageManager} install`.cwd(projectDir);

    log.success("Dependencies installed successfully");
  } catch (error) {
    log.error("Failed to install dependencies");
    if (error instanceof Error) {
      consola.error(pc.red(`Installation error: ${error.message}`));
    }
  }
}
