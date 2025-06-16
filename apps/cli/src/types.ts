import { z } from "zod";

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
	.enum(["bun", "node", "none"])
	.describe("Runtime environment");
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
		"angular",
		"none",
	])
	.describe("Frontend framework");
export type Frontend = z.infer<typeof FrontendSchema>;

export const AddonsSchema = z
	.enum(["pwa", "tauri", "starlight", "biome", "husky", "turborepo", "none"])
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
}

export type AvailablePackageManagers = "npm" | "pnpm" | "bun";
