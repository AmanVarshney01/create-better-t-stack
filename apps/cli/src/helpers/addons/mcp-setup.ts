import { isCancel, multiselect, select } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { AddonOptions, ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionCommand, getPackageRunnerPrefix } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

type McpTransport = "http" | "sse";

type McpOptions = NonNullable<AddonOptions["mcp"]>;
type McpServerKey = NonNullable<McpOptions["servers"]>[number];
type McpAgent = NonNullable<McpOptions["agents"]>[number];
type InstallScope = NonNullable<McpOptions["scope"]>;

export type McpServerDef = {
  key: McpServerKey;
  label: string;
  name: string;
  target: string;
  transport?: McpTransport;
  headers?: string[];
};

type AgentScope = "project" | "global" | "both";

type AgentOption = {
  value: McpAgent;
  label: string;
  scope: AgentScope;
};

const MCP_AGENTS: AgentOption[] = [
  { value: "antigravity", label: "Antigravity", scope: "global" },
  { value: "cline", label: "Cline VSCode Extension", scope: "global" },
  { value: "cline-cli", label: "Cline CLI", scope: "global" },
  { value: "cursor", label: "Cursor", scope: "both" },
  { value: "claude-code", label: "Claude Code", scope: "both" },
  { value: "codex", label: "Codex", scope: "both" },
  { value: "opencode", label: "OpenCode", scope: "both" },
  { value: "gemini-cli", label: "Gemini CLI", scope: "both" },
  { value: "github-copilot-cli", label: "GitHub Copilot CLI", scope: "both" },
  { value: "mcporter", label: "MCPorter", scope: "both" },
  { value: "vscode", label: "VS Code (GitHub Copilot)", scope: "both" },
  { value: "zed", label: "Zed", scope: "both" },
  { value: "claude-desktop", label: "Claude Desktop", scope: "global" },
  { value: "goose", label: "Goose", scope: "global" },
];

const DEFAULT_SCOPE: InstallScope = "project";
const DEFAULT_AGENTS: McpAgent[] = ["cursor", "claude-code", "vscode"];

function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function hasReactBasedFrontend(frontend: ProjectConfig["frontend"]): boolean {
  return (
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("tanstack-start") ||
    frontend.includes("next")
  );
}

function hasNativeFrontend(frontend: ProjectConfig["frontend"]): boolean {
  return (
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles")
  );
}

function getAllMcpServers(config: ProjectConfig): McpServerDef[] {
  return [
    {
      key: "better-t-stack",
      label: "Better T Stack",
      name: "better-t-stack",
      target: getPackageExecutionCommand(config.packageManager, "create-better-t-stack@latest mcp"),
    },
    {
      key: "context7",
      label: "Context7",
      name: "context7",
      target: "@upstash/context7-mcp",
    },
    {
      key: "nx",
      label: "Nx Workspace",
      name: "nx",
      target: "npx nx mcp .",
    },
    {
      key: "cloudflare-docs",
      label: "Cloudflare Docs",
      name: "cloudflare-docs",
      target: "https://docs.mcp.cloudflare.com/sse",
      transport: "sse",
    },
    {
      key: "convex",
      label: "Convex",
      name: "convex",
      target: "npx -y convex@latest mcp start",
    },
    {
      key: "shadcn",
      label: "shadcn/ui",
      name: "shadcn",
      target: "npx -y shadcn@latest mcp",
    },
    {
      key: "next-devtools",
      label: "Next Devtools",
      name: "next-devtools",
      target: "npx -y next-devtools-mcp@latest",
    },
    {
      key: "nuxt-docs",
      label: "Nuxt Docs",
      name: "nuxt",
      target: "https://nuxt.com/mcp",
    },
    {
      key: "nuxt-ui-docs",
      label: "Nuxt UI Docs",
      name: "nuxt-ui",
      target: "https://ui.nuxt.com/mcp",
    },
    {
      key: "svelte-docs",
      label: "Svelte Docs",
      name: "svelte",
      target: "https://mcp.svelte.dev/mcp",
    },
    {
      key: "astro-docs",
      label: "Astro Docs",
      name: "astro-docs",
      target: "https://mcp.docs.astro.build/mcp",
    },
    {
      key: "planetscale",
      label: "PlanetScale",
      name: "planetscale",
      target: "https://mcp.pscale.dev/mcp/planetscale",
    },
    {
      key: "neon",
      label: "Neon",
      name: "neon",
      target: "https://mcp.neon.tech/mcp",
    },
    {
      key: "supabase",
      label: "Supabase",
      name: "supabase",
      target: "https://mcp.supabase.com/mcp",
    },
    {
      key: "better-auth",
      label: "Better Auth",
      name: "better-auth",
      target: "https://mcp.inkeep.com/better-auth/mcp",
    },
    {
      key: "clerk",
      label: "Clerk",
      name: "clerk",
      target: "https://mcp.clerk.com/mcp",
    },
    {
      key: "expo",
      label: "Expo",
      name: "expo-mcp",
      target: "https://mcp.expo.dev/mcp",
    },
    {
      key: "polar",
      label: "Polar",
      name: "polar",
      target: "https://mcp.polar.sh/mcp/polar-mcp",
    },
  ];
}

