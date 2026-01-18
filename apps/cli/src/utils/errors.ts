import { cancel } from "@clack/prompts";
import { Result, TaggedError } from "better-result";
import consola from "consola";
import pc from "picocolors";

// ============================================================================
// Tagged Error Classes
// ============================================================================

/**
 * User cancelled the operation (e.g., Ctrl+C in prompts)
 */
export class UserCancelledError extends TaggedError("UserCancelledError")<{
  message: string;
}>() {
  constructor(args?: { message?: string }) {
    super({ message: args?.message ?? "Operation cancelled" });
  }
}

/**
 * General CLI error for validation failures, invalid flags, etc.
 */
export class CLIError extends TaggedError("CLIError")<{
  message: string;
  cause?: unknown;
}>() {}

/**
 * Validation error for config/flag validation failures
 */
export class ValidationError extends TaggedError("ValidationError")<{
  field?: string;
  value?: unknown;
  message: string;
}>() {
  constructor(args: { field?: string; value?: unknown; message: string }) {
    super(args);
  }
}

/**
 * Compatibility error for incompatible option combinations
 */
export class CompatibilityError extends TaggedError("CompatibilityError")<{
  options: string[];
  message: string;
}>() {
  constructor(args: { options: string[]; message: string }) {
    super(args);
  }
}

/**
 * Directory conflict error when target directory exists and is not empty
 */
export class DirectoryConflictError extends TaggedError("DirectoryConflictError")<{
  directory: string;
  message: string;
}>() {
  constructor(args: { directory: string }) {
    super({
      directory: args.directory,
      message: `Directory "${args.directory}" already exists and is not empty. Use directoryConflict: "overwrite", "merge", or "increment" to handle this.`,
    });
  }
}

/**
 * Project creation error for failures during scaffolding
 */
export class ProjectCreationError extends TaggedError("ProjectCreationError")<{
  phase: string;
  message: string;
  cause?: unknown;
}>() {
  constructor(args: { phase: string; message: string; cause?: unknown }) {
    super(args);
  }
}

/**
 * Database setup error for failures during database configuration
 */
export class DatabaseSetupError extends TaggedError("DatabaseSetupError")<{
  provider: string;
  message: string;
  cause?: unknown;
}>() {
  constructor(args: { provider: string; message: string; cause?: unknown }) {
    super(args);
  }
}

/**
 * Addon setup error for failures during addon configuration
 */
export class AddonSetupError extends TaggedError("AddonSetupError")<{
  addon: string;
  message: string;
  cause?: unknown;
}>() {
  constructor(args: { addon: string; message: string; cause?: unknown }) {
    super(args);
  }
}

// ============================================================================
// Error Type Unions
// ============================================================================

/**
 * All possible CLI errors
 */
export type AppError =
  | UserCancelledError
  | CLIError
  | ValidationError
  | CompatibilityError
  | DirectoryConflictError
  | ProjectCreationError
  | DatabaseSetupError
  | AddonSetupError;

// ============================================================================
// Result Helper Functions
// ============================================================================

/**
 * Create an error Result from a message string
 */
export function cliError(message: string): Result<never, CLIError> {
  return Result.err(new CLIError({ message }));
}

/**
 * Create a validation error Result
 */
export function validationError(
  message: string,
  field?: string,
  value?: unknown,
): Result<never, ValidationError> {
  return Result.err(new ValidationError({ message, field, value }));
}

/**
 * Create a compatibility error Result
 */
export function compatibilityError(
  message: string,
  options: string[],
): Result<never, CompatibilityError> {
  return Result.err(new CompatibilityError({ message, options }));
}

/**
 * Create a user cancelled error Result
 */
export function userCancelled(message?: string): Result<never, UserCancelledError> {
  return Result.err(new UserCancelledError({ message }));
}

/**
 * Create a directory conflict error Result
 */
export function directoryConflict(directory: string): Result<never, DirectoryConflictError> {
  return Result.err(new DirectoryConflictError({ directory }));
}

/**
 * Create a project creation error Result
 */
export function projectCreationError(
  phase: string,
  message: string,
  cause?: unknown,
): Result<never, ProjectCreationError> {
  return Result.err(new ProjectCreationError({ phase, message, cause }));
}

/**
 * Create a database setup error Result
 */
export function databaseSetupError(
  provider: string,
  message: string,
  cause?: unknown,
): Result<never, DatabaseSetupError> {
  return Result.err(new DatabaseSetupError({ provider, message, cause }));
}

/**
 * Create an addon setup error Result
 */
export function addonSetupError(
  addon: string,
  message: string,
  cause?: unknown,
): Result<never, AddonSetupError> {
  return Result.err(new AddonSetupError({ addon, message, cause }));
}

// ============================================================================
// Error Display Utilities
// ============================================================================

/**
 * Display an error to the user (for CLI mode)
 */
export function displayError(error: AppError): void {
  if (UserCancelledError.is(error)) {
    cancel(pc.red(error.message));
  } else {
    consola.error(pc.red(error.message));
  }
}

/**
 * Handle a Result error by displaying it and exiting (for CLI mode)
 */
export function handleResultError(error: AppError): never {
  displayError(error);
  process.exit(1);
}
