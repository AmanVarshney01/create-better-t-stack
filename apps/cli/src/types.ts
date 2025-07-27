import z from "zod";

export const DatabaseSchema = z
	.enum(["none", "sqlite", "postgres", "mysql", "mongodb"])
	.describe("Database type");
export type Database = z.infer<typeof DatabaseSchema>;

export const ORMSchema = z
	.enum(["drizzle", "prisma", "mongoose", "none"])
	.describe("ORM type");
export type ORM = z.infer<typeof ORMSchema>;

export const BackendSchema = z
	.enum(["hono", "express", "fastify", "next", "elysia", "convex", "none"])
	.describe("Backend framework");
export type Backend = z.infer<typeof BackendSchema>;

export const RuntimeSchema = z
	.enum(["bun", "node", "workers", "none"])
	.describe(
		"Runtime environment (workers only available with hono backend and drizzle orm)",
	);
export type Runtime = z.infer<typeof RuntimeSchema>;

export const FrontendSchema = z
	.enum([
		"tanstack-router",
		"react-router",
		"tanstack-start",
		"next",
		"nuxt",
		"native-nativewind",
		"native-unistyles",
		"svelte",
		"solid",
		"none",
	])
	.describe("Frontend framework");
export type Frontend = z.infer<typeof FrontendSchema>;

export const AddonsSchema = z
	.enum([
		"pwa",
		"tauri",
		"starlight",
		"biome",
		"husky",
		"turborepo",
		"fumadocs",
		"ultracite",
		"oxlint",
		"none",
	])
	.describe("Additional addons");
export type Addons = z.infer<typeof AddonsSchema>;

export const ExamplesSchema = z
	.enum(["todo", "ai", "none"])
	.describe("Example templates to include");
export type Examples = z.infer<typeof ExamplesSchema>;

export const PackageManagerSchema = z
	.enum(["npm", "pnpm", "bun"])
	.describe("Package manager");
export type PackageManager = z.infer<typeof PackageManagerSchema>;

export const DatabaseSetupSchema = z
	.enum([
		"turso",
		"neon",
		"prisma-postgres",
		"mongodb-atlas",
		"supabase",
		"d1",
		"docker",
		"none",
	])
	.describe("Database hosting setup");
export type DatabaseSetup = z.infer<typeof DatabaseSetupSchema>;

export const APISchema = z.enum(["trpc", "orpc", "none"]).describe("API type");
export type API = z.infer<typeof APISchema>;

export const ProjectNameSchema = z
	.string()
	.min(1, "Project name cannot be empty")
	.max(255, "Project name must be less than 255 characters")
	.refine(
		(name) => name === "." || !name.startsWith("."),
		"Project name cannot start with a dot (except for '.')",
	)
	.refine(
		(name) => name === "." || !name.startsWith("-"),
		"Project name cannot start with a dash",
	)
	.refine((name) => {
		const invalidChars = ["<", ">", ":", '"', "|", "?", "*"];
		return !invalidChars.some((char) => name.includes(char));
	}, "Project name contains invalid characters")
	.refine(
		(name) => name.toLowerCase() !== "node_modules",
		"Project name is reserved",
	)
	.describe("Project name or path");
export type ProjectName = z.infer<typeof ProjectNameSchema>;

export const WebDeploySchema = z
	.enum(["workers", "none"])
	.describe("Web deployment");
export type WebDeploy = z.infer<typeof WebDeploySchema>;

export type CreateInput = {
	projectName?: string;
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
	webDeploy?: WebDeploy;
};

export type AddInput = {
	addons?: Addons[];
	webDeploy?: WebDeploy;
	projectDir?: string;
	install?: boolean;
	packageManager?: PackageManager;
};

export type CLIInput = CreateInput & {
	projectDirectory?: string;
};

export interface ProjectConfig {
	projectName: string;
	projectDir: string;
	relativePath: string;
	database: Database;
	orm: ORM;
	backend: Backend;
	runtime: Runtime;
	frontend: Frontend[];
	addons: Addons[];
	examples: Examples[];
	auth: boolean;
	git: boolean;
	packageManager: PackageManager;
	install: boolean;
	dbSetup: DatabaseSetup;
	api: API;
	webDeploy: WebDeploy;
}

export interface BetterTStackConfig {
	version: string;
	createdAt: string;
	database: Database;
	orm: ORM;
	backend: Backend;
	runtime: Runtime;
	frontend: Frontend[];
	addons: Addons[];
	examples: Examples[];
	auth: boolean;
	packageManager: PackageManager;
	dbSetup: DatabaseSetup;
	api: API;
	webDeploy: WebDeploy;
}

export type AvailablePackageManagers = "npm" | "pnpm" | "bun";