export function getRecommendedMcpServers(
  config: ProjectConfig,
  scope: InstallScope,
): McpServerDef[] {
  const serversByKey = new Map(getAllMcpServers(config).map((server) => [server.key, server]));
  const recommendedServerKeys: McpServerKey[] = ["better-t-stack", "context7"];

  if (scope === "project" && config.addons.includes("nx")) {
    recommendedServerKeys.push("nx");
  }

  if (
    config.runtime === "workers" ||
    config.webDeploy === "cloudflare" ||
    config.serverDeploy === "cloudflare"
  ) {
    recommendedServerKeys.push("cloudflare-docs");
  }

  if (config.backend === "convex") {
    recommendedServerKeys.push("convex");
  }

  if (hasReactBasedFrontend(config.frontend)) {
    recommendedServerKeys.push("shadcn");
  }

  if (config.frontend.includes("next")) {
    recommendedServerKeys.push("next-devtools");
  }

  if (config.frontend.includes("nuxt")) {
    recommendedServerKeys.push("nuxt-docs", "nuxt-ui-docs");
  }

  if (config.frontend.includes("svelte")) {
    recommendedServerKeys.push("svelte-docs");
  }

  if (config.frontend.includes("astro")) {
    recommendedServerKeys.push("astro-docs");
  }

  if (config.dbSetup === "planetscale") {
    recommendedServerKeys.push("planetscale");
  }

  if (config.dbSetup === "neon") {
    recommendedServerKeys.push("neon");
  }

  if (config.dbSetup === "supabase") {
    recommendedServerKeys.push("supabase");
  }

  if (config.auth === "better-auth") {
    recommendedServerKeys.push("better-auth");
  }

  if (config.auth === "clerk") {
    recommendedServerKeys.push("clerk");
  }

  if (hasNativeFrontend(config.frontend)) {
    recommendedServerKeys.push("expo");
  }

  if (config.payments === "polar") {
    recommendedServerKeys.push("polar");
  }

  return uniqueValues(recommendedServerKeys)
    .map((serverKey) => serversByKey.get(serverKey))
    .filter((server): server is McpServerDef => server !== undefined);
}

function filterAgentsForScope(scope: InstallScope): AgentOption[] {
  return MCP_AGENTS.filter((a) => a.scope === "both" || a.scope === scope);
}

