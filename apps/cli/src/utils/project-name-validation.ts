import { Result } from "better-result";
import path from "node:path";

import { ProjectNameSchema } from "../types";
import { ValidationError } from "./errors";

type ValidationResult<T> = Result<T, ValidationError>;

export function validateProjectName(name: string): ValidationResult<void> {
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
