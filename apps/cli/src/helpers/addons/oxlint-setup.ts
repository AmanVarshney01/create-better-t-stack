import path from "node:path";
import { $ } from "bun";
import fs from "fs-extra";
import type { PackageManager } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { log } from "../../utils/logger";

export async function setupOxlint(projectDir: string, packageManager: PackageManager) {
  await addPackageDependency({
    devDependencies: ["oxlint", "oxfmt"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      check: "oxlint && oxfmt --write",
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  log.step("Initializing oxlint and oxfmt...");

  const oxlintInitCommand = getPackageExecutionCommand(packageManager, "oxlint@latest --init");
  await $`${{ raw: oxlintInitCommand }}`.cwd(projectDir).env({ CI: "true" });

  const oxfmtInitCommand = getPackageExecutionCommand(packageManager, "oxfmt@latest --init");
  await $`${{ raw: oxfmtInitCommand }}`.cwd(projectDir).env({ CI: "true" });

  log.success("oxlint and oxfmt initialized successfully!");
}
