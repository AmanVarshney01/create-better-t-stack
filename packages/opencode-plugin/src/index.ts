import {
  ADDONS_VALUES,
  API_VALUES,
  AUTH_VALUES,
  BACKEND_VALUES,
  DATABASE_SETUP_VALUES,
  DATABASE_VALUES,
  DIRECTORY_CONFLICT_VALUES,
  EXAMPLES_VALUES,
  FRONTEND_VALUES,
  ORM_VALUES,
  PACKAGE_MANAGER_VALUES,
  PAYMENTS_VALUES,
  RUNTIME_VALUES,
  SERVER_DEPLOY_VALUES,
  WEB_DEPLOY_VALUES,
} from "@better-t-stack/types";
import { tool, type Plugin } from "@opencode-ai/plugin";
import {
  add,
  create,
  getSchemaResult,
  getStackGuidance,
  readBtsConfig,
} from "create-better-t-stack";

// Use opencode's bundled zod (via tool.schema) so arg schemas match the host runtime.
const z = tool.schema;
const enumOf = (values: readonly string[]) => z.enum(values as [string, ...string[]]);

function ok(data: unknown): string {
  return JSON.stringify({ ok: true, data }, null, 2);
}

function fail(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return JSON.stringify({ ok: false, error: message }, null, 2);
}

// Shared explicit project-config args. Enum values come from @better-t-stack/types,
// so the option set always tracks the CLI.
const projectConfigArgs = {
  frontend: z
    .array(enumOf(FRONTEND_VALUES))
    .describe("App surfaces (not styling). Use [] for none, e.g. an API-only project."),
  backend: enumOf(BACKEND_VALUES),
  runtime: enumOf(RUNTIME_VALUES),
  database: enumOf(DATABASE_VALUES),
  orm: enumOf(ORM_VALUES),
  api: enumOf(API_VALUES),
  auth: enumOf(AUTH_VALUES),
  payments: enumOf(PAYMENTS_VALUES),
  addons: z.array(enumOf(ADDONS_VALUES)).describe("Use [] when no addons are requested."),
  examples: z.array(enumOf(EXAMPLES_VALUES)).describe("Use [] when no examples are requested."),
  git: z.boolean(),
  packageManager: enumOf(PACKAGE_MANAGER_VALUES),
  dbSetup: enumOf(DATABASE_SETUP_VALUES).describe("Use 'none' when no DB provisioning is wanted."),
  webDeploy: enumOf(WEB_DEPLOY_VALUES),
  serverDeploy: enumOf(SERVER_DEPLOY_VALUES),
  directoryConflict: enumOf(DIRECTORY_CONFLICT_VALUES).optional(),
  addonOptions: z.any().optional().describe("Nested addon options (see bts_get_schema)."),
  dbSetupOptions: z
    .any()
    .optional()
    .describe("Nested database-setup options (see bts_get_schema)."),
};

const addonArgs = {
  projectDir: z.string().describe("Path to the existing Better-T-Stack project"),
  addons: z.array(enumOf(ADDONS_VALUES)).describe("Addons to install"),
  packageManager: enumOf(PACKAGE_MANAGER_VALUES).optional(),
  addonOptions: z.any().optional().describe("Nested addon options (see bts_get_schema)."),
};

// Build a short system-prompt note so the agent is Better-T-Stack aware: inside a
// BTS project it knows the stack and to extend via the addon tools; elsewhere it
// knows the scaffold tools exist. Computed once at plugin load for the workspace.
async function buildSystemContext(directory: string): Promise<string> {
  let config: Awaited<ReturnType<typeof readBtsConfig>> = null;
  try {
    config = await readBtsConfig(directory);
  } catch {
    config = null;
  }

  if (config) {
    const parts: string[] = [];
    if (Array.isArray(config.frontend) && config.frontend.length) {
      parts.push(`frontend [${config.frontend.join(", ")}]`);
    }
    if (config.backend) parts.push(`backend ${config.backend}`);
    if (config.runtime) parts.push(`runtime ${config.runtime}`);
    if (config.database && config.database !== "none") parts.push(`database ${config.database}`);
    if (config.orm && config.orm !== "none") parts.push(`orm ${config.orm}`);
    if (config.api && config.api !== "none") parts.push(`api ${config.api}`);
    if (config.auth && config.auth !== "none") parts.push(`auth ${config.auth}`);
    if (Array.isArray(config.addons) && config.addons.length) {
      parts.push(`addons [${config.addons.join(", ")}]`);
    }
    const stack = parts.length ? ` Stack: ${parts.join(", ")}.` : "";
    return [
      `This workspace is a Better-T-Stack project (bts.jsonc present).${stack}`,
      "When the user wants to add tooling or features (PWA, docs, linters, task runners, the MCP addon, etc.), use the bts_add_addons tool — call bts_plan_addons first — instead of wiring it by hand.",
      "To scaffold a brand-new project, use bts_plan_project then bts_create_project.",
    ].join(" ");
  }

  return [
    "Better-T-Stack tools are available to scaffold new end-to-end type-safe projects.",
    "When the user wants to start, create, or bootstrap a new app/API/fullstack project, prefer bts_plan_project then bts_create_project (use bts_get_schema / bts_get_stack_guidance for valid options) over hand-writing project config and folders.",
  ].join(" ");
}

