import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import z from "zod";

import { add, create, type SchemaName, SchemaNameSchema, getSchemaResult } from "./index";
import {
  AddInputSchema,
  AddonOptionsSchema,
  AddonsSchema,
  APISchema,
  AuthSchema,
  BackendSchema,
  CreateInputSchema,
  DatabaseSchema,
  DatabaseSetupSchema,
  DbSetupOptionsSchema,
  DirectoryConflictSchema,
  ExamplesSchema,
  FrontendSchema,
  ORMSchema,
  PackageManagerSchema,
  PaymentsSchema,
  RuntimeSchema,
  ServerDeploySchema,
  WebDeploySchema,
} from "./types";
import { setProcessMode } from "./utils/context";
import { durationBucket, reportDiagnostic, scrubReason } from "./utils/diagnostics";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";

const ToolResponseSchema = z.object({
  ok: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

const SchemaToolInputSchema = z.object({
  name: SchemaNameSchema.optional().describe("Schema name to inspect. Defaults to all."),
});

const McpCreateProjectInputSchema = CreateInputSchema.safeExtend({
  projectName: z.string().describe("Project name or relative path"),
  frontend: z
    .array(FrontendSchema)
    .describe("Explicit frontend app surfaces. Do not use native frontends as styling options."),
  backend: BackendSchema.describe("Explicit backend framework"),
  runtime: RuntimeSchema.describe("Explicit runtime environment"),
  database: DatabaseSchema.describe("Explicit database choice"),
  orm: ORMSchema.describe("Explicit ORM choice"),
  api: APISchema.describe("Explicit API layer"),
  auth: AuthSchema.describe("Explicit authentication provider"),
  payments: PaymentsSchema.describe("Explicit payments provider"),
  addons: z.array(AddonsSchema).describe("Explicit addon list. Use [] when no addons are needed."),
  examples: z
    .array(ExamplesSchema)
    .describe("Explicit example list. Use [] when no examples are needed."),
  git: z.boolean().describe("Whether to initialize a git repository"),
  packageManager: PackageManagerSchema.describe("Explicit package manager"),
  install: z.boolean().describe("Whether to install dependencies"),
  dbSetup: DatabaseSetupSchema.describe("Explicit database setup/provisioning choice"),
  webDeploy: WebDeploySchema.describe("Explicit web deployment choice"),
  serverDeploy: ServerDeploySchema.describe("Explicit server deployment choice"),
  addonOptions: AddonOptionsSchema.optional(),
  dbSetupOptions: DbSetupOptionsSchema.optional(),
  directoryConflict: DirectoryConflictSchema.optional(),
}).describe(
  "Explicit Better T Stack project configuration for MCP use. Provide the full stack config instead of relying on inferred defaults.",
);

type SchemaToolInput = {
  name?: SchemaName;
};
type McpCreateProjectInput = z.infer<typeof McpCreateProjectInputSchema>;
type McpAddInput = z.infer<typeof AddInputSchema>;

function formatToolSuccess<T>(data: T) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
    structuredContent: {
      ok: true,
      data,
    },
  };
}

function formatToolError(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause);
  return {
    content: [
      {
        type: "text" as const,
        text: message,
      },
    ],
    structuredContent: {
      ok: false,
      error: message,
    },
    isError: true,
  };
}

type ToolResult = ReturnType<typeof formatToolSuccess> | ReturnType<typeof formatToolError>;

const reportedSessions = new WeakSet<McpServer>();

/** One session event per connection, sent when the client identity is first known. */
function reportMcpSession(server: McpServer) {
  if (reportedSessions.has(server)) return;
  reportedSessions.add(server);
  const client = server.server.getClientVersion();
  void reportDiagnostic("mcp_session", {
    client: client?.name ?? "unknown",
    clientVersion: client?.version ?? "unknown",
  });
}

/**
 * Times every tool call and reports the outcome. Diagnostics are fire-and-forget here
 * because the server process is long-lived and must not add latency to tool results.
 */
