import z from "zod";
import { ADDONS } from "@/constants/addons";
import { API_STRATEGIES } from "@/constants/api-strategy";
import { BACKEND_FRAMEWORKS } from "@/constants/backend-frameworks";
import { DATABASES_PROVIDERS } from "@/constants/database-providers";
import { DATABASES } from "@/constants/databases";
import { DIRECTORY_CONFLICT_STRATEGIES } from "@/constants/directory-conflict-strategies";
import { DOCKERS } from "@/constants/dockers";
import { EXAMPLES } from "@/constants/examples";
import { FRONTEND_FRAMEWORKS } from "@/constants/frontend-frameworks";
import { JAVASCRIPT_RUNTIMES } from "@/constants/javascript-runtimes";
import { ORM as ORM_OPTIONS } from "@/constants/orm";
import { PACKAGE_MANAGERS } from "@/constants/package-managers";
import { SERVER_DEPLOYMENT_STRATEGIES } from "@/constants/server-deployment-strategies";
import { WEB_DEPLOYMENT_STRATEGIES } from "@/constants/web-deployment-strategies";

export const DatabaseSchema = z.enum(DATABASES).describe("Database type");
export type Database = z.infer<typeof DatabaseSchema>;

export const ORMSchema = z.enum(ORM_OPTIONS).describe("ORM type");
export type ORM = z.infer<typeof ORMSchema>;

export const BackendSchema = z
	.enum(BACKEND_FRAMEWORKS)
	.describe("Backend framework");
export type Backend = z.infer<typeof BackendSchema>;

export const RuntimeSchema = z
	.enum(JAVASCRIPT_RUNTIMES)
	.describe("Runtime environment");
export type Runtime = z.infer<typeof RuntimeSchema>;

export const FrontendSchema = z
	.enum(FRONTEND_FRAMEWORKS)
	.describe("Frontend framework");
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

export const APISchema = z.enum(API_STRATEGIES).describe("API type");
export type API = z.infer<typeof APISchema>;

export const AuthSchema = z
	.enum(["better-auth", "clerk", "none"])
	.describe("Authentication provider");
export type Auth = z.infer<typeof AuthSchema>;

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

export const CreateInputSchema = z.tuple([
	ProjectNameSchema.optional(),
	z.object({
		yes: z
			.boolean()
			.optional()
			.default(false)
			.describe("Use default configuration"),
		yolo: z
			.boolean()
			.optional()
			.default(false)
			.describe(
				"(WARNING - NOT RECOMMENDED) Bypass validations and compatibility checks",
			),
		verbose: z
			.boolean()
			.optional()
			.default(false)
			.describe("Show detailed result information"),
		database: DatabaseSchema.optional(),
		orm: ORMSchema.optional(),
		auth: AuthSchema.optional(),
		frontend: z.array(FrontendSchema).optional(),
		addons: z.array(AddonsSchema).optional(),
		docker: z.array(DockerSchema).optional(),
		examples: z.array(ExamplesSchema).optional(),
		git: z.boolean().optional(),
		packageManager: PackageManagerSchema.optional(),
		install: z.boolean().optional(),
		dbSetup: DatabaseSetupSchema.optional(),
		backend: BackendSchema.optional(),
		runtime: RuntimeSchema.optional(),
		api: APISchema.optional(),
		webDeploy: WebDeploySchema.optional(),
		serverDeploy: ServerDeploySchema.optional(),
		directoryConflict: DirectoryConflictSchema.optional(),
		renderTitle: z.boolean().optional(),
		disableAnalytics: z
			.boolean()
			.optional()
			.default(false)
			.describe("Disable analytics"),
	}),
]);

export type CreateInput = z.infer<typeof CreateInputSchema>[1] & {
	projectName: z.infer<typeof CreateInputSchema>[0];
};

export const AddInputSchema = z.tuple([
	z.object({
		addons: z.array(AddonsSchema).optional().default([]),
		webDeploy: WebDeploySchema.optional(),
		serverDeploy: ServerDeploySchema.optional(),
		projectDir: z.string().optional(),
		install: z
			.boolean()
			.optional()
			.default(false)
			.describe("Install dependencies after adding addons or deployment"),
		packageManager: PackageManagerSchema.optional(),
	}),
]);

export type AddInput = z.infer<typeof AddInputSchema>[0];

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
