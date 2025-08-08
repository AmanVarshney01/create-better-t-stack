import { cancel } from "@clack/prompts";
import { consola } from "consola";
import pc from "picocolors";

export function exitWithError(message: string): never {
	consola.error(pc.red(message));
	process.exit(1);
}

export function exitCancelled(message = "Operation cancelled"): never {
	cancel(pc.red(message));
	process.exit(0);
}

export function handleError(error: unknown, fallbackMessage?: string): never {
	const message =
		error instanceof Error ? error.message : fallbackMessage || String(error);
	consola.error(pc.red(message));
	process.exit(1);
}
