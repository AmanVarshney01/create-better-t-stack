import { cancel } from "@clack/prompts";
import consola from "consola";
import pc from "picocolors";

export function exitWithError(message: string): never {
  consola.error(pc.red(message));
  throw new Error(message);
}

export function exitCancelled(message = "Operation cancelled"): never {
  cancel(pc.red(message));
  throw new Error(message);
}

export function handleError(error: unknown, fallbackMessage?: string): never {
  const message = error instanceof Error ? error.message : fallbackMessage || String(error);
  consola.error(pc.red(message));
  throw new Error(message);
}