/**
 * Better-T-Stack opencode plugin.
 *
 * Registers native opencode tools that plan and generate end-to-end type-safe
 * projects with Better-T-Stack (mirroring the official MCP server), and injects
 * Better-T-Stack awareness into the system prompt so the agent reaches for the
 * right tools — scaffolding new projects, or extending the current one via addons.
 *
 * The agent should call bts_plan_project before bts_create_project, and
 * bts_plan_addons before bts_add_addons.
 */
export const BetterTStackPlugin: Plugin = async ({ directory }) => {
  const systemContext = await buildSystemContext(directory);

  return {
    "experimental.chat.system.transform": async (_input, output) => {
      output.system.push(systemContext);
    },
    tool: {
      bts_get_stack_guidance: tool({
        description:
          "Read guidance for choosing a valid Better-T-Stack configuration: the full explicit config the create tools expect, field semantics, and ambiguity rules. Use this first when a request is ambiguous.",
        args: {},
        async execute() {
          try {
            return ok(getStackGuidance());
          } catch (error) {
            return fail(error);
          }
        },
      }),

      bts_get_schema: tool({
        description:
          "Inspect Better-T-Stack CLI and input schemas (the exact allowed values for every field). Use together with bts_get_stack_guidance before planning when any part of the request is ambiguous.",
        args: {
          name: z
            .string()
            .optional()
            .describe(
              "Schema name (e.g. createInput, addInput, projectConfig). Defaults to 'all'.",
            ),
        },
        async execute({ name }) {
          try {
            return ok(getSchemaResult((name ?? "all") as never));
          } catch (error) {
            return fail(error);
          }
        },
      }),

      bts_plan_project: tool({
        description:
          "Validate and preview a Better-T-Stack project without writing files or provisioning resources (dry run). Always call this before bts_create_project. Provide a full explicit config; use 'none', [], and booleans rather than omitting fields.",
        args: {
          projectName: z.string().describe("Project name or relative path"),
          ...projectConfigArgs,
        },
        async execute({ projectName, ...config }) {
          try {
            const result = await create(projectName, {
              ...(config as Record<string, unknown>),
              dryRun: true,
              disableAnalytics: true,
            });
            return result.isErr() ? fail(result.error) : ok(result.value);
          } catch (error) {
            return fail(error);
          }
        },
      }),

      bts_create_project: tool({
        description:
          "Create a Better-T-Stack project on disk. Call only after bts_plan_project succeeds and matches the user's intent. Dependencies are NOT installed — tell the user to run their package manager's install in the new project directory afterwards.",
        args: {
          projectName: z.string().describe("Project name or relative path"),
          ...projectConfigArgs,
        },
        async execute({ projectName, ...config }) {
          try {
            const result = await create(projectName, {
              ...(config as Record<string, unknown>),
              install: false,
              disableAnalytics: true,
            });
            return result.isErr() ? fail(result.error) : ok(result.value);
          } catch (error) {
            return fail(error);
          }
        },
      }),

      bts_plan_addons: tool({
        description:
          "Validate and preview addon installation for an existing Better-T-Stack project without writing files (dry run). Always call this before bts_add_addons.",
        args: addonArgs,
        async execute({ projectDir, addons, packageManager, addonOptions }) {
          try {
            const result = await add({
              projectDir,
              addons: addons as never,
              packageManager: packageManager as never,
              addonOptions: addonOptions as never,
              install: false,
              dryRun: true,
            });
            return result?.success
              ? ok(result)
              : fail(result?.error ?? "Failed to plan addon installation");
          } catch (error) {
            return fail(error);
          }
        },
      }),

      bts_add_addons: tool({
        description:
          "Install addons into an existing Better-T-Stack project. Call only after bts_plan_addons succeeds and the planned changes match the user's intent. Dependencies are NOT installed.",
        args: addonArgs,
        async execute({ projectDir, addons, packageManager, addonOptions }) {
          try {
            const result = await add({
              projectDir,
              addons: addons as never,
              packageManager: packageManager as never,
              addonOptions: addonOptions as never,
              install: false,
            });
            return result?.success ? ok(result) : fail(result?.error ?? "Failed to add addons");
          } catch (error) {
            return fail(error);
          }
        },
      }),
    },
  };
};

export default BetterTStackPlugin;
