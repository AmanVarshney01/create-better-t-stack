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

  const entrypoint = backend === "nest" ? "main" : "index";

  if (runtime === "bun") {
    pkgJson.scripts.dev = `bun run --hot src/${entrypoint}.ts`;
    pkgJson.scripts.start = `bun run dist/${entrypoint}.mjs`;

    addPackageDependency({
      vfs,
      packagePath: serverPath,
      devDependencies: ["@types/bun"],
    });
  } else if (runtime === "node") {
    pkgJson.scripts.dev = `tsx watch src/${entrypoint}.ts`;
    pkgJson.scripts.start = `node dist/${entrypoint}.mjs`;

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
