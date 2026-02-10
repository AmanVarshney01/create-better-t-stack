import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "../src";

import { getRecommendedMcpServers } from "../src/helpers/addons/mcp-setup";

function makeConfig(overrides: Partial<ProjectConfig>): ProjectConfig {
  return {
    projectName: "test",
    projectDir: "/tmp/test",
    relativePath: "test",
    database: "sqlite",
    orm: "drizzle",
    backend: "hono",
    runtime: "bun",
    frontend: ["tanstack-router"],
    addons: [],
    examples: ["none"],
    auth: "none",
    payments: "none",
    git: false,
    packageManager: "bun",
    install: false,
    dbSetup: "none",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    ...overrides,
  };
}

describe("MCP Curation", () => {
  it("should include nuxt docs and nuxt ui docs for nuxt projects", () => {
    const config = makeConfig({ frontend: ["nuxt"], api: "orpc" });
    const servers = getRecommendedMcpServers(config);
    const targets = servers.map((s) => s.target);

    expect(targets).toContain("https://nuxt.com/mcp");
    expect(targets).toContain("https://ui.nuxt.com/mcp");
  });

  it("should include Better Auth MCP for better-auth projects", () => {
    const config = makeConfig({ auth: "better-auth" });
    const servers = getRecommendedMcpServers(config);
    const targets = servers.map((s) => s.target);

    expect(targets).toContain("https://mcp.inkeep.com/better-auth/mcp");
  });

  it("should include PlanetScale MCP for planetscale db setup", () => {
    const config = makeConfig({ dbSetup: "planetscale" });
    const servers = getRecommendedMcpServers(config);
    const targets = servers.map((s) => s.target);

    expect(targets).toContain("https://mcp.pscale.dev/mcp/planetscale");
  });

  it("should include Cloudflare docs MCP with sse transport for workers runtime", () => {
    const config = makeConfig({ runtime: "workers" });
    const servers = getRecommendedMcpServers(config);
    const cloudflare = servers.find((s) => s.key === "cloudflare-docs");

    expect(cloudflare?.target).toBe("https://docs.mcp.cloudflare.com/sse");
    expect(cloudflare?.transport).toBe("sse");
  });
});
