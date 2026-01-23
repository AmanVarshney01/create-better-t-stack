import { spinner } from "@clack/prompts";
import consola from "consola";
import { $ } from "execa";
import pc from "picocolors";

import type { Addons, PackageManager } from "../../types";

export async function installDependencies({
  projectDir,
  packageManager,
}: {
  projectDir: string;
  packageManager: PackageManager;
  addons?: Addons[];
}) {
  const s = spinner();

  try {
    s.start(`Running ${packageManager} install...`);

    await $({
      cwd: projectDir,
      stderr: "inherit",
    })`${packageManager} install`;

    s.stop("Dependencies installed successfully");
  } catch (error) {
    s.stop(pc.red("Failed to install dependencies"));
    if (error instanceof Error) {
      consola.error(pc.red(`Installation error: ${error.message}`));
    }
  }
}

export async function runCargoBuild({ projectDir }: { projectDir: string }) {
  const s = spinner();

  try {
    s.start("Running cargo build...");

    await $({
      cwd: projectDir,
      stderr: "inherit",
    })`cargo build`;

    s.stop("Cargo build completed");
  } catch (error) {
    s.stop(pc.red("Cargo build failed"));
    if (error instanceof Error) {
      consola.error(pc.red(`Cargo build error: ${error.message}`));
    }
  }
}

export async function runUvSync({ projectDir }: { projectDir: string }) {
  const s = spinner();

  try {
    s.start("Running uv sync...");

    await $({
      cwd: projectDir,
      stderr: "inherit",
    })`uv sync`;

    s.stop("Python dependencies installed successfully");
  } catch (error) {
    s.stop(pc.red("uv sync failed"));
    if (error instanceof Error) {
      consola.error(pc.red(`uv sync error: ${error.message}`));
    }
  }
}
