import type { ProjectConfig } from "@better-t-stack/types";

import type { JsonValue } from "../core/json-types";
import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

type PackageJson = {
  scripts?: Record<string, string>;
  [key: string]: JsonValue | undefined;
};

export function processRuntimeDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { runtime, backend } = config;

  if (backend === "convex" || backend === "self" || runtime === "none") return;

  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath)) return;

  const pkgJson = vfs.readJson<PackageJson>(serverPath);
  if (!pkgJson) return;

  pkgJson.scripts = pkgJson.scripts || {};

  if (backend === "nitro") {
    pkgJson.scripts.dev = "nitro dev --port 3000";
    pkgJson.scripts.start =
      runtime === "workers" ? "nitro preview" : `${runtime} .output/server/index.mjs`;

    addPackageDependency({
      vfs,
      packagePath: serverPath,
      devDependencies: [runtime === "bun" ? "@types/bun" : "@types/node"],
    });
    vfs.writeJson(serverPath, pkgJson);
    return;
  }

  if (runtime === "bun") {
    pkgJson.scripts.dev = "bun run --hot src/index.ts";
    pkgJson.scripts.start = "bun run dist/index.mjs";

    addPackageDependency({
      vfs,
      packagePath: serverPath,
      devDependencies: ["@types/bun"],
    });
  } else if (runtime === "node") {
    pkgJson.scripts.dev = "tsx watch src/index.ts";
    pkgJson.scripts.start = "node dist/index.mjs";

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
