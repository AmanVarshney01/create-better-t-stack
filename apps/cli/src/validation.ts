import { Result } from "better-result";

import type { CLIInput, ProjectConfig } from "./types";

import { getProvidedFlags, processFlags, validateArrayOptions } from "./utils/config-processing";
import { validateConfigForProgrammaticUse, validateFullConfig } from "./utils/config-validation";
import { ValidationError } from "./utils/errors";
import { extractAndValidateProjectName } from "./utils/project-name-validation";

type ValidationResult<T> = Result<T, ValidationError>;

const CORE_STACK_FLAGS = new Set([
  "database",
  "orm",
  "backend",
  "runtime",
  "frontend",
  "addons",
  "examples",
  "auth",
  "dbSetup",
  "payments",
  "api",
  "webDeploy",
  "serverDeploy",
]);

function validateYesFlagCombination(
  options: CLIInput,
  providedFlags: Set<string>,
): ValidationResult<void> {
  if (!options.yes) return Result.ok(undefined);

  if (options.template && options.template !== "none") {
    return Result.ok(undefined);
  }

  const coreStackFlagsProvided = Array.from(providedFlags).filter((flag) =>
    CORE_STACK_FLAGS.has(flag),
  );

  if (coreStackFlagsProvided.length > 0) {
    return Result.err(
      new ValidationError({
        message:
          `Cannot combine --yes with core stack configuration flags: ${coreStackFlagsProvided.map((f) => `--${f}`).join(", ")}. ` +
          "The --yes flag uses default configuration. Remove these flags or use --yes without them.",
      }),
    );
  }

  return Result.ok(undefined);
}

export function processAndValidateFlags(
  options: CLIInput,
  providedFlags: Set<string>,
  projectName?: string,
): ValidationResult<Partial<ProjectConfig>> {
  if (options.yolo) {
    const cfg = processFlags(options, projectName);
    const validatedProjectNameResult = extractAndValidateProjectName(
      projectName,
      options.projectDirectory,
    );
    if (validatedProjectNameResult.isOk() && validatedProjectNameResult.value) {
      cfg.projectName = validatedProjectNameResult.value;
    }
    return Result.ok(cfg);
  }

  const yesFlagResult = validateYesFlagCombination(options, providedFlags);
  if (yesFlagResult.isErr()) {
    return Result.err(yesFlagResult.error);
  }

  try {
    validateArrayOptions(options);
  } catch (error) {
    return Result.err(
      new ValidationError({
        message: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  const config = processFlags(options, projectName);

  const validatedProjectNameResult = extractAndValidateProjectName(
    projectName,
    options.projectDirectory,
  );
  if (validatedProjectNameResult.isErr()) {
    return Result.err(validatedProjectNameResult.error);
  }
  if (validatedProjectNameResult.value) {
    config.projectName = validatedProjectNameResult.value;
  }

  const fullConfigResult = validateFullConfig(config, providedFlags, options);
  if (fullConfigResult.isErr()) {
    return Result.err(fullConfigResult.error);
  }

  return Result.ok(config);
}

export function processProvidedFlagsWithoutValidation(
  options: CLIInput,
  projectName?: string,
): ValidationResult<Partial<ProjectConfig>> {
  if (!options.yolo) {
    const providedFlags = getProvidedFlags(options);
    const yesFlagResult = validateYesFlagCombination(options, providedFlags);
    if (yesFlagResult.isErr()) {
      return Result.err(yesFlagResult.error);
    }
  }

  const config = processFlags(options, projectName);

  const validatedProjectNameResult = extractAndValidateProjectName(
    projectName,
    options.projectDirectory,
  );
  if (validatedProjectNameResult.isErr()) {
    return Result.err(validatedProjectNameResult.error);
  }
  if (validatedProjectNameResult.value) {
    config.projectName = validatedProjectNameResult.value;
  }

  return Result.ok(config);
}

export function validateConfigCompatibility(
  config: Partial<ProjectConfig>,
  providedFlags?: Set<string>,
  options?: CLIInput,
): ValidationResult<void> {
  if (options?.yolo) return Result.ok(undefined);
  if (options && providedFlags) {
    return validateFullConfig(config, providedFlags, options);
  } else {
    return validateConfigForProgrammaticUse(config);
  }
}

export { getProvidedFlags };
