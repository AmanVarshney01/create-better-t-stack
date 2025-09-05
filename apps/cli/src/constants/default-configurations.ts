import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ProjectConfig } from "@/types";
import { getUserPkgManager } from "@/utils/get-package-manager";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const DEFAULT_CONFIG_BASE = {
	projectName: "my-better-t-app",
	relativePath: "my-better-t-app",
	frontend: ["tanstack-router"],
	database: "sqlite",
	orm: "drizzle",
	auth: "better-auth",
	addons: ["turborepo"],
	docker: ["none"],
	examples: [],
	git: true,
	install: true,
	dbSetup: "none",
	backend: "hono",
	runtime: "bun",
	api: "trpc",
	webDeploy: "none",
	serverDeploy: "none",
} as const;

export const DEFAULT_CONFIG: ProjectConfig = {
	...DEFAULT_CONFIG_BASE,
	projectDir: path.resolve(process.cwd(), DEFAULT_CONFIG_BASE.projectName),
	packageManager: getUserPkgManager(),
	frontend: [...DEFAULT_CONFIG_BASE.frontend],
	addons: [...DEFAULT_CONFIG_BASE.addons],
	docker: [...DEFAULT_CONFIG_BASE.docker],
	examples: [...DEFAULT_CONFIG_BASE.examples],
} as const;
