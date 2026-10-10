import type { ProjectConfig } from "@better-t-stack/types";
import { parseDocument } from "yaml";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getPrismaWebsiteFramework } from "../generators/alchemy/plan";
import { addPackageDependency, alchemyEffectDependencyVersions } from "../utils/add-deps";

export function processInfraDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const infraPath = "packages/infra/package.json";
  if (!vfs.exists(infraPath)) return;

  const { serverDeploy, webDeploy } = config;
  if (getPrismaWebsiteFramework(config)) {
    addPackageDependency({
      vfs,
      packagePath: infraPath,
      devDependencies: ["@alchemy.run/frontend-frameworks", "@vercel/nft"],
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

    // Pin transitive and adapter peers too; workspace dependency pins alone do not constrain them.
    if (config.packageManager === "pnpm") {
      const workspacePath = "pnpm-workspace.yaml";
      const workspace = parseDocument(vfs.readFile(workspacePath) ?? "");
      for (const [name, version] of Object.entries(alchemyEffectDependencyVersions)) {
        workspace.setIn(["overrides", name], version);
      }
      vfs.writeFile(workspacePath, workspace.toString());
    } else {
      const workspace = vfs.readJson<{ overrides?: Record<string, string> }>("package.json")!;
      workspace.overrides = { ...workspace.overrides, ...alchemyEffectDependencyVersions };
      vfs.writeJson("package.json", workspace);
    }
  }
}
