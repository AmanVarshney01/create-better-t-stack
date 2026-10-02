import { expect, test } from "bun:test";

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
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
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
          expect(resolved).toBeString();
          return resolved;
        };
        expect(version("@effect/platform-node")).toBe(version("effect"));
        expect(version("@effect/platform-bun")).toBe(version("effect"));
        if (deployment === "prisma") {
          expect(version("@alchemy.run/frontend-frameworks")).toBe(version("alchemy"));
        }
      }
    });
  }
}
