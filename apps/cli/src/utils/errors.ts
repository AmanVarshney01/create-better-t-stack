import consola from "consola";

export class CLIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CLIError";
  }
}

export class CancelledError extends Error {
  constructor(message = "Operation cancelled") {
    super(message);
    this.name = "CancelledError";
  }
}

export function exitWithError(message: string): never {
  consola.error(message);
  throw new CLIError(message);
}

export function exitCancelled(message = "Operation cancelled"): never {
  throw new CancelledError(message);
}

export function handleError(error: unknown, fallbackMessage?: string): never {
  const message = error instanceof Error ? error.message : fallbackMessage || String(error);
  consola.error(message);
  throw new CLIError(message);
}
