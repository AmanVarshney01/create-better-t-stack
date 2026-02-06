import { z } from "zod";

export const DatabaseSchema = z
  .enum(["none", "sqlite", "postgres", "mysql", "mongodb"])
  .describe("Database type");

export const ORMSchema = z.enum(["drizzle", "prisma", "mongoose", "none"]).describe("ORM type");

export const BackendSchema = z
  .enum(["hono", "express", "fastify", "elysia", "convex", "self", "none"])
  .describe("Backend framework");

export const RuntimeSchema = z
  .enum(["bun", "node", "workers", "none"])
  .describe("Runtime environment");

export const FrontendSchema = z
  .enum([
    "tanstack-router",
    "react-router",
    "tanstack-start",
    "next",
    "nuxt",
    "native-bare",
    "native-uniwind",
    "native-unistyles",
    "svelte",
    "solid",
    "astro",
    "none",
  ])
  .describe("Frontend framework");

export const AddonsSchema = z
  .enum([
    "pwa",
    "tauri",
    "starlight",
    "biome",
    "lefthook",
    "husky",
    "ruler",
    "turborepo",
    "fumadocs",
    "ultracite",
    "oxlint",
    "opentui",
    "wxt",
    "skills",
    "none",
  ])
  .describe("Additional addons");

export const ExamplesSchema = z
  .enum(["todo", "ai", "none"])
  .describe("Example templates to include");

export const PackageManagerSchema = z.enum(["npm", "pnpm", "bun"]).describe("Package manager");

export const DatabaseSetupSchema = z
  .enum([
    "turso",
    "neon",
    "prisma-postgres",
    "planetscale",
    "mongodb-atlas",
    "supabase",
    "d1",
    "docker",
    "none",
  ])
  .describe("Database hosting setup");

export const APISchema = z.enum(["trpc", "orpc", "none"]).describe("API type");

export const AuthSchema = z
  .enum(["better-auth", "clerk", "none"])
  .describe("Authentication provider");

export const PaymentsSchema = z.enum(["polar", "none"]).describe("Payments provider");

export const WebDeploySchema = z.enum(["cloudflare", "none"]).describe("Web deployment");

export const ServerDeploySchema = z.enum(["cloudflare", "none"]).describe("Server deployment");

export const DirectoryConflictSchema = z
  .enum(["merge", "overwrite", "increment", "error"])
  .describe("How to handle existing directory conflicts");

export const TemplateSchema = z
  .enum(["mern", "pern", "t3", "uniwind", "none"])
  .describe("Predefined project template");

export const ProjectNameSchema = z
  .string()
  .min(1, "Project name cannot be empty")
  .max(255, "Project name must be less than 255 characters")
  .refine(
    (name) => name === "." || !name.startsWith("."),
    "Project name cannot start with a dot (except for '.')",
  )
  .refine((name) => name === "." || !name.startsWith("-"), "Project name cannot start with a dash")
  .refine((name) => {
    const invalidChars = ["<", ">", ":", '"', "|", "?", "*"];
    return !invalidChars.some((char) => name.includes(char));
  }, "Project name contains invalid characters")
  .refine((name) => name.toLowerCase() !== "node_modules", "Project name is reserved")
  .describe("Project name or path");

export const CreateInputSchema = z.object({
  projectName: z.string().optional(),
  template: TemplateSchema.optional(),
  yes: z.boolean().optional(),
  yolo: z.boolean().optional(),
  verbose: z.boolean().optional(),
  database: DatabaseSchema.optional(),
  orm: ORMSchema.optional(),
  auth: AuthSchema.optional(),
  payments: PaymentsSchema.optional(),
  frontend: z.array(FrontendSchema).optional(),
  addons: z.array(AddonsSchema).optional(),
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
  disableAnalytics: z.boolean().optional(),
  manualDb: z.boolean().optional(),
});

export const AddInputSchema = z.object({
  addons: z.array(AddonsSchema).optional(),
  webDeploy: WebDeploySchema.optional(),
  serverDeploy: ServerDeploySchema.optional(),
  projectDir: z.string().optional(),
  install: z.boolean().optional(),
  packageManager: PackageManagerSchema.optional(),
});

export const CLIInputSchema = CreateInputSchema.extend({
  projectDirectory: z.string().optional(),
});

export const ProjectConfigSchema = z.object({
  projectName: z.string(),
  projectDir: z.string(),
  relativePath: z.string(),
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  runtime: RuntimeSchema,
  frontend: z.array(FrontendSchema),
  addons: z.array(AddonsSchema),
  examples: z.array(ExamplesSchema),
  auth: AuthSchema,
  payments: PaymentsSchema,
  git: z.boolean(),
  packageManager: PackageManagerSchema,
  install: z.boolean(),
  dbSetup: DatabaseSetupSchema,
  api: APISchema,
  webDeploy: WebDeploySchema,
  serverDeploy: ServerDeploySchema,
});

export const BetterTStackConfigSchema = z.object({
  version: z.string().describe("CLI version used to create this project"),
  createdAt: z.string().describe("Timestamp when the project was created"),
  reproducibleCommand: z.string().optional().describe("Command to reproduce this project setup"),
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  runtime: RuntimeSchema,
  frontend: z.array(FrontendSchema),
  addons: z.array(AddonsSchema),
  examples: z.array(ExamplesSchema),
  auth: AuthSchema,
  payments: PaymentsSchema,
  packageManager: PackageManagerSchema,
  dbSetup: DatabaseSetupSchema,
  api: APISchema,
  webDeploy: WebDeploySchema,
  serverDeploy: ServerDeploySchema,
});

export const BetterTStackConfigFileSchema = z
  .object({
    $schema: z.string().optional().describe("JSON Schema reference for validation"),
  })
  .extend(BetterTStackConfigSchema.shape)
  .meta({
    id: "https://r2.better-t-stack.dev/schema.json",
    title: "Better-T-Stack Configuration",
    description: "Configuration file for Better-T-Stack projects",
  });

export const InitResultSchema = z.object({
  success: z.boolean(),
  projectConfig: ProjectConfigSchema,
  reproducibleCommand: z.string(),
  timeScaffolded: z.string(),
  elapsedTimeMs: z.number(),
  projectDirectory: z.string(),
  relativePath: z.string(),
  error: z.string().optional(),
});

export const DATABASE_VALUES = DatabaseSchema.options;
export const ORM_VALUES = ORMSchema.options;
export const BACKEND_VALUES = BackendSchema.options;
export const RUNTIME_VALUES = RuntimeSchema.options;
export const FRONTEND_VALUES = FrontendSchema.options;
export const ADDONS_VALUES = AddonsSchema.options;
export const EXAMPLES_VALUES = ExamplesSchema.options;
export const PACKAGE_MANAGER_VALUES = PackageManagerSchema.options;
export const DATABASE_SETUP_VALUES = DatabaseSetupSchema.options;
export const API_VALUES = APISchema.options;
export const AUTH_VALUES = AuthSchema.options;
export const PAYMENTS_VALUES = PaymentsSchema.options;
export const WEB_DEPLOY_VALUES = WebDeploySchema.options;
export const SERVER_DEPLOY_VALUES = ServerDeploySchema.options;
export const DIRECTORY_CONFLICT_VALUES = DirectoryConflictSchema.options;
export const TEMPLATE_VALUES = TemplateSchema.options;
