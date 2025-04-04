import { cancel, confirm, isCancel, log } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectFrontend } from "../types";

export async function getAuthChoice(
	auth: boolean | undefined,
	hasDatabase: boolean,
	frontends?: ProjectFrontend[],
): Promise<boolean> {
	if (!hasDatabase) return false;

	if (auth !== undefined) return auth;

	const response = await confirm({
		message: "Add authentication with Better-Auth?",
		initialValue: DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
