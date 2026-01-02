import { cancel } from "@clack/prompts";
import consola from "consola";
import pc from "picocolors";

import { isSilent } from "./context";

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
  if (isSilent()) {
    throw new CLIError(message);
  }
  consola.error(pc.red(message));
  process.exit(1);
}

export function exitCancelled(message = "Operation cancelled"): never {
  if (isSilent()) {
    throw new UserCancelledError(message);
  }
  cancel(pc.red(message));
  process.exit(1);
}

export function handleError(error: unknown, fallbackMessage?: string): never {
  const message = error instanceof Error ? error.message : fallbackMessage || String(error);
  if (isSilent()) {
    throw error instanceof Error ? error : new Error(message);
  }
  consola.error(pc.red(message));
  process.exit(1);
}
