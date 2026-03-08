import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import path from "node:path";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import fs from "fs-extra";

import { create } from "../src/index";
import { createBtsMcpServer } from "../src/mcp";
import { readBtsConfig } from "../src/utils/bts-config";
import { SMOKE_DIR } from "./setup";

async function connectInMemoryClient() {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createBtsMcpServer();
  await server.connect(serverTransport);

  const client = new Client({ name: "mcp-test-client", version: "0.0.0" }, { capabilities: {} });
  await client.connect(clientTransport);

  return {
    client,
    cleanup: async () => {
      await client.close();
      await server.close();
    },
  };
}

function getExplicitCreateInput(projectPath: string) {
  return {
    projectName: projectPath,
    frontend: ["next"] as const,
    backend: "hono" as const,
    runtime: "bun" as const,
    database: "sqlite" as const,
    orm: "drizzle" as const,
    api: "trpc" as const,
    auth: "better-auth" as const,
    payments: "none" as const,
    addons: ["turborepo"] as const,
    examples: [] as const,
    git: true,
    packageManager: "bun" as const,
    install: false,
    dbSetup: "none" as const,
    webDeploy: "none" as const,
    serverDeploy: "none" as const,
  };
}

describe("MCP server", () => {
  let cleanups: Array<() => Promise<void>> = [];

  beforeEach(async () => {
    process.env.BTS_SKIP_EXTERNAL_COMMANDS = "1";
    process.env.BTS_TEST_MODE = "1";
  });

  afterEach(async () => {
    for (const cleanup of cleanups.reverse()) {
      await Promise.race([
        cleanup(),
        new Promise<void>((resolve) => {
          setTimeout(resolve, 1000);
        }),
      ]);
    }
    cleanups = [];
  });

  it("registers the expected MCP tools", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const result = await client.listTools();
    const toolNames = result.tools.map((tool) => tool.name).sort();

    expect(toolNames).toEqual([
      "bts_add_addons",
      "bts_create_project",
      "bts_get_schema",
      "bts_get_stack_guidance",
      "bts_plan_addons",
      "bts_plan_project",
    ]);
  });

  it("returns explicit create-contract guidance", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const result = await client.callTool({
      name: "bts_get_stack_guidance",
      arguments: {},
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: {
        createContract?: {
          requiresExplicitFields?: string[];
          rule?: string;
        };
      };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.createContract?.requiresExplicitFields).toEqual(
      expect.arrayContaining([
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
      ]),
    );
    expect(payload.data?.createContract?.rule).toContain("full explicit stack config");
  });

  it("returns CLI and input schemas through MCP", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const result = await client.callTool({
      name: "bts_get_schema",
      arguments: { name: "createInput" },
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: { type?: string; properties?: Record<string, unknown> };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.type).toBe("object");
    expect(payload.data?.properties).toHaveProperty("frontend");
    expect(payload.data?.properties).toHaveProperty("backend");
  });

  it("rejects partial project payloads before planning", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const result = await client.callTool({
      name: "bts_plan_project",
      arguments: {
        projectName: "partial-app",
        frontend: ["next"],
        git: true,
        install: true,
      },
    });

    expect(result.isError).toBe(true);
    const text = result.content
      .filter((item): item is { type: "text"; text: string } => item.type === "text")
      .map((item) => item.text)
      .join("\n");

    expect(text).toContain("Input validation error");
    expect(text).toContain("database");
    expect(text).toContain("backend");
    expect(text).toContain("packageManager");
  });

  it("plans projects without writing files", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-plan-project");
    await fs.remove(projectPath);

    const result = await client.callTool({
      name: "bts_plan_project",
      arguments: getExplicitCreateInput(projectPath),
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: { projectDirectory?: string; success?: boolean };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.success).toBe(true);
    expect(payload.data?.projectDirectory).toBe(projectPath);
    expect(await fs.pathExists(projectPath)).toBe(false);
  });

  it("warns during planning when install=true would be slow for MCP execution", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-plan-install-warning");
    await fs.remove(projectPath);

    const result = await client.callTool({
      name: "bts_plan_project",
      arguments: {
        ...getExplicitCreateInput(projectPath),
        install: true,
      },
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: {
        warnings?: string[];
        recommendedMcpExecution?: { install?: boolean };
      };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.warnings?.[0]).toContain("install: false");
    expect(payload.data?.recommendedMcpExecution?.install).toBe(false);
  });

  it("creates projects on disk from explicit MCP input", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-create-project");
    await fs.remove(projectPath);

    const result = await client.callTool({
      name: "bts_create_project",
      arguments: getExplicitCreateInput(projectPath),
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: { success?: boolean; projectDirectory?: string };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.success).toBe(true);
    expect(payload.data?.projectDirectory).toBe(projectPath);
    expect(await fs.pathExists(projectPath)).toBe(true);

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.frontend).toEqual(["next"]);
  });

  it("rejects install=true during MCP project creation with an actionable error", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-create-install-rejected");
    await fs.remove(projectPath);

    const result = await client.callTool({
      name: "bts_create_project",
      arguments: {
        ...getExplicitCreateInput(projectPath),
        install: true,
      },
    });

    const payload = result.structuredContent as { ok: boolean; error?: string };

    expect(result.isError).toBe(true);
    expect(payload.ok).toBe(false);
    expect(payload.error).toContain("install: false");
    expect(await fs.pathExists(projectPath)).toBe(false);
  });

  it("returns an MCP tool error when creating into a non-empty directory", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-existing-directory");
    await fs.ensureDir(projectPath);
    await fs.writeFile(path.join(projectPath, "existing.txt"), "hello");

    const result = await client.callTool({
      name: "bts_create_project",
      arguments: getExplicitCreateInput(projectPath),
    });

    const payload = result.structuredContent as { ok: boolean; error?: string };
    expect(result.isError).toBe(true);
    expect(payload.ok).toBe(false);
    expect(payload.error).toContain("already exists and is not empty");
  });

  it("plans addon installation without mutating bts.jsonc", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-plan-addons");
    await fs.remove(projectPath);
    const createResult = await create(projectPath, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      git: true,
      packageManager: "bun",
      disableAnalytics: true,
    });
    expect(createResult.isOk()).toBe(true);

    const before = await readBtsConfig(projectPath);

    const result = await client.callTool({
      name: "bts_plan_addons",
      arguments: {
        projectDir: projectPath,
        addons: ["biome"],
        packageManager: "bun",
        install: false,
      },
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: { success?: boolean; dryRun?: boolean; addedAddons?: string[] };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.success).toBe(true);
    expect(payload.data?.dryRun).toBe(true);
    expect(payload.data?.addedAddons).toEqual(["biome"]);

    const after = await readBtsConfig(projectPath);
    expect(after).toEqual(before);
  });

  it("adds addons through MCP and persists them to bts.jsonc", async () => {
    const { client, cleanup } = await connectInMemoryClient();
    cleanups.push(cleanup);

    const projectPath = path.join(SMOKE_DIR, "mcp-add-addons");
    await fs.remove(projectPath);
    const createResult = await create(projectPath, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      git: true,
      packageManager: "bun",
      disableAnalytics: true,
    });
    expect(createResult.isOk()).toBe(true);

    const result = await client.callTool({
      name: "bts_add_addons",
      arguments: {
        projectDir: projectPath,
        addons: ["biome"],
        packageManager: "bun",
        install: false,
      },
    });

    const payload = result.structuredContent as {
      ok: boolean;
      data?: { success?: boolean; addedAddons?: string[] };
    };

    expect(payload.ok).toBe(true);
    expect(payload.data?.success).toBe(true);
    expect(payload.data?.addedAddons).toEqual(["biome"]);

    const after = await readBtsConfig(projectPath);
    expect(after?.addons).toEqual(expect.arrayContaining(["turborepo", "biome"]));
  });

  it("starts over stdio through the CLI entrypoint", async () => {
    const cliRoot = path.join(import.meta.dir, "..");
    const cliEntrypoint = path.join(cliRoot, "src", "cli.ts");
    const client = new Client({ name: "mcp-stdio-test", version: "0.0.0" }, { capabilities: {} });

    const transport = new StdioClientTransport({
      command: "bun",
      args: [cliEntrypoint, "mcp"],
      cwd: cliRoot,
      env: {
        BTS_SKIP_EXTERNAL_COMMANDS: "1",
        BTS_TEST_MODE: "1",
      },
    });

    await client.connect(transport);
    cleanups.push(async () => {
      await transport.close();
      await client.close();
    });

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toEqual(
      expect.arrayContaining(["bts_get_stack_guidance", "bts_plan_project", "bts_add_addons"]),
    );

    const guidance = await client.callTool({
      name: "bts_get_stack_guidance",
      arguments: {},
    });

    const payload = guidance.structuredContent as { ok: boolean };
    expect(payload.ok).toBe(true);
  });
});
