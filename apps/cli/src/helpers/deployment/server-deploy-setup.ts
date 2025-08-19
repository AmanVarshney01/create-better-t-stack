import path from "node:path";
import fs from "fs-extra";
import type { PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupServerDeploy(config: ProjectConfig) {
	const { serverDeploy, webDeploy, projectDir } = config;
	const { packageManager } = config;

	if (serverDeploy === "none") return;

	if (serverDeploy === "alchemy" && webDeploy === "alchemy") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	if (!(await fs.pathExists(serverDir))) return;

	if (serverDeploy === "workers") {
		await setupWorkersServerDeploy(serverDir, packageManager);
	} else if (serverDeploy === "alchemy") {
		await setupAlchemyServerDeploy(serverDir, packageManager);
	}
}

async function setupWorkersServerDeploy(
	serverDir: string,
	_packageManager: PackageManager,
) {
	const packageJsonPath = path.join(serverDir, "package.json");
	if (!(await fs.pathExists(packageJsonPath))) return;

	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "wrangler dev --port=3000",
		start: "wrangler dev",
		deploy: "wrangler deploy",
		build: "wrangler deploy --dry-run",
		"cf-typegen": "wrangler types --env-interface CloudflareBindings",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	await addPackageDependency({
		devDependencies: ["wrangler", "@types/node", "@cloudflare/workers-types"],
		projectDir: serverDir,
	});
}

async function setupAlchemyServerDeploy(
	serverDir: string,
	_packageManager: PackageManager,
) {
	if (!(await fs.pathExists(serverDir))) return;

	await addPackageDependency({
		devDependencies: ["alchemy"],
		projectDir: serverDir,
	});

	const packageJsonPath = path.join(serverDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			deploy: "alchemy deploy",
			destroy: "alchemy destroy",
			"alchemy:dev": "alchemy dev",
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}
