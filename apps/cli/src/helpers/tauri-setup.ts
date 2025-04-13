import path from "node:path";
import { log, spinner } from "@clack/prompts";
import { consola } from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectFrontend, ProjectPackageManager } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupTauri(
	projectDir: string,
	packageManager: ProjectPackageManager,
	frontends: ProjectFrontend[],
): Promise<void> {
	const s = spinner();
	const clientPackageDir = path.join(projectDir, "apps/web");

	if (!(await fs.pathExists(clientPackageDir))) {
		return;
	}

	try {
		s.start("Setting up Tauri desktop app support...");

		addPackageDependency({
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

		let cmd: string;
		let args: string[];

		switch (packageManager) {
			case "npm":
				cmd = "npx";
				args = ["@tauri-apps/cli@latest"];
				break;
			case "pnpm":
				cmd = "pnpm";
				args = ["dlx", "@tauri-apps/cli@latest"];
				break;
			case "bun":
				cmd = "bunx";
				args = ["@tauri-apps/cli@latest"];
				break;
			default:
				cmd = "npx";
				args = ["@tauri-apps/cli@latest"];
		}

		const hasReactRouter = frontends.includes("react-router");
		const devUrl = hasReactRouter
			? "http://localhost:5173"
			: "http://localhost:3001";

		args = [
			...args,
			"init",
			`--app-name=${path.basename(projectDir)}`,
			`--window-title=${path.basename(projectDir)}`,
			"--frontend-dist=../dist",
			`--dev-url=${devUrl}`,
			`--before-dev-command=${packageManager} run dev`,
			`--before-build-command=${packageManager} run build`,
		];

		await execa(cmd, args, {
			cwd: clientPackageDir,
			env: {
				CI: "true",
			},
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
