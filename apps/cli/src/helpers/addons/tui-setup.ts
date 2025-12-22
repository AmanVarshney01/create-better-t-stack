import path from "node:path";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { log } from "../../utils/logger";

type TuiTemplate = "core" | "react" | "solid";

export async function setupTui(config: ProjectConfig, template: TuiTemplate = "react") {
  const { packageManager, projectDir } = config;

  try {
    log.info("Setting up OpenTUI...");

    const commandWithArgs = `create-tui@latest --template ${template} --no-git --no-install tui`;

    const tuiInitCommand = getPackageExecutionCommand(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    log.step("Running OpenTUI create command...");

    await $`${{ raw: tuiInitCommand }}`.cwd(appsDir).env({ CI: "true" });

    log.success("OpenTUI setup complete!");
  } catch (error) {
    log.error("Failed to set up OpenTUI");
    if (error instanceof Error) {
      console.error(pc.red(error.message));
    }
  }
}
