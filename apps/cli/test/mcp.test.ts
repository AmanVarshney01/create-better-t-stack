import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { describe, expect, it } from "bun:test";
import { rm } from "node:fs/promises";
import path from "node:path";

import { computeExternalStatusFromReports, resolveScaffoldPlan } from "../src/mcp/planning";

describe("MCP Planning", () => {
  it("should resolve a valid stack plan", () => {
    const result = resolveScaffoldPlan({
      projectName: ".smoke/mcp-plan-test",
      config: {
        install: false,
        git: false,
        addons: ["none"],
        examples: ["none"],
        auth: "none",
      },
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    expect(result.value.config.relativePath).toBe(".smoke/mcp-plan-test");
    expect(result.value.reproducibleCommand).toMatch(
      /(?:create-better-t-stack|better-t-stack)@latest/,
    );
  });

  it("should report partial_success when external reports include warnings", () => {
    const status = computeExternalStatusFromReports([
      {
        addon: "mcp",
        status: "warning",
        warning: "No agents selected",
      },
    ]);
    expect(status).toBe("partial_success");
  });
});

describe("MCP Server", () => {
  it("should expose MCP tools and execute plan_stack", async () => {
    const client = new Client({ name: "mcp-test-client", version: "1.0.0" }, { capabilities: {} });
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [path.join(import.meta.dir, "..", "dist", "cli.mjs"), "mcp"],
      cwd: path.join(import.meta.dir, ".."),
      stderr: "pipe",
    });

    await client.connect(transport);

    const toolsResponse = await client.listTools();
    const toolNames = toolsResponse.tools.map((tool) => tool.name);
    expect(toolNames).toContain("plan_stack");
    expect(toolNames).toContain("create_stack");

    const planResult = await client.callTool({
      name: "plan_stack",
      arguments: {
        projectName: ".smoke/mcp-server-plan",
        config: {
          install: false,
          git: false,
          addons: ["none"],
          examples: ["none"],
          auth: "none",
        },
      },
    });

    const structured = planResult.structuredContent as { success?: boolean } | undefined;
    expect(structured?.success).toBe(true);

    await transport.close();
  });

  it("should execute create_stack", async () => {
    const targetRelativePath = ".smoke/mcp-server-create";
    const absoluteTarget = path.join(import.meta.dir, "..", targetRelativePath);
    await rm(absoluteTarget, { recursive: true, force: true });

    const client = new Client({ name: "mcp-test-client", version: "1.0.0" }, { capabilities: {} });
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [path.join(import.meta.dir, "..", "dist", "cli.mjs"), "mcp"],
      cwd: path.join(import.meta.dir, ".."),
      stderr: "pipe",
    });

    await client.connect(transport);

    const createResult = await client.callTool({
      name: "create_stack",
      arguments: {
        projectName: targetRelativePath,
        directoryConflict: "error",
        config: {
          install: false,
          git: false,
          addons: ["none"],
          examples: ["none"],
          auth: "none",
        },
      },
    });

    const structured = createResult.structuredContent as { status?: string } | undefined;
    expect(structured?.status).toBe("success");

    await transport.close();
    await rm(absoluteTarget, { recursive: true, force: true });
  });
});
