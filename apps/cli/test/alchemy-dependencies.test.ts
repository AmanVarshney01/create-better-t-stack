import { expect, test } from "bun:test";

import { inc, minVersion, satisfies, subset, valid } from "semver";
import yaml from "yaml";
import { z } from "zod";

import { createVirtual } from "../src";
import { collectFiles } from "./setup";

const dependencies = z.record(z.string(), z.string());
const workspaceSchema = z.object({
  catalog: dependencies.optional(),
  overrides: dependencies.optional(),
  workspaces: z
    .union([z.array(z.string()), z.object({ catalog: dependencies.optional() })])
    .optional(),
});
const infraSchema = z.object({ devDependencies: dependencies });

for (const packageManager of ["bun", "npm", "pnpm"] as const) {
  for (const deployment of ["cloudflare", "prisma", "axiom", "none"] as const) {
    test(`Alchemy generates compatible platform dependencies for ${deployment} with ${packageManager}`, async () => {
      const result = await createVirtual({
        projectName: `alchemy-${deployment}-${packageManager}`,
        frontend: ["next"],
        backend: deployment === "prisma" || deployment === "none" ? "none" : "hono",
        runtime: deployment === "prisma" || deployment === "none" ? "none" : "bun",
        database: deployment === "prisma" || deployment === "none" ? "none" : "sqlite",
        orm: deployment === "prisma" || deployment === "none" ? "none" : "drizzle",
        api: deployment === "prisma" || deployment === "none" ? "none" : "orpc",
        auth: "none",
        webDeploy: deployment === "cloudflare" || deployment === "prisma" ? deployment : "none",
        addons: deployment === "axiom" ? ["axiom"] : ["none"],
        packageManager,
        install: false,
        git: false,
      });
      if (result.isErr()) throw result.error;
      const files = collectFiles(result.value.root, result.value.root.path);
      const workspace = workspaceSchema.parse(
        packageManager === "pnpm"
          ? yaml.parse(files.get("pnpm-workspace.yaml")!)
          : JSON.parse(files.get("package.json")!),
      );
      if (deployment !== "cloudflare") {
        expect(workspace.overrides?.["@next/env"]).toBeDefined();
      }
      if (deployment !== "none") {
        const infra = infraSchema.parse(JSON.parse(files.get("packages/infra/package.json")!));
        const catalog =
          workspace.catalog ??
          (Array.isArray(workspace.workspaces) ? undefined : workspace.workspaces?.catalog);
        const version = (name: string) => {
          const value = infra.devDependencies[name];
          const resolved = value === "catalog:" ? catalog?.[name] : value;
          return z.string().parse(resolved);
        };
        const effectRange = version("effect");
        const minimumEffect = minVersion(effectRange);
        if (!minimumEffect) throw new Error("Expected a valid Effect dependency range");
        const nextPatch = inc(minimumEffect, "patch");
        if (!nextPatch) throw new Error("Expected a compatible Effect patch version");
        expect(satisfies(nextPatch, effectRange)).toBe(true);
        for (const platform of ["@effect/platform-node", "@effect/platform-bun"]) {
          const platformRange = version(platform);
          expect(valid(platformRange)).toBe(platformRange);
          expect(subset(platformRange, effectRange)).toBe(true);
          expect(satisfies(minimumEffect, platformRange)).toBe(true);
          expect(satisfies(nextPatch, platformRange)).toBe(false);
          expect(workspace.overrides?.[platform]).toBe(platformRange);
        }
        for (const dependency of [
          "@effect/platform-node-shared",
          "@effect/sql-d1",
          "@effect/sql-sqlite-do",
          "@effect/sql-pg",
          "@effect/sql-mysql2",
          "@effect/sql-libsql",
          "@effect/sql-pglite",
          "@effect/sql-sqlite-bun",
          "@effect/sql-sqlite-node",
          "@effect/sql-sqlite-wasm",
          "@effect/vitest",
        ]) {
          const pinnedVersion = z.string().parse(workspace.overrides?.[dependency]);
          expect(valid(pinnedVersion)).toBe(pinnedVersion);
          expect(pinnedVersion).toBe(version("@effect/platform-node"));
        }
        if (deployment === "prisma") {
          expect(version("@alchemy.run/frontend-frameworks")).toBe(version("alchemy"));
        }
      } else {
        expect(workspace.overrides?.["@effect/platform-node"]).toBeUndefined();
        expect(workspace.overrides?.["@effect/platform-bun"]).toBeUndefined();
        expect(workspace.overrides?.["@effect/platform-node-shared"]).toBeUndefined();
      }
    });
  }
}

for (const packageManager of ["bun", "npm", "pnpm"] as const) {
  test(`Svelte Kit 2 uses the Node artifact without the Kit 3 adapter with ${packageManager}`, async () => {
    const result = await createVirtual({
      projectName: "prisma-svelte-node",
      frontend: ["svelte"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      webDeploy: "prisma",
      packageManager,
      install: false,
      git: false,
    });
    if (result.isErr()) throw result.error;
    const files = collectFiles(result.value.root, result.value.root.path);
    const infra = infraSchema.parse(JSON.parse(files.get("packages/infra/package.json")!));
    expect(infra.devDependencies.alchemy).toBeDefined();
    expect(infra.devDependencies["@alchemy.run/frontend-frameworks"]).toBeUndefined();
    expect(infra.devDependencies["@vercel/nft"]).toBeUndefined();
  });
}

for (const packageManager of ["bun", "npm", "pnpm"] as const) {
  test(`Drizzle constrains optional Effect SQL peers without Alchemy with ${packageManager}`, async () => {
    const result = await createVirtual({
      projectName: `drizzle-effect-${packageManager}`,
      frontend: ["next"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "better-auth",
      examples: ["todo"],
      packageManager,
      install: false,
      git: false,
    });
    if (result.isErr()) throw result.error;
    const files = collectFiles(result.value.root, result.value.root.path);
    expect(files.has("packages/infra/package.json")).toBe(false);
    const workspace = workspaceSchema.parse(
      packageManager === "pnpm"
        ? yaml.parse(files.get("pnpm-workspace.yaml")!)
        : JSON.parse(files.get("package.json")!),
    );
    expect(workspace.overrides?.["@next/env"]).toBeDefined();
    const platformVersion = z.string().parse(workspace.overrides?.["@effect/platform-node"]);
    expect(valid(platformVersion)).toBe(platformVersion);
    for (const adapter of [
      "@effect/sql-d1",
      "@effect/sql-libsql",
      "@effect/sql-mysql2",
      "@effect/sql-pg",
      "@effect/sql-pglite",
      "@effect/sql-sqlite-bun",
      "@effect/sql-sqlite-do",
      "@effect/sql-sqlite-node",
      "@effect/sql-sqlite-wasm",
    ]) {
      expect(workspace.overrides?.[adapter]).toBe(platformVersion);
    }
    expect(workspace.overrides?.effect).toBeUndefined();
  });
}
