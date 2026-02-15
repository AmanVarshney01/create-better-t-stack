import { generate, EMBEDDED_TEMPLATES } from "@better-t-stack/template-generator";
import { writeTree } from "@better-t-stack/template-generator/fs-writer";
import { log } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";

import type { ProjectConfig } from "../../types";
import type { AddonSetupContext, ExternalAddonStepReport } from "../addons/types";

import { isSilent } from "../../utils/context";
import { ProjectCreationError } from "../../utils/errors";
import { formatProject } from "../../utils/file-formatter";
import { getLatestCLIVersion } from "../../utils/get-latest-cli-version";
import { setupAddons } from "../addons/addons-setup";
import { writeExternalAddonManifest } from "../addons/external-manifest";
import { setupDatabase } from "../core/db-setup";
import { initializeGit } from "./git";
import { installDependencies } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";

export interface CreateProjectOptions {
  manualDb?: boolean;
  addonSetupContext?: AddonSetupContext;
  onExternalAddonReports?: (reports: ExternalAddonStepReport[]) => void;
}

/**
 * Creates a new project with the given configuration.
 * Returns a Result with the project directory path on success, or an error on failure.
 */
export async function createProject(
  options: ProjectConfig,
  cliInput: CreateProjectOptions = {},
): Promise<Result<string, ProjectCreationError>> {
  return Result.gen(async function* () {
    const projectDir = options.projectDir;
    const isConvex = options.backend === "convex";

    const externalReports: ExternalAddonStepReport[] = [];

    // Ensure project directory exists
    yield* Result.await(
      Result.tryPromise({
        try: () => fs.ensureDir(projectDir),
        catch: (e) =>
          new ProjectCreationError({
            phase: "directory-setup",
            message: `Failed to create project directory: ${e instanceof Error ? e.message : String(e)}`,
            cause: e,
          }),
      }),
    );

    // Generate virtual project using Result-based API
    const tree = yield* Result.await(
      generate({
        config: options,
        templates: EMBEDDED_TEMPLATES,
        version: getLatestCLIVersion(),
      }).then((result) =>
        result.mapError(
          (e) =>
            new ProjectCreationError({
              phase: e.phase || "template-generation",
              message: e.message,
              cause: e,
            }),
        ),
      ),
    );

    // Write tree to filesystem using Result-based API
    yield* Result.await(
      writeTree(tree, projectDir).then((result) =>
        result.mapError(
          (e) =>
            new ProjectCreationError({
              phase: "file-writing",
              message: e.message,
              cause: e,
            }),
        ),
      ),
    );

    // Set package manager version
    yield* Result.await(setPackageManagerVersion(projectDir, options.packageManager));

    // Setup database if needed
    if (!isConvex && options.database !== "none") {
      yield* Result.await(
        Result.tryPromise({
          try: () => setupDatabase(options, cliInput),
          catch: (e) =>
            new ProjectCreationError({
              phase: "database-setup",
              message: `Failed to setup database: ${e instanceof Error ? e.message : String(e)}`,
              cause: e,
            }),
        }),
      );
    }

    // Setup addons if any
    if (options.addons.length > 0 && options.addons[0] !== "none") {
      const baseSetupContext = cliInput.addonSetupContext ?? {};
      const setupContext: AddonSetupContext = {
        ...baseSetupContext,
        collectExternalReport: (report) => {
          externalReports.push(report);
          baseSetupContext.collectExternalReport?.(report);
        },
      };

      yield* Result.await(
        Result.tryPromise({
          try: () => setupAddons(options, setupContext),
          catch: (e) =>
            new ProjectCreationError({
              phase: "addons-setup",
              message: `Failed to setup addons: ${e instanceof Error ? e.message : String(e)}`,
              cause: e,
            }),
        }),
      );
    }

    yield* Result.await(
      Result.tryPromise({
        try: async () => {
          await writeExternalAddonManifest(projectDir, externalReports);
          cliInput.onExternalAddonReports?.(externalReports);
        },
        catch: (e) =>
          new ProjectCreationError({
            phase: "addons-manifest",
            message: `Failed to write external addon manifest: ${e instanceof Error ? e.message : String(e)}`,
            cause: e,
          }),
      }),
    );

    // Format project
    yield* Result.await(formatProject(projectDir));

    if (!isSilent()) log.success("Project template successfully scaffolded!");

    // Install dependencies if requested
    if (options.install) {
      yield* Result.await(
        installDependencies({
          projectDir,
          packageManager: options.packageManager,
        }),
      );
    }

    // Initialize git if requested
    yield* Result.await(initializeGit(projectDir, options.git));

    // Display post-install instructions
    if (!isSilent()) {
      await displayPostInstallInstructions({
        ...options,
        depsInstalled: options.install,
      });
    }

    return Result.ok(projectDir);
  });
}

async function setPackageManagerVersion(
  projectDir: string,
  packageManager: ProjectConfig["packageManager"],
): Promise<Result<void, ProjectCreationError>> {
  const pkgJsonPath = path.join(projectDir, "package.json");

  if (!(await fs.pathExists(pkgJsonPath))) {
    return Result.ok(undefined);
  }

  // First, try to get the version
  const versionResult = await Result.tryPromise({
    try: async () => {
      // Run in a neutral directory to avoid local package manager shims affecting lookup.
      const { stdout } = await $({ cwd: os.tmpdir() })`${packageManager} -v`;
      return stdout.trim();
    },
    catch: () => null, // Return null if we can't get version
  });

  // Now update the package.json
  return Result.tryPromise({
    try: async () => {
      const pkgJson = await fs.readJson(pkgJsonPath);

      if (versionResult.isOk() && versionResult.value) {
        pkgJson.packageManager = `${packageManager}@${versionResult.value}`;
      } else {
        // If we can't get the version, just remove the packageManager field
        delete pkgJson.packageManager;
      }

      await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "package-manager-version",
        message: `Failed to set package manager version: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}
