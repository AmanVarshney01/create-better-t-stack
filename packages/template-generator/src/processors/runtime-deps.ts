import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

type PackageJson = {
  scripts?: Record<string, string>;
  [key: string]: unknown;
};

export function processRuntimeDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { runtime, backend } = config;

  if (backend === "convex" || backend === "self" || runtime === "none") return;

  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath)) return;

  const pkgJson = vfs.readJson<PackageJson>(serverPath);
  if (!pkgJson) return;

  pkgJson.scripts = pkgJson.scripts || {};

  if (runtime === "bun") {
    pkgJson.scripts.dev = "bun run --hot src/index.ts";
    pkgJson.scripts.start = "bun run dist/index.js";

    addPackageDependency({
      vfs,
      packagePath: serverPath,
      devDependencies: ["@types/bun"],
    });
  } else if (runtime === "node") {
    pkgJson.scripts.dev = "tsx watch src/index.ts";
    pkgJson.scripts.start = "node dist/index.js";

    addPackageDependency({
      vfs,
      packagePath: serverPath,
      devDependencies: ["tsx", "@types/node"],
    });

    if (backend === "hono") {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@hono/node-server"],
      });
    } else if (backend === "elysia") {
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@elysiajs/node"],
      });
    }
  }

  vfs.writeJson(serverPath, pkgJson);
}
