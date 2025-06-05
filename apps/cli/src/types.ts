export type Database = "sqlite" | "postgres" | "mongodb" | "mysql" | "none";
export type ORM = "drizzle" | "prisma" | "mongoose" | "none";
export type PackageManager = "npm" | "pnpm" | "bun";
export type Addons =
	| "pwa"
	| "biome"
	| "tauri"
	| "husky"
	| "starlight"
	| "turborepo"
	| "none";
export type Backend =
	| "hono"
	| "express"
	| "fastify"
	| "next"
	| "elysia"
	| "convex"
	| "none";
export type Runtime = "node" | "bun" | "none";
export type Examples = "todo" | "ai" | "none";
export type Frontend =
	| "react-router"
	| "tanstack-router"
	| "tanstack-start"
	| "next"
	| "nuxt"
	| "native-nativewind"
	| "native-unistyles"
	| "svelte"
	| "solid"
	| "angular"
	| "none";
export type DatabaseSetup =
	| "turso"
	| "prisma-postgres"
	| "mongodb-atlas"
	| "neon"
	| "supabase"
	| "none";
export type API = "trpc" | "orpc" | "none";

export interface ProjectConfig {
	projectName: string;
	projectDir: string;
	relativePath: string;
	backend: Backend;
	runtime: Runtime;
	database: Database;
	orm: ORM;
	auth: boolean;
	addons: Addons[];
	examples: Examples[];
	git: boolean;
	packageManager: PackageManager;
	install: boolean;
	dbSetup: DatabaseSetup;
	frontend: Frontend[];
	api: API;
}

export type YargsArgv = {
	projectDirectory?: string;

	yes?: boolean;
	database?: Database;
	orm?: ORM;
	auth?: boolean;
	frontend?: Frontend[];
	addons?: Addons[];
	examples?: Examples[];
	git?: boolean;
	packageManager?: PackageManager;
	install?: boolean;
	dbSetup?: DatabaseSetup;
	backend?: Backend;
	runtime?: Runtime;
	api?: API;

	_: (string | number)[];
	$0: string;
};
