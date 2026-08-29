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
import {
  beginInterruptibleScope,
  endInterruptibleScope,
  getInterruptSignal,
  startInterruptibleStep,
  wasAnyStepInterrupted,
  wasInterrupted,
} from "../../utils/interrupt";
import { runOptionalStep } from "../../utils/optional-step";
import { cliLog } from "../../utils/terminal-output";
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
  install: "installed" | "skipped" | "cancelled" | "failed";
  installError: ProjectCreationError | null;
  interrupted: boolean;
}

/**
 * Creates a new project with the given configuration.
 * A failed dependency install is returned in the outcome instead of failing, since the project
 * is already on disk by then.
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

    // Files are on disk from here: Ctrl-C only stops the current step
    beginInterruptibleScope();
    try {
      return yield* runPostScaffoldSteps(options, cliInput, projectDir, isConvex);
    } finally {
      endInterruptibleScope();
    }
  });
}

async function* runPostScaffoldSteps(
  options: ProjectConfig,
  cliInput: CreateProjectOptions,
  projectDir: string,
  isConvex: boolean,
) {
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

  startInterruptibleStep();
  yield* Result.await(formatProject(projectDir, getInterruptSignal()));
  if (wasInterrupted()) cliLog.warn(pc.yellow("Formatting cancelled."));

  if (!isSilent()) log.success("Project scaffolded");

  // Install dependencies if requested
  let install: CreateProjectOutcome["install"] = "skipped";
  let installError: ProjectCreationError | null = null;
  if (options.install) {
    const installResult = await installDependencies({
      projectDir,
      packageManager: options.packageManager,
    });
    if (installResult.isErr()) {
      install = "failed";
      installError = installResult.error;
    } else {
      install = installResult.value;
    }
  }

  await runOptionalStep(
    () => initializeGit(projectDir, options.git, getInterruptSignal()),
    "Git initialization cancelled.",
  );

  // Display post-install instructions
  if (!isSilent()) {
    await displayPostInstallInstructions({
      ...options,
      depsInstalled: install === "installed",
    });
  }

  return Result.ok({ projectDir, install, installError, interrupted: wasAnyStepInterrupted() });
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
