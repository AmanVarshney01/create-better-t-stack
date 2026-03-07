import { describe, expect, it } from "bun:test";

import {
  AddInputSchema,
  BetterTStackConfigFileSchema,
  CLIInputSchema,
  CreateInputSchema,
} from "../../../packages/types/src/schemas";

describe("Input schemas", () => {
  it("rejects conflicting manualDb and dbSetupOptions.mode inputs", () => {
    const result = CreateInputSchema.safeParse({
      projectName: "app",
      manualDb: true,
      dbSetupOptions: { mode: "manual" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects conflicting nx and turborepo addon combinations", () => {
    const result = AddInputSchema.safeParse({
      addons: ["nx", "turborepo"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown keys in JSON-first create input", () => {
    const result = CreateInputSchema.safeParse({
      projectName: "app",
      pakageManager: "bun",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown keys in bts.jsonc config payloads", () => {
    const result = BetterTStackConfigFileSchema.safeParse({
      version: "0.0.0",
      createdAt: new Date(0).toISOString(),
      projectName: "app",
      database: "sqlite",
      orm: "drizzle",
      backend: "hono",
      runtime: "bun",
      frontend: ["tanstack-router"],
      addons: ["none"],
      examples: ["none"],
      auth: "none",
      payments: "none",
      packageManager: "bun",
      dbSetup: "none",
      api: "trpc",
      webDeploy: "none",
      serverDeploy: "none",
      unexpected: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown nested addon option keys", () => {
    const result = CreateInputSchema.safeParse({
      projectName: "app",
      addonOptions: {
        skills: {
          agent: ["cursor"],
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown nested db setup option keys", () => {
    const result = CreateInputSchema.safeParse({
      projectName: "app",
      dbSetupOptions: {
        neon: {
          region: "aws-us-east-1",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("allows CLI input parsing on top of the refined create schema", () => {
    const result = CLIInputSchema.safeParse({
      projectDirectory: ".",
      projectName: "app",
      addons: ["biome"],
    });

    expect(result.success).toBe(true);
  });

  it("imports the MCP module without schema-construction crashes", async () => {
    const module = await import("../src/mcp");

    expect(typeof module.createBtsMcpServer).toBe("function");
  });
});
