import { EMBEDDED_TEMPLATES, generate, type VirtualNode } from "@better-t-stack/template-generator";
import {
  AddonsSchema,
  APISchema,
  AuthSchema,
  BackendSchema,
  DatabaseSchema,
  DatabaseSetupSchema,
  ExamplesSchema,
  FrontendSchema,
  FULLSTACK_FRONTENDS,
  ORMSchema,
  PackageManagerSchema,
  PaymentsSchema,
  RuntimeSchema,
  ServerDeploySchema,
  WebDeploySchema,
} from "@better-t-stack/types";
import { getAllJsonSchemas } from "@better-t-stack/types/json-schema";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { TECH_OPTIONS, type StackState } from "@/lib/constant";
import { resolveStackCompatibility } from "@/lib/stack-compatibility";
import { stackStateToConfig } from "@/lib/stack-schema";
import {
  formatProjectName,
  generateStackCommand,
  generateStackUrlFromState,
} from "@/lib/stack-utils";
import { validateProjectName } from "@/lib/stack-validation";

import cliPackage from "../../../cli/package.json";

const MAX_LISTED_FILES = 500;
const MAX_FILE_BYTES = 100_000;

const ToolResponseSchema = z.object({
  ok: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

const STACK_FIELDS = [
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
  "dbSetup",
  "webDeploy",
  "serverDeploy",
] as const;

const HostedProjectInputSchema = z
  .object({
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
    addons: z
      .array(AddonsSchema)
      .describe("Explicit addon list. Use [] when no addons are needed."),
    examples: z
      .array(ExamplesSchema)
      .describe("Explicit example list. Use [] when no examples are needed."),
    git: z.boolean().describe("Whether the generated command initializes a git repository"),
    packageManager: PackageManagerSchema.describe("Explicit package manager"),
    install: z.boolean().describe("Whether the generated command installs dependencies"),
    dbSetup: DatabaseSetupSchema.describe("Explicit database setup/provisioning choice"),
    webDeploy: WebDeploySchema.describe("Explicit web deployment choice"),
    serverDeploy: ServerDeploySchema.describe("Explicit server deployment choice"),
  })
  // Nested addonOptions/dbSetupOptions have cross-field rules only the CLI enforces, so the
  // hosted server rejects them rather than returning a command the CLI would refuse.
  .strict()
  .describe(
    "Explicit Better T Stack project configuration. Provide the full stack config instead of relying on inferred defaults. addonOptions and dbSetupOptions are not supported here; use the local CLI's create-json for them.",
  );

const PreviewFileInputSchema = HostedProjectInputSchema.safeExtend({
  path: z.string().describe("Path of a generated file, as listed by bts_plan_project"),
});

const SchemaNameSchema = z
  .enum(["all", ...(Object.keys(getAllJsonSchemas()) as [string, ...string[]])])
  .optional()
  .describe("Schema name to inspect. Defaults to all.");

type HostedProjectInput = z.infer<typeof HostedProjectInputSchema>;

const webFrontendIds = new Set<string>(TECH_OPTIONS.webFrontend.map((option) => option.id));
const nativeFrontendIds = new Set<string>(TECH_OPTIONS.nativeFrontend.map((option) => option.id));

function formatToolSuccess<T>(data: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: { ok: true, data },
  };
}

function formatToolError(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause);
  return {
    content: [{ type: "text" as const, text: message }],
    structuredContent: { ok: false, error: message },
    isError: true,
  };
}

