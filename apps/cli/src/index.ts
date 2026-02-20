import { intro, log } from "@clack/prompts";
import { createRouterClient, os } from "@orpc/server";
import pc from "picocolors";
import { createCli } from "trpc-cli";
import z from "zod";

import { historyHandler } from "./commands/history";
import { updateDepsHandler, showEcosystems } from "./commands/update-deps";
import { addHandler, type AddResult } from "./helpers/core/add-handler";
import { createProjectHandler } from "./helpers/core/command-handlers";
import {
  type AddInput,
  type Addons,
  AddonsSchema,
  AISchema,
  type API,
  APISchema,
  AstroIntegrationSchema,
  type Auth,
  AuthSchema,
  type Backend,
  BackendSchema,
  type BetterTStackConfig,
  type CreateInput,
  type CSSFramework,
  CSSFrameworkSchema,
  type Database,
  DatabaseSchema,
  type DatabaseSetup,
  DatabaseSetupSchema,
  type DirectoryConflict,
  DirectoryConflictSchema,
  type Ecosystem,
  EcosystemSchema,
  type Effect,
  EffectSchema,
  EmailSchema,
  type Examples,
  FileUploadSchema,
  ExamplesSchema,
  FormsSchema,
  type Frontend,
  FrontendSchema,
  type InitResult,
  type ORM,
  ORMSchema,
  type PackageManager,
  PackageManagerSchema,
  type Payments,
  PaymentsSchema,
  type ProjectConfig,
  ProjectNameSchema,
  type Runtime,
  RuntimeSchema,
  type ServerDeploy,
  ServerDeploySchema,
  StateManagementSchema,
  type Template,
  TemplateSchema,
  TestingSchema,
  type UILibrary,
  UILibrarySchema,
  ValidationSchema,
  type WebDeploy,
  WebDeploySchema,
  RealtimeSchema,
  type Realtime,
  JobQueueSchema,
  AnimationSchema,
  type Animation,
  LoggingSchema,
  type Logging,
  ObservabilitySchema,
  AnalyticsSchema,
  type Analytics,
  CMSSchema,
  type CMS,
  CachingSchema,
  type Caching,
  SearchSchema,
  FileStorageSchema,
  RustWebFrameworkSchema,
  type RustWebFramework,
  RustFrontendSchema,
  type RustFrontend,
  RustOrmSchema,
  type RustOrm,
  RustApiSchema,
  type RustApi,
  RustCliSchema,
  type RustCli,
  RustLibrariesSchema,
  type RustLibraries,
  PythonWebFrameworkSchema,
  type PythonWebFramework,
  PythonOrmSchema,
  type PythonOrm,
  PythonValidationSchema,
  type PythonValidation,
  PythonAiSchema,
  type PythonAi,
  PythonTaskQueueSchema,
  type PythonTaskQueue,
  PythonQualitySchema,
  type PythonQuality,
  GoWebFrameworkSchema,
  type GoWebFramework,
  GoOrmSchema,
  type GoOrm,
  GoApiSchema,
  type GoApi,
  GoCliSchema,
  type GoCli,
  GoLoggingSchema,
  type GoLogging,
  AiDocsSchema,
  type AiDocs,
} from "./types";
import { handleError } from "./utils/errors";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { openUrl } from "./utils/open-url";
import { renderTitle } from "./utils/render-title";
import { displaySponsors, fetchSponsors } from "./utils/sponsors";

