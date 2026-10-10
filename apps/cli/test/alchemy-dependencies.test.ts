import { expect, test } from "bun:test";

import { inc, minVersion, satisfies, subset } from "semver";
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
        backend: deployment === "prisma" ? "none" : "hono",
        runtime: deployment === "prisma" ? "none" : "bun",
        database: deployment === "prisma" ? "none" : "sqlite",
        orm: deployment === "prisma" ? "none" : "drizzle",
        api: deployment === "prisma" ? "none" : "orpc",
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
      // Stable Effect peers resolve normally; generation must not inject an override.
      expect(workspace.overrides?.["@effect/platform-node-shared"]).toBeUndefined();
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
          expect(subset(platformRange, effectRange)).toBe(true);
          expect(satisfies(nextPatch, platformRange)).toBe(true);
        }
        if (deployment === "prisma") {
          expect(version("@alchemy.run/frontend-frameworks")).toBe(version("alchemy"));
        }
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
