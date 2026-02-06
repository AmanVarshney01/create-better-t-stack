import { spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { AddonSetupError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageRunnerPrefix } from "../../utils/package-runner";

export async function setupTauri(config: ProjectConfig): Promise<Result<void, AddonSetupError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, frontend, projectDir } = config;
  const s = spinner();
  const clientPackageDir = path.join(projectDir, "apps/web");

  if (!(await fs.pathExists(clientPackageDir))) {
    return Result.ok(undefined);
  }

  s.start("Setting up Tauri desktop app support...");

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

  const result = await Result.tryPromise({
    try: async () => {
      await $({ cwd: clientPackageDir, env: { CI: "true" } })`${[...prefix, ...tauriArgs]}`;
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "tauri",
        message: `Failed to set up Tauri: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (result.isErr()) {
    s.stop("Failed to set up Tauri");
    return result;
  }

  s.stop("Tauri desktop app support configured successfully!");
  return Result.ok(undefined);
}
