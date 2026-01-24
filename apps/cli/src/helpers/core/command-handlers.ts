import { generateReproducibleCommand } from "@better-t-stack/template-generator";
import { intro, log, outro } from "@clack/prompts";
import { Result, UnhandledException } from "better-result";
import consola from "consola";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { CreateInput, DirectoryConflict, ProjectConfig } from "../../types";

import { getDefaultConfig } from "../../constants";
import { gatherConfig } from "../../prompts/config-prompts";
import { getProjectName } from "../../prompts/project-name";
import { trackProjectCreation } from "../../utils/analytics";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { displayConfig } from "../../utils/display-config";
import {
  type AppError,
  CLIError,
  DirectoryConflictError,
  ProjectCreationError,
  UserCancelledError,
  displayError,
} from "../../utils/errors";
import { handleDirectoryConflict, setupProjectDirectory } from "../../utils/project-directory";
import { addToHistory } from "../../utils/project-history";
import { renderTitle } from "../../utils/render-title";
import { getTemplateConfig, getTemplateDescription } from "../../utils/templates";
import {
  getProvidedFlags,
  processAndValidateFlags,
  processProvidedFlagsWithoutValidation,
  validateConfigCompatibility,
} from "../../validation";
import { createProject } from "./create-project";

export interface CreateHandlerOptions {
  silent?: boolean;
}

/**
 * Result type for project creation
 */
export interface CreateProjectResult {
  success: boolean;
  projectConfig: ProjectConfig;
  reproducibleCommand: string;
  timeScaffolded: string;
  elapsedTimeMs: number;
  projectDirectory: string;
  relativePath: string;
  error?: string;
}

/**
 * Create an empty/failed result
 */
function createEmptyResult(
  timeScaffolded: string,
  elapsedTimeMs: number,
  error?: string,
): CreateProjectResult {
  return {
    success: false,
    projectConfig: {
      projectName: "",
      projectDir: "",
      relativePath: "",
      database: "none",
      orm: "none",
      backend: "none",
      runtime: "none",
      frontend: [],
      addons: [],
      examples: [],
      auth: "none",
      payments: "none",
      git: false,
      packageManager: "npm",
      install: false,
      dbSetup: "none",
      api: "none",
      webDeploy: "none",
      serverDeploy: "none",
    } satisfies ProjectConfig,
    reproducibleCommand: "",
    timeScaffolded,
    elapsedTimeMs,
    projectDirectory: "",
    relativePath: "",
    error,
  };
}

type CreateHandlerError =
  | UserCancelledError
  | CLIError
  | DirectoryConflictError
  | ProjectCreationError
  | UnhandledException;

export async function createProjectHandler(
  input: CreateInput & { projectName?: string },
  options: CreateHandlerOptions = {},
): Promise<CreateProjectResult | undefined> {
  const { silent = false } = options;

  return runWithContextAsync({ silent }, async () => {
    const startTime = Date.now();
    const timeScaffolded = new Date().toISOString();

    const result = await createProjectHandlerInternal(input, startTime, timeScaffolded);

    // Handle success case
    if (result.isOk()) {
      return result.value;
    }

    // Handle error cases
    const error = result.error;
    const elapsedTimeMs = Date.now() - startTime;

    // Handle user cancellation specially
    if (UserCancelledError.is(error)) {
      if (isSilent()) {
        return createEmptyResult(timeScaffolded, elapsedTimeMs, error.message);
      }
      // In CLI mode, just return undefined (the cancel UI was already shown)
      return undefined;
    }

    // For silent mode, always return a failed result instead of throwing
    if (isSilent()) {
      return createEmptyResult(timeScaffolded, elapsedTimeMs, error.message);
    }

    // In CLI mode, display error and exit
    displayError(error as AppError);
    process.exit(1);
  });
}

