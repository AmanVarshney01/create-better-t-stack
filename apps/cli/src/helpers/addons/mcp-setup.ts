import { isCancel, log, multiselect, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { PackageManager, ProjectConfig } from "../../types";

import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageRunnerPrefix } from "../../utils/package-runner";

type McpTransport = "http" | "sse";

export type McpServerDef = {
  key: string;
  label: string;
  name: string;
  target: string;
  transport?: McpTransport;
  headers?: string[];
};

type InstallScope = "project" | "global";

type AgentScope = "project" | "global" | "both";

type AgentOption = {
  value: string;
  label: string;
  scope: AgentScope;
};

const MCP_AGENTS: AgentOption[] = [
  { value: "cursor", label: "Cursor", scope: "both" },
  { value: "claude-code", label: "Claude Code", scope: "both" },
  { value: "codex", label: "Codex", scope: "both" },
  { value: "opencode", label: "OpenCode", scope: "both" },
  { value: "gemini-cli", label: "Gemini CLI", scope: "both" },
  { value: "vscode", label: "VS Code (GitHub Copilot)", scope: "both" },
  { value: "zed", label: "Zed", scope: "both" },
  { value: "claude-desktop", label: "Claude Desktop", scope: "global" },
  { value: "goose", label: "Goose", scope: "global" },
];

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

function getPackageRunnerWithYesFlag(packageManager: PackageManager | null | undefined): string[] {
  const prefix = getPackageRunnerPrefix(packageManager);
  const runner = prefix[0];

  // Ensure the runner itself doesn't prompt for package downloads.
  if (runner === "bunx") return [...prefix, "-y"];
  if (runner === "npx") return [...prefix, "-y"];
  if (runner === "pnpm") return [...prefix, "--yes"];

  return prefix;
}

export function getRecommendedMcpServers(config: ProjectConfig): McpServerDef[] {
  const servers: McpServerDef[] = [];

  servers.push({
    key: "context7",
    label: "Context7",
    name: "context7",
    target: "@upstash/context7-mcp",
  });

  if (
    config.runtime === "workers" ||
    config.webDeploy === "cloudflare" ||
    config.serverDeploy === "cloudflare"
  ) {
    servers.push({
      key: "cloudflare-docs",
      label: "Cloudflare Docs",
      name: "cloudflare-docs",
      target: "https://docs.mcp.cloudflare.com/sse",
      transport: "sse",
    });
  }

  if (config.backend === "convex") {
    servers.push({
      key: "convex",
      label: "Convex",
      name: "convex",
      target: "npx -y convex@latest mcp start",
    });
  }

  if (hasReactBasedFrontend(config.frontend)) {
    servers.push({
      key: "shadcn",
      label: "shadcn/ui",
      name: "shadcn",
      target: "npx -y shadcn@latest mcp",
    });
  }

  if (config.frontend.includes("next")) {
    servers.push({
      key: "next-devtools",
      label: "Next Devtools",
      name: "next-devtools",
      target: "npx -y next-devtools-mcp@latest",
    });
  }

  if (config.frontend.includes("nuxt")) {
    servers.push(
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
    );
  }

  if (config.frontend.includes("svelte")) {
    servers.push({
      key: "svelte-docs",
      label: "Svelte Docs",
      name: "svelte",
      target: "https://mcp.svelte.dev/mcp",
    });
  }

  if (config.frontend.includes("astro")) {
    servers.push({
      key: "astro-docs",
      label: "Astro Docs",
      name: "astro-docs",
      target: "https://mcp.docs.astro.build/mcp",
    });
  }

  if (config.dbSetup === "planetscale") {
    servers.push({
      key: "planetscale",
      label: "PlanetScale",
      name: "planetscale",
      target: "https://mcp.pscale.dev/mcp/planetscale",
    });
  }

  if (config.dbSetup === "neon") {
    servers.push({
      key: "neon",
      label: "Neon",
      name: "neon",
      target: "https://mcp.neon.tech/mcp",
    });
  }

  if (config.dbSetup === "supabase") {
    servers.push({
      key: "supabase",
      label: "Supabase",
      name: "supabase",
      target: "https://mcp.supabase.com/mcp",
    });
  }

  if (config.auth === "better-auth") {
    servers.push({
      key: "better-auth",
      label: "Better Auth",
      name: "better-auth",
      target: "https://mcp.inkeep.com/better-auth/mcp",
    });
  }

  return servers;
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

  log.info("Setting up MCP servers...");

  const scope = await select<InstallScope>({
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
    initialValue: "project",
  });

  if (isCancel(scope)) {
    return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
  }

  const recommendedServers = getRecommendedMcpServers(config);
  if (recommendedServers.length === 0) {
    return Result.ok(undefined);
  }

  const serverOptions = recommendedServers.map((s) => ({
    value: s.key,
    label: s.label,
    hint: s.target,
  }));

  const selectedServerKeys = await multiselect({
    message: "Select MCP servers to install",
    options: serverOptions,
    required: false,
    initialValues: serverOptions.map((o) => o.value),
  });

  if (isCancel(selectedServerKeys)) {
    return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
  }

  if (selectedServerKeys.length === 0) {
    return Result.ok(undefined);
  }

  const agentOptions = filterAgentsForScope(scope).map((a) => ({
    value: a.value,
    label: a.label,
  }));

  const defaultAgents = uniqueValues(
    ["cursor", "claude-code", "vscode"].filter((a) => agentOptions.some((o) => o.value === a)),
  );

  const selectedAgents = await multiselect({
    message: "Select agents to install MCP servers to",
    options: agentOptions,
    required: false,
    initialValues: defaultAgents,
  });

  if (isCancel(selectedAgents)) {
    return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
  }

  if (selectedAgents.length === 0) {
    return Result.ok(undefined);
  }

  const serversByKey = new Map(recommendedServers.map((s) => [s.key, s]));
  const selectedServers: McpServerDef[] = [];
  for (const key of selectedServerKeys as string[]) {
    const server = serversByKey.get(key);
    if (server) selectedServers.push(server);
  }

  if (selectedServers.length === 0) {
    return Result.ok(undefined);
  }

  const installSpinner = spinner();
  installSpinner.start("Installing MCP servers...");

  const runner = getPackageRunnerWithYesFlag(packageManager);
  const globalFlags = scope === "global" ? ["-g"] : [];

  for (const server of selectedServers) {
    const transportFlags = server.transport ? ["-t", server.transport] : [];
    const headerFlags = (server.headers ?? []).flatMap((h) => ["--header", h]);
    const agentFlags = (selectedAgents as string[]).flatMap((a) => ["-a", a]);

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
      log.warn(pc.yellow(`Warning: Could not install MCP server '${server.name}'`));
    }
  }

  installSpinner.stop("MCP servers installed");
  return Result.ok(undefined);
}
