import path from "node:path";

import { Result } from "better-result";

import { ProjectNameSchema } from "../types";
import { ValidationError } from "./errors";
import { validateAgentSafePathInput } from "./input-hardening";

type ValidationResult<T> = Result<T, ValidationError>;

export function validateProjectName(name: string): ValidationResult<void> {
  const hardeningResult = validateAgentSafePathInput(name, "projectName");
  if (hardeningResult.isErr()) {
    return Result.err(hardeningResult.error);
  }

  const result = ProjectNameSchema.safeParse(name);
  if (!result.success) {
    return Result.err(
      new ValidationError({
        field: "projectName",
        value: name,
        message: `Invalid project name: ${result.error.issues[0]?.message || "Invalid project name"}`,
      }),
    );
  }
  return Result.ok(undefined);
}

export function extractAndValidateProjectName(
  projectName?: string,
  projectDirectory?: string,
): ValidationResult<string> {
  if (projectName) {
    const projectNameInputResult = validateAgentSafePathInput(projectName, "projectName");
    if (projectNameInputResult.isErr()) {
      return Result.err(projectNameInputResult.error);
    }
  }

  if (projectDirectory) {
    const projectDirInputResult = validateAgentSafePathInput(projectDirectory, "projectDirectory");
    if (projectDirInputResult.isErr()) {
      return Result.err(projectDirInputResult.error);
    }
  }

  const derivedName =
    projectName ||
    (projectDirectory ? path.basename(path.resolve(process.cwd(), projectDirectory)) : "");

  if (!derivedName) {
    return Result.ok("");
  }

  const nameToValidate = projectName ? path.basename(projectName) : derivedName;

  const validationResult = validateProjectName(nameToValidate);
  if (validationResult.isErr()) {
    return Result.err(validationResult.error);
  }

  return Result.ok(projectName || derivedName);
}
