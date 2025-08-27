import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getAuthChoice(
	auth: Auth | undefined,
	hasDatabase: boolean,
	backend?: Backend,
) {
	if (backend === "convex") {
		return "none" as Auth;
	}

	if (!hasDatabase) return "none";

	if (auth !== undefined) return auth;

	const response = await select({
		message: "Select authentication provider",
		options: [
			{ value: "better-auth", label: "Better-Auth" },
			{ value: "clerk", label: "Clerk" },
			{ value: "none", label: "None" },
		],
		initialValue: DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response as Auth;
}
