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
    "electrobun",
    "starlight",
    "biome",
    "lefthook",
    "husky",
    "mcp",
    "turborepo",
    "nx",
    "fumadocs",
    "ultracite",
    "oxlint",
    "opentui",
    "wxt",
    "skills",
    "none",
  ])
  .describe("Additional addons");

const AddonsListSchema = z.array(AddonsSchema).superRefine((addons, ctx) => {
  if (addons.includes("nx") && addons.includes("turborepo")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "`nx` and `turborepo` cannot be used together",
    });
  }
});

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

export const WxtTemplateSchema = z
  .enum(["vanilla", "vue", "react", "solid", "svelte"])
  .describe("WXT template");

export const TuiTemplateSchema = z.enum(["core", "react", "solid"]).describe("OpenTUI template");

export const FumadocsTemplateSchema = z
  .enum([
    "next-mdx",
    "next-mdx-static",
    "waku",
    "react-router",
    "react-router-spa",
    "tanstack-start",
    "tanstack-start-spa",
  ])
  .describe("Fumadocs template");

export const InstallScopeSchema = z.enum(["project", "global"]).describe("Installation scope");

export const McpServerSchema = z
  .enum([
    "better-t-stack",
    "context7",
    "nx",
    "cloudflare-docs",
    "convex",
    "shadcn",
    "next-devtools",
    "nuxt-docs",
    "nuxt-ui-docs",
    "svelte-docs",
    "astro-docs",
    "planetscale",
    "neon",
    "supabase",
    "better-auth",
    "clerk",
    "expo",
    "polar",
  ])
  .describe("MCP server to install");

export const McpAgentSchema = z
  .enum([
    "antigravity",
    "cline",
    "cline-cli",
    "cursor",
    "claude-code",
    "codex",
    "opencode",
    "gemini-cli",
    "github-copilot-cli",
    "mcporter",
    "vscode",
    "zed",
    "claude-desktop",
    "goose",
  ])
  .describe("Agent target for MCP installation");

export const SkillsSourceSchema = z
  .enum([
    "vercel-labs/agent-skills",
    "vercel/ai",
    "vercel/turborepo",
    "yusukebe/hono-skill",
    "vercel-labs/next-skills",
    "nuxt/ui",
    "heroui-inc/heroui",
    "shadcn/ui",
    "better-auth/skills",
    "clerk/skills",
    "neondatabase/agent-skills",
    "supabase/agent-skills",
    "planetscale/database-skills",
    "expo/skills",
    "prisma/skills",
    "elysiajs/skills",
    "waynesutton/convexskills",
    "msmps/opentui-skill",
    "haydenbleasel/ultracite",
  ])
  .describe("Skill source repository");

export const SkillsAgentSchema = z
  .enum([
    "cursor",
    "claude-code",
    "cline",
    "github-copilot",
    "codex",
    "opencode",
    "windsurf",
    "goose",
    "roo",
    "kilo",
    "gemini-cli",
    "antigravity",
    "openhands",
    "trae",
    "amp",
    "pi",
    "qoder",
    "qwen-code",
    "kiro-cli",
    "droid",
    "command-code",
    "clawdbot",
    "zencoder",
    "neovate",
    "mcpjam",
  ])
  .describe("Agent target for skill installation");

export const SkillSelectionSchema = z.strictObject({
  source: SkillsSourceSchema.describe("Skill source to install from"),
  skills: z.array(z.string()).describe("Curated skill names to install from this source"),
});

export const UltraciteLinterSchema = z
  .enum(["biome", "eslint", "oxlint"])
  .describe("Ultracite linter");

export const UltraciteEditorSchema = z
  .enum(["vscode", "cursor", "windsurf", "antigravity", "kiro", "trae", "void", "zed"])
  .describe("Ultracite editor integration");

export const UltraciteAgentSchema = z
  .enum([
    "claude",
    "codex",
    "jules",
    "copilot",
    "cline",
    "amp",
    "aider",
    "firebase-studio",
    "open-hands",
    "gemini",
    "junie",
    "augmentcode",
    "kilo-code",
    "goose",
    "roo-code",
    "warp",
    "droid",
    "opencode",
    "crush",
    "qwen",
    "amazon-q-cli",
    "firebender",
    "cursor-cli",
    "mistral-vibe",
    "vercel",
  ])
  .describe("Ultracite agent integration");

export const UltraciteHookSchema = z
  .enum(["cursor", "windsurf", "claude"])
  .describe("Ultracite hook integration");

export const DbSetupModeSchema = z.enum(["manual", "auto"]).describe("Database setup mode");

export const NeonSetupMethodSchema = z
  .enum(["neondb", "neonctl"])
  .describe("Neon database provisioning method");

