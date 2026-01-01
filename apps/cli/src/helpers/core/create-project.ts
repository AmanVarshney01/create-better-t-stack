// Use unified generator from template-generator package
import { generateVirtualProject, EMBEDDED_TEMPLATES } from "@better-t-stack/template-generator";
import { writeTreeToFilesystem } from "@better-t-stack/template-generator/fs-writer";
import { log } from "@clack/prompts";
import fs from "fs-extra";

import type { ProjectConfig } from "../../types";

import { setupBetterAuthPlugins } from "../../utils/better-auth-plugin-setup";
import { writeBtsConfig } from "../../utils/bts-config";
import { isSilent } from "../../utils/context";
import { exitWithError } from "../../utils/errors";
import { setupAddons } from "../addons/addons-setup";
import { setupExamples } from "../addons/examples-setup";
import { setupDatabase } from "../core/db-setup";
import { setupServerDeploy } from "../deployment/server-deploy-setup";
import { setupWebDeploy } from "../deployment/web-deploy-setup";
import { createReadme } from "./create-readme";
import { setupEnvironmentVariables } from "./env-setup";
import { initializeGit } from "./git";
import { installDependencies } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";

export interface CreateProjectOptions {
  manualDb?: boolean;
}

export async function createProject(options: ProjectConfig, cliInput: CreateProjectOptions = {}) {
  const projectDir = options.projectDir;
  const isConvex = options.backend === "convex";

  try {
    await fs.ensureDir(projectDir);

    // ==== Phase 1: Generate virtual project ====
    // Generator handles: templates, scripts, naming, catalogs, ALL dependencies
    const result = await generateVirtualProject({
      config: options,
      templates: EMBEDDED_TEMPLATES,
    });

    if (!result.success || !result.tree) {
      throw new Error(result.error || "Failed to generate project templates");
    }

    // ==== Phase 2: Write to disk ====
    await writeTreeToFilesystem(result.tree, projectDir);

    // ==== Phase 3: CLI-only operations (external CLIs, secrets, file mods) ====

    // Database provider setup (runs turso, neon, prisma-postgres CLIs)
    if (!isConvex && options.database !== "none") {
      await setupDatabase(options, cliInput);
    }

    // Examples may need external CLI setup
    if (options.examples.length > 0 && options.examples[0] !== "none") {
      await setupExamples(options);
    }

    // Addons may need external CLI setup (biome, starlight, etc.)
    if (options.addons.length > 0 && options.addons[0] !== "none") {
      await setupAddons(options);
    }

    // Better Auth plugin file modifications (CLI-only)
    if (options.auth === "better-auth" && !isConvex) {
      const authPackageDir = `${projectDir}/packages/auth`;
      if (await fs.pathExists(authPackageDir)) {
        await setupBetterAuthPlugins(projectDir, options);
      }
    }

    // Environment variables with generated secrets
    await setupEnvironmentVariables(options);

    // Deployment CLIs
    await setupWebDeploy(options);
    await setupServerDeploy(options);

    // README generation (TODO: port to generator)
    await createReadme(projectDir, options);

    // BTS config
    await writeBtsConfig(options);

    if (!isSilent()) log.success("Project template successfully scaffolded!");

    // ==== Phase 4: Post-scaffolding ====

    // Install dependencies
    if (options.install) {
      await installDependencies({
        projectDir,
        packageManager: options.packageManager,
      });
    }

    // Git init
    await initializeGit(projectDir, options.git);

    // Post-install instructions
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
