/**
 * Oxlint setup - CLI-only operations
 * NOTE: Dependencies are handled by template-generator's addons-deps.ts processor
 * This file only handles external CLI initialization (oxlint --init, oxfmt --init)
 */

import { spinner } from "@clack/prompts";
import { $ } from "execa";

import type { PackageManager } from "../../types";

import { getPackageExecutionArgs } from "../../utils/package-runner";

export async function setupOxlint(projectDir: string, packageManager: PackageManager) {
  // Dependencies (oxlint, oxfmt) and scripts are added by template-generator
  // This only runs the init CLIs

  const s = spinner();
  s.start("Initializing oxlint and oxfmt...");

  const oxlintArgs = getPackageExecutionArgs(packageManager, "oxlint@latest --init");
  await $({ cwd: projectDir, env: { CI: "true" } })`${oxlintArgs}`;

  const oxfmtArgs = getPackageExecutionArgs(packageManager, "oxfmt@latest --init");
  await $({ cwd: projectDir, env: { CI: "true" } })`${oxfmtArgs}`;

  s.stop("oxlint and oxfmt initialized successfully!");
}
