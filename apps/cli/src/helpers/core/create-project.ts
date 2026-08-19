import path from "node:path";

import { generate, EMBEDDED_TEMPLATES } from "@better-t-stack/template-generator";
import { writeTree } from "@better-t-stack/template-generator/fs-writer";
import { log } from "@clack/prompts";
import { Result } from "better-result";
import fs from "fs-extra";

import type { AddedApp, DbSetupOptions, ProjectConfig } from "../../types";
import { readBtsConfig, updateBtsConfig } from "../../utils/bts-config";
import { isSilent } from "../../utils/context";
import { ProjectCreationError } from "../../utils/errors";
import { formatProject } from "../../utils/file-formatter";
import { getLatestCLIVersion } from "../../utils/get-latest-cli-version";
import { setupAddons } from "../addons/addons-setup";
import { setupDatabase } from "../core/db-setup";
import { addAppHandler, buildExtraAppsWiringNote } from "./add-app-handler";
import { initializeGit } from "./git";
import { installDependencies } from "./install-dependencies";
import { displayPostInstallInstructions } from "./post-installation";

export interface CreateProjectOptions {
  manualDb?: boolean;
  dbSetupOptions?: DbSetupOptions;
  packageManagerVersion: string;
  extraApps?: { name: string; frontend: AddedApp["frontend"] }[];
}

/**
 * Creates a new project with the given configuration.
 * Returns a Result with the project directory path on success, or an error on failure.
 */
export async function createProject(
  options: ProjectConfig,
  cliInput: CreateProjectOptions,
): Promise<Result<string, ProjectCreationError>> {
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

    // Scaffold extra frontend apps (--apps) before install and git so the
    // single install and the initial commit include them.
    const extraApps = cliInput.extraApps ?? [];
    if (extraApps.length > 0) {
      const addedApps: AddedApp[] = [];

      for (const app of extraApps) {
        const appResult = await addAppHandler(
          { projectDir, name: app.name, frontend: app.frontend, install: false },
          { silent: true },
        );
        const appPort = appResult?.success ? appResult.port : undefined;
        if (appPort === undefined) {
          yield* new ProjectCreationError({
            phase: "extra-apps",
            message: appResult?.error ?? `Failed to add app '${app.name}'.`,
          });
        } else {
          addedApps.push({ name: app.name, frontend: app.frontend, port: appPort });
        }
      }

      // Record --apps in the reproducible command now that the apps exist.
      const btsConfig = await readBtsConfig(projectDir);
      if (btsConfig?.reproducibleCommand) {
        const appSpecs = extraApps.map((app) => `${app.name}:${app.frontend}`).join(" ");
        await updateBtsConfig(projectDir, {
          reproducibleCommand: `${btsConfig.reproducibleCommand} --apps ${appSpecs}`,
        });
      }

      if (!isSilent()) {
        log.success(`Added ${addedApps.length} extra app${addedApps.length > 1 ? "s" : ""}`);
        log.message(
          buildExtraAppsWiringNote({
            apps: addedApps,
            backend: options.backend,
            auth: options.auth,
            webDeploy: options.webDeploy,
            serverDeploy: options.serverDeploy,
            packageManager: options.packageManager,
          }),
        );
      }
    }

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
