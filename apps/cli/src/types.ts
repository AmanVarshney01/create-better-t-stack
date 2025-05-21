export type ProjectDatabase =
	| "sqlite"
	| "postgres"
	| "mongodb"
	| "mysql"
	| "none";
export type ProjectOrm = "drizzle" | "prisma" | "mongoose" | "none";
export type ProjectPackageManager = "npm" | "pnpm" | "bun";
export type ProjectAddons =
	| "pwa"
	| "biome"
	| "tauri"
	| "husky"
	| "starlight"
	| "turborepo"
	| "none";
export type ProjectBackend =
	| "hono"
	| "express"
	| "fastify"
	| "next"
	| "elysia"
	| "convex"
	| "none";
export type ProjectRuntime = "node" | "bun" | "none";
export type ProjectExamples = "todo" | "ai" | "none";
export type ProjectFrontend =
	| "react-router"
	| "tanstack-router"
	| "tanstack-start"
	| "next"
	| "nuxt"
	| "native-nativewind"
	| "native-unistyles"
	| "svelte"
	| "solid"
	| "none";
export type ProjectDBSetup =
	| "turso"
	| "prisma-postgres"
	| "mongodb-atlas"
	| "neon"
	| "supabase"
	| "none";
export type ProjectApi = "trpc" | "orpc" | "none";

export interface ProjectConfig {
	projectName: string;
	projectDir: string;
	relativePath: string;
	backend: ProjectBackend;
	runtime: ProjectRuntime;
	database: ProjectDatabase;
	orm: ProjectOrm;
	auth: boolean;
	addons: ProjectAddons[];
	examples: ProjectExamples[];
	git: boolean;
	packageManager: ProjectPackageManager;
	install: boolean;
	dbSetup: ProjectDBSetup;
	frontend: ProjectFrontend[];
	api: ProjectApi;
}

export type YargsArgv = {
	projectDirectory?: string;

	yes?: boolean;
	database?: ProjectDatabase;
	orm?: ProjectOrm;
	auth?: boolean;
	frontend?: ProjectFrontend[];
	addons?: ProjectAddons[];
	examples?: ProjectExamples[];
	git?: boolean;
	packageManager?: ProjectPackageManager;
	install?: boolean;
	dbSetup?: ProjectDBSetup;
	backend?: ProjectBackend;
	runtime?: ProjectRuntime;
	api?: ProjectApi;

	_: (string | number)[];
	$0: string;
};
