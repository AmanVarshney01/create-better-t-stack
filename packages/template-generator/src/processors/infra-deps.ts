import type { ProjectConfig } from "@better-t-stack/types";
import { parse, stringify } from "yaml";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getPrismaWebsiteFramework } from "../generators/alchemy/plan";
import { addPackageDependency, dependencyVersionMap } from "../utils/add-deps";

export function processInfraDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const infraPath = "packages/infra/package.json";
  if (!vfs.exists(infraPath)) return;

  const { serverDeploy, webDeploy } = config;
  if (webDeploy === "prisma") {
    addPackageDependency({
      vfs,
      packagePath: infraPath,
      devDependencies: ["@alchemy.run/frontend-frameworks"],
    });
  }
  if (getPrismaWebsiteFramework(config)) {
    addPackageDependency({
      vfs,
      packagePath: infraPath,
      devDependencies: ["@vercel/nft"],
    });
  }
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

    // The platform RCs use a caret range that also accepts the incompatible stable release.
    const overrides = { "@effect/platform-node-shared": dependencyVersionMap.effect };
    if (config.packageManager === "pnpm") {
      const workspace = parse(vfs.readFile("pnpm-workspace.yaml") ?? "") ?? {};
      workspace.overrides = { ...workspace.overrides, ...overrides };
      vfs.writeFile("pnpm-workspace.yaml", stringify(workspace));
    } else {
      const root = vfs.readJson<{ overrides?: Record<string, string> }>("package.json");
      if (root) {
        root.overrides = { ...root.overrides, ...overrides };
        vfs.writeJson("package.json", root);
      }
    }
  }
}
