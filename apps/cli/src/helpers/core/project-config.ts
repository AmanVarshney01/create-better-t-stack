import path from "node:path";
import { log } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function updatePackageConfigurations(
	projectDir: string,
	options: ProjectConfig,
) {
	await updateRootPackageJson(projectDir, options);
	if (options.backend !== "convex") {
		await updateServerPackageJson(projectDir, options);
		await updateWorkspaceDependencies(projectDir, options);
	} else {
		await updateConvexPackageJson(projectDir, options);
	}
}

async function updateRootPackageJson(
	projectDir: string,
	options: ProjectConfig,
) {
	const rootPackageJsonPath = path.join(projectDir, "package.json");
	if (!(await fs.pathExists(rootPackageJsonPath))) return;

	const packageJson = await fs.readJson(rootPackageJsonPath);
	packageJson.name = options.projectName;

	if (!packageJson.scripts) {
		packageJson.scripts = {};
	}
	const scripts = packageJson.scripts;

	const backendPackageName =
		options.backend === "convex" ? `@${options.projectName}/backend` : "server";
	const dbPackageName = "db";

	let serverDevScript = "";
	if (options.addons.includes("turborepo")) {
		serverDevScript = `turbo -F ${backendPackageName} dev`;
	} else if (options.packageManager === "bun") {
		serverDevScript = `bun run --filter ${backendPackageName} dev`;
	} else if (options.packageManager === "pnpm") {
		serverDevScript = `pnpm --filter ${backendPackageName} dev`;
	} else if (options.packageManager === "npm") {
		serverDevScript = `npm run dev --workspace ${backendPackageName}`;
	}

	let devScript = "";
	if (options.packageManager === "pnpm") {
		devScript = "pnpm -r dev";
	} else if (options.packageManager === "npm") {
		devScript = "npm run dev --workspaces";
	} else if (options.packageManager === "bun") {
		devScript = "bun run --filter '*' dev";
	}

	const needsDbScripts =
		options.backend !== "convex" &&
		options.database !== "none" &&
		options.orm !== "none" &&
		options.orm !== "mongoose";
	if (options.addons.includes("turborepo")) {
		scripts.dev = "turbo dev";
		scripts.build = "turbo build";
		scripts["check-types"] = "turbo check-types";
		scripts["dev:native"] = "turbo -F native dev";
		scripts["dev:web"] = "turbo -F web dev";
		scripts["dev:server"] = serverDevScript;
		if (options.backend === "convex") {
			scripts["dev:setup"] = `turbo -F ${backendPackageName} dev:setup`;
		}
		if (needsDbScripts) {
			scripts["db:push"] = `turbo -F ${dbPackageName} db:push`;
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:studio"] = `turbo -F ${dbPackageName} db:studio`;
			}
			if (options.orm === "prisma") {
				scripts["db:generate"] = `turbo -F ${dbPackageName} db:generate`;
				scripts["db:migrate"] = `turbo -F ${dbPackageName} db:migrate`;
			} else if (options.orm === "drizzle") {
				scripts["db:generate"] = `turbo -F ${dbPackageName} db:generate`;
				if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
					scripts["db:migrate"] = `turbo -F ${dbPackageName} db:migrate`;
				}
			}
		}
		if (options.dbSetup === "docker") {
			scripts["db:start"] = `turbo -F ${backendPackageName} db:start`;
			scripts["db:watch"] = `turbo -F ${backendPackageName} db:watch`;
			scripts["db:stop"] = `turbo -F ${backendPackageName} db:stop`;
			scripts["db:down"] = `turbo -F ${backendPackageName} db:down`;
		}
	} else if (options.packageManager === "pnpm") {
		scripts.dev = devScript;
		scripts.build = "pnpm -r build";
		scripts["check-types"] = "pnpm -r check-types";
		scripts["dev:native"] = "pnpm --filter native dev";
		scripts["dev:web"] = "pnpm --filter web dev";
		scripts["dev:server"] = serverDevScript;
		if (options.backend === "convex") {
			scripts["dev:setup"] = `pnpm --filter ${backendPackageName} dev:setup`;
		}
		if (needsDbScripts) {
			scripts["db:push"] = `pnpm --filter ${dbPackageName} db:push`;
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:studio"] = `pnpm --filter ${dbPackageName} db:studio`;
			}
			if (options.orm === "prisma") {
				scripts["db:generate"] = `pnpm --filter ${dbPackageName} db:generate`;
				scripts["db:migrate"] = `pnpm --filter ${dbPackageName} db:migrate`;
			} else if (options.orm === "drizzle") {
				scripts["db:generate"] = `pnpm --filter ${dbPackageName} db:generate`;
				if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
					scripts["db:migrate"] = `pnpm --filter ${dbPackageName} db:migrate`;
				}
			}
		}
		if (options.dbSetup === "docker") {
			scripts["db:start"] = `pnpm --filter ${backendPackageName} db:start`;
			scripts["db:watch"] = `pnpm --filter ${backendPackageName} db:watch`;
			scripts["db:stop"] = `pnpm --filter ${backendPackageName} db:stop`;
			scripts["db:down"] = `pnpm --filter ${backendPackageName} db:down`;
		}
	} else if (options.packageManager === "npm") {
		scripts.dev = devScript;
		scripts.build = "npm run build --workspaces";
		scripts["check-types"] = "npm run check-types --workspaces";
		scripts["dev:native"] = "npm run dev --workspace native";
		scripts["dev:web"] = "npm run dev --workspace web";
		scripts["dev:server"] = serverDevScript;
		if (options.backend === "convex") {
			scripts["dev:setup"] =
				`npm run dev:setup --workspace ${backendPackageName}`;
		}
		if (needsDbScripts) {
			scripts["db:push"] = `npm run db:push --workspace ${dbPackageName}`;
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:studio"] = `npm run db:studio --workspace ${dbPackageName}`;
			}
			if (options.orm === "prisma") {
				scripts["db:generate"] =
					`npm run db:generate --workspace ${dbPackageName}`;
				scripts["db:migrate"] =
					`npm run db:migrate --workspace ${dbPackageName}`;
			} else if (options.orm === "drizzle") {
				scripts["db:generate"] =
					`npm run db:generate --workspace ${dbPackageName}`;
				if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
					scripts["db:migrate"] =
						`npm run db:migrate --workspace ${dbPackageName}`;
				}
			}
		}
		if (options.dbSetup === "docker") {
			scripts["db:start"] =
				`npm run db:start --workspace ${backendPackageName}`;
			scripts["db:watch"] =
				`npm run db:watch --workspace ${backendPackageName}`;
			scripts["db:stop"] = `npm run db:stop --workspace ${backendPackageName}`;
			scripts["db:down"] = `npm run db:down --workspace ${backendPackageName}`;
		}
	} else if (options.packageManager === "bun") {
		scripts.dev = devScript;
		scripts.build = "bun run --filter '*' build";
		scripts["check-types"] = "bun run --filter '*' check-types";
		scripts["dev:native"] = "bun run --filter native dev";
		scripts["dev:web"] = "bun run --filter web dev";
		scripts["dev:server"] = serverDevScript;
		if (options.backend === "convex") {
			scripts["dev:setup"] = `bun run --filter ${backendPackageName} dev:setup`;
		}
		if (needsDbScripts) {
			scripts["db:push"] = `bun run --filter ${dbPackageName} db:push`;
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:studio"] = `bun run --filter ${dbPackageName} db:studio`;
			}
			if (options.orm === "prisma") {
				scripts["db:generate"] =
					`bun run --filter ${dbPackageName} db:generate`;
				scripts["db:migrate"] = `bun run --filter ${dbPackageName} db:migrate`;
			} else if (options.orm === "drizzle") {
				scripts["db:generate"] =
					`bun run --filter ${dbPackageName} db:generate`;
				if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
					scripts["db:migrate"] =
						`bun run --filter ${dbPackageName} db:migrate`;
				}
			}
		}
		if (options.dbSetup === "docker") {
			scripts["db:start"] = `bun run --filter ${backendPackageName} db:start`;
			scripts["db:watch"] = `bun run --filter ${backendPackageName} db:watch`;
			scripts["db:stop"] = `bun run --filter ${backendPackageName} db:stop`;
			scripts["db:down"] = `bun run --filter ${backendPackageName} db:down`;
		}
	}

	try {
		const { stdout } = await execa(options.packageManager, ["-v"], {
			cwd: projectDir,
		});
		packageJson.packageManager = `${options.packageManager}@${stdout.trim()}`;
	} catch (_e) {
		log.warn(`Could not determine ${options.packageManager} version.`);
	}

	if (!packageJson.workspaces) {
		packageJson.workspaces = [];
	}
	const workspaces = packageJson.workspaces;

	if (options.backend === "convex") {
		if (!workspaces.includes("packages/*")) {
			workspaces.push("packages/*");
		}
		const needsAppsDir =
			options.frontend.length > 0 || options.addons.includes("starlight");
		if (needsAppsDir && !workspaces.includes("apps/*")) {
			workspaces.push("apps/*");
		}
	} else {
		if (!workspaces.includes("apps/*")) {
			workspaces.push("apps/*");
		}
		if (!workspaces.includes("packages/*")) {
			workspaces.push("packages/*");
		}
	}

	await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
}

