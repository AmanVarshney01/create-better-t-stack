import path from "node:path";
import { log, spinner } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";

export async function setupServerDeploy(config: ProjectConfig) {
	const { serverDeploy, webDeploy, projectDir } = config;
	const { packageManager } = config;

	if (serverDeploy === "none") return;

	if (serverDeploy === "alchemy" && webDeploy === "alchemy") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	if (!(await fs.pathExists(serverDir))) return;

	if (serverDeploy === "wrangler") {
		await setupWorkersServerDeploy(serverDir, packageManager);
		await generateCloudflareWorkerTypes({ serverDir, packageManager });
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
		devDependencies: ["wrangler", "@types/node"],
		projectDir: serverDir,
	});
}

async function generateCloudflareWorkerTypes({
	serverDir,
	packageManager,
}: {
	serverDir: string;
	packageManager: ProjectConfig["packageManager"];
}) {
	if (!(await fs.pathExists(serverDir))) return;
	const s = spinner();
	try {
		s.start("Generating Cloudflare Workers types...");
		const runCmd = getPackageExecutionCommand(
			packageManager,
			"wrangler types --env-interface CloudflareBindings",
		);
		await execa(runCmd, { cwd: serverDir, shell: true });
		s.stop("Cloudflare Workers types generated successfully!");
	} catch {
		s.stop(pc.yellow("Failed to generate Cloudflare Workers types"));
		const managerCmd = `${packageManager} run`;
		log.warn(
			`Note: You can manually run 'cd apps/server && ${managerCmd} cf-typegen' in the project directory later`,
		);
	}
}

export async function setupAlchemyServerDeploy(
	serverDir: string,
	_packageManager: PackageManager,
) {
	if (!(await fs.pathExists(serverDir))) return;

	await addPackageDependency({
		devDependencies: [
			"alchemy",
			"wrangler",
			"@types/node",
			"dotenv",
			"@cloudflare/workers-types",
		],
		projectDir: serverDir,
	});

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
