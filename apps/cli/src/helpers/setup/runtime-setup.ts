import path from "node:path";
import { spinner } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { Backend, ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupRuntime(config: ProjectConfig): Promise<void> {
	const { runtime, backend, projectDir } = config;

	if (backend === "convex" || backend === "next" || runtime === "none") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");

	if (!(await fs.pathExists(serverDir))) {
		return;
	}

	if (runtime === "bun") {
		await setupBunRuntime(serverDir, backend);
	} else if (runtime === "node") {
		await setupNodeRuntime(serverDir, backend);
	} else if (runtime === "workers") {
		await setupWorkersRuntime(serverDir);
	} else if (runtime === "vercel-edge") {
		await setupVercelEdgeRuntime(serverDir);
	} else if (runtime === "vercel-nodejs") {
		await setupVercelNodejsRuntime(serverDir);
	}
}

export async function generateCloudflareWorkerTypes(
	config: ProjectConfig,
): Promise<void> {
	if (config.runtime !== "workers") {
		return;
	}

	const serverDir = path.join(config.projectDir, "apps/server");

	if (!(await fs.pathExists(serverDir))) {
		return;
	}

	const s = spinner();

	try {
		s.start("Generating Cloudflare Workers types...");

		const runCmd =
			config.packageManager === "npm" ? "npm" : config.packageManager;
		await execa(runCmd, ["run", "cf-typegen"], {
			cwd: serverDir,
		});

		s.stop("Cloudflare Workers types generated successfully!");
	} catch {
		s.stop(pc.yellow("Failed to generate Cloudflare Workers types"));
		const managerCmd =
			config.packageManager === "npm"
				? "npm run"
				: `${config.packageManager} run`;
		console.warn(
			`Note: You can manually run 'cd apps/server && ${managerCmd} cf-typegen' in the project directory later`,
		);
	}
}

async function setupBunRuntime(
	serverDir: string,
	_backend: Backend,
): Promise<void> {
	const packageJsonPath = path.join(serverDir, "package.json");
	if (!(await fs.pathExists(packageJsonPath))) return;

	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "bun run --hot src/index.ts",
		start: "bun run dist/src/index.js",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	await addPackageDependency({
		devDependencies: ["@types/bun"],
		projectDir: serverDir,
	});
}

async function setupNodeRuntime(
	serverDir: string,
	backend: Backend,
): Promise<void> {
	const packageJsonPath = path.join(serverDir, "package.json");
	if (!(await fs.pathExists(packageJsonPath))) return;

	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "tsx watch src/index.ts",
		start: "node dist/src/index.js",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	await addPackageDependency({
		devDependencies: ["tsx", "@types/node"],
		projectDir: serverDir,
	});

	if (backend === "hono") {
		await addPackageDependency({
			dependencies: ["@hono/node-server"],
			projectDir: serverDir,
		});
	} else if (backend === "elysia") {
		await addPackageDependency({
			dependencies: ["@elysiajs/node"],
			projectDir: serverDir,
		});
	}
}

async function setupWorkersRuntime(serverDir: string): Promise<void> {
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
		devDependencies: ["wrangler"],
		projectDir: serverDir,
	});
}

async function setupVercelEdgeRuntime(serverDir: string): Promise<void> {
	const packageJsonPath = path.join(serverDir, "package.json");
	if (!(await fs.pathExists(packageJsonPath))) return;

	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "next dev",
		build: "next build",
		start: "next start",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function setupVercelNodejsRuntime(serverDir: string): Promise<void> {
	const packageJsonPath = path.join(serverDir, "package.json");
	if (!(await fs.pathExists(packageJsonPath))) return;

	const packageJson = await fs.readJson(packageJsonPath);

	packageJson.scripts = {
		...packageJson.scripts,
		dev: "next dev",
		build: "next build",
		start: "next start",
	};

	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

	await addPackageDependency({
		dependencies: ["@hono/node-server"],
		projectDir: serverDir,
	});
}
