import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupPayments(config: ProjectConfig) {
	const { payments, projectDir, frontend } = config;

	if (!payments || payments === "none") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	const clientDir = path.join(projectDir, "apps/web");

	const serverDirExists = await fs.pathExists(serverDir);
	const clientDirExists = await fs.pathExists(clientDir);

	if (!serverDirExists) {
		return;
	}

	if (payments === "polar") {
		await addPackageDependency({
			dependencies: ["@polar-sh/better-auth", "@polar-sh/sdk"],
			projectDir: serverDir,
		});

		if (clientDirExists) {
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

			if (hasWebFrontend) {
				await addPackageDependency({
					dependencies: ["@polar-sh/better-auth"],
					projectDir: clientDir,
				});
			}
		}
	}
}
