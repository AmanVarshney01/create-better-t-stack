import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupServerDeploy(config: ProjectConfig) {
	const { serverDeploy, webDeploy, projectDir } = config;

	if (serverDeploy === "none") return;

	if (serverDeploy === "alchemy" && webDeploy === "alchemy") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	if (!(await fs.pathExists(serverDir))) return;

	if (serverDeploy === "alchemy") {
		await setupAlchemyServerDeploy(serverDir, projectDir);
	}
}

export async function setupAlchemyServerDeploy(
	serverDir: string,
	projectDir?: string,
) {
	if (!(await fs.pathExists(serverDir))) return;

	await addPackageDependency({
		devDependencies: [
			"alchemy",
			"wrangler",
			"@types/node",
			"@cloudflare/workers-types",
		],
		projectDir: serverDir,
	});

	if (projectDir) {
		await addAlchemyPackagesDependencies(projectDir);
	}

	const packageJsonPath = path.join(serverDir, "package.json");
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = await fs.readJson(packageJsonPath);

		packageJson.scripts = {
			...packageJson.scripts,
			dev: "alchemy dev",
			deploy: "alchemy deploy",
			destroy: "alchemy destroy",
		};

		await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	}
}

async function addAlchemyPackagesDependencies(projectDir: string) {
	await addPackageDependency({
		devDependencies: ["@cloudflare/workers-types"],
		projectDir,
	});
}
