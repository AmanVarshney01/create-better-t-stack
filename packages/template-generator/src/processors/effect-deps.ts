import type { ProjectConfig, Database, Runtime, ORM } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

export function processEffectDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { effect, runtime, database, orm, testing, backend, frontend } = config;

  if (effect === "none") return;

  const hasWeb = frontend.some((f) => f !== "none");
  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasServer = backend !== "none" && backend !== "convex" && backend !== "self";

  const webPath = getWebPackagePath(frontend);
  const serverPath = getServerPackagePath(frontend);

  // Add core effect to all relevant packages
  addEffectCoreDeps(vfs, effect, hasWeb, hasNative, hasServer, webPath, serverPath);

  // For effect-full, add platform and schema packages
  if (effect === "effect-full") {
    addEffectPlatformDeps(vfs, runtime, hasWeb, hasNative, hasServer, webPath, serverPath);
    addEffectSqlDeps(vfs, database, orm, runtime, serverPath);
    addEffectTestingDeps(vfs, testing, webPath, serverPath);
  }
}

function addEffectCoreDeps(
  vfs: VirtualFileSystem,
  effect: ProjectConfig["effect"],
  hasWeb: boolean,
  hasNative: boolean,
  hasServer: boolean,
  webPath: string,
  serverPath: string,
): void {
  const deps: AvailableDependencies[] = ["effect"];

  // For effect-full, also add schema
  if (effect === "effect-full") {
    deps.push("@effect/schema");
  }

  // Add to server package
  if (hasServer && vfs.exists(serverPath)) {
    addPackageDependency({ vfs, packagePath: serverPath, dependencies: deps });
  }

  // Add to web package
  if (hasWeb && vfs.exists(webPath)) {
    addPackageDependency({ vfs, packagePath: webPath, dependencies: deps });
  }

  // Add to native package
  const nativePath = "apps/native/package.json";
  if (hasNative && vfs.exists(nativePath)) {
    addPackageDependency({ vfs, packagePath: nativePath, dependencies: deps });
  }

  // Add to packages/api if it exists
  const apiPath = "packages/api/package.json";
  if (vfs.exists(apiPath)) {
    addPackageDependency({ vfs, packagePath: apiPath, dependencies: deps });
  }
}

function addEffectPlatformDeps(
  vfs: VirtualFileSystem,
  runtime: Runtime,
  hasWeb: boolean,
  hasNative: boolean,
  hasServer: boolean,
  webPath: string,
  serverPath: string,
): void {
  const nativePath = "apps/native/package.json";

  // Add platform packages based on runtime
  if (hasServer && vfs.exists(serverPath)) {
    const deps: AvailableDependencies[] = ["@effect/platform"];
    if (runtime === "bun") {
      deps.push("@effect/platform-bun");
    } else if (runtime === "node") {
      deps.push("@effect/platform-node");
    }
    // For workers runtime, just use @effect/platform
    addPackageDependency({ vfs, packagePath: serverPath, dependencies: deps });
  }

  // For web, add browser platform
  if (hasWeb && vfs.exists(webPath)) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@effect/platform", "@effect/platform-browser"],
    });
  }

  // For native, add the platform package
  if (hasNative && vfs.exists(nativePath)) {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@effect/platform"],
    });
  }
}

function addEffectSqlDeps(
  vfs: VirtualFileSystem,
  database: Database,
  orm: ORM,
  runtime: Runtime,
  serverPath: string,
): void {
  if (database === "none") return;

  if (!vfs.exists(serverPath)) return;

  const deps: AvailableDependencies[] = ["@effect/sql"];

  // Add database-specific SQL adapter
  if (database === "sqlite") {
    if (runtime === "bun") {
      deps.push("@effect/sql-sqlite-bun");
    } else {
      deps.push("@effect/sql-sqlite-node");
    }
  } else if (database === "postgres") {
    deps.push("@effect/sql-pg");
  } else if (database === "mysql") {
    deps.push("@effect/sql-mysql2");
  }

  // If using Drizzle ORM, also add the drizzle adapter
  if (orm === "drizzle") {
    deps.push("@effect/sql-drizzle");
  }

  addPackageDependency({ vfs, packagePath: serverPath, dependencies: deps });
}

function addEffectTestingDeps(
  vfs: VirtualFileSystem,
  testing: ProjectConfig["testing"],
  webPath: string,
  serverPath: string,
): void {
  if (testing === "none" || testing === "playwright") return;

  // Add @effect/vitest to packages that use vitest
  const packagesToCheck = [serverPath, webPath, "packages/api/package.json"];

  for (const pkgPath of packagesToCheck) {
    if (vfs.exists(pkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: pkgPath,
        devDependencies: ["@effect/vitest"],
      });
    }
  }
}
