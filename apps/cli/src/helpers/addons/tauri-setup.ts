/**
 * Tauri setup - CLI-only operations
 * NOTE: Dependencies are handled by template-generator's addons-deps.ts processor
 * This file only handles external CLI initialization (tauri init)
 */

import { spinner } from "@clack/prompts";
import { consola } from "consola";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { getPackageRunnerPrefix } from "../../utils/package-runner";

export async function setupTauri(config: ProjectConfig) {
  const { packageManager, frontend, projectDir } = config;
  const s = spinner();
  const clientPackageDir = path.join(projectDir, "apps/web");

  if (!(await fs.pathExists(clientPackageDir))) {
    return;
  }

  try {
    s.start("Setting up Tauri desktop app support...");

    // Dependencies and scripts are added by template-generator
    // This only runs the tauri init CLI

    const hasReactRouter = frontend.includes("react-router");
    const hasNuxt = frontend.includes("nuxt");
    const hasSvelte = frontend.includes("svelte");
    const hasNext = frontend.includes("next");

    const devUrl =
      hasReactRouter || hasSvelte
        ? "http://localhost:5173"
        : hasNext
          ? "http://localhost:3001"
          : "http://localhost:3001";

    const frontendDist = hasNuxt
      ? "../.output/public"
      : hasSvelte
        ? "../build"
        : hasNext
          ? "../.next"
          : hasReactRouter
            ? "../build/client"
            : "../dist";

    const tauriArgs = [
      "@tauri-apps/cli@latest",
      "init",
      `--app-name=${path.basename(projectDir)}`,
      `--window-title=${path.basename(projectDir)}`,
      `--frontend-dist=${frontendDist}`,
      `--dev-url=${devUrl}`,
      `--before-dev-command=${packageManager} run dev`,
      `--before-build-command=${packageManager} run build`,
    ];
    const prefix = getPackageRunnerPrefix(packageManager);

    await $({ cwd: clientPackageDir, env: { CI: "true" } })`${[...prefix, ...tauriArgs]}`;

    s.stop("Tauri desktop app support configured successfully!");
  } catch (error) {
    s.stop(pc.red("Failed to set up Tauri"));
    if (error instanceof Error) {
      consola.error(pc.red(error.message));
    }
  }
}
