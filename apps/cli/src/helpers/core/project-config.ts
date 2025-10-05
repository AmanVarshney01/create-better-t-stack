import path from "node:path";
import { log } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { setupWorkspaceDependencies } from "./workspace-setup";

export async function updatePackageConfigurations(
	projectDir: string,
	options: ProjectConfig,
) {
	await updateRootPackageJson(projectDir, options);
	if (options.backend === "convex") {
		await updateConvexPackageJson(projectDir, options);
	} else if (options.backend === "self") {
		await updateDbPackageJson(projectDir, options);
		await updateAuthPackageJson(projectDir, options);
		await updateApiPackageJson(projectDir, options);
		await setupWorkspaceDependencies(projectDir, options);
	} else if (options.backend !== "none") {
		await updateServerPackageJson(projectDir, options);
		await updateAuthPackageJson(projectDir, options);
		await updateApiPackageJson(projectDir, options);
		await setupWorkspaceDependencies(projectDir, options);
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
	const dbPackageName = `@${options.projectName}/db`;

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
		if (options.backend !== "self" && options.backend !== "none") {
			scripts["dev:server"] = serverDevScript;
		}
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
			scripts["db:start"] = `turbo -F ${dbPackageName} db:start`;
			scripts["db:watch"] = `turbo -F ${dbPackageName} db:watch`;
			scripts["db:stop"] = `turbo -F ${dbPackageName} db:stop`;
			scripts["db:down"] = `turbo -F ${dbPackageName} db:down`;
		}
	} else if (options.packageManager === "pnpm") {
		scripts.dev = devScript;
		scripts.build = "pnpm -r build";
		scripts["check-types"] = "pnpm -r check-types";
		scripts["dev:native"] = "pnpm --filter native dev";
		scripts["dev:web"] = "pnpm --filter web dev";
		if (options.backend !== "self" && options.backend !== "none") {
			scripts["dev:server"] = serverDevScript;
		}
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
			scripts["db:start"] = `pnpm --filter ${dbPackageName} db:start`;
			scripts["db:watch"] = `pnpm --filter ${dbPackageName} db:watch`;
			scripts["db:stop"] = `pnpm --filter ${dbPackageName} db:stop`;
			scripts["db:down"] = `pnpm --filter ${dbPackageName} db:down`;
		}
	} else if (options.packageManager === "npm") {
		scripts.dev = devScript;
		scripts.build = "npm run build --workspaces";
		scripts["check-types"] = "npm run check-types --workspaces";
		scripts["dev:native"] = "npm run dev --workspace native";
		scripts["dev:web"] = "npm run dev --workspace web";
		if (options.backend !== "self" && options.backend !== "none") {
			scripts["dev:server"] = serverDevScript;
		}
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
			scripts["db:start"] = `npm run db:start --workspace ${dbPackageName}`;
			scripts["db:watch"] = `npm run db:watch --workspace ${dbPackageName}`;
			scripts["db:stop"] = `npm run db:stop --workspace ${dbPackageName}`;
			scripts["db:down"] = `npm run db:down --workspace ${dbPackageName}`;
		}
	} else if (options.packageManager === "bun") {
		scripts.dev = devScript;
		scripts.build = "bun run --filter '*' build";
		scripts["check-types"] = "bun run --filter '*' check-types";
		scripts["dev:native"] = "bun run --filter native dev";
		scripts["dev:web"] = "bun run --filter web dev";
		if (options.backend !== "self" && options.backend !== "none") {
			scripts["dev:server"] = serverDevScript;
		}
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
			scripts["db:start"] = `bun run --filter ${dbPackageName} db:start`;
			scripts["db:watch"] = `bun run --filter ${dbPackageName} db:watch`;
			scripts["db:stop"] = `bun run --filter ${dbPackageName} db:stop`;
			scripts["db:down"] = `bun run --filter ${dbPackageName} db:down`;
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

	await fs.writeJson(serverPackageJsonPath, serverPackageJson, {
		spaces: 2,
	});

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

	if (options.dbSetup === "docker") {
		scripts["db:start"] = "docker compose up -d";
		scripts["db:watch"] = "docker compose up";
		scripts["db:stop"] = "docker compose stop";
		scripts["db:down"] = "docker compose down";
	}

	await fs.writeJson(dbPackageJsonPath, dbPackageJson, {
		spaces: 2,
	});
}

async function updateAuthPackageJson(
	projectDir: string,
	options: ProjectConfig,
) {
	const authPackageJsonPath = path.join(
		projectDir,
		"packages/auth/package.json",
	);

	if (!(await fs.pathExists(authPackageJsonPath))) return;

	const authPackageJson = await fs.readJson(authPackageJsonPath);
	authPackageJson.name = `@${options.projectName}/auth`;

	await fs.writeJson(authPackageJsonPath, authPackageJson, {
		spaces: 2,
	});
}

async function updateApiPackageJson(
	projectDir: string,
	options: ProjectConfig,
) {
	const apiPackageJsonPath = path.join(projectDir, "packages/api/package.json");

	if (!(await fs.pathExists(apiPackageJsonPath))) return;

	const apiPackageJson = await fs.readJson(apiPackageJsonPath);
	apiPackageJson.name = `@${options.projectName}/api`;

	await fs.writeJson(apiPackageJsonPath, apiPackageJson, {
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
