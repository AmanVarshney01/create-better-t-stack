import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processDatabaseDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { database, orm, backend, dbSetup } = config;

  if (backend === "convex" || database === "none") return;

  const dbPkgPath = "packages/db/package.json";
  const webPkgPath = "apps/web/package.json";
  const serverPkgPath = "apps/server/package.json";

  if (!vfs.exists(dbPkgPath)) return;
  const webNeedsDbRuntime = backend === "self" && vfs.exists(webPkgPath);

  if (orm === "prisma") {
    processPrismaDeps(vfs, config, dbPkgPath, webPkgPath, webNeedsDbRuntime);
  } else if (orm === "drizzle") {
    processDrizzleDeps(vfs, config, dbPkgPath, webPkgPath, webNeedsDbRuntime);
  } else if (orm === "mongoose") {
    addPackageDependency({ vfs, packagePath: dbPkgPath, dependencies: ["mongoose"] });
  }

  if (
    backend !== "self" &&
    database === "sqlite" &&
    dbSetup !== "d1" &&
    vfs.exists(serverPkgPath)
  ) {
    addPackageDependency({ vfs, packagePath: serverPkgPath, dependencies: ["libsql"] });
  }
}

function processPrismaDeps(
  vfs: VirtualFileSystem,
  config: ProjectConfig,
  dbPkgPath: string,
  webPkgPath: string,
  webExists: boolean,
): void {
  const { database, dbSetup } = config;

  if (database === "mongodb") {
    // Intentional: Prisma ORM v7 does not support MongoDB yet, so MongoDB stays on v6.
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      customDependencies: { "@prisma/client": "6.19.3" },
      customDevDependencies: { prisma: "6.19.3" },
    });
    if (webExists) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        customDependencies: { "@prisma/client": "6.19.3" },
      });
    }
    return;
  }

  const deps: AvailableDependencies[] = ["@prisma/client"];
  const devDeps: AvailableDependencies[] = ["prisma"];

  if (database === "mysql" && dbSetup === "planetscale") {
    deps.push("@prisma/adapter-planetscale", "@planetscale/database");
  } else if (database === "mysql") {
    deps.push("@prisma/adapter-mariadb");
  } else if (database === "sqlite") {
    deps.push(dbSetup === "d1" ? "@prisma/adapter-d1" : "@prisma/adapter-libsql");
  } else if (database === "postgres") {
    if (dbSetup === "neon") {
      deps.push("@prisma/adapter-neon", "@neondatabase/serverless");
    } else if (dbSetup === "prisma-postgres") {
      deps.push("@prisma/adapter-ppg");
    } else {
      deps.push("@prisma/adapter-pg", "pg");
      devDeps.push("@types/pg");
    }
  }

  addPackageDependency({
    vfs,
    packagePath: dbPkgPath,
    dependencies: deps,
    devDependencies: devDeps,
  });

  if (webExists) {
    const webDeps: AvailableDependencies[] = ["@prisma/client"];
    if (database === "sqlite" && dbSetup !== "d1") {
      webDeps.push("libsql");
    }
    addPackageDependency({ vfs, packagePath: webPkgPath, dependencies: webDeps });
  }
}

function processDrizzleDeps(
  vfs: VirtualFileSystem,
  config: ProjectConfig,
  dbPkgPath: string,
  webPkgPath: string,
  webExists: boolean,
): void {
  const { database, dbSetup, backend, webDeploy, serverDeploy } = config;
  const databaseRunsOnCloudflare =
    backend === "self" ? webDeploy === "cloudflare" : serverDeploy === "cloudflare";

  if (database === "sqlite") {
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: ["drizzle-orm", "@libsql/client", "libsql"],
      devDependencies: ["drizzle-kit"],
    });
    if (webExists) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@libsql/client", "libsql"],
      });
    }
  } else if (database === "postgres") {
    const deps: AvailableDependencies[] = ["drizzle-orm"];
    const devDeps: AvailableDependencies[] = ["drizzle-kit"];

    if (dbSetup === "neon") {
      deps.push("@neondatabase/serverless");
    } else if (databaseRunsOnCloudflare) {
      deps.push("postgres");
    } else {
      deps.push("pg");
      devDeps.push("@types/pg");
    }

    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
      devDependencies: devDeps,
    });
  } else if (database === "mysql") {
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies:
        dbSetup === "planetscale"
          ? ["drizzle-orm", "@planetscale/database"]
          : ["drizzle-orm", "mysql2"],
      devDependencies: ["drizzle-kit"],
    });
  }
}
