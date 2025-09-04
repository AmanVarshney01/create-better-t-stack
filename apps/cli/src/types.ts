import z from "zod";
import { DATABASES } from "@/constants/database";
import { ORMS } from "@/constants/orm";
import { BACKENDS } from "@/constants/backend";
import { RUNTIMES } from "@/constants/runtime";
import { FRONTEND } from "@/constants/frontend";
import { ADDONS } from "@/constants/addons";
import { DOCKERS } from "@/constants/docker";
import { EXAMPLES } from "@/constants/example";
import { PACKAGE_MANAGERS } from "@/constants/package-manager";
import { DATABASES_PROVIDERS } from "@/constants/database-providers";
import { APIS } from "@/constants/api-strategy";
import { WEB_DEPLOYMENT_STRATEGIES } from "@/constants/web-deployment-strategy";
import { SERVER_DEPLOYMENT_STRATEGIES } from "@/constants/server-deployment-strategy";
import { DIRECTORY_CONFLICT_STRATEGIES } from "@/constants/directory-conflict-strategy";

export const DatabaseSchema = z.enum(DATABASES).describe("Database type");
export type Database = z.infer<typeof DatabaseSchema>;

export const ORMSchema = z.enum(ORMS).describe("ORM type");
export type ORM = z.infer<typeof ORMSchema>;

export const BackendSchema = z.enum(BACKENDS).describe("Backend framework");
export type Backend = z.infer<typeof BackendSchema>;

export const RuntimeSchema = z.enum(RUNTIMES).describe("Runtime environment");
export type Runtime = z.infer<typeof RuntimeSchema>;

export const FrontendSchema = z.enum(FRONTEND).describe("Frontend framework");
export type Frontend = z.infer<typeof FrontendSchema>;

export const AddonsSchema = z.enum(ADDONS).describe("Addon");
export type Addons = z.infer<typeof AddonsSchema>;

export const DockerSchema = z.enum(DOCKERS).describe("Docker configuration");
export type Docker = z.infer<typeof DockerSchema>;

export const ExamplesSchema = z.enum(EXAMPLES).describe("Example template");
export type Examples = z.infer<typeof ExamplesSchema>;

export const PackageManagerSchema = z
	.enum(PACKAGE_MANAGERS)
	.describe("Package manager");
export type PackageManager = z.infer<typeof PackageManagerSchema>;

export const DatabaseSetupSchema = z
	.enum(DATABASES_PROVIDERS)
	.describe("Database setup");
export type DatabaseSetup = z.infer<typeof DatabaseSetupSchema>;

export const APISchema = z.enum(APIS).describe("API type");
export type API = z.infer<typeof APISchema>;

export const AuthSchema = z
	.enum(["better-auth", "clerk", "none"])
	.describe("Authentication provider");
export type Auth = z.infer<typeof AuthSchema>;

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
	.enum(WEB_DEPLOYMENT_STRATEGIES)
	.describe("Web deployment");
export type WebDeploy = z.infer<typeof WebDeploySchema>;

export const ServerDeploySchema = z
	.enum(SERVER_DEPLOYMENT_STRATEGIES)
	.describe("Server deployment");
export type ServerDeploy = z.infer<typeof ServerDeploySchema>;

export const DirectoryConflictSchema = z
	.enum(DIRECTORY_CONFLICT_STRATEGIES)
	.describe("How to handle existing directory conflicts");
export type DirectoryConflict = z.infer<typeof DirectoryConflictSchema>;

export type CreateInput = {
	projectName?: string;
	yes?: boolean;
	yolo?: boolean;
	verbose?: boolean;
	database?: Database;
	orm?: ORM;
	auth?: Auth;
	frontend?: Frontend[];
	addons?: Addons[];
	docker?: Docker[];
	examples?: Examples[];
	git?: boolean;
	packageManager?: PackageManager;
	install?: boolean;
	dbSetup?: DatabaseSetup;
	backend?: Backend;
	runtime?: Runtime;
	api?: API;
	webDeploy?: WebDeploy;
	serverDeploy?: ServerDeploy;
	directoryConflict?: DirectoryConflict;
	renderTitle?: boolean;
	disableAnalytics?: boolean;
};

export type AddInput = {
	addons?: Addons[];
	docker?: Docker[];
	webDeploy?: WebDeploy;
	serverDeploy?: ServerDeploy;
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
	docker: Docker[];
	examples: Examples[];
	auth: Auth;
	git: boolean;
	packageManager: PackageManager;
	install: boolean;
	dbSetup: DatabaseSetup;
	api: API;
	webDeploy: WebDeploy;
	serverDeploy: ServerDeploy;
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
	docker: Docker[];
	examples: Examples[];
	auth: Auth;
	packageManager: PackageManager;
	dbSetup: DatabaseSetup;
	api: API;
	webDeploy: WebDeploy;
	serverDeploy: ServerDeploy;
}

export interface InitResult {
	success: boolean;
	projectConfig: ProjectConfig;
	reproducibleCommand: string;
	timeScaffolded: string;
	elapsedTimeMs: number;
	projectDirectory: string;
	relativePath: string;
	error?: string;
}
