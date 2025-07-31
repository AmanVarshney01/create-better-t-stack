import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getAuthProvider, hasAuth, isBetterAuth, isClerk } from "../../types";

export async function setupAuth(config: ProjectConfig) {
	const { auth, frontend, backend, projectDir } = config;
	const authProvider = getAuthProvider(auth);

	if (backend === "convex" || !hasAuth(auth)) {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	const clientDir = path.join(projectDir, "apps/web");
	const nativeDir = path.join(projectDir, "apps/native");

	const clientDirExists = await fs.pathExists(clientDir);
	const nativeDirExists = await fs.pathExists(nativeDir);
	const serverDirExists = await fs.pathExists(serverDir);

	try {
		if (isBetterAuth(auth)) {
			await setupBetterAuthDependencies(config, serverDirExists, clientDirExists, nativeDirExists, serverDir, clientDir, nativeDir);
		} else if (isClerk(auth)) {
			await setupClerkDependencies(config, serverDirExists, clientDirExists, nativeDirExists, serverDir, clientDir, nativeDir);
		}
	} catch (error) {
		consola.error(pc.red("Failed to configure authentication dependencies"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
	}
}

async function setupBetterAuthDependencies(
	config: ProjectConfig,
	serverDirExists: boolean,
	clientDirExists: boolean,
	nativeDirExists: boolean,
	serverDir: string,
	clientDir: string,
	nativeDir: string,
) {
	const { frontend } = config;

	if (serverDirExists) {
		await addPackageDependency({
			dependencies: ["better-auth"],
			projectDir: serverDir,
		});
	}

	const hasWebFrontend = frontend.some((f) =>
		[
			"react-router",
			"tanstack-router",
			"tanstack-start",
			"next",
			"nuxt",
			"svelte",
			"solid",
		].includes(f),
	);

	if (hasWebFrontend && clientDirExists) {
		await addPackageDependency({
			dependencies: ["better-auth"],
			projectDir: clientDir,
		});
	}

	if (
		(frontend.includes("native-nativewind") ||
			frontend.includes("native-unistyles")) &&
		nativeDirExists
	) {
		await addPackageDependency({
			dependencies: ["better-auth", "@better-auth/expo"],
			projectDir: nativeDir,
		});
		if (serverDirExists) {
			await addPackageDependency({
				dependencies: ["@better-auth/expo"],
				projectDir: serverDir,
			});
		}
	}
}

async function setupClerkDependencies(
	config: ProjectConfig,
	serverDirExists: boolean,
	clientDirExists: boolean,
	nativeDirExists: boolean,
	serverDir: string,
	clientDir: string,
	nativeDir: string,
) {
	const { frontend } = config;

	// For Next.js, install @clerk/nextjs
	if (frontend.includes("next")) {
		if (serverDirExists) {
			await addPackageDependency({
				dependencies: ["@clerk/nextjs"],
				projectDir: serverDir,
			});
		}
		if (clientDirExists) {
			await addPackageDependency({
				dependencies: ["@clerk/nextjs"],
				projectDir: clientDir,
			});
		}
	} else {
		// For other web frameworks, install @clerk/clerk-react or @clerk/clerk-js
		const hasWebFrontend = frontend.some((f) =>
			[
				"react-router",
				"tanstack-router",
				"tanstack-start",
				"nuxt",
				"svelte",
				"solid",
			].includes(f),
		);

		if (hasWebFrontend && clientDirExists) {
			const isReactBased = frontend.some((f) =>
				["react-router", "tanstack-router", "tanstack-start"].includes(f),
			);

			if (isReactBased) {
				await addPackageDependency({
					dependencies: ["@clerk/clerk-react"],
					projectDir: clientDir,
				});
			} else {
				await addPackageDependency({
					dependencies: ["@clerk/clerk-js"],
					projectDir: clientDir,
				});
			}
		}
	}

	// For React Native, install @clerk/expo
	if (
		(frontend.includes("native-nativewind") ||
			frontend.includes("native-unistyles")) &&
		nativeDirExists
	) {
		await addPackageDependency({
			dependencies: ["@clerk/expo"],
			projectDir: nativeDir,
		});
	}
}

export function generateAuthSecret(length = 32): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