async function createProjectHandlerInternal(
  input: CreateInput & { projectName?: string },
  startTime: number,
  timeScaffolded: string,
): Promise<Result<CreateProjectResult, CreateHandlerError>> {
  return Result.gen(async function* () {
    if (!isSilent() && input.renderTitle !== false) {
      renderTitle();
    }
    if (!isSilent()) intro(pc.magenta("Creating a new Better-T-Stack project"));

    if (!isSilent() && input.yolo) {
      consola.fatal("YOLO mode enabled - skipping checks. Things may break!");
    }

    // Get project name
    let currentPathInput: string;
    if (input.yes && input.projectName) {
      currentPathInput = input.projectName;
    } else if (input.yes) {
      const defaultConfig = getDefaultConfig();
      let defaultName: string = defaultConfig.relativePath;
      let counter = 1;
      while (
        (await fs.pathExists(path.resolve(process.cwd(), defaultName))) &&
        (await fs.readdir(path.resolve(process.cwd(), defaultName))).length > 0
      ) {
        defaultName = `${defaultConfig.projectName}-${counter}`;
        counter++;
      }
      currentPathInput = defaultName;
    } else {
      // getProjectName may throw UserCancelledError
      const projectNameResult = yield* Result.await(
        Result.tryPromise({
          try: async () => getProjectName(input.projectName),
          catch: (e: unknown) => {
            if (e instanceof UserCancelledError) return e;
            return new CLIError({
              message: e instanceof Error ? e.message : String(e),
              cause: e,
            });
          },
        }),
      );
      currentPathInput = projectNameResult;
    }

    // Handle directory conflict
    let finalPathInput: string;
    let shouldClearDirectory: boolean;

    const conflictResult = yield* Result.await(
      handleDirectoryConflictResult(currentPathInput, input.directoryConflict),
    );
    finalPathInput = conflictResult.finalPathInput;
    shouldClearDirectory = conflictResult.shouldClearDirectory;

    // Setup project directory
    const setupResult = yield* Result.await(
      Result.tryPromise({
        try: async () => setupProjectDirectory(finalPathInput, shouldClearDirectory),
        catch: (e: unknown) => {
          if (e instanceof UserCancelledError) return e;
          return new CLIError({
            message: e instanceof Error ? e.message : String(e),
            cause: e,
          });
        },
      }),
    );
    const { finalResolvedPath, finalBaseName } = setupResult;

    const originalInput = {
      ...input,
      projectDirectory: input.projectName,
    };

    const providedFlags = getProvidedFlags(originalInput);

    let cliInput = originalInput;

    // Handle template
    if (input.template && input.template !== "none") {
      const templateConfig = getTemplateConfig(input.template);
      if (templateConfig) {
        const templateName = input.template.toUpperCase();
        const templateDescription = getTemplateDescription(input.template);
        if (!isSilent()) {
          log.message(pc.bold(pc.cyan(`Using template: ${pc.white(templateName)}`)));
          log.message(pc.dim(`   ${templateDescription}`));
        }
        const userOverrides: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(originalInput)) {
          if (value !== undefined) {
            userOverrides[key] = value;
          }
        }
        cliInput = {
          ...templateConfig,
          ...userOverrides,
          template: input.template,
          projectDirectory: originalInput.projectDirectory,
        };
      }
    }

    // Build config
    let config: ProjectConfig;
    if (cliInput.yes) {
      const flagConfigResult = processProvidedFlagsWithoutValidation(cliInput, finalBaseName);
      if (flagConfigResult.isErr()) {
        return Result.err(
          new CLIError({ message: flagConfigResult.error.message, cause: flagConfigResult.error }),
        );
      }
      const flagConfig = flagConfigResult.value;

      config = {
        ...getDefaultConfig(),
        ...flagConfig,
        projectName: finalBaseName,
        projectDir: finalResolvedPath,
        relativePath: finalPathInput,
      };

      // Validate config compatibility
      const validationResult = validateConfigCompatibility(config, providedFlags, cliInput);
      if (validationResult.isErr()) {
        return Result.err(
          new CLIError({ message: validationResult.error.message, cause: validationResult.error }),
        );
      }

      if (!isSilent()) {
        log.info(pc.yellow("Using default/flag options (config prompts skipped):"));
        log.message(displayConfig(config));
      }
    } else {
      // Process and validate flags
      const flagConfigResult = processAndValidateFlags(cliInput, providedFlags, finalBaseName);
      if (flagConfigResult.isErr()) {
        return Result.err(
          new CLIError({ message: flagConfigResult.error.message, cause: flagConfigResult.error }),
        );
      }
      const flagConfig = flagConfigResult.value;
      const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

      if (!isSilent() && Object.keys(otherFlags).length > 0) {
        log.info(pc.yellow("Using these pre-selected options:"));
        log.message(displayConfig(otherFlags));
        log.message("");
      }

      // gatherConfig may throw UserCancelledError
      const gatherResult = yield* Result.await(
        Result.tryPromise({
          try: async () =>
            gatherConfig(flagConfig, finalBaseName, finalResolvedPath, finalPathInput),
          catch: (e: unknown) => {
            if (e instanceof UserCancelledError) return e;
            return new CLIError({
              message: e instanceof Error ? e.message : String(e),
              cause: e,
            });
          },
        }),
      );
      config = gatherResult;
    }

    // Create the project
    yield* Result.await(
      createProject(config, {
        manualDb: cliInput.manualDb ?? input.manualDb,
      }),
    );

    const reproducibleCommand = generateReproducibleCommand(config);

    if (!isSilent()) {
      log.success(
        pc.blue(`You can reproduce this setup with the following command:\n${reproducibleCommand}`),
      );
    }

    await trackProjectCreation(config, input.disableAnalytics);

    // Track locally in ~/.bts/history.json
    await addToHistory(config, reproducibleCommand);

    const elapsedTimeMs = Date.now() - startTime;
    if (!isSilent()) {
      const elapsedTimeInSeconds = (elapsedTimeMs / 1000).toFixed(2);
      outro(
        pc.magenta(`Project created successfully in ${pc.bold(elapsedTimeInSeconds)} seconds!`),
      );
    }

    return Result.ok({
      success: true,
      projectConfig: config,
      reproducibleCommand,
      timeScaffolded,
      elapsedTimeMs,
      projectDirectory: config.projectDir,
      relativePath: config.relativePath,
    });
  });
}