export const router = os.router({
  create: os
    .meta({
      description: "Create a new Better Fullstack project",
      default: true,
      negateBooleans: true,
    })
    .input(
      z.tuple([
        ProjectNameSchema.optional(),
        z.object({
          template: TemplateSchema.optional().describe("Use a predefined template"),
          yes: z.boolean().optional().default(false).describe("Use default configuration"),
          yolo: z
            .boolean()
            .optional()
            .default(false)
            .describe("(WARNING - NOT RECOMMENDED) Bypass validations and compatibility checks"),
          verbose: z
            .boolean()
            .optional()
            .default(false)
            .describe("Show detailed result information"),
          ecosystem: EcosystemSchema.optional().describe(
            "Language ecosystem (typescript, rust, or python)",
          ),
          database: DatabaseSchema.optional(),
          orm: ORMSchema.optional(),
          auth: AuthSchema.optional(),
          payments: PaymentsSchema.optional(),
          email: EmailSchema.optional(),
          fileUpload: FileUploadSchema.optional(),
          effect: EffectSchema.optional(),
          stateManagement: StateManagementSchema.optional(),
          validation: ValidationSchema.optional(),
          forms: FormsSchema.optional(),
          testing: TestingSchema.optional(),
          ai: AISchema.optional(),
          realtime: RealtimeSchema.optional(),
          jobQueue: JobQueueSchema.optional(),
          animation: AnimationSchema.optional(),
          logging: LoggingSchema.optional(),
          observability: ObservabilitySchema.optional(),
          analytics: AnalyticsSchema.optional().describe("Privacy-focused analytics"),
          cms: CMSSchema.optional().describe("Headless CMS solution"),
          caching: CachingSchema.optional().describe("Caching solution"),
          search: SearchSchema.optional().describe("Search engine solution"),
          fileStorage: FileStorageSchema.optional().describe("File storage solution (S3, R2)"),
          frontend: z.array(FrontendSchema).optional(),
          astroIntegration: AstroIntegrationSchema.optional().describe(
            "Astro UI framework integration (react, vue, svelte, solid)",
          ),
          addons: z.array(AddonsSchema).optional(),
          examples: z.array(ExamplesSchema).optional(),
          git: z.boolean().optional(),
          packageManager: PackageManagerSchema.optional(),
          install: z.boolean().optional(),
          dbSetup: DatabaseSetupSchema.optional(),
          backend: BackendSchema.optional(),
          runtime: RuntimeSchema.optional(),
          api: APISchema.optional(),
          cssFramework: CSSFrameworkSchema.optional(),
          uiLibrary: UILibrarySchema.optional(),
          webDeploy: WebDeploySchema.optional(),
          serverDeploy: ServerDeploySchema.optional(),
          directoryConflict: DirectoryConflictSchema.optional(),
          renderTitle: z.boolean().optional(),
          disableAnalytics: z.boolean().optional().default(false).describe("Disable analytics"),
          manualDb: z
            .boolean()
            .optional()
            .default(false)
            .describe("Skip automatic/manual database setup prompt and use manual setup"),
          // Rust ecosystem options
          rustWebFramework: RustWebFrameworkSchema.optional().describe(
            "Rust web framework (axum, actix-web)",
          ),
          rustFrontend: RustFrontendSchema.optional().describe(
            "Rust WASM frontend (leptos, dioxus)",
          ),
          rustOrm: RustOrmSchema.optional().describe("Rust ORM/database (sea-orm, sqlx)"),
          rustApi: RustApiSchema.optional().describe("Rust API layer (tonic, async-graphql)"),
          rustCli: RustCliSchema.optional().describe("Rust CLI tools (clap, ratatui)"),
          rustLibraries: z.array(RustLibrariesSchema).optional().describe("Rust core libraries"),
          // Python ecosystem options
          pythonWebFramework: PythonWebFrameworkSchema.optional().describe(
            "Python web framework (fastapi, django)",
          ),
          pythonOrm: PythonOrmSchema.optional().describe(
            "Python ORM/database (sqlalchemy, sqlmodel)",
          ),
          pythonValidation: PythonValidationSchema.optional().describe(
            "Python validation (pydantic)",
          ),
          pythonAi: z.array(PythonAiSchema).optional().describe("Python AI/ML frameworks"),
          pythonTaskQueue: PythonTaskQueueSchema.optional().describe("Python task queue (celery)"),
          pythonQuality: PythonQualitySchema.optional().describe("Python code quality (ruff)"),
          // Go ecosystem options
          goWebFramework: GoWebFrameworkSchema.optional().describe("Go web framework (gin, echo)"),
          goOrm: GoOrmSchema.optional().describe("Go ORM/database (gorm, sqlc)"),
          goApi: GoApiSchema.optional().describe("Go API layer (grpc-go)"),
          goCli: GoCliSchema.optional().describe("Go CLI tools (cobra, bubbletea)"),
          goLogging: GoLoggingSchema.optional().describe("Go logging (zap)"),
          // AI documentation files
          aiDocs: z
            .array(AiDocsSchema)
            .optional()
            .describe("AI documentation files (claude-md, agents-md, cursorrules)"),
        }),
      ]),
    )
    .handler(async ({ input }) => {
      const [projectName, options] = input;
      const combinedInput = {
        projectName,
        ...options,
      };
      const result = await createProjectHandler(combinedInput);

      if (options.verbose) {
        return result;
      }
    }),
  sponsors: os.meta({ description: "Show Better Fullstack sponsors" }).handler(async () => {
    try {
      renderTitle();
      intro(pc.magenta("Better Fullstack Sponsors"));
      const sponsors = await fetchSponsors();
      displaySponsors(sponsors);
    } catch (error) {
      handleError(error, "Failed to display sponsors");
    }
  }),
  docs: os.meta({ description: "Open Better Fullstack documentation" }).handler(async () => {
    const DOCS_URL = "https://better-fullstack-web.vercel.app/docs";
    try {
      await openUrl(DOCS_URL);
      log.success(pc.blue("Opened docs in your default browser."));
    } catch {
      log.message(`Please visit ${DOCS_URL}`);
    }
  }),
  builder: os.meta({ description: "Open the web-based stack builder" }).handler(async () => {
    const BUILDER_URL = "https://better-fullstack-web.vercel.app/new";
    try {
      await openUrl(BUILDER_URL);
      log.success(pc.blue("Opened builder in your default browser."));
    } catch {
      log.message(`Please visit ${BUILDER_URL}`);
    }
  }),
  add: os
    .meta({ description: "Add addons to an existing Better Fullstack project" })
    .input(
      z.object({
        addons: z.array(AddonsSchema).optional().describe("Addons to add"),
        webDeploy: WebDeploySchema.optional().describe("Web deployment option to set"),
        serverDeploy: ServerDeploySchema.optional().describe("Server deployment option to set"),
        install: z
          .boolean()
          .optional()
          .default(false)
          .describe("Install dependencies after adding"),
        packageManager: PackageManagerSchema.optional().describe("Package manager to use"),
        projectDir: z.string().optional().describe("Project directory (defaults to current)"),
      }),
    )
    .handler(async ({ input }) => {
      await addHandler(input as AddInput);
    }),
  history: os
    .meta({ description: "Show project creation history" })
    .input(
      z.object({
        limit: z.number().optional().default(10).describe("Number of entries to show"),
        clear: z.boolean().optional().default(false).describe("Clear all history"),
        json: z.boolean().optional().default(false).describe("Output as JSON"),
      }),
    )
    .handler(async ({ input }) => {
      await historyHandler(input);
    }),
  "update-deps": os
    .meta({ description: "Check and update dependency versions in add-deps.ts" })
    .input(
      z.object({
        check: z.boolean().default(false).describe("Report only, no changes"),
        patch: z.boolean().default(false).describe("Apply patch/minor updates only"),
        all: z.boolean().default(false).describe("Interactive mode for all updates"),
        ecosystem: z
          .string()
          .optional()
          .describe("Filter by ecosystem (effect, tanstack, prisma, etc.)"),
        "list-ecosystems": z.boolean().default(false).describe("List available ecosystems"),
      }),
    )
    .handler(async ({ input }) => {
      if (input["list-ecosystems"]) {
        showEcosystems();
        return;
      }
      await updateDepsHandler({
        check: input.check,
        patch: input.patch,
        all: input.all,
        ecosystem: input.ecosystem,
      });
    }),
});

