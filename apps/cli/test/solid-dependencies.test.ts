import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

import yaml from "yaml";

import { expectSuccess, runCreateTest } from "./test-utils";

for (const packageManager of ["bun", "npm", "pnpm"] as const) {
  test(`Solid pins its runtime across the ${packageManager} workspace`, async () => {
    const result = await runCreateTest({
      projectName: `solid-runtime-${packageManager}`,
      frontend: ["solid"],
      backend: "hono",
      runtime: "bun",
      api: "orpc",
      database: "sqlite",
      orm: "drizzle",
      auth: "better-auth",
      examples: ["todo"],
      packageManager,
    });
    expectSuccess(result);
    const web = JSON.parse(
      await readFile(path.join(result.projectDir!, "apps/web/package.json"), "utf8"),
    );
    const workspace =
      packageManager === "pnpm"
        ? yaml.parse(await readFile(path.join(result.projectDir!, "pnpm-workspace.yaml"), "utf8"))
        : JSON.parse(await readFile(path.join(result.projectDir!, "package.json"), "utf8"));

    expect(workspace.overrides["solid-js"]).toBe(web.dependencies["solid-js"]);
    const auth = JSON.parse(
      await readFile(path.join(result.projectDir!, "packages/auth/package.json"), "utf8"),
    );
    const catalog = workspace.catalog ?? workspace.workspaces?.catalog;
    const version = (name: string) =>
      auth.dependencies[name] === "catalog:" ? catalog[name] : auth.dependencies[name];
    expect(version("@better-auth/core")).toBe(version("better-auth"));
    expect(version("@better-auth/drizzle-adapter")).toBe(version("better-auth"));
  });
}
