import path from "node:path";
import { log } from "@clack/prompts";
import { $, execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { dependencyVersionMap } from "../constants";
import type { ProjectConfig } from "../types";

export async function updatePackageConfigurations(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	await updateRootPackageJson(projectDir, options);
	await updateServerPackageJson(projectDir, options);
}

async function updateRootPackageJson(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	const rootPackageJsonPath = path.join(projectDir, "package.json");
	if (await fs.pathExists(rootPackageJsonPath)) {
		const packageJson = await fs.readJson(rootPackageJsonPath);
		packageJson.name = options.projectName;

		const turboScripts = {
			dev: "turbo dev",
			build: "turbo build",
			"check-types": "turbo check-types",
			"dev:native": "turbo -F native dev",
			"dev:web": "turbo -F web dev",
			"dev:server": "turbo -F server dev",
			"db:push": "turbo -F server db:push",
			"db:studio": "turbo -F server db:studio",
		};

		const pnpmScripts = {
			dev: "pnpm -r dev",
			build: "pnpm -r build",
			"check-types": "pnpm -r check-types",
			"dev:native": "pnpm --filter native dev",
			"dev:web": "pnpm --filter web dev",
			"dev:server": "pnpm --filter server dev",
			"db:push": "pnpm --filter server db:push",
			"db:studio": "pnpm --filter server db:studio",
		};

		const npmScripts = {
			dev: "npm run dev --workspaces",
			build: "npm run build --workspaces",
			"check-types": "npm run check-types --workspaces",
			"dev:native": "npm run dev --workspace native",
			"dev:web": "npm run dev --workspace web",
			"dev:server": "npm run dev --workspace server",
			"db:push": "npm run db:push --workspace server",
			"db:studio": "npm run db:studio --workspace server",
		};

		const bunScripts = {
			dev: "bun run --filter '*' dev",
			build: "bun run --filter '*' build",
			"check-types": "bun run --filter '*' check-types",
			"dev:native": "bun run --filter native dev",
			"dev:web": "bun run --filter web dev",
			"dev:server": "bun run --filter server dev",
			"db:push": "bun run --filter server db:push",
			"db:studio": "bun run --filter server db:studio",
		};

		if (options.addons.includes("turborepo")) {
			packageJson.scripts = turboScripts;
		} else {
			if (options.packageManager === "pnpm") {
				packageJson.scripts = pnpmScripts;
			} else if (options.packageManager === "npm") {
				packageJson.scripts = npmScripts;
			} else if (options.packageManager === "bun") {
				packageJson.scripts = bunScripts;
			} else {
				packageJson.scripts = {};
			}
		}

		const { stdout } = await execa(options.packageManager, ["-v"], {
			cwd: projectDir,
		});
		packageJson.packageManager = `${options.packageManager}@${stdout.trim()}`;

		await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
	}
}

async function updateServerPackageJson(
	projectDir: string,
	options: ProjectConfig,
): Promise<void> {
	const serverPackageJsonPath = path.join(
		projectDir,
		"apps/server/package.json",
	);

	if (await fs.pathExists(serverPackageJsonPath)) {
		const serverPackageJson = await fs.readJson(serverPackageJsonPath);

		if (options.database !== "none") {
			if (options.database === "sqlite" && options.orm === "drizzle") {
				serverPackageJson.scripts["db:local"] = "turso dev --db-file local.db";
			}

			if (options.orm === "prisma") {
				serverPackageJson.scripts["db:push"] =
					"prisma db push --schema ./prisma/schema";
				serverPackageJson.scripts["db:studio"] = "prisma studio";
			} else if (options.orm === "drizzle") {
				serverPackageJson.scripts["db:push"] = "drizzle-kit push";
				serverPackageJson.scripts["db:studio"] = "drizzle-kit studio";
			}
		}

		await fs.writeJson(serverPackageJsonPath, serverPackageJson, {
			spaces: 2,
		});
	}
}

export async function initializeGit(
	projectDir: string,
	useGit: boolean,
): Promise<void> {
	if (!useGit) return;

	const gitVersionResult = await $({
		cwd: projectDir,
		reject: false,
		stderr: "pipe",
	})`git --version`;

	if (gitVersionResult.exitCode !== 0) {
		log.warn(pc.yellow("Git is not installed"));
		return;
	}

	const result = await $({
		cwd: projectDir,
		reject: false,
		stderr: "pipe",
	})`git init`;

	if (result.exitCode !== 0) {
		throw new Error(`Git initialization failed: ${result.stderr}`);
	}
}
