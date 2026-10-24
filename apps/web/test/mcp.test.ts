import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

import { DELETE, GET, OPTIONS, POST } from "../src/app/mcp/route";

const handlers = { DELETE, GET, OPTIONS, POST };

function isRouteMethod(method: string): method is keyof typeof handlers {
  return method in handlers;
}

const routeFetch = async (input: string | URL | Request, init?: RequestInit) => {
  const request = new Request(input, init);
  if (!isRouteMethod(request.method)) return new Response(null, { status: 405 });
  return handlers[request.method](request);
};

const baseStack = {
  projectName: "my-app",
  frontend: ["tanstack-router"],
  backend: "hono",
  runtime: "bun",
  database: "sqlite",
  orm: "drizzle",
  api: "trpc",
  auth: "better-auth",
  payments: "none",
  addons: ["turborepo"],
  examples: [],
  git: true,
  packageManager: "bun",
  install: true,
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
};

type ToolResult = {
  ok: boolean;
  data?: {
    files?: string[];
    fileCount?: number;
    command?: string;
    builderUrl?: string;
    content?: string;
  };
  error?: string;
};
type ToolArguments = Parameters<Client["callTool"]>[0]["arguments"];

let client: Client;

async function call(name: string, args: ToolArguments = {}) {
  const result = await client.callTool({ name, arguments: args });
  return result.structuredContent as ToolResult;
}

beforeAll(async () => {
  client = new Client({ name: "hosted-mcp-test", version: "1.0.0" });
  await client.connect(
    new StreamableHTTPClientTransport(new URL("http://localhost/mcp"), { fetch: routeFetch }),
  );
});

afterAll(async () => {
  await client.close();
});

describe("hosted MCP over HTTP", () => {
  test("lists only the read-only hosted tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "bts_get_create_command",
      "bts_get_schema",
      "bts_get_stack_guidance",
      "bts_plan_project",
      "bts_preview_file",
    ]);
    for (const tool of tools) expect(tool.annotations?.readOnlyHint).toBe(true);
  });

  test("plans a valid stack with its file tree and create command", async () => {
    const plan = await call("bts_plan_project", baseStack);
    expect(plan.ok).toBe(true);
    expect(plan.data?.files).toContain("package.json");
    expect(plan.data?.fileCount).toBeGreaterThan(10);
    expect(plan.data?.command).toBe("bun create better-t-stack@latest my-app --yes");
    expect(plan.data?.builderUrl).toStartWith("https://www.better-t-stack.dev/new?");
  });

  test("previews a generated file from the same config", async () => {
    const preview = await call("bts_preview_file", { ...baseStack, path: "package.json" });
    expect(preview.ok).toBe(true);
    expect(JSON.parse(preview.data?.content ?? "{}").name).toBe("my-app");
  });

  test("rejects an incompatible stack instead of rewriting it", async () => {
    const plan = await call("bts_plan_project", { ...baseStack, database: "mongodb" });
    expect(plan.ok).toBe(false);
    expect(plan.error).toContain("not compatible");
    expect(plan.error).toContain('"orm"');
  });

  test("maps a fullstack self backend and returns flag-based commands", async () => {
    const result = await call("bts_get_create_command", {
      ...baseStack,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      api: "orpc",
      addons: [],
      install: false,
    });
    expect(result.ok).toBe(true);
    expect(result.data?.command).toContain("--frontend next --backend self");
    expect(result.data?.command).toContain("--no-install");
  });

  test("rejects nested options the CLI would have to validate", async () => {
    const result = await client.callTool({
      name: "bts_plan_project",
      arguments: { ...baseStack, dbSetupOptions: { mode: "auto" } },
    });
    expect(result.isError).toBe(true);
  });

  test("rejects none mixed with concrete selections", async () => {
    const plan = await call("bts_plan_project", { ...baseStack, frontend: ["none", "next"] });
    expect(plan.ok).toBe(false);
    expect(plan.error).toContain('"none" can\'t be combined');
  });

  test("returns the same normalized project name it previews", async () => {
    const plan = await call("bts_plan_project", { ...baseStack, projectName: "my app" });
    expect(plan.ok).toBe(true);
    expect(plan.data?.command).toBe("bun create better-t-stack@latest my-app --yes");
  });

  test("serves 2025-era clients statelessly, without a session", async () => {
    const rpc = async (body: { id: number; method: string; params: object }) => {
      const response = await routeFetch("http://localhost/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          "Mcp-Protocol-Version": "2025-06-18",
        },
        body: JSON.stringify({ jsonrpc: "2.0", ...body }),
      });
      expect(response.status).toBe(200);
      const text = await response.text();
      const json = text.startsWith("{") ? text : text.split("data: ").at(-1)!;
      return JSON.parse(json);
    };

    const init = await rpc({
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "legacy-client", version: "1.0.0" },
      },
    });
    expect(init.result.serverInfo.name).toBe("better-t-stack");

    const plan = await rpc({
      id: 2,
      method: "tools/call",
      params: { name: "bts_plan_project", arguments: baseStack },
    });
    expect(plan.result.structuredContent.ok).toBe(true);
  });

  test("answers CORS preflight for browser-based clients", async () => {
    const response = await routeFetch("http://localhost/mcp", { method: "OPTIONS" });
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
