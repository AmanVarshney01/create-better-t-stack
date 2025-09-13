import path from "node:path";
import { spinner } from "@clack/prompts";
import { consola } from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupT3Env(config: ProjectConfig) {
	const { frontend, backend, projectDir } = config;
	const s = spinner();

	// T3 Env requires a backend to be present
	if (backend === "none") {
		s.stop(pc.yellow("T3 Env requires a backend to be configured"));
		return;
	}

	try {
		s.start("Setting up T3 Env for type-safe environment variables...");

		// Add dependencies to server
		const serverDir = path.join(projectDir, "apps/server");
		if (await fs.pathExists(serverDir)) {
			await addPackageDependency({
				dependencies: ["@t3-oss/env-core", "zod"],
				projectDir: serverDir,
			});
		}

		// Add framework-specific dependencies to web app
		const webDir = path.join(projectDir, "apps/web");
		if (await fs.pathExists(webDir)) {
			const hasNext = frontend.includes("next");
			const hasNuxt = frontend.includes("nuxt");

			if (hasNext) {
				await addPackageDependency({
					dependencies: ["@t3-oss/env-nextjs"],
					projectDir: webDir,
				});
			} else if (hasNuxt) {
				// For Nuxt, we'll use the core package
				await addPackageDependency({
					dependencies: ["@t3-oss/env-nuxt", "zod"],
					projectDir: webDir,
				});
			} else {
				// For other frameworks, use the core package
				await addPackageDependency({
					dependencies: ["@t3-oss/env-core", "zod"],
					projectDir: webDir,
				});
			}
		}

		s.stop("T3 Env configured successfully!");
	} catch (error) {
		s.stop(pc.red("Failed to set up T3 Env"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
	}
}