export async function setupMcp(
  config: ProjectConfig,
): Promise<Result<void, AddonSetupError | UserCancelledError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;

  cliLog.info("Setting up MCP servers...");

  let scope = config.addonOptions?.mcp?.scope;

  if (!scope) {
    if (isSilent()) {
      scope = DEFAULT_SCOPE;
    } else {
      const selectedScope = await select<InstallScope>({
        message: "Where should MCP servers be installed?",
        options: [
          {
            value: "project",
            label: "Project",
            hint: "Writes to project config files (recommended for teams)",
          },
          {
            value: "global",
            label: "Global",
            hint: "Writes to user-level config files (personal machine)",
          },
        ],
        initialValue: DEFAULT_SCOPE,
      });

      if (isCancel(selectedScope)) {
        return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
      }

      scope = selectedScope;
    }
  }

  const recommendedServers = getRecommendedMcpServers(config, scope);
  if (recommendedServers.length === 0) {
    return Result.ok(undefined);
  }
  const allServersByKey = new Map(getAllMcpServers(config).map((server) => [server.key, server]));

  const serverOptions = recommendedServers.map((s) => ({
    value: s.key,
    label: s.label,
    hint: s.target,
  }));

  const configuredServerKeys = config.addonOptions?.mcp?.servers;
  const availableServerKeys = new Set(allServersByKey.keys());
  let selectedServerKeys: McpServerKey[] =
    configuredServerKeys?.filter((serverKey) => availableServerKeys.has(serverKey)) ?? [];

  if (selectedServerKeys.length === 0 && configuredServerKeys === undefined) {
    if (isSilent()) {
      selectedServerKeys = serverOptions.map((o) => o.value);
    } else {
      const promptedServerKeys = await multiselect({
        message: "Select MCP servers to install",
        options: serverOptions,
        required: false,
        initialValues: serverOptions.map((o) => o.value),
      });

      if (isCancel(promptedServerKeys)) {
        return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
      }

      selectedServerKeys = [...promptedServerKeys] as McpServerKey[];
    }
  }

  if (selectedServerKeys.length === 0) {
    return Result.ok(undefined);
  }

  const agentOptions = filterAgentsForScope(scope).map((a) => ({
    value: a.value,
    label: a.label,
  }));

  const defaultAgents: McpAgent[] = uniqueValues(
    DEFAULT_AGENTS.filter((agent) => agentOptions.some((option) => option.value === agent)),
  );

  const configuredAgents = config.addonOptions?.mcp?.agents;
  let selectedAgents: McpAgent[] =
    configuredAgents?.filter((agent) => agentOptions.some((option) => option.value === agent)) ??
    [];

  if (selectedAgents.length === 0 && configuredAgents === undefined) {
    if (isSilent()) {
      selectedAgents = defaultAgents;
    } else {
      const promptedAgents = await multiselect({
        message: "Select agents to install MCP servers to",
        options: agentOptions,
        required: false,
        initialValues: defaultAgents,
      });

      if (isCancel(promptedAgents)) {
        return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
      }

      selectedAgents = [...promptedAgents] as McpAgent[];
    }
  }

  if (selectedAgents.length === 0) {
    return Result.ok(undefined);
  }

  const selectedServers: McpServerDef[] = [];
  for (const key of selectedServerKeys) {
    const server = allServersByKey.get(key);
    if (server) selectedServers.push(server);
  }

  if (selectedServers.length === 0) {
    return Result.ok(undefined);
  }

  const installSpinner = createSpinner();
  installSpinner.start("Installing MCP servers...");

  const runner = getPackageRunnerPrefix(packageManager);
  const globalFlags = scope === "global" ? ["-g"] : [];
  let successfulInstalls = 0;

  for (const server of selectedServers) {
    const transportFlags = server.transport ? ["-t", server.transport] : [];
    const headerFlags = (server.headers ?? []).flatMap((h) => ["--header", h]);
    const agentFlags = selectedAgents.flatMap((agent) => ["-a", agent]);

    const args = [
      ...runner,
      "add-mcp@latest",
      server.target,
      "--name",
      server.name,
      ...transportFlags,
      ...headerFlags,
      ...agentFlags,
      ...globalFlags,
      "-y",
    ];

    const installResult = await Result.tryPromise({
      try: async () => {
        await $({ cwd: projectDir, env: { CI: "true" } })`${args}`;
      },
      catch: (e) =>
        new AddonSetupError({
          addon: "mcp",
          message: `Failed to install MCP server '${server.name}': ${e instanceof Error ? e.message : String(e)}`,
          cause: e,
        }),
    });

    if (installResult.isErr()) {
      cliLog.warn(pc.yellow(`Warning: Could not install MCP server '${server.name}'`));
      continue;
    }

    successfulInstalls += 1;
  }

  if (successfulInstalls === 0) {
    installSpinner.stop(pc.red("Failed to install MCP servers"));
    return Result.err(
      new AddonSetupError({
        addon: "mcp",
        message: `Failed to install all requested MCP servers: ${selectedServers.map((server) => server.name).join(", ")}`,
      }),
    );
  }

  installSpinner.stop(
    successfulInstalls === selectedServers.length
      ? "MCP servers installed"
      : "MCP servers installed with warnings",
  );
  return Result.ok(undefined);
}
