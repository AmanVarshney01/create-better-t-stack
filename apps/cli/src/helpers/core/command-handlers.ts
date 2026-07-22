import path from "node:path";

import { generateReproducibleCommand } from "@better-t-stack/template-generator";
import { intro, log, outro } from "@clack/prompts";
import { Result, UnhandledException } from "better-result";
import pc from "picocolors";

import { getDefaultConfig } from "../../constants";
import { gatherConfig } from "../../prompts/config-prompts";
import { getProjectName } from "../../prompts/project-name";
import type { CreateInput, DirectoryConflict, ProjectConfig } from "../../types";
import { trackProjectCreation } from "../../utils/analytics";
import { getCliSubcommandCommand } from "../../utils/cli-invocation";
import { validateAddonsAgainstFrontends } from "../../utils/compatibility-rules";
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
import { validateAgentSafePathInput } from "../../utils/input-hardening";
import {
  findAvailableIncrementedPath,
  handleDirectoryConflict,
  inspectProjectPath,
  setupProjectDirectory,
  validateSafeProjectDirectoryPath,
} from "../../utils/project-directory";
import { addToHistory } from "../../utils/project-history";
import { validateProjectName } from "../../utils/project-name-validation";
import { renderTitle } from "../../utils/render-title";
import { getTemplateConfig, getTemplateDescription } from "../../utils/templates";
import {
  getProvidedFlags,
  processAndValidateFlags,
  processProvidedFlagsWithoutValidation,
  validateConfigCompatibility,
} from "../../validation";
import { createProject } from "./create-project";
import { mergeResolvedDbSetupOptions } from "./db-setup-options";

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
    if (!isSilent()) intro(pc.magenta("Configure your new project"));

    if (!isSilent() && input.yolo) {
      log.warn(pc.yellow("YOLO mode enabled — compatibility checks are disabled."));
    }

    // Get project name
    let currentPathInput: string;
    if (isSilent()) {
      const silentProjectName = yield* Result.await(resolveProjectNameForSilent(input));
      currentPathInput = silentProjectName;
    } else if (input.yes && input.projectName) {
      currentPathInput = input.projectName;
    } else if (input.yes) {
      const defaultConfig = getDefaultConfig();
      let defaultName: string = defaultConfig.relativePath;
      const defaultPathState = yield* Result.await(
        inspectProjectPath(path.resolve(process.cwd(), defaultName)),
      );
      if (defaultPathState !== "missing" && defaultPathState !== "empty-directory") {
        defaultName = yield* Result.await(findAvailableIncrementedPath(defaultConfig.projectName));
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

    yield* validateResolvedProjectPathInput(currentPathInput);

    // Handle directory conflict
    let finalPathInput: string;
    let shouldClearDirectory: boolean;

    const conflictResult = yield* Result.await(
      handleDirectoryConflictResult(currentPathInput, input.directoryConflict),
    );
    finalPathInput = conflictResult.finalPathInput;
    shouldClearDirectory = conflictResult.shouldClearDirectory;
    yield* validateResolvedProjectPathInput(finalPathInput);
    yield* Result.await(validateSafeProjectDirectoryPath(finalPathInput));

    let finalResolvedPath: string;
    let finalBaseName: string;

    if (input.dryRun) {
      finalResolvedPath =
        finalPathInput === "." ? process.cwd() : path.resolve(process.cwd(), finalPathInput);
      finalBaseName = path.basename(finalResolvedPath);
    } else {
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
      finalResolvedPath = setupResult.finalResolvedPath;
      finalBaseName = setupResult.finalBaseName;
    }

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
          log.info(
            `${pc.dim("Template")} ${pc.bold(pc.cyan(templateName))}\n${pc.dim(templateDescription)}`,
          );
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
        log.info(pc.dim("Quick setup selected — using defaults and provided flags."));
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

      const isTemplateSetup = input.template && input.template !== "none";
      if (!isSilent() && !isTemplateSetup && Object.keys(otherFlags).length > 0) {
        log.info(pc.dim("Command-line options applied."));
      }

      // gatherConfig may throw UserCancelledError
      const gatherResult = yield* Result.await(
        Result.tryPromise({
          try: async () =>
            gatherConfig(flagConfig, finalBaseName, finalResolvedPath, finalPathInput, {
              skipCompatibilityChecks: cliInput.yolo,
            }),
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

    const effectiveDbSetupOptions = mergeResolvedDbSetupOptions(
      config.dbSetup,
      config.dbSetupOptions,
      {
        manualDb: cliInput.manualDb ?? input.manualDb,
        dbSetupOptions: cliInput.dbSetupOptions ?? input.dbSetupOptions,
      },
    );

    if (effectiveDbSetupOptions) {
      config = {
        ...config,
        dbSetupOptions: effectiveDbSetupOptions,
      };
    }

    if (!input.yolo) {
      const addonsValidationResult = validateAddonsAgainstFrontends(
        config.addons,
        config.frontend,
        config.auth,
        config.backend,
        config.runtime,
      );
      if (addonsValidationResult.isErr()) {
        return Result.err(new CLIError({ message: addonsValidationResult.error.message }));
      }
    }

    if (!isSilent()) {
      log.info(pc.magenta(pc.bold("Stack ready")));
      log.message(displayConfig(config));
    }

    const reproducibleCommand = generateReproducibleCommand(config);

    if (input.dryRun) {
      const elapsedTimeMs = Date.now() - startTime;

      if (!isSilent()) {
        if (shouldClearDirectory) {
          log.warn(
            pc.yellow(
              `Dry run: directory "${finalPathInput}" would be cleared due to overwrite strategy.`,
            ),
          );
        }
        log.success(pc.green("Configuration ready. No files were written."));
        log.message(pc.dim(`Target directory: ${finalResolvedPath}`));
        log.message(pc.dim(`Run without --dry-run to create the project.`));
        outro(pc.magenta("Dry run complete."));
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
    }

    // Create the project
    yield* Result.await(
      createProject(config, {
        manualDb: cliInput.manualDb ?? input.manualDb,
        dbSetupOptions: effectiveDbSetupOptions,
      }),
    );

    await trackProjectCreation(config, input.disableAnalytics);

    // Track locally in history.json (non-fatal)
    const historyResult = await addToHistory(config, reproducibleCommand);
    if (historyResult.isErr() && !isSilent()) {
      log.warn(pc.yellow(historyResult.error.message));
      log.message(`${pc.dim("Recreate this stack")}\n${pc.cyan(reproducibleCommand)}`);
    } else if (!isSilent()) {
      const historyCommand = getCliSubcommandCommand("history", config.packageManager);
      log.message(`${pc.dim("Setup saved to history")}\n${pc.cyan(historyCommand)}`);
    }

    const elapsedTimeMs = Date.now() - startTime;
    if (!isSilent()) {
      const elapsedTimeInSeconds = (elapsedTimeMs / 1000).toFixed(1);
      outro(pc.magenta(`Project ready in ${pc.bold(`${elapsedTimeInSeconds}s`)}`));
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

function isPathWithinCwd(targetPath: string) {
  const resolved = path.resolve(targetPath);
  const rel = path.relative(process.cwd(), resolved);
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

function validateResolvedProjectPathInput(candidate: string): Result<void, CLIError> {
  const hardeningResult = validateAgentSafePathInput(candidate, "projectName");
  if (hardeningResult.isErr()) {
    return Result.err(
      new CLIError({
        message: hardeningResult.error.message,
        cause: hardeningResult.error,
      }),
    );
  }

  if (candidate === ".") {
    return Result.ok(undefined);
  }

  const finalDirName = path.basename(candidate);
  const validationResult = validateProjectName(finalDirName);
  if (validationResult.isErr()) {
    return Result.err(
      new CLIError({
        message: validationResult.error.message,
        cause: validationResult.error,
      }),
    );
  }

  if (!isPathWithinCwd(candidate)) {
    return Result.err(
      new CLIError({
        message: "Project path must be within current directory",
      }),
    );
  }

  return Result.ok(undefined);
}

async function resolveProjectNameForSilent(
  input: CreateInput & { projectName?: string },
): Promise<Result<string, CLIError>> {
  const defaultConfig = getDefaultConfig();
  const rawProjectName = input.projectName?.trim() || undefined;
  const candidate = rawProjectName ?? defaultConfig.relativePath;
  return Result.ok(candidate);
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
): Promise<Result<DirectoryConflictResult, CLIError | DirectoryConflictError>> {
  const currentPath = path.resolve(process.cwd(), currentPathInput);
  const pathStateResult = await inspectProjectPath(currentPath);
  if (pathStateResult.isErr()) return Result.err(pathStateResult.error);
  const pathState = pathStateResult.value;

  if (pathState === "missing" || pathState === "empty-directory") {
    return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });
  }

  if (strategy === "increment") {
    const incrementResult = await findAvailableIncrementedPath(currentPathInput);
    if (incrementResult.isErr()) return Result.err(incrementResult.error);
    return Result.ok({ finalPathInput: incrementResult.value, shouldClearDirectory: false });
  }

  if (pathState === "symbolic-link") {
    return Result.err(
      new CLIError({
        message: `Project path "${currentPathInput}" is a symbolic link. Choose a real directory or use directoryConflict: "increment".`,
      }),
    );
  }
  if (pathState === "non-directory") {
    return Result.err(
      new CLIError({
        message: `Project path "${currentPathInput}" exists and is not a directory. Choose a different path or use directoryConflict: "increment".`,
      }),
    );
  }

  switch (strategy) {
    case "overwrite":
      return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: true });

    case "merge":
      return Result.ok({ finalPathInput: currentPathInput, shouldClearDirectory: false });

    case "error":
      return Result.err(new DirectoryConflictError({ directory: currentPathInput }));

    default:
      return Result.err(new DirectoryConflictError({ directory: currentPathInput }));
  }
}
