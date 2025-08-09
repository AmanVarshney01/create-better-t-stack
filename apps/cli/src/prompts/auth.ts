import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getAuthChoice(
	auth: Auth | undefined,
	hasDatabase: boolean,
	backend?: Backend,
): Promise<Auth> {
	if (backend === "convex") {
		return "none" as const;
	}

	if (auth !== undefined) return auth;

	const response = await select<Auth, Auth>({
		message: "Choose an authentication provider:",
		options: [
			{
				value: "none",
				label: "No authentication",
				hint: "No authentication layer",
			},
			{
				value: "better-auth",
				label: "Better-Auth",
				hint: "Simple authentication with database",
				disabled: !hasDatabase,
			},
			{
				value: "clerk",
				label: "Clerk",
				hint: "Complete user management platform",
			},
		],
		initialValue: DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
