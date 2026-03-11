/**
 * Database setup - CLI-only operations
 * Calls external database provider CLIs (turso, neon, prisma-postgres, etc.)
 * Dependencies are handled by the generator's db-deps processor
 */

import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";
import { DatabaseSetupError, UserCancelledError } from "../../utils/errors";
import { cliConsola } from "../../utils/terminal-output";
import { setupCloudflareD1 } from "../database-providers/d1-setup";
import { setupDockerCompose } from "../database-providers/docker-compose-setup";
import { setupMongoDBAtlas } from "../database-providers/mongodb-atlas-setup";
import { setupNeonPostgres } from "../database-providers/neon-setup";
import { setupPlanetScale } from "../database-providers/planetscale-setup";
import { setupPrismaPostgres } from "../database-providers/prisma-postgres-setup";
import { setupSupabase } from "../database-providers/supabase-setup";
import { setupTurso } from "../database-providers/turso-setup";
import { type DatabaseSetupCliOptions, mergeResolvedDbSetupOptions } from "./db-setup-options";

export async function setupDatabase(config: ProjectConfig, cliInput?: DatabaseSetupCliOptions) {
  const { database, dbSetup, backend, projectDir } = config;

  if (backend === "convex" || database === "none") {
    // Clean up server db dir if not using convex
    if (backend !== "convex") {
      const serverDbDir = path.join(projectDir, "apps/server/src/db");
      if (await fs.pathExists(serverDbDir)) {
        await fs.remove(serverDbDir);
      }
    }
    return;
  }

  const dbPackageDir = path.join(projectDir, "packages/db");
  if (!(await fs.pathExists(dbPackageDir))) {
    return;
  }

  // Helper to run setup and handle Result
  async function runSetup<T, E extends UserCancelledError | DatabaseSetupError>(
    setupFn: () => Promise<Result<T, E>>,
  ): Promise<void> {
    const result = await setupFn();
    if (result.isErr()) {
      // Re-throw user cancellation to propagate up
      if (UserCancelledError.is(result.error)) {
        throw result.error;
      }
      // Log other errors but don't fail the overall project creation
      cliConsola.error(pc.red(result.error.message));
    }
  }

  const resolvedCliInput: DatabaseSetupCliOptions = {
    ...cliInput,
    dbSetupOptions: mergeResolvedDbSetupOptions(dbSetup, config.dbSetupOptions, cliInput),
  };

  // Call external database provider CLIs
  if (dbSetup === "docker") {
    await runSetup(() => setupDockerCompose(config));
  } else if (database === "sqlite" && dbSetup === "turso") {
    await runSetup(() => setupTurso(config, resolvedCliInput));
  } else if (database === "sqlite" && dbSetup === "d1") {
    await runSetup(() => setupCloudflareD1(config));
  } else if (database === "postgres") {
    if (dbSetup === "prisma-postgres") {
      await runSetup(() => setupPrismaPostgres(config, resolvedCliInput));
    } else if (dbSetup === "neon") {
      await runSetup(() => setupNeonPostgres(config, resolvedCliInput));
    } else if (dbSetup === "planetscale") {
      await runSetup(() => setupPlanetScale(config));
    } else if (dbSetup === "supabase") {
      await runSetup(() => setupSupabase(config, resolvedCliInput));
    }
  } else if (database === "mysql" && dbSetup === "planetscale") {
    await runSetup(() => setupPlanetScale(config));
  } else if (database === "mongodb" && dbSetup === "mongodb-atlas") {
    await runSetup(() => setupMongoDBAtlas(config, resolvedCliInput));
  }
}
