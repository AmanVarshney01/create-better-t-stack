import path from "node:path";
import { spinner } from "@clack/prompts";
import { $ } from "bun";
import fs from "fs-extra";
import type { PackageManager } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";

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

  const s = spinner();

  const oxlintInitCommand = getPackageExecutionCommand(packageManager, "oxlint@latest --init");
  s.start("Initializing oxlint and oxfmt...");
  await $`${{ raw: oxlintInitCommand }}`.cwd(projectDir).env({ CI: "true" });

  const oxfmtInitCommand = getPackageExecutionCommand(packageManager, "oxfmt@latest --init");
  await $`${{ raw: oxfmtInitCommand }}`.cwd(projectDir).env({ CI: "true" });
  s.stop("oxlint and oxfmt initialized successfully!");
}
