import { generateVirtualProject, EMBEDDED_TEMPLATES } from "@better-fullstack/template-generator";
import { writeTreeToFilesystem } from "@better-fullstack/template-generator/fs-writer";
import { log } from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { writeBtsConfig } from "../../utils/bts-config";
import { isSilent } from "../../utils/context";
import { exitWithError } from "../../utils/errors";
import { formatProject } from "../../utils/file-formatter";
import { setupAddons } from "../addons/addons-setup";
import { setupDatabase } from "../core/db-setup";
import { initializeGit } from "./git";
import { installDependencies, runCargoBuild } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";

export interface CreateProjectOptions {
  manualDb?: boolean;
}

export async function createProject(options: ProjectConfig, cliInput: CreateProjectOptions = {}) {
  const projectDir = options.projectDir;
  const isConvex = options.backend === "convex";

  try {
    await fs.ensureDir(projectDir);

    const result = await generateVirtualProject({
      config: options,
      templates: EMBEDDED_TEMPLATES,
    });

    if (!result.success || !result.tree) {
      throw new Error(result.error || "Failed to generate project templates");
    }

    await writeTreeToFilesystem(result.tree, projectDir);
    await setPackageManagerVersion(projectDir, options.packageManager);

    if (!isConvex && options.database !== "none") {
      await setupDatabase(options, cliInput);
    }

    if (options.addons.length > 0 && options.addons[0] !== "none") {
      await setupAddons(options);
    }

    await writeBtsConfig(options);

    await formatProject(projectDir);

    if (!isSilent()) log.success("Project template successfully scaffolded!");

    // Skip npm/pnpm/bun install for Rust projects (they use cargo)
    if (options.install && options.ecosystem !== "rust") {
      await installDependencies({
        projectDir,
        packageManager: options.packageManager,
      });
    }

    // Run cargo build for Rust projects
    if (options.install && options.ecosystem === "rust") {
      await runCargoBuild({ projectDir });
    }

    await initializeGit(projectDir, options.git);

    if (!isSilent()) {
      await displayPostInstallInstructions({
        ...options,
        depsInstalled: options.install,
      });
    }

    return projectDir;
  } catch (error) {
    if (error instanceof Error) {
      if (!isSilent()) console.error(error.stack);
      exitWithError(`Error during project creation: ${error.message}`);
    } else {
      if (!isSilent()) console.error(error);
      exitWithError(`An unexpected error occurred: ${String(error)}`);
    }
  }
}

async function setPackageManagerVersion(
  projectDir: string,
  packageManager: ProjectConfig["packageManager"],
): Promise<void> {
  const pkgJsonPath = path.join(projectDir, "package.json");
  if (!(await fs.pathExists(pkgJsonPath))) return;

  try {
    const { stdout } = await $`${packageManager} -v`;
    const version = stdout.trim();
    const pkgJson = await fs.readJson(pkgJsonPath);
    pkgJson.packageManager = `${packageManager}@${version}`;
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  } catch {
    const pkgJson = await fs.readJson(pkgJsonPath);
    delete pkgJson.packageManager;
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }
}
