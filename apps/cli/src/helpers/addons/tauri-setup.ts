import { spinner } from "@clack/prompts";
import { getLocalWebDevPort } from "@better-fullstack/types";
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

    const hasNuxt = frontend.includes("nuxt");
    const hasSvelte = frontend.includes("svelte");
    const hasNext = frontend.includes("next");

    const devUrl = `http://localhost:${getLocalWebDevPort(frontend)}`;

    const frontendDist = hasNuxt
      ? "../.output/public"
      : hasSvelte
        ? "../build"
        : hasNext
        ? "../.next"
        : frontend.includes("react-router")
          ? "../build/client"
          : frontend.includes("react-vite")
            ? "../dist"
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
