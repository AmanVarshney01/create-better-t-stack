// Use unified generator from template-generator package
import { generateVirtualProject, EMBEDDED_TEMPLATES } from "@better-t-stack/template-generator";
import { writeTreeToFilesystem } from "@better-t-stack/template-generator/fs-writer";
import { log } from "@clack/prompts";
import fs from "fs-extra";

import type { ProjectConfig } from "../../types";

import { writeBtsConfig } from "../../utils/bts-config";
import { isSilent } from "../../utils/context";
import { exitWithError } from "../../utils/errors";
import { setupCatalogs } from "../../utils/setup-catalogs";
import { setupAddons } from "../addons/addons-setup";
import { setupExamples } from "../addons/examples-setup";
import { setupApi } from "../core/api-setup";
import { setupBackendDependencies } from "../core/backend-setup";
import { setupDatabase } from "../core/db-setup";
import { setupRuntime } from "../core/runtime-setup";
import { setupServerDeploy } from "../deployment/server-deploy-setup";
import { setupWebDeploy } from "../deployment/web-deploy-setup";
import { setupAuth } from "./auth-setup";
import { createReadme } from "./create-readme";
import { setupEnvPackageDependencies } from "./env-package-setup";
import { setupEnvironmentVariables } from "./env-setup";
import { initializeGit } from "./git";
import { setupInfraPackageDependencies } from "./infra-package-setup";
import { installDependencies } from "./install-dependencies";
import { setupPayments } from "./payments-setup";
import { displayPostInstallInstructions } from "./post-installation";
import { updatePackageConfigurations } from "./project-config";

export interface CreateProjectOptions {
  manualDb?: boolean;
}

export async function createProject(options: ProjectConfig, cliInput: CreateProjectOptions = {}) {
  const projectDir = options.projectDir;
  const isConvex = options.backend === "convex";
  const isSelfBackend = options.backend === "self";
  const needsServerSetup = !isConvex && !isSelfBackend;

  try {
    await fs.ensureDir(projectDir);

    // Generate all templates using unified generator
    const result = await generateVirtualProject({
      config: options,
      templates: EMBEDDED_TEMPLATES,
    });

    if (!result.success || !result.tree) {
      throw new Error(result.error || "Failed to generate project templates");
    }

    // Write generated files to disk
    await writeTreeToFilesystem(result.tree, projectDir);

    // Setup dependencies (these are NOT template operations, they modify package.json)
    await setupEnvPackageDependencies(projectDir, options);
    if (options.serverDeploy === "cloudflare" || options.webDeploy === "cloudflare") {
      await setupInfraPackageDependencies(projectDir, options);
    }

    await setupApi(options);

    if (isConvex || needsServerSetup) {
      await setupBackendDependencies(options);
    }

    if (!isConvex) {
      if (needsServerSetup) {
        await setupRuntime(options);
      }
      await setupDatabase(options, cliInput);
    }

    if (options.examples.length > 0 && options.examples[0] !== "none") {
      await setupExamples(options);
    }

    if (options.addons.length > 0 && options.addons[0] !== "none") {
      await setupAddons(options);
    }

    if (options.auth && options.auth !== "none") {
      await setupAuth(options);
    }

    if (options.payments && options.payments !== "none") {
      await setupPayments(options);
    }

    // Extras (pnpm-workspace, bunfig, npmrc) are now handled by the unified generator

    await setupEnvironmentVariables(options);
    await updatePackageConfigurations(projectDir, options);

    await setupWebDeploy(options);
    await setupServerDeploy(options);

    await setupCatalogs(projectDir, options);

    await createReadme(projectDir, options);

    await writeBtsConfig(options);

    if (!isSilent()) log.success("Project template successfully scaffolded!");

    if (options.install) {
      await installDependencies({
        projectDir,
        packageManager: options.packageManager,
      });
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
