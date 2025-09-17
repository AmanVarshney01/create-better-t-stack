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
		const supportedBetterAuthFrontends = frontend?.some((f) =>
			["tanstack-router", "tanstack-start", "next"].includes(f),
		);

		const hasClerkCompatibleFrontends = frontend?.some((f) =>
			[
				"react-router",
				"tanstack-router",
				"tanstack-start",
				"next",
				"native-nativewind",
				"native-unistyles",
			].includes(f),
		);

		const options = [];

		if (supportedBetterAuthFrontends) {
			options.push({
				value: "better-auth",
				label: "Better-Auth",
				hint: "comprehensive auth framework for TypeScript",
			});
		}

		if (hasClerkCompatibleFrontends) {
			options.push({
				value: "clerk",
				label: "Clerk",
				hint: "More than auth, Complete User Management",
			});
		}

		options.push({ value: "none", label: "None", hint: "No auth" });

		const response = await select({
			message: "Select authentication provider",
			options,
			initialValue: "none",
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
