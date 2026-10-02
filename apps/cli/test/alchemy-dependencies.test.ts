import { expect, test } from "bun:test";

import yaml from "yaml";

import { createVirtual } from "../src";
import { collectFiles } from "./setup";

for (const packageManager of ["bun", "npm", "pnpm"] as const) {
  for (const deployment of ["cloudflare", "prisma", "axiom", "none"] as const) {
    test(`Alchemy aligns its transitive platform dependency for ${deployment} with ${packageManager}`, async () => {
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
      const workspace =
        packageManager === "pnpm"
          ? yaml.parse(files.get("pnpm-workspace.yaml")!)
          : JSON.parse(files.get("package.json")!);
      const override = workspace.overrides?.["@effect/platform-node-shared"];
      if (deployment === "none") {
        expect(override).toBeUndefined();
      } else {
        const infra = JSON.parse(files.get("packages/infra/package.json")!);
        const effect = infra.devDependencies.effect;
        const catalog = workspace.catalog ?? workspace.workspaces?.catalog;
        expect(override).toBe(effect === "catalog:" ? catalog.effect : effect);
      }
    });
  }
}
