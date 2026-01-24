import { intro, log } from "@clack/prompts";
import { createRouterClient, os } from "@orpc/server";
import { Result } from "better-result";
import pc from "picocolors";
import { createCli } from "trpc-cli";
import z from "zod";

import { addHandler, type AddResult } from "./helpers/core/add-handler";
import { createProjectHandler } from "./helpers/core/command-handlers";
import {
  type Addons,
  AddonsSchema,
  type API,
  APISchema,
  type Auth,
  AuthSchema,
  type Backend,
  BackendSchema,
  type BetterTStackConfig,
  type CreateInput,
  type Database,
  DatabaseSchema,
  type DatabaseSetup,
  DatabaseSetupSchema,
  type DirectoryConflict,
  DirectoryConflictSchema,
  type Examples,
  ExamplesSchema,
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
  type Template,
  TemplateSchema,
  type WebDeploy,
  WebDeploySchema,
} from "./types";
import { CLIError, ProjectCreationError, UserCancelledError, displayError } from "./utils/errors";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { openUrl } from "./utils/open-url";
import { clearHistory, getHistory, type ProjectHistoryEntry } from "./utils/project-history";
import { renderTitle } from "./utils/render-title";
import { displaySponsors, fetchSponsors } from "./utils/sponsors";

function formatStackSummary(entry: ProjectHistoryEntry): string {
  const parts: string[] = [];

  if (entry.stack.frontend.length > 0 && !entry.stack.frontend.includes("none")) {
    parts.push(entry.stack.frontend.join(", "));
  }

  if (entry.stack.backend && entry.stack.backend !== "none") {
    parts.push(entry.stack.backend);
  }

  if (entry.stack.database && entry.stack.database !== "none") {
    parts.push(entry.stack.database);
  }

  if (entry.stack.orm && entry.stack.orm !== "none") {
    parts.push(entry.stack.orm);
  }

  return parts.length > 0 ? parts.join(" + ") : "minimal";
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function historyHandler(input: {
  limit: number;
  clear: boolean;
  json: boolean;
}): Promise<void> {
  if (input.clear) {
    await clearHistory();
    log.success(pc.green("Project history cleared."));
    return;
  }

  const entries = await getHistory(input.limit);

  if (entries.length === 0) {
    log.info(pc.dim("No projects in history yet."));
    log.info(pc.dim("Create a project with: create-better-t-stack my-app"));
    return;
  }

  if (input.json) {
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  renderTitle();
  intro(pc.magenta(`Project History (${entries.length} entries)`));

  for (const [index, entry] of entries.entries()) {
    const num = pc.dim(`${index + 1}.`);
    const name = pc.cyan(pc.bold(entry.projectName));
    const stack = pc.dim(formatStackSummary(entry));

    log.message(`${num} ${name}`);
    log.message(`   ${pc.dim("Created:")} ${formatDate(entry.createdAt)}`);
    log.message(`   ${pc.dim("Path:")} ${entry.projectDir}`);
    log.message(`   ${pc.dim("Stack:")} ${stack}`);
    log.message(`   ${pc.dim("Command:")} ${pc.dim(entry.reproducibleCommand)}`);
    log.message("");
  }
}

export const router = os.router({
  create: os
    .meta({
      description: "Create a new Better-T-Stack project",
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
          disableAnalytics: z.boolean().optional().default(false).describe("Disable analytics"),
          manualDb: z
            .boolean()
            .optional()
            .default(false)
            .describe("Skip automatic/manual database setup prompt and use manual setup"),
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
  sponsors: os.meta({ description: "Show Better-T-Stack sponsors" }).handler(async () => {
    const result = await Result.tryPromise({
      try: async () => {
        renderTitle();
        intro(pc.magenta("Better-T-Stack Sponsors"));
        const sponsors = await fetchSponsors();
        displaySponsors(sponsors);
      },
      catch: (e: unknown) =>
        new CLIError({
          message: e instanceof Error ? e.message : "Failed to display sponsors",
          cause: e,
        }),
    });
    if (result.isErr()) {
      displayError(result.error);
      process.exit(1);
    }
  }),
  docs: os.meta({ description: "Open Better-T-Stack documentation" }).handler(async () => {
    const DOCS_URL = "https://better-t-stack.dev/docs";
    const result = await Result.tryPromise({
      try: () => openUrl(DOCS_URL),
      catch: () => null,
    });
    if (result.isOk()) {
      log.success(pc.blue("Opened docs in your default browser."));
    } else {
      log.message(`Please visit ${DOCS_URL}`);
    }
  }),
  builder: os.meta({ description: "Open the web-based stack builder" }).handler(async () => {
    const BUILDER_URL = "https://better-t-stack.dev/new";
    const result = await Result.tryPromise({
      try: () => openUrl(BUILDER_URL),
      catch: () => null,
    });
    if (result.isOk()) {
      log.success(pc.blue("Opened builder in your default browser."));
    } else {
      log.message(`Please visit ${BUILDER_URL}`);
    }
  }),
  add: os
    .meta({ description: "Add addons to an existing Better-T-Stack project" })
    .input(
      z.object({
        addons: z.array(AddonsSchema).optional().describe("Addons to add"),
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
      await addHandler(input);
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
});

const caller = createRouterClient(router, { context: {} });

export function createBtsCli() {
  return createCli({
    router,
    name: "create-better-t-stack",
    version: getLatestCLIVersion(),
  });
}

// Re-export Result type from better-result for programmatic API consumers
export { Result } from "better-result";

/**
 * Error types that can be returned from create/createVirtual
 */
export type CreateError = UserCancelledError | CLIError | ProjectCreationError;

/**
 * Programmatic API to create a new Better-T-Stack project.
 * Returns a Result type - no console output, no interactive prompts.
 *
 * @example
 * ```typescript
 * import { create, Result } from "create-better-t-stack";
 *
 * const result = await create("my-app", {
 *   frontend: ["tanstack-router"],
 *   backend: "hono",
 *   runtime: "bun",
 *   database: "sqlite",
 *   orm: "drizzle",
 * });
 *
 * result.match({
 *   ok: (data) => console.log(`Project created at: ${data.projectDirectory}`),
 *   err: (error) => console.error(`Failed: ${error.message}`),
 * });
 *
 * // Or use unwrapOr for a default value
 * const data = result.unwrapOr(null);
 * ```
 */
export async function create(
  projectName?: string,
  options?: Partial<CreateInput>,
): Promise<Result<InitResult, CreateError>> {
  const input = {
    ...options,
    projectName,
    renderTitle: false,
    verbose: true,
    disableAnalytics: options?.disableAnalytics ?? true,
    directoryConflict: options?.directoryConflict ?? "error",
  } as CreateInput & { projectName?: string };

  return Result.tryPromise({
    try: async () => {
      const result = await createProjectHandler(input, { silent: true });
      if (!result) {
        // User cancelled (undefined return means cancellation in CLI mode)
        throw new UserCancelledError({ message: "Operation cancelled" });
      }
      if (!result.success) {
        throw new CLIError({
          message: result.error || "Unknown error occurred",
        });
      }
      return result as InitResult;
    },
    catch: (e: unknown) => {
      if (e instanceof UserCancelledError) return e;
      if (e instanceof CLIError) return e;
      if (e instanceof ProjectCreationError) return e;
      return new CLIError({
        message: e instanceof Error ? e.message : String(e),
        cause: e,
      });
    },
  });
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

// Re-export virtual filesystem types for programmatic usage
export {
  VirtualFileSystem,
  type VirtualFileTree,
  type VirtualFile,
  type VirtualDirectory,
  type VirtualNode,
  type GeneratorOptions,
  GeneratorError,
  generate,
  EMBEDDED_TEMPLATES,
  TEMPLATE_COUNT,
} from "@better-t-stack/template-generator";

// Import for createVirtual
import {
  generate,
  GeneratorError,
  type VirtualFileTree,
  EMBEDDED_TEMPLATES,
} from "@better-t-stack/template-generator";

/**
 * Programmatic API to generate a project in-memory (virtual filesystem).
 * Returns a Result with a VirtualFileTree without writing to disk.
 * Useful for web previews and testing.
 *
 * @example
 * ```typescript
 * import { createVirtual, EMBEDDED_TEMPLATES, Result } from "create-better-t-stack";
 *
 * const result = await createVirtual({
 *   frontend: ["tanstack-router"],
 *   backend: "hono",
 *   runtime: "bun",
 *   database: "sqlite",
 *   orm: "drizzle",
 * });
 *
 * result.match({
 *   ok: (tree) => console.log(`Generated ${tree.fileCount} files`),
 *   err: (error) => console.error(`Failed: ${error.message}`),
 * });
 * ```
 */
export async function createVirtual(
  options: Partial<Omit<ProjectConfig, "projectDir" | "relativePath">>,
): Promise<Result<VirtualFileTree, GeneratorError>> {
  const config: ProjectConfig = {
    projectName: options.projectName || "my-project",
    projectDir: "/virtual",
    relativePath: "./virtual",
    database: options.database || "none",
    orm: options.orm || "none",
    backend: options.backend || "hono",
    runtime: options.runtime || "bun",
    frontend: options.frontend || ["tanstack-router"],
    addons: options.addons || [],
    examples: options.examples || [],
    auth: options.auth || "none",
    payments: options.payments || "none",
    git: options.git ?? false,
    packageManager: options.packageManager || "bun",
    install: false,
    dbSetup: options.dbSetup || "none",
    api: options.api || "trpc",
    webDeploy: options.webDeploy || "none",
    serverDeploy: options.serverDeploy || "none",
  };

  return generate({
    config,
    templates: EMBEDDED_TEMPLATES,
  });
}

export type {
  CreateInput,
  InitResult,
  BetterTStackConfig,
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
  WebDeploy,
  ServerDeploy,
  Template,
  DirectoryConflict,
};

export type { AddResult };

/**
 * Programmatic API to add addons to an existing Better-T-Stack project.
 *
 * @example
 * ```typescript
 * import { add } from "create-better-t-stack";
 *
 * const result = await add({
 *   addons: ["biome", "husky"],
 *   install: true,
 * });
 *
 * if (result?.success) {
 *   console.log(`Added: ${result.addedAddons.join(", ")}`);
 * }
 * ```
 */
export async function add(
  options: {
    addons?: Addons[];
    install?: boolean;
    packageManager?: PackageManager;
    projectDir?: string;
  } = {},
): Promise<AddResult | undefined> {
  return addHandler(options, { silent: true });
}

// Re-export error types for consumers
export {
  UserCancelledError,
  CLIError,
  ProjectCreationError,
  ValidationError,
  CompatibilityError,
  DirectoryConflictError,
  DatabaseSetupError,
} from "./utils/errors";
