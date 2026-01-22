/**
 * Database setup - CLI-only operations
 * Calls external database provider CLIs (turso, neon, prisma-postgres, etc.)
 * Dependencies are handled by the generator's db-deps processor
 */

import { Result } from "better-result";
import consola from "consola";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { UserCancelledError } from "../../utils/errors";
import { setupCloudflareD1 } from "../database-providers/d1-setup";
import { setupDockerCompose } from "../database-providers/docker-compose-setup";
import { setupMongoDBAtlas } from "../database-providers/mongodb-atlas-setup";
import { setupNeonPostgres } from "../database-providers/neon-setup";
import { setupPlanetScale } from "../database-providers/planetscale-setup";
import { setupPrismaPostgres } from "../database-providers/prisma-postgres-setup";
import { setupSupabase } from "../database-providers/supabase-setup";
import { setupTurso } from "../database-providers/turso-setup";

export async function setupDatabase(config: ProjectConfig, cliInput?: { manualDb?: boolean }) {
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
  async function runSetup<T>(
    setupFn: () => Promise<Result<T, UserCancelledError | { message: string }>>,
  ): Promise<void> {
    const result = await setupFn();
    if (result.isErr()) {
      // Re-throw user cancellation to propagate up
      if (UserCancelledError.is(result.error)) {
        throw result.error;
      }
      // Log other errors but don't fail the overall project creation
      consola.error(pc.red(result.error.message));
    }
  }

  // Call external database provider CLIs
  if (dbSetup === "docker") {
    await runSetup(() => setupDockerCompose(config));
  } else if (database === "sqlite" && dbSetup === "turso") {
    await runSetup(() => setupTurso(config, cliInput));
  } else if (database === "sqlite" && dbSetup === "d1") {
    await setupCloudflareD1(config);
  } else if (database === "postgres") {
    if (dbSetup === "prisma-postgres") {
      await runSetup(() => setupPrismaPostgres(config, cliInput));
    } else if (dbSetup === "neon") {
      await runSetup(() => setupNeonPostgres(config, cliInput));
    } else if (dbSetup === "planetscale") {
      await setupPlanetScale(config);
    } else if (dbSetup === "supabase") {
      await runSetup(() => setupSupabase(config, cliInput));
    }
  } else if (database === "mysql" && dbSetup === "planetscale") {
    await setupPlanetScale(config);
  } else if (database === "mongodb" && dbSetup === "mongodb-atlas") {
    await runSetup(() => setupMongoDBAtlas(config, cliInput));
  }
}