export const AddonOptionsSchema = z
  .strictObject({
    wxt: z
      .strictObject({
        template: WxtTemplateSchema,
        devPort: z.number().int().min(1).max(65535).optional().describe("WXT dev server port"),
      })
      .optional()
      .describe("Options for the WXT addon"),
    fumadocs: z
      .strictObject({
        template: FumadocsTemplateSchema,
        devPort: z.number().int().min(1).max(65535).optional().describe("Fumadocs dev server port"),
      })
      .optional()
      .describe("Options for the Fumadocs addon"),
    opentui: z
      .strictObject({
        template: TuiTemplateSchema,
      })
      .optional()
      .describe("Options for the OpenTUI addon"),
    mcp: z
      .strictObject({
        scope: InstallScopeSchema.optional(),
        servers: z.array(McpServerSchema).optional().describe("MCP servers to install"),
        agents: z.array(McpAgentSchema).optional().describe("Agents to wire MCP servers into"),
      })
      .optional()
      .describe("Options for the MCP addon"),
    skills: z
      .strictObject({
        scope: InstallScopeSchema.optional(),
        agents: z.array(SkillsAgentSchema).optional().describe("Agents to install skills into"),
        selections: z.array(SkillSelectionSchema).optional().describe("Skills grouped by source"),
      })
      .optional()
      .describe("Options for the Skills addon"),
    ultracite: z
      .strictObject({
        linter: UltraciteLinterSchema.optional(),
        editors: z.array(UltraciteEditorSchema).optional(),
        agents: z.array(UltraciteAgentSchema).optional(),
        hooks: z.array(UltraciteHookSchema).optional(),
      })
      .optional()
      .describe("Options for the Ultracite addon"),
  })
  .describe("Addon-specific configuration");

export const DbSetupOptionsSchema = z
  .strictObject({
    mode: DbSetupModeSchema.optional().describe("How database setup should be executed"),
    neon: z
      .strictObject({
        method: NeonSetupMethodSchema.optional(),
        projectName: z.string().min(1).optional().describe("Neon project name"),
        regionId: z.string().min(1).optional().describe("Neon region identifier"),
      })
      .optional()
      .describe("Options for Neon setup"),
    prismaPostgres: z
      .strictObject({
        regionId: z.string().min(1).optional().describe("Prisma Postgres region identifier"),
      })
      .optional()
      .describe("Options for Prisma Postgres setup"),
    turso: z
      .strictObject({
        databaseName: z.string().min(1).optional().describe("Turso database name"),
        groupName: z.string().min(1).optional().describe("Turso database group name"),
        installCli: z
          .boolean()
          .optional()
          .describe("Whether the CLI may install the Turso CLI automatically"),
      })
      .optional()
      .describe("Options for Turso setup"),
  })
  .describe("Database setup configuration");

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

export const CreateInputSchema = z
  .object({
    projectName: z.string().optional(),
    template: TemplateSchema.optional(),
    yes: z.boolean().optional(),
    yolo: z.boolean().optional(),
    dryRun: z.boolean().optional(),
    verbose: z.boolean().optional(),
    addonOptions: AddonOptionsSchema.optional(),
    dbSetupOptions: DbSetupOptionsSchema.optional(),
    database: DatabaseSchema.optional(),
    orm: ORMSchema.optional(),
    auth: AuthSchema.optional(),
    payments: PaymentsSchema.optional(),
    frontend: z.array(FrontendSchema).optional(),
    addons: AddonsListSchema.optional(),
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
  })
  .strict()
  .refine((input) => !(input.manualDb !== undefined && input.dbSetupOptions?.mode !== undefined), {
    message: "`manualDb` and `dbSetupOptions.mode` are mutually exclusive",
    path: ["dbSetupOptions", "mode"],
  });

export const AddInputSchema = z
  .object({
    addons: AddonsListSchema.optional(),
    addonOptions: AddonOptionsSchema.optional(),
    webDeploy: WebDeploySchema.optional(),
    serverDeploy: ServerDeploySchema.optional(),
    projectDir: z.string().optional(),
    install: z.boolean().optional(),
    packageManager: PackageManagerSchema.optional(),
    dryRun: z.boolean().optional(),
  })
  .strict();

export const CLIInputSchema = CreateInputSchema.safeExtend({
  projectDirectory: z.string().optional(),
}).strict();

export const ProjectConfigSchema = z.object({
  projectName: z.string(),
  projectDir: z.string(),
  relativePath: z.string(),
  addonOptions: AddonOptionsSchema.optional(),
  dbSetupOptions: DbSetupOptionsSchema.optional(),
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  runtime: RuntimeSchema,
  frontend: z.array(FrontendSchema),
  addons: AddonsListSchema,
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
  addonOptions: AddonOptionsSchema.optional(),
  dbSetupOptions: DbSetupOptionsSchema.optional(),
  database: DatabaseSchema,
  orm: ORMSchema,
  backend: BackendSchema,
  runtime: RuntimeSchema,
  frontend: z.array(FrontendSchema),
  addons: AddonsListSchema,
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
  .strict()
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