const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function toStackState(input: HostedProjectInput): StackState {
  const webFrontend = input.frontend.filter((id) => webFrontendIds.has(id));
  const nativeFrontend = input.frontend.filter((id) => nativeFrontendIds.has(id));
  let backend = input.backend as StackState["backend"];
  if (input.backend === "self") {
    const fullstack = FULLSTACK_FRONTENDS.find((id) => webFrontend.includes(id));
    if (!fullstack) {
      throw new Error(
        `backend "self" requires a fullstack web frontend (${FULLSTACK_FRONTENDS.join(", ")}).`,
      );
    }
    backend = `self-${fullstack}`;
  }

  return {
    projectName: formatProjectName(input.projectName),
    webFrontend: (webFrontend.length ? webFrontend : ["none"]) as StackState["webFrontend"],
    nativeFrontend: (nativeFrontend.length
      ? nativeFrontend
      : ["none"]) as StackState["nativeFrontend"],
    backend,
    runtime: input.runtime,
    database: input.database,
    orm: input.orm,
    api: input.api,
    auth: input.auth,
    payments: input.payments,
    addons: input.addons.length ? input.addons : ["none"],
    examples: input.examples.length ? input.examples : ["none"],
    dbSetup: input.dbSetup,
    webDeploy: input.webDeploy,
    serverDeploy: input.serverDeploy,
    packageManager: input.packageManager,
    git: input.git ? "true" : "false",
    install: input.install ? "true" : "false",
    yolo: "false",
  } as StackState;
}

type StackValue = string | readonly string[];

function sameValue(a: StackValue, b: StackValue) {
  const normalize = (value: StackValue) =>
    [value]
      .flat()
      .filter((item) => item !== "none")
      .sort()
      .join();
  return normalize(a) === normalize(b);
}

/**
 * Validates with the same compatibility rules as the Stack Builder. The hosted
 * server never rewrites a stack silently: any adjustment the rules would make is
 * reported as an error, with the nearest valid stack as a suggestion.
 */
function resolveHostedStack(input: HostedProjectInput) {
  const nameError = validateProjectName(formatProjectName(input.projectName));
  if (nameError) throw new Error(nameError);

  for (const field of ["frontend", "addons", "examples"] as const) {
    if (input[field].includes("none") && input[field].length > 1) {
      throw new Error(
        `"none" can't be combined with other values in ${field}. Use [] or "none" alone.`,
      );
    }
  }

  const resolved = resolveStackCompatibility(toStackState(input));
  const config = stackStateToConfig(resolved.stack);
  const differences = STACK_FIELDS.filter((field) => !sameValue(input[field], config[field])).map(
    (field) => ({ field, requested: input[field], valid: config[field] }),
  );

  if (differences.length > 0) {
    const reasons = resolved.changes.map((change) => change.message);
    const suggestion = Object.fromEntries(
      differences.map(({ field, valid }) => [field, valid] as const),
    );
    throw new Error(
      [
        "This stack combination is not compatible.",
        ...reasons.map((reason) => `- ${reason}`),
        `Nearest valid values: ${JSON.stringify(suggestion)}`,
      ].join("\n"),
    );
  }

  return { stack: resolved.stack, config, notes: resolved.notes };
}

async function generateProject(input: HostedProjectInput) {
  const { stack, config, notes } = resolveHostedStack(input);
  const result = await generate({ config, templates: EMBEDDED_TEMPLATES });
  if (result.isErr()) throw new Error("Unable to generate this project. Please try again.");
  return { stack, config, notes, tree: result.value };
}

function listFiles(node: VirtualNode, files: VirtualNode[] = []) {
  if (node.type === "file") files.push(node);
  else for (const child of node.children) listFiles(child, files);
  return files;
}

function getCreateCommands(stack: StackState) {
  return {
    command: generateStackCommand(stack),
    builderUrl: generateStackUrlFromState(stack),
  };
}

function getStackGuidance() {
  return {
    server:
      "This is the hosted Better T Stack MCP server. It validates stacks and previews generated files, but it cannot write to the user's machine. Projects are created by running the returned command locally.",
    workflow: [
      "If the user's request is ambiguous, resolve the major stack choices first. Use bts_get_schema for exact allowed values.",
      "Build a full explicit config, then call bts_plan_project to validate it and preview the generated files.",
      "Use bts_preview_file to show the contents of specific generated files when that helps the user.",
      "Call bts_get_create_command once the plan matches the user's intent, and give the user the command to run in a terminal.",
      "To write files directly, add addons to an existing project, or set addonOptions/dbSetupOptions, use the local server or the CLI's create-json instead: npx -y create-better-t-stack@latest mcp",
    ],
    createContract: {
      requiresExplicitFields: ["projectName", ...STACK_FIELDS, "git", "packageManager", "install"],
      unsupportedFields: ["addonOptions", "dbSetupOptions"],
      rule: "Send the full explicit stack config. Use 'none', [], true or false instead of omitting fields.",
    },
    ambiguityRules: [
      "Do not infer extra app surfaces, addons, examples, or provisioning choices from a template name or styling preference.",
      "When asking the user to choose, offer every valid option for their stack from bts_get_schema.",
    ],
  };
}

