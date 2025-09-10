import { cancel } from "@clack/prompts";
import consola from "consola";
import pc from "picocolors";

function isProgrammatic() {
	return process.env.BTS_PROGRAMMATIC === "1";
}

export function exitWithError(message: string): never {
	consola.error(pc.red(message));
	if (isProgrammatic()) {
		throw new Error(message);
	}
	process.exit(1);
}

export function exitCancelled(message = "Operation cancelled"): never {
	cancel(pc.red(message));
	if (isProgrammatic()) {
		throw new Error(message);
	}
	process.exit(0);
}

export function handleError(error: unknown, fallbackMessage?: string): never {
	const message =
		error instanceof Error ? error.message : fallbackMessage || String(error);
	consola.error(pc.red(message));
	if (isProgrammatic()) {
		throw new Error(message);
	}
	process.exit(1);
}
