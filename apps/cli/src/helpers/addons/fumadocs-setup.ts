import path from "node:path";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { log } from "../../utils/logger";

type FumadocsTemplate =
  | "next-mdx"
  | "waku"
  | "react-router"
  | "react-router-spa"
  | "tanstack-start";

const TEMPLATE_VALUES: Record<FumadocsTemplate, string> = {
  "next-mdx": "+next+fuma-docs-mdx",
  waku: "waku",
  "react-router": "react-router",
  "react-router-spa": "react-router-spa",
  "tanstack-start": "tanstack-start",
};

export async function setupFumadocs(
  config: ProjectConfig,
  template: FumadocsTemplate = "next-mdx",
) {
  const { packageManager, projectDir } = config;

  try {
    log.info("Setting up Fumadocs...");

    const templateArg = TEMPLATE_VALUES[template];

    const commandWithArgs = `create-fumadocs-app@latest fumadocs --template ${templateArg} --src --pm ${packageManager} --no-git`;

    const fumadocsInitCommand = getPackageExecutionCommand(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    log.step("Running Fumadocs create command...");

    await $`${{ raw: fumadocsInitCommand }}`.cwd(appsDir).env({ CI: "true" });

    const fumadocsDir = path.join(projectDir, "apps", "fumadocs");
    const packageJsonPath = path.join(fumadocsDir, "package.json");

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = "fumadocs";

      if (packageJson.scripts?.dev) {
        packageJson.scripts.dev = `${packageJson.scripts.dev} --port=4000`;
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    log.success("Fumadocs setup complete!");
  } catch (error) {
    log.error("Failed to set up Fumadocs");
    if (error instanceof Error) {
      log.error(error.message);
    }
  }
}