export function createHostedMcpServer() {
  const server = new McpServer(
    { name: "better-t-stack", version: cliPackage.version },
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
        "Read how to use this hosted server: the workflow, the full explicit config it requires, and when to switch to the local server. Call this first when the user's intent is ambiguous.",
      outputSchema: ToolResponseSchema,
      annotations: { title: "Get Better T Stack MCP Guidance", ...readOnlyAnnotations },
    },
    async () => formatToolSuccess(getStackGuidance()),
  );

  server.registerTool(
    "bts_get_schema",
    {
      title: "Get Better T Stack Schemas",
      description:
        "Inspect the JSON schemas for Better T Stack options so you can build a valid config.",
      inputSchema: z.object({ name: SchemaNameSchema }),
      outputSchema: ToolResponseSchema,
      annotations: { title: "Get Better T Stack Schemas", ...readOnlyAnnotations },
    },
    async ({ name }) => {
      const schemas = getAllJsonSchemas();
      if (!name || name === "all") return formatToolSuccess(schemas);
      return formatToolSuccess(schemas[name as keyof typeof schemas]);
    },
  );

  server.registerTool(
    "bts_plan_project",
    {
      title: "Plan Better T Stack Project",
      description:
        "Validate a full explicit stack config and preview the files it generates, without writing anything. Always call this before bts_get_create_command.",
      inputSchema: HostedProjectInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: { title: "Plan Better T Stack Project", ...readOnlyAnnotations },
    },
    async (input) => {
      try {
        const { stack, config, notes, tree } = await generateProject(input);
        const files = listFiles(tree.root).map((file) => file.path);
        return formatToolSuccess({
          projectName: config.projectName,
          stack: Object.fromEntries(STACK_FIELDS.map((field) => [field, config[field]])),
          notes,
          fileCount: tree.fileCount,
          directoryCount: tree.directoryCount,
          files: files.slice(0, MAX_LISTED_FILES),
          filesTruncated: files.length > MAX_LISTED_FILES,
          ...getCreateCommands(stack),
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );

  server.registerTool(
    "bts_preview_file",
    {
      title: "Preview Generated File",
      description:
        "Return the contents of one file that bts_plan_project would generate for the same config.",
      inputSchema: PreviewFileInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: { title: "Preview Generated File", ...readOnlyAnnotations },
    },
    async ({ path, ...input }) => {
      try {
        const { tree } = await generateProject(input);
        const normalized = path.replace(/^\.?\/+/, "");
        const file = listFiles(tree.root).find((node) => node.path === normalized);
        if (!file || file.type !== "file") {
          return formatToolError(
            `No generated file at "${path}". Use a path from bts_plan_project.`,
          );
        }
        const truncated = file.content.length > MAX_FILE_BYTES;
        return formatToolSuccess({
          path: file.path,
          content: truncated ? file.content.slice(0, MAX_FILE_BYTES) : file.content,
          truncated,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );

  server.registerTool(
    "bts_get_create_command",
    {
      title: "Get Better T Stack Create Command",
      description:
        "Validate a full explicit stack config and return the exact command that creates it locally, plus a Stack Builder link. Call this only after bts_plan_project matches the user's intent.",
      inputSchema: HostedProjectInputSchema,
      outputSchema: ToolResponseSchema,
      annotations: { title: "Get Better T Stack Create Command", ...readOnlyAnnotations },
    },
    async (input) => {
      try {
        const { stack } = resolveHostedStack(input);
        return formatToolSuccess({
          ...getCreateCommands(stack),
          instructions:
            "Run the command in a terminal, in the folder where the project should be created.",
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );

  return server;
}
