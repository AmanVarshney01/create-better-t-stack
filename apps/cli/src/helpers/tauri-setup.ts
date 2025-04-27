import path from "node:path";
import { spinner } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { addPackageDependency } from "../utils/add-package-deps";
import { getPackageExecutionCommand } from "../utils/get-package-execution-command";

import type { ProjectConfig } from "../types";

export async function setupTauri(config: ProjectConfig): Promise<void> {
	const { projectName, packageManager, frontend } = config;
	const projectDir = path.resolve(process.cwd(), projectName);
	const s = spinner();
	const clientPackageDir = path.join(projectDir, "apps/web");

	if (!(await fs.pathExists(clientPackageDir))) {
		return;
	}

	try {
		s.start("Setting up Tauri desktop app support...");

		await addPackageDependency({
			devDependencies: ["@tauri-apps/cli"],
			projectDir: clientPackageDir,
		});

		const clientPackageJsonPath = path.join(clientPackageDir, "package.json");
		if (await fs.pathExists(clientPackageJsonPath)) {
			const packageJson = await fs.readJson(clientPackageJsonPath);

			packageJson.scripts = {
				...packageJson.scripts,
				tauri: "tauri",
				"desktop:dev": "tauri dev",
				"desktop:build": "tauri build",
			};

			await fs.writeJson(clientPackageJsonPath, packageJson, { spaces: 2 });
		}

		const hasTanstackRouter = frontend.includes("tanstack-router");
		const hasReactRouter = frontend.includes("react-router");
		const hasNuxt = frontend.includes("nuxt");
		const hasSvelte = frontend.includes("svelte");

		const devUrl = hasReactRouter
			? "http://localhost:5173"
			: hasSvelte
				? "http://localhost:5173"
				: "http://localhost:3001";

		const frontendDist = hasNuxt
			? "../.output/public"
			: hasSvelte
				? "../build"
				: "../dist";

		const tauriArgs = [
			"init",
			`--app-name=${path.basename(projectDir)}`,
			`--window-title=${path.basename(projectDir)}`,
			`--frontend-dist=${frontendDist}`,
			`--dev-url=${devUrl}`,
			`--before-dev-command=\"${packageManager} run dev\"`,
			`--before-build-command=\"${packageManager} run build\"`,
		];
		const tauriArgsString = tauriArgs.join(" ");

		const commandWithArgs = `@tauri-apps/cli@latest ${tauriArgsString}`;

		const tauriInitCommand = getPackageExecutionCommand(
			packageManager,
			commandWithArgs,
		);

		await execa(tauriInitCommand, {
			cwd: clientPackageDir,
			env: {
				CI: "true",
			},
			shell: true,
		});

		s.stop("Tauri desktop app support configured successfully!");
	} catch (error) {
		s.stop(pc.red("Failed to set up Tauri"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
		throw error;
	}
}
