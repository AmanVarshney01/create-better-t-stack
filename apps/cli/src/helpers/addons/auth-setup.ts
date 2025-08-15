import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupAuth(config: ProjectConfig) {
	const { auth, frontend, backend, projectDir } = config;
	if (backend === "convex" || !auth) {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	const clientDir = path.join(projectDir, "apps/web");
	const nativeDir = path.join(projectDir, "apps/native");

	const clientDirExists = await fs.pathExists(clientDir);
	const nativeDirExists = await fs.pathExists(nativeDir);
	const serverDirExists = await fs.pathExists(serverDir);

	try {
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
	} catch (error) {
		consola.error(pc.red("Failed to configure authentication dependencies"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
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