async function updateServerPackageJson(
	projectDir: string,
	options: ProjectConfig,
) {
	const serverPackageJsonPath = path.join(
		projectDir,
		"apps/server/package.json",
	);

	if (!(await fs.pathExists(serverPackageJsonPath))) return;

	const serverPackageJson = await fs.readJson(serverPackageJsonPath);

	if (!serverPackageJson.scripts) {
		serverPackageJson.scripts = {};
	}
	const scripts = serverPackageJson.scripts;

	// Server package only needs server-specific scripts now
	// Database scripts are handled in packages/db

	if (options.dbSetup === "docker") {
		scripts["db:start"] = "docker compose up -d";
		scripts["db:watch"] = "docker compose up";
		scripts["db:stop"] = "docker compose stop";
		scripts["db:down"] = "docker compose down";
	}

	await fs.writeJson(serverPackageJsonPath, serverPackageJson, {
		spaces: 2,
	});

	// Update database package scripts
	await updateDbPackageJson(projectDir, options);
}

async function updateDbPackageJson(projectDir: string, options: ProjectConfig) {
	const dbPackageJsonPath = path.join(projectDir, "packages/db/package.json");

	if (!(await fs.pathExists(dbPackageJsonPath))) return;

	const dbPackageJson = await fs.readJson(dbPackageJsonPath);
	dbPackageJson.name = `@${options.projectName}/db`;

	if (!dbPackageJson.scripts) {
		dbPackageJson.scripts = {};
	}
	const scripts = dbPackageJson.scripts;

	if (options.database !== "none") {
		if (
			options.database === "sqlite" &&
			options.orm === "drizzle" &&
			options.dbSetup !== "d1"
		) {
			scripts["db:local"] = "turso dev --db-file local.db";
		}

		if (options.orm === "prisma") {
			scripts["db:push"] = "prisma db push";
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:studio"] = "prisma studio";
			}
			scripts["db:generate"] = "prisma generate";
			scripts["db:migrate"] = "prisma migrate dev";
		} else if (options.orm === "drizzle") {
			scripts["db:push"] = "drizzle-kit push";
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:studio"] = "drizzle-kit studio";
			}
			scripts["db:generate"] = "drizzle-kit generate";
			if (!(options.dbSetup === "d1" && options.serverDeploy === "alchemy")) {
				scripts["db:migrate"] = "drizzle-kit migrate";
			}
		}
	}

	await fs.writeJson(dbPackageJsonPath, dbPackageJson, {
		spaces: 2,
	});
}

