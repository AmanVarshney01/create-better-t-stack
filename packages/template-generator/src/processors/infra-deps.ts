import type { ProjectConfig } from "@better-t-stack/types";
import yaml from "yaml";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, dependencyVersionMap } from "../utils/add-deps";

export function processInfraDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const infraPath = "packages/infra/package.json";
  if (!vfs.exists(infraPath)) return;

  const { serverDeploy, webDeploy } = config;
  if (
    ["cloudflare", "prisma"].includes(serverDeploy) ||
    ["cloudflare", "prisma"].includes(webDeploy) ||
    config.addons.includes("axiom")
  ) {
    addPackageDependency({
      vfs,
      packagePath: infraPath,
      devDependencies: [
        "alchemy",
        "effect",
        "@effect/platform-node",
        "@effect/platform-bun",
        "varlock",
      ],
    });

    // Alchemy uses APIs removed in Effect rc.113; keep its transitive packages on the compatible RC.
    const overrides = Object.fromEntries(
      [
        "@effect/platform-node-shared",
        "@effect/sql-d1",
        "@effect/sql-sqlite-do",
        "@effect/vitest",
      ].map((name) => [name, dependencyVersionMap.effect]),
    );
    if (config.packageManager === "pnpm") {
      const file = "pnpm-workspace.yaml";
      const workspace = yaml.parse(vfs.readFile(file) ?? "") ?? {};
      workspace.overrides = { ...workspace.overrides, ...overrides };
      vfs.writeFile(file, yaml.stringify(workspace));
    } else {
      const root = vfs.readJson<{ overrides?: Record<string, string> }>("package.json")!;
      root.overrides = { ...root.overrides, ...overrides };
      vfs.writeJson("package.json", root);
    }
  }
}