const caller = createRouterClient(router, { context: {} });

export function createBtsCli() {
  return createCli({
    router,
    name: "create-better-fullstack",
    version: getLatestCLIVersion(),
  });
}

/**
 * Programmatic API to create a new Better Fullstack project.
 * Returns pure JSON - no console output, no interactive prompts.
 *
 * @example
 * ```typescript
 * import { create } from "create-better-fullstack";
 *
 * const result = await create("my-app", {
 *   frontend: ["tanstack-router"],
 *   backend: "hono",
 *   runtime: "bun",
 *   database: "sqlite",
 *   orm: "drizzle",
 * });
 *
 * if (result.success) {
 *   console.log(`Project created at: ${result.projectDirectory}`);
 * }
 * ```
 */
export async function create(
  projectName?: string,
  options?: Partial<CreateInput>,
): Promise<InitResult> {
  const input = {
    ...options,
    projectName,
    renderTitle: false,
    verbose: true,
    disableAnalytics: options?.disableAnalytics ?? true,
    directoryConflict: options?.directoryConflict ?? "error",
  } as CreateInput & { projectName?: string };

  try {
    return (await createProjectHandler(input, { silent: true })) as InitResult;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      projectConfig: {} as ProjectConfig,
      reproducibleCommand: "",
      timeScaffolded: new Date().toISOString(),
      elapsedTimeMs: 0,
      projectDirectory: "",
      relativePath: "",
    };
  }
}

export async function sponsors() {
  return caller.sponsors();
}

export async function docs() {
  return caller.docs();
}

export async function builder() {
  return caller.builder();
}

export async function add(input: AddInput): Promise<AddResult | undefined> {
  return addHandler(input, { silent: true });
}

export async function history(options?: { limit?: number; clear?: boolean; json?: boolean }) {
  return caller.history({
    limit: options?.limit ?? 10,
    clear: options?.clear ?? false,
    json: options?.json ?? false,
  });
}

// Re-export virtual filesystem types for programmatic usage
export {
  VirtualFileSystem,
  type VirtualFileTree,
  type VirtualFile,
  type VirtualDirectory,
  type VirtualNode,
  type GeneratorOptions,
  type GeneratorResult,
  EMBEDDED_TEMPLATES,
  TEMPLATE_COUNT,
  generateVirtualProject,
} from "@better-fullstack/template-generator";

// Import for createVirtual
import {
  generateVirtualProject as generate,
  type VirtualFileTree,
  EMBEDDED_TEMPLATES,
} from "@better-fullstack/template-generator";

