import { spinner } from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";

import type { PackageManager } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionArgs } from "../../utils/package-runner";

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

  const oxlintArgs = getPackageExecutionArgs(packageManager, "oxlint@latest --init");
  s.start("Initializing oxlint and oxfmt...");
  await $({ cwd: projectDir, env: { CI: "true" } })`${oxlintArgs}`;

  const oxfmtArgs = getPackageExecutionArgs(packageManager, "oxfmt@latest --init");
  await $({ cwd: projectDir, env: { CI: "true" } })`${oxfmtArgs}`;
  s.stop("oxlint and oxfmt initialized successfully!");
}
