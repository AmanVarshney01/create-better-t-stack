import { cancel } from "@clack/prompts";
import consola from "consola";
import pc from "picocolors";

export class UserCancelledError extends Error {
  constructor(message = "Operation cancelled") {
    super(message);
    this.name = "UserCancelledError";
  }
}

export class CLIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CLIError";
  }
}

export function exitWithError(message: string): never {
  consola.error(pc.red(message));
  throw new CLIError(message);
}

export function exitCancelled(message = "Operation cancelled"): never {
  cancel(pc.red(message));
  throw new UserCancelledError(message);
}

export function handleError(error: unknown, fallbackMessage?: string): never {
  const message = error instanceof Error ? error.message : fallbackMessage || String(error);
  consola.error(pc.red(message));
  throw error instanceof Error ? error : new Error(message);
}