/**
 * Programmatic API to generate a project in-memory (virtual filesystem).
 * Returns a VirtualFileTree without writing to disk.
 * Useful for web previews and testing.
 *
 * @example
 * ```typescript
 * import { createVirtual, EMBEDDED_TEMPLATES } from "create-better-fullstack";
 *
 * const result = await createVirtual({
 *   frontend: ["tanstack-router"],
 *   backend: "hono",
 *   runtime: "bun",
 *   database: "sqlite",
 *   orm: "drizzle",
 * });
 *
 * if (result.success) {
 *   console.log(`Generated ${result.tree.fileCount} files`);
 * }
 * ```
 */
export async function createVirtual(
  options: Partial<Omit<ProjectConfig, "projectDir" | "relativePath">>,
): Promise<{ success: boolean; tree?: VirtualFileTree; error?: string }> {
  try {
    const config: ProjectConfig = {
      projectName: options.projectName || "my-project",
      projectDir: "/virtual",
      relativePath: "./virtual",
      ecosystem: options.ecosystem || "typescript",
      database: options.database || "none",
      orm: options.orm || "none",
      backend: options.backend || "hono",
      runtime: options.runtime || "bun",
      frontend: options.frontend || ["tanstack-router"],
      addons: options.addons || [],
      examples: options.examples || [],
      auth: options.auth || "none",
      payments: options.payments || "none",
      email: options.email || "none",
      fileUpload: options.fileUpload || "none",
      effect: options.effect || "none",
      git: options.git ?? false,
      packageManager: options.packageManager || "bun",
      install: false,
      dbSetup: options.dbSetup || "none",
      api: options.api || "trpc",
      webDeploy: options.webDeploy || "none",
      serverDeploy: options.serverDeploy || "none",
      cssFramework: options.cssFramework || "tailwind",
      uiLibrary: options.uiLibrary || "shadcn-ui",
      ai: options.ai || "none",
      stateManagement: options.stateManagement || "none",
      forms: options.forms || "react-hook-form",
      testing: options.testing || "vitest",
      validation: options.validation || "zod",
      realtime: options.realtime || "none",
      jobQueue: options.jobQueue || "none",
      animation: options.animation || "none",
      logging: options.logging || "none",
      observability: options.observability || "none",
      featureFlags: options.featureFlags || "none",
      analytics: options.analytics || "none",
      cms: options.cms || "none",
      caching: options.caching || "none",
      search: options.search || "none",
      fileStorage: options.fileStorage || "none",
      // Rust ecosystem options
      rustWebFramework: options.rustWebFramework || "none",
      rustFrontend: options.rustFrontend || "none",
      rustOrm: options.rustOrm || "none",
      rustApi: options.rustApi || "none",
      rustCli: options.rustCli || "none",
      rustLibraries: options.rustLibraries || [],
      // Python ecosystem options
      pythonWebFramework: options.pythonWebFramework || "none",
      pythonOrm: options.pythonOrm || "none",
      pythonValidation: options.pythonValidation || "none",
      pythonAi: options.pythonAi || [],
      pythonTaskQueue: options.pythonTaskQueue || "none",
      pythonQuality: options.pythonQuality || "none",
      // Go ecosystem options
      goWebFramework: options.goWebFramework || "none",
      goOrm: options.goOrm || "none",
      goApi: options.goApi || "none",
      goCli: options.goCli || "none",
      goLogging: options.goLogging || "none",
      // AI documentation files
      aiDocs: options.aiDocs || ["claude-md"],
    };

    const result = await generate({
      config,
      templates: EMBEDDED_TEMPLATES,
    });

    if (result.success && result.tree) {
      return { success: true, tree: result.tree };
    }

    return { success: false, error: result.error || "Unknown error" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export type {
  CreateInput,
  AddInput,
  InitResult,
  BetterTStackConfig,
  Ecosystem,
  Database,
  ORM,
  Backend,
  Runtime,
  Frontend,
  Addons,
  Examples,
  PackageManager,
  DatabaseSetup,
  API,
  Auth,
  Payments,
  Effect,
  WebDeploy,
  ServerDeploy,
  Template,
  DirectoryConflict,
  CSSFramework,
  UILibrary,
  Realtime,
  Animation,
  Logging,
  RustWebFramework,
  RustFrontend,
  RustOrm,
  RustApi,
  RustCli,
  RustLibraries,
  CMS,
  Caching,
  Analytics,
  PythonWebFramework,
  PythonOrm,
  PythonValidation,
  PythonAi,
  PythonTaskQueue,
  PythonQuality,
  GoWebFramework,
  GoOrm,
  GoApi,
  GoCli,
  GoLogging,
  AiDocs,
  AddResult,
};
