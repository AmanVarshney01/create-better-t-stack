import type { ProjectConfig } from "@better-t-stack/types";
import { parseDocument } from "yaml";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { effectDependencyVersions } from "../utils/add-deps";

export function processEffectDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const hasDrizzle = config.orm === "drizzle" && vfs.exists("packages/db/package.json");
  const hasAlchemy =
    vfs.exists("packages/infra/package.json") &&
    (["cloudflare", "prisma"].includes(config.serverDeploy) ||
      ["cloudflare", "prisma"].includes(config.webDeploy) ||
      config.addons.includes("axiom"));
  if (!hasDrizzle && !hasAlchemy) return;

  // Constrain optional SQL peers as well as installed adapters to the published Effect release.
  if (config.packageManager === "pnpm") {
    const workspacePath = "pnpm-workspace.yaml";
    const workspace = parseDocument(vfs.readFile(workspacePath) ?? "");
    for (const [name, version] of Object.entries(effectDependencyVersions)) {
      workspace.setIn(["overrides", name], version);
    }
    vfs.writeFile(workspacePath, workspace.toString());
  } else {
    const workspace = vfs.readJson<{ overrides?: Record<string, string> }>("package.json")!;
    workspace.overrides = { ...workspace.overrides, ...effectDependencyVersions };
    vfs.writeJson("package.json", workspace);
  }
}
