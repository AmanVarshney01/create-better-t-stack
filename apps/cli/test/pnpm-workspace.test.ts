import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

import yaml from "yaml";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

async function readPnpmWorkspace(config: TestConfig) {
  const result = await runTRPCTest({
    ...config,
    packageManager: "pnpm",
    install: false,
    git: false,
  });

  expectSuccess(result);

  const workspacePath = path.join(result.projectDir!, "pnpm-workspace.yaml");
  const content = await readFile(workspacePath, "utf8");
  return yaml.parse(content) as { allowBuilds?: Record<string, boolean> };
}

describe("pnpm workspace", () => {
  it("adds build approvals for the Convex Better Auth Cloudflare stack", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-convex-cloudflare",
      frontend: ["tanstack-start"],
      backend: "convex",
      runtime: "none",
      api: "none",
      database: "none",
      orm: "none",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
      dbSetup: "none",
      webDeploy: "cloudflare",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toMatchObject({
      esbuild: true,
      msw: true,
      sharp: true,
      workerd: true,
    });
  });

  it("adds build approvals for Prisma engines", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-prisma-engines",
      frontend: ["none"],
      backend: "hono",
      runtime: "bun",
      api: "none",
      database: "sqlite",
      orm: "prisma",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toMatchObject({
      "@prisma/engines": true,
      prisma: true,
    });
  });

  it("adds build approvals for node runtime and workspace addons", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-node-addons",
      frontend: ["none"],
      backend: "hono",
      runtime: "node",
      api: "none",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      addons: ["nx", "lefthook"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toMatchObject({
      esbuild: true,
      lefthook: true,
      nx: true,
    });
  });

  it("adds only the React UI approval when no other build-script deps are expected", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-react-ui",
      frontend: ["tanstack-router"],
      backend: "none",
      runtime: "none",
      api: "none",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toEqual({ msw: true });
  });

  it("does not add build approvals for stacks without lifecycle-script dependencies", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-svelte",
      frontend: ["svelte"],
      backend: "none",
      runtime: "none",
      api: "none",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toBeUndefined();
  });
});
