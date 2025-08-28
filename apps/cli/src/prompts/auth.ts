import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getAuthChoice(
	auth: Auth | undefined,
	hasDatabase: boolean,
	backend?: Backend,
	frontend?: string[],
) {
	if (auth !== undefined) return auth;
	if (backend === "convex") {
		const unsupportedFrontends = frontend?.filter((f) =>
			["nuxt", "svelte", "solid"].includes(f),
		);

		if (unsupportedFrontends && unsupportedFrontends.length > 0) {
			return "none";
		}

		const response = await select({
			message: "Select authentication provider",
			options: [
				{
					value: "clerk",
					label: "Clerk",
					hint: "More than auth, Complete User Management",
				},
				{ value: "none", label: "None" },
			],
			initialValue: "clerk",
		});
		if (isCancel(response)) return exitCancelled("Operation cancelled");
		return response as Auth;
	}

	if (!hasDatabase) return "none";

	const response = await select({
		message: "Select authentication provider",
		options: [
			{
				value: "better-auth",
				label: "Better-Auth",
				hint: "comprehensive auth framework for TypeScript",
			},
			{ value: "none", label: "None" },
		],
		initialValue: DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response as Auth;
}
