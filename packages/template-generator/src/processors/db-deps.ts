import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processDatabaseDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { database, orm, backend } = config;

  if (backend === "convex" || database === "none") return;

  const dbPkgPath = "packages/db/package.json";
  const webPkgPath = "apps/web/package.json";

  if (!vfs.exists(dbPkgPath)) return;
  const webExists = vfs.exists(webPkgPath);

  if (orm === "prisma") {
    processPrismaDeps(vfs, config, dbPkgPath, webPkgPath, webExists);
  } else if (orm === "drizzle") {
    processDrizzleDeps(vfs, config, dbPkgPath, webPkgPath, webExists);
  } else if (orm === "mongoose") {
    addPackageDependency({ vfs, packagePath: dbPkgPath, dependencies: ["mongoose"] });
  } else if (orm === "typeorm") {
    processTypeORMDeps(vfs, config, dbPkgPath);
  } else if (orm === "kysely") {
    processKyselyDeps(vfs, config, dbPkgPath);
  } else if (orm === "mikroorm") {
    processMikroORMDeps(vfs, config, dbPkgPath);
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
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      customDependencies: { "@prisma/client": "6.19.0" },
      customDevDependencies: { prisma: "6.19.0" },
    });
    if (webExists) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        customDependencies: { "@prisma/client": "6.19.0" },
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
      deps.push("@prisma/adapter-neon", "@neondatabase/serverless", "ws");
      devDeps.push("@types/ws");
    } else if (dbSetup === "prisma-postgres") {
      deps.push("@prisma/adapter-pg");
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
    addPackageDependency({ vfs, packagePath: webPkgPath, dependencies: ["@prisma/client"] });
  }
}

function processDrizzleDeps(
  vfs: VirtualFileSystem,
  config: ProjectConfig,
  dbPkgPath: string,
  webPkgPath: string,
  webExists: boolean,
): void {
  const { database, dbSetup } = config;

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
      deps.push("@neondatabase/serverless", "ws");
      devDeps.push("@types/ws");
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

function processTypeORMDeps(
  vfs: VirtualFileSystem,
  config: ProjectConfig,
  dbPkgPath: string,
): void {
  const { database } = config;

  const deps: AvailableDependencies[] = ["typeorm", "reflect-metadata"];

  if (database === "sqlite") {
    deps.push("better-sqlite3");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
      devDependencies: ["@types/better-sqlite3"],
    });
  } else if (database === "postgres") {
    deps.push("pg");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
      devDependencies: ["@types/pg"],
    });
  } else if (database === "mysql") {
    deps.push("mysql2");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
    });
  }
}

function processKyselyDeps(vfs: VirtualFileSystem, config: ProjectConfig, dbPkgPath: string): void {
  const { database } = config;

  const deps: AvailableDependencies[] = ["kysely"];

  if (database === "sqlite") {
    deps.push("better-sqlite3");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
      devDependencies: ["@types/better-sqlite3"],
    });
  } else if (database === "postgres") {
    deps.push("pg");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
      devDependencies: ["@types/pg"],
    });
  } else if (database === "mysql") {
    deps.push("mysql2");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
    });
  }
}

function processMikroORMDeps(
  vfs: VirtualFileSystem,
  config: ProjectConfig,
  dbPkgPath: string,
): void {
  const { database } = config;

  const deps: AvailableDependencies[] = ["@mikro-orm/core"];

  if (database === "sqlite") {
    deps.push("@mikro-orm/better-sqlite");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
    });
  } else if (database === "postgres") {
    deps.push("@mikro-orm/postgresql");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
    });
  } else if (database === "mysql") {
    deps.push("@mikro-orm/mysql");
    addPackageDependency({
      vfs,
      packagePath: dbPkgPath,
      dependencies: deps,
    });
  }
}
