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

  it("adds esbuild approval for Vite+ stacks", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-svelte-vite-plus",
      frontend: ["svelte"],
      backend: "self",
      runtime: "none",
      api: "orpc",
      database: "sqlite",
      orm: "drizzle",
      auth: "better-auth",
      payments: "none",
      addons: ["evlog", "husky", "oxlint", "ultracite", "vite-plus"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toEqual({ esbuild: true });
  });

  it("adds esbuild approval for Turborepo stacks", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-turborepo",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      api: "trpc",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toEqual({ esbuild: true });
  });

  it("does not add build approvals for TanStack Router without lifecycle-script dependencies", async () => {
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

    expect(workspace.allowBuilds).toBeUndefined();
  });

  it("adds esbuild approval for a plain React Router frontend", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-react-router-ui",
      frontend: ["react-router"],
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

    expect(workspace.allowBuilds).toEqual({ esbuild: true });
  });

  it("adds build approvals for a plain Next.js frontend", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-next-ui",
      frontend: ["next"],
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

    expect(workspace.allowBuilds).toEqual({
      sharp: true,
    });
  });

  it("adds build approvals for a plain Nuxt frontend", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-nuxt-ui",
      frontend: ["nuxt"],
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

    expect(workspace.allowBuilds).toEqual({
      esbuild: true,
      "@parcel/watcher": true,
      "vue-demi": true,
    });
  });

  it("does not add build approvals for native Expo stacks without lifecycle-script dependencies", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-native-expo",
      frontend: ["native-bare"],
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

  it("adds build approvals for Docker deploys so non-interactive installs succeed", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-docker-next",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      api: "trpc",
      database: "postgres",
      orm: "prisma",
      auth: "better-auth",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "docker",
      webDeploy: "docker",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toMatchObject({
      esbuild: true,
      sharp: true,
      "@prisma/engines": true,
    });
  });

  it("adds build approvals for Vercel deploys so non-interactive installs succeed", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-vercel-svelte",
      frontend: ["svelte"],
      backend: "self",
      runtime: "none",
      api: "orpc",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "vercel",
      serverDeploy: "none",
    });

    expect(workspace.allowBuilds).toMatchObject({
      esbuild: true,
      sharp: true,
    });
  });

  it("approves Nuxt lifecycle-script dependencies", async () => {
    const workspace = await readPnpmWorkspace({
      projectName: "pnpm-nuxt-builds",
      frontend: ["nuxt"],
      backend: "fastify",
      runtime: "node",
      api: "orpc",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "docker",
      serverDeploy: "docker",
    });

    expect(workspace.allowBuilds).toMatchObject({
      "@parcel/watcher": true,
      "vue-demi": true,
    });
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
