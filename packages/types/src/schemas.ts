import { z } from "zod";

export const DatabaseSchema = z
  .enum(["none", "sqlite", "postgres", "mysql", "mongodb"])
  .describe("Database type");

export const ORMSchema = z
  .enum(["drizzle", "prisma", "mongoose", "typeorm", "kysely", "mikroorm", "sequelize", "none"])
  .describe("ORM type");

export const BackendSchema = z
  .enum([
    "hono",
    "express",
    "fastify",
    "elysia",
    "fets",
    "nestjs",
    "adonisjs",
    "nitro",
    "encore",
    "convex",
    "self",
    "none",
  ])
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
    "qwik",
    "angular",
    "redwood",
    "fresh",
    "none",
  ])
  .describe("Frontend framework");

export const AstroIntegrationSchema = z
  .enum(["react", "vue", "svelte", "solid", "none"])
  .describe("Astro UI framework integration");

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
    "msw",
    "storybook",
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

export const APISchema = z.enum(["trpc", "orpc", "ts-rest", "garph", "none"]).describe("API type");

export const AuthSchema = z
  .enum(["better-auth", "clerk", "nextauth", "none"])
  .describe("Authentication provider");

export const PaymentsSchema = z
  .enum(["polar", "stripe", "lemon-squeezy", "paddle", "dodo", "none"])
  .describe("Payments provider");

export const WebDeploySchema = z.enum(["cloudflare", "none"]).describe("Web deployment");

export const ServerDeploySchema = z.enum(["cloudflare", "none"]).describe("Server deployment");

export const AISchema = z.enum(["vercel-ai", "langchain", "llamaindex", "none"]).describe("AI SDK");

export const EffectSchema = z
  .enum(["effect", "effect-full", "none"])
  .describe(
    "Effect ecosystem (effect-full includes @effect/schema, @effect/platform, @effect/sql)",
  );

export const StateManagementSchema = z
  .enum([
    "zustand",
    "jotai",
    "nanostores",
    "redux-toolkit",
    "mobx",
    "xstate",
    "valtio",
    "tanstack-store",
    "legend-state",
    "none",
  ])
  .describe("State management library");

export const FormsSchema = z
  .enum([
    "tanstack-form",
    "react-hook-form",
    "formik",
    "final-form",
    "conform",
    "modular-forms",
    "none",
  ])
  .describe("Form handling library");

export const ValidationSchema = z
  .enum(["zod", "valibot", "arktype", "typebox", "typia", "runtypes", "effect-schema", "none"])
  .describe("Schema validation library (none uses Zod as default for internal usage)");

export const TestingSchema = z
  .enum(["vitest", "playwright", "vitest-playwright", "jest", "cypress", "none"])
  .describe("Testing framework (vitest-playwright includes both unit and e2e testing)");

export const EmailSchema = z
  .enum([
    "react-email",
    "resend",
    "nodemailer",
    "postmark",
    "sendgrid",
    "aws-ses",
    "mailgun",
    "plunk",
    "none",
  ])
  .describe(
    "Email solution (resend includes react-email, nodemailer is classic Node.js email, postmark/sendgrid/aws-ses/mailgun/plunk are transactional email services)",
  );

export const RealtimeSchema = z
  .enum(["socket-io", "none"])
  .describe("Real-time/WebSocket solution");

export const AnimationSchema = z
  .enum(["framer-motion", "gsap", "react-spring", "auto-animate", "lottie", "none"])
  .describe("Animation library");

export const FileUploadSchema = z
  .enum(["uploadthing", "filepond", "uppy", "none"])
  .describe("File upload solution");

export const LoggingSchema = z
  .enum(["pino", "winston", "none"])
  .describe("Server-side logging framework");

export const ObservabilitySchema = z
  .enum(["opentelemetry", "none"])
  .describe("Observability and distributed tracing");

export const CSSFrameworkSchema = z
  .enum(["tailwind", "scss", "less", "postcss-only", "none"])
  .describe("CSS framework/preprocessor");

export const UILibrarySchema = z
  .enum([
    "shadcn-ui",
    "daisyui",
    "radix-ui",
    "headless-ui",
    "park-ui",
    "chakra-ui",
    "nextui",
    "mantine",
    "base-ui",
    "ark-ui",
    "react-aria",
    "none",
  ])
  .describe("UI component library");

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
  astroIntegration: AstroIntegrationSchema.optional(),
  ai: AISchema.optional(),
  effect: EffectSchema.optional(),
  stateManagement: StateManagementSchema.optional(),
  forms: FormsSchema.optional(),
  testing: TestingSchema.optional(),
  email: EmailSchema.optional(),
  cssFramework: CSSFrameworkSchema.optional(),
  uiLibrary: UILibrarySchema.optional(),
  validation: ValidationSchema.optional(),
  realtime: RealtimeSchema.optional(),
  animation: AnimationSchema.optional(),
  fileUpload: FileUploadSchema.optional(),
  logging: LoggingSchema.optional(),
  observability: ObservabilitySchema.optional(),
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
  astroIntegration: AstroIntegrationSchema.optional(),
  ai: AISchema,
  effect: EffectSchema,
  stateManagement: StateManagementSchema,
  forms: FormsSchema,
  testing: TestingSchema,
  email: EmailSchema,
  cssFramework: CSSFrameworkSchema,
  uiLibrary: UILibrarySchema,
  validation: ValidationSchema,
  realtime: RealtimeSchema,
  animation: AnimationSchema,
  fileUpload: FileUploadSchema,
  logging: LoggingSchema,
  observability: ObservabilitySchema,
});

export const BetterTStackConfigSchema = z.object({
  version: z.string().describe("CLI version used to create this project"),
  createdAt: z.string().describe("Timestamp when the project was created"),
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
  astroIntegration: AstroIntegrationSchema.optional(),
  ai: AISchema,
  effect: EffectSchema,
  stateManagement: StateManagementSchema,
  forms: FormsSchema,
  testing: TestingSchema,
  email: EmailSchema,
  cssFramework: CSSFrameworkSchema,
  uiLibrary: UILibrarySchema,
  validation: ValidationSchema,
  realtime: RealtimeSchema,
  animation: AnimationSchema,
  fileUpload: FileUploadSchema,
  logging: LoggingSchema,
  observability: ObservabilitySchema,
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
export const ASTRO_INTEGRATION_VALUES = AstroIntegrationSchema.options;
export const AI_VALUES = AISchema.options;
export const EFFECT_VALUES = EffectSchema.options;
export const STATE_MANAGEMENT_VALUES = StateManagementSchema.options;
export const FORMS_VALUES = FormsSchema.options;
export const TESTING_VALUES = TestingSchema.options;
export const EMAIL_VALUES = EmailSchema.options;
export const CSS_FRAMEWORK_VALUES = CSSFrameworkSchema.options;
export const UI_LIBRARY_VALUES = UILibrarySchema.options;
export const VALIDATION_VALUES = ValidationSchema.options;
export const REALTIME_VALUES = RealtimeSchema.options;
export const ANIMATION_VALUES = AnimationSchema.options;
export const FILE_UPLOAD_VALUES = FileUploadSchema.options;
export const LOGGING_VALUES = LoggingSchema.options;
export const OBSERVABILITY_VALUES = ObservabilitySchema.options;
