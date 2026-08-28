import path from "node:path";

import { generate, EMBEDDED_TEMPLATES } from "@better-t-stack/template-generator";
import { writeTree } from "@better-t-stack/template-generator/fs-writer";
import { log } from "@clack/prompts";
import { Result } from "better-result";
import fs from "fs-extra";
import pc from "picocolors";

import type { DbSetupOptions, ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { ProjectCreationError } from "../../utils/errors";
import { formatProject } from "../../utils/file-formatter";
import { getLatestCLIVersion } from "../../utils/get-latest-cli-version";
import { setupAddons } from "../addons/addons-setup";
import { setupDatabase } from "../core/db-setup";
import { initializeGit } from "./git";
import { installDependencies } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";

export interface CreateProjectOptions {
  manualDb?: boolean;
  dbSetupOptions?: DbSetupOptions;
  packageManagerVersion: string;
}

export interface CreateProjectOutcome {
  projectDir: string;
  /** Set when the files were written but the dependency install failed. */
  installError: ProjectCreationError | null;
}

/**
 * Creates a new project with the given configuration.
 * Returns a Result with the outcome on success, or an error on failure. A failed dependency
 * install is not a failure: the project exists on disk, so it is reported as a warning.
 */
export async function createProject(
  options: ProjectConfig,
  cliInput: CreateProjectOptions,
): Promise<Result<CreateProjectOutcome, ProjectCreationError>> {
  return Result.gen(async function* () {
    const projectDir = options.projectDir;
    const isConvex = options.backend === "convex";

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
    yield* Result.await(
      setPackageManagerVersion(projectDir, options.packageManager, cliInput.packageManagerVersion),
    );

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
      yield* Result.await(
        Result.tryPromise({
          try: () => setupAddons(options),
          catch: (e) =>
            new ProjectCreationError({
              phase: "addons-setup",
              message: `Failed to setup addons: ${e instanceof Error ? e.message : String(e)}`,
              cause: e,
            }),
        }),
      );
    }

    // Format project
    yield* Result.await(formatProject(projectDir));

    if (!isSilent()) log.success("Project scaffolded");

    // Install dependencies if requested. The project is already on disk at this point, so a
    // failed install must not fail the run: warn, and the next steps below include the install.
    let installError: ProjectCreationError | null = null;
    if (options.install) {
      const installResult = await installDependencies({
        projectDir,
        packageManager: options.packageManager,
      });
      if (installResult.isErr()) {
        installError = installResult.error;
        if (!isSilent()) {
          log.warn(
            pc.yellow(
              `Dependencies were not installed. Run \`${options.packageManager} install\` in ${options.relativePath} and continue with the steps below.`,
            ),
          );
        }
      }
    }

    // Initialize git if requested
    yield* Result.await(initializeGit(projectDir, options.git));

    // Display post-install instructions
    if (!isSilent()) {
      await displayPostInstallInstructions({
        ...options,
        depsInstalled: options.install && installError === null,
      });
    }

    return Result.ok({ projectDir, installError });
  });
}

async function setPackageManagerVersion(
  projectDir: string,
  packageManager: ProjectConfig["packageManager"],
  version: string,
): Promise<Result<void, ProjectCreationError>> {
  const pkgJsonPath = path.join(projectDir, "package.json");

  if (!(await fs.pathExists(pkgJsonPath))) {
    return Result.ok(undefined);
  }

  return Result.tryPromise({
    try: async () => {
      const pkgJson = await fs.readJson(pkgJsonPath);
      pkgJson.packageManager = `${packageManager}@${version}`;
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
