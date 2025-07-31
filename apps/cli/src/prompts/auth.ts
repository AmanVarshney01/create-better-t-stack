import { cancel, confirm, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { AuthProvider, Backend } from "../types";
import { getAuthProvider } from "../types";

export async function getAuthChoice(
	auth: AuthProvider | boolean | undefined,
	hasDatabase: boolean,
	backend?: Backend,
): Promise<AuthProvider> {
	if (backend === "convex") {
		return "none";
	}

	// If auth is already specified, normalize it to AuthProvider
	if (auth !== undefined) {
		return getAuthProvider(auth);
	}

	// First ask if they want authentication at all
	const wantsAuth = await confirm({
		message: "Add authentication to your project?",
		initialValue: true,
	});

	if (isCancel(wantsAuth)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if (!wantsAuth) {
		return "none";
	}

	// If they want auth, ask which provider
	const authProvider = await select({
		message: "Choose your authentication provider:",
		options: [
			{
				value: "better-auth",
				label: "Better-Auth",
				hint: "Simple, flexible authentication for TypeScript",
			},
			{
				value: "clerk",
				label: "Clerk",
				hint: "Complete authentication and user management platform",
			},
		],
		initialValue: "better-auth",
	});

	if (isCancel(authProvider)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	// For Clerk, database is not required
	if (authProvider === "clerk") {
		return "clerk";
	}

	// For Better-Auth, check if database is available
	if (authProvider === "better-auth" && !hasDatabase) {
		cancel(pc.red("Better-Auth requires a database. Please select a database first."));
		process.exit(0);
	}

	return authProvider as AuthProvider;
}