interface DirectoryConflictResult {
  finalPathInput: string;
  shouldClearDirectory: boolean;
}

async function handleDirectoryConflictResult(
  currentPathInput: string,
  strategy?: DirectoryConflict,
): Promise<
  Result<DirectoryConflictResult, UserCancelledError | CLIError | DirectoryConflictError>
> {
  if (strategy) {
    return handleDirectoryConflictProgrammatically(currentPathInput, strategy);
  }

  // Use interactive handler
  return Result.tryPromise({
    try: async () => handleDirectoryConflict(currentPathInput),
    catch: (e: unknown) => {
      if (e instanceof UserCancelledError) return e;
      if (e instanceof CLIError) return e;
      return new CLIError({
        message: e instanceof Error ? e.message : String(e),
        cause: e,
      });
    },
  });
}

async function handleDirectoryConflictProgrammatically(
  currentPathInput: string,
  strategy: DirectoryConflict,
): Promise<Result<DirectoryConflictResult, DirectoryConflictError>> {
  const currentPath = path.resolve(process.cwd(), currentPathInput);

  if (!(await fs.pathExists(currentPath))) {
    return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });
  }

  const dirContents = await fs.readdir(currentPath);
  const isNotEmpty = dirContents.length > 0;

  if (!isNotEmpty) {
    return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });
  }

  switch (strategy) {
    case "overwrite":
      return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: true });

    case "merge":
      return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });

    case "increment": {
      let counter = 1;
      const baseName = currentPathInput;
      let finalPathInput = `${baseName}-${counter}`;

      while (
        (await fs.pathExists(path.resolve(process.cwd(), finalPathInput))) &&
        (await fs.readdir(path.resolve(process.cwd(), finalPathInput))).length > 0
      ) {
        counter++;
        finalPathInput = `${baseName}-${counter}`;
      }

      return Result.ok({ finalPathInput, shouldClearDirectory: false });
    }

    case "error":
      return Result.err(new DirectoryConflictError({ directory: currentPathInput }));

    default:
      return Result.err(new DirectoryConflictError({ directory: currentPathInput }));
  }
}