function instrumentTool<Args extends unknown[]>(
  server: McpServer,
  tool: string,
  handler: (...args: Args) => Promise<ToolResult>,
  isOptedOut?: (...args: Args) => boolean,
) {
  return async (...args: Args): Promise<ToolResult> => {
    if (isOptedOut?.(...args)) return handler(...args);
    reportMcpSession(server);
    const startTime = Date.now();
    const result = await handler(...args);
    const ok = !("isError" in result);
    void reportDiagnostic("mcp_tool", {
      tool,
      ok,
      duration: durationBucket(Date.now() - startTime),
    });
    if (!ok) {
      void reportDiagnostic("mcp_tool_error", {
        tool,
        error: "ToolError",
        reason: scrubReason(result.structuredContent.error),
      });
    }
    return result;
  };
}

function isCreateOptedOut(input: McpCreateProjectInput) {
  return input.disableAnalytics === true;
}

function getProjectToolAnnotations() {
  return {
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  };
}

function getMcpInstallTimeoutMessage(packageManager: string) {
  return [
    "MCP project creation requires `install: false`.",
    "Dependency installation can exceed common MCP client request timeouts and cause the connection to close before the tool returns.",
    `Scaffold the project first, then run \`${packageManager} install\` in the generated project directory from a terminal.`,
  ].join(" ");
}

function getStackGuidance() {
  return {
    workflow: [
      "Call bts_get_schema or bts_get_stack_guidance before constructing a config if the request is ambiguous.",
      "For project creation, build a full explicit config before calling bts_plan_project.",
      "Always call bts_plan_project before bts_create_project.",
      "Only call bts_create_project after the plan succeeds and matches the user's intent.",
      "Use bts_plan_addons before bts_add_addons when adding addons or scaffolding a workspace package in an existing project.",
    ],
    createContract: {
      requiresExplicitFields: [
        "projectName",
        "frontend",
        "backend",
        "runtime",
        "database",
        "orm",
        "api",
        "auth",
        "payments",
        "addons",
        "examples",
        "git",
        "packageManager",
        "install",
        "dbSetup",
        "webDeploy",
        "serverDeploy",
      ],
      optionalFields: ["addonOptions", "dbSetupOptions", "directoryConflict"],
      rule: "Do not call bts_plan_project or bts_create_project with a partial payload. MCP project creation requires the full explicit stack config.",
    },
    fieldNotes: {
      frontend:
        "frontend is for app surfaces only. Choose explicit app targets such as next, react-router, tanstack-router, native-bare, native-uniwind, or native-unistyles.",
      addons: "addons must be an explicit array. Use [] when no addons are requested.",
      examples: "examples must be an explicit array. Use [] when no examples are requested.",
      dbSetup:
        "dbSetup is always required. Use 'none' when no managed database provisioning is requested.",
      webDeploy:
        "webDeploy is always required. Use 'none' when no web deployment target is requested.",
      serverDeploy:
        "serverDeploy is always required. Use 'none' when no server deployment target is requested.",
      packageManager:
        "packageManager is always required because installation and reproducible commands depend on it.",
      install:
        "install is always required. For MCP project creation, prefer false because many clients enforce request timeouts around long-running dependency installs.",
      git: "git is always required. Set it to true or false explicitly instead of relying on defaults.",
    },
    ambiguityRules: [
      "If the user request leaves major stack choices unspecified, stop and resolve them before calling bts_plan_project.",
      "Do not infer extra app surfaces, addons, examples, or provisioning choices from a template name or styling preference.",
      "If the user wants the smallest valid stack, still send the full config with explicit 'none', [] , true, or false values where appropriate.",
      "For MCP execution, scaffold with install=false and let the user or agent run dependency installation separately from a terminal session.",
    ],
  };
}

