import { describe, it } from "bun:test";

import type { Database, ORM } from "../src/types";
import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

describe("Database and ORM Combinations", () => {
  describe("Valid Database-ORM Combinations", () => {
    const validCombinations: Array<{ database: Database; orm: ORM }> = [
      // SQLite combinations
      { database: "sqlite" as Database, orm: "drizzle" as ORM },
      { database: "sqlite" as Database, orm: "prisma" as ORM },

      // PostgreSQL combinations
      { database: "postgres" as Database, orm: "drizzle" as ORM },
      { database: "postgres" as Database, orm: "prisma" as ORM },

      // MySQL combinations
      { database: "mysql" as Database, orm: "drizzle" as ORM },
      { database: "mysql" as Database, orm: "prisma" as ORM },

      // MongoDB combinations
      { database: "mongodb" as Database, orm: "mongoose" as ORM },
      { database: "mongodb" as Database, orm: "prisma" as ORM },

      // None combinations
      { database: "none" as Database, orm: "none" as ORM },
    ];

    for (const { database, orm } of validCombinations) {
      it(`should work with ${database} + ${orm}`, async () => {
        const result = await runTRPCTest({
          projectName: `${database}-${orm}`,
          database,
          orm,
          backend: "hono",
          runtime: "bun",
          frontend: ["tanstack-router"],
          auth: "none",
          api: "trpc",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Invalid Database-ORM Combinations", () => {
    const invalidCombinations: Array<{
      database: Database;
      orm: ORM;
      error: string;
    }> = [
      // MongoDB with Drizzle (not supported)
      {
        database: "mongodb" as Database,
        orm: "drizzle" as ORM,
        error: "Drizzle ORM does not support MongoDB",
      },

      // Mongoose with non-MongoDB
      {
        database: "sqlite" as Database,
        orm: "mongoose" as ORM,
        error: "Mongoose ORM requires MongoDB database",
      },
      {
        database: "postgres" as Database,
        orm: "mongoose" as ORM,
        error: "Mongoose ORM requires MongoDB database",
      },
      {
        database: "mysql" as Database,
        orm: "mongoose" as ORM,
        error: "Mongoose ORM requires MongoDB database",
      },

      // Database without ORM
      {
        database: "sqlite" as Database,
        orm: "none" as ORM,
        error: "Database selection requires an ORM",
      },
      {
        database: "postgres" as Database,
        orm: "none" as ORM,
        error: "Database selection requires an ORM",
      },

      // ORM without database
      {
        database: "none" as Database,
        orm: "drizzle" as ORM,
        error: "ORM selection requires a database",
      },
      {
        database: "none" as Database,
        orm: "prisma" as ORM,
        error: "ORM selection requires a database",
      },
    ];

    for (const { database, orm, error } of invalidCombinations) {
      it(`should fail with ${database} + ${orm}`, async () => {
        const result = await runTRPCTest({
          projectName: `invalid-${database}-${orm}`,
          database,
          orm,
          backend: "hono",
          runtime: "bun",
          frontend: ["tanstack-router"],
          auth: "none",
          api: "trpc",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, error);
      });
    }
  });
});
