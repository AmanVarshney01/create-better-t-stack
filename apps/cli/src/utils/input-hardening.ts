import { Result } from "better-result";

import { ValidationError } from "./errors";

type ValidationResult = Result<void, ValidationError>;

function hasControlCharacters(value: string): boolean {
  for (const char of value) {
    const charCode = char.charCodeAt(0);
    if (charCode < 0x20 || charCode === 0x7f) {
      return true;
    }
  }
  return false;
}

function hardeningError(field: string, value: string, message: string): ValidationResult {
  return Result.err(
    new ValidationError({
      field,
      value,
      message,
    }),
  );
}

export function validateAgentSafePathInput(value: string, field: string): ValidationResult {
  if (hasControlCharacters(value)) {
    return hardeningError(field, value, `Invalid ${field}: control characters are not allowed.`);
  }

  return Result.ok(undefined);
}
