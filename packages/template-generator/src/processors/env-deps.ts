import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processEnvDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  addPackageDependency({ vfs, packagePath: "package.json", devDependencies: ["varlock"] });
  for (const app of ["web", "server", "native"]) {
    const dependencies: AvailableDependencies[] = ["varlock"];
    if (app === "web" && config.webDeploy !== "cloudflare") {
      dependencies.push(
        config.frontend.includes("next")
          ? "@varlock/nextjs-integration"
          : config.frontend.includes("nuxt")
            ? "@varlock/nuxt-integration"
            : config.frontend.includes("astro")
              ? "@varlock/astro-integration"
              : "@varlock/vite-integration",
      );
    }
    if (app === "web" && config.webDeploy === "cloudflare" && config.frontend.includes("next"))
      dependencies.push("@opennextjs/cloudflare");
    if (app === "native") {
      dependencies.push("@varlock/expo-integration");
      addPackageDependency({
        vfs,
        packagePath: "apps/native/package.json",
        devDependencies: ["babel-preset-expo"],
      });
    }
    addPackageDependency({ vfs, packagePath: `apps/${app}/package.json`, dependencies });
  }
  if (config.frontend.includes("next") && config.webDeploy !== "cloudflare") {
    const version = "npm:@varlock/nextjs-integration@1.2.2";
    if (config.packageManager === "pnpm") {
      const path = "pnpm-workspace.yaml";
      vfs.writeFile(path, `${vfs.readFile(path) ?? ""}\noverrides:\n  '@next/env': '${version}'\n`);
    } else {
      const pkg = vfs.readJson<{ overrides?: Record<string, string> }>("package.json")!;
      pkg.overrides = { ...pkg.overrides, "@next/env": version };
      vfs.writeJson("package.json", pkg);
    }
  }
}
