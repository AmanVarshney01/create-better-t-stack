import { confirm, isCancel } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getAuthChoice(
	auth: boolean | undefined,
	hasDatabase: boolean,
	backend?: Backend,
) {
	if (backend === "convex") {
		return false;
	}

	if (!hasDatabase) return false;

	if (auth !== undefined) return auth;

	const response = await confirm({
		message: "Add authentication with Better-Auth?",
		initialValue: DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