export function createBtsMcpServer() {
  setProcessMode("mcp");
  const server = new McpServer(
    {
      name: "create-better-t-stack",
      version: getLatestCLIVersion(),
    },
    {
      cacheHints: {
        "tools/list": { ttlMs: 60 * 60 * 1000, cacheScope: "public" },
      },
    },
  );

  server.registerTool(
    "bts_get_stack_guidance",
    {
      title: "Get Better T Stack MCP Guidance",
      description:
        "Read MCP-specific guidance for choosing valid Better T Stack configurations. Use this before planning when user intent is ambiguous. This explains the full explicit config required by MCP project creation, plus important field semantics and ambiguity rules.",
      outputSchema: ToolResponseSchema,
      annotations: {
        title: "Get Better T Stack MCP Guidance",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    instrumentTool(server, "bts_get_stack_guidance", async () => {
      try {
        return formatToolSuccess(getStackGuidance());
      } catch (error) {
        return formatToolError(error);
      }
    }),
  );

  server.registerTool(
    "bts_get_schema",
    {
      title: "Get Better T Stack Schemas",
      description:
        "Inspect Better T Stack CLI and input schemas so agents can plan valid create/add requests. Use this together with bts_get_stack_guidance before creating a project if any part of the request is ambiguous.",
      inputSchema: SchemaToolInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: {
        title: "Get Better T Stack Schemas",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    instrumentTool(server, "bts_get_schema", async ({ name }: SchemaToolInput) => {
      try {
        return formatToolSuccess(getSchemaResult((name ?? "all") as SchemaName));
      } catch (error) {
        return formatToolError(error);
      }
    }),
  );

  server.registerTool(
    "bts_plan_project",
    {
      title: "Plan Better T Stack Project",
      description:
        "Validate and preview a Better T Stack project creation without writing files or provisioning resources. Always use this before bts_create_project. This tool requires an explicit full stack config rather than a partial payload with inferred defaults.",
      inputSchema: McpCreateProjectInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: {
        title: "Plan Better T Stack Project",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    instrumentTool(
      server,
      "bts_plan_project",
      async (input: McpCreateProjectInput) => {
        try {
          const result = await create(input.projectName, {
            ...input,
            dryRun: true,
            disableAnalytics: true,
          });

          if (result.isErr()) {
            return formatToolError(result.error);
          }

          const planningData = input.install
            ? {
                ...result.value,
                warnings: [getMcpInstallTimeoutMessage(input.packageManager)],
                recommendedMcpExecution: {
                  ...input,
                  install: false,
                },
              }
            : result.value;

          return formatToolSuccess(planningData);
        } catch (error) {
          return formatToolError(error);
        }
      },
      isCreateOptedOut,
    ),
  );

  server.registerTool(
    "bts_create_project",
    {
      title: "Create Better T Stack Project",
      description:
        "Create a Better T Stack project on disk using the same silent programmatic flow as the CLI JSON API. Call this only after bts_plan_project succeeds and the plan clearly matches the user's intent. This tool requires an explicit full stack config.",
      inputSchema: McpCreateProjectInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: {
        title: "Create Better T Stack Project",
        ...getProjectToolAnnotations(),
      },
    },
    instrumentTool(
      server,
      "bts_create_project",
      async (input: McpCreateProjectInput) => {
        try {
          if (input.install) {
            return formatToolError(getMcpInstallTimeoutMessage(input.packageManager));
          }

          const result = await create(input.projectName, {
            ...input,
            disableAnalytics: input.disableAnalytics ?? false,
          });

          if (result.isErr()) {
            return formatToolError(result.error);
          }

          return formatToolSuccess(result.value);
        } catch (error) {
          return formatToolError(error);
        }
      },
      isCreateOptedOut,
    ),
  );

  server.registerTool(
    "bts_plan_addons",
    {
      title: "Plan Better T Stack Project Additions",
      description:
        "Validate and preview addon installation or workspace package scaffolding for an existing Better T Stack project without writing files. Always use this before bts_add_addons.",
      inputSchema: AddInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: {
        title: "Plan Better T Stack Project Additions",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    instrumentTool(server, "bts_plan_addons", async (input: McpAddInput) => {
      try {
        const result = await add({
          ...input,
          dryRun: true,
        });

        if (!result?.success) {
          return formatToolError(result?.error ?? "Failed to plan project additions");
        }

        return formatToolSuccess(result);
      } catch (error) {
        return formatToolError(error);
      }
    }),
  );

  server.registerTool(
    "bts_add_addons",
    {
      title: "Apply Better T Stack Project Additions",
      description:
        "Install addons or scaffold a workspace package in an existing Better T Stack project using the same silent flow as add-json. Call this only after bts_plan_addons succeeds and the planned changes match the user's intent.",
      inputSchema: AddInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: {
        title: "Apply Better T Stack Project Additions",
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    instrumentTool(server, "bts_add_addons", async (input: McpAddInput) => {
      try {
        const result = await add(input);

        if (!result?.success) {
          return formatToolError(result?.error ?? "Failed to update project");
        }

        return formatToolSuccess(result);
      } catch (error) {
        return formatToolError(error);
      }
    }),
  );

  return server;
}

export function startBtsMcpServer() {
  return serveStdio(() => createBtsMcpServer());
}