async function updateConvexPackageJson(
	projectDir: string,
	options: ProjectConfig,
) {
	const convexPackageJsonPath = path.join(
		projectDir,
		"packages/backend/package.json",
	);

	if (!(await fs.pathExists(convexPackageJsonPath))) return;

	const convexPackageJson = await fs.readJson(convexPackageJsonPath);
	convexPackageJson.name = `@${options.projectName}/backend`;

	if (!convexPackageJson.scripts) {
		convexPackageJson.scripts = {};
	}

	await fs.writeJson(convexPackageJsonPath, convexPackageJson, { spaces: 2 });
}

async function updateWorkspaceDependencies(
	projectDir: string,
	options: ProjectConfig,
) {
	const projectName = options.projectName;
	const workspaceVersion =
		options.packageManager === "npm" ? "*" : "workspace:*";

	// Update packages/auth dependencies
	const authPackageDir = path.join(projectDir, "packages/auth");
	if (await fs.pathExists(authPackageDir)) {
		const authPackagePath = path.join(authPackageDir, "package.json");
		const authPackage = await fs.readJson(authPackagePath);
		authPackage.name = `@${projectName}/auth`;
		await fs.writeJson(authPackagePath, authPackage, { spaces: 2 });

		await addPackageDependency({
			customDependencies: {
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: authPackageDir,
		});
	}

	// Update packages/api dependencies
	const apiPackageDir = path.join(projectDir, "packages/api");
	if (await fs.pathExists(apiPackageDir)) {
		const apiPackagePath = path.join(apiPackageDir, "package.json");
		const apiPackage = await fs.readJson(apiPackagePath);
		apiPackage.name = `@${projectName}/api`;
		await fs.writeJson(apiPackagePath, apiPackage, { spaces: 2 });

		await addPackageDependency({
			customDependencies: {
				[`@${projectName}/auth`]: workspaceVersion,
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: apiPackageDir,
		});
	}

	// Update apps/server dependencies
	const serverPackageDir = path.join(projectDir, "apps/server");
	if (await fs.pathExists(serverPackageDir)) {
		await addPackageDependency({
			customDependencies: {
				[`@${projectName}/api`]: workspaceVersion,
				[`@${projectName}/auth`]: workspaceVersion,
				[`@${projectName}/db`]: workspaceVersion,
			},
			projectDir: serverPackageDir,
		});
	}
}
