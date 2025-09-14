import path from "node:path";
import { spinner } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { setupCloudflareD1 } from "../database-providers/d1-setup";
import { setupDockerCompose } from "../database-providers/docker-compose-setup";
import { setupMongoDBAtlas } from "../database-providers/mongodb-atlas-setup";
import { setupNeonPostgres } from "../database-providers/neon-setup";
import { setupPlanetScale } from "../database-providers/planetscale-setup";
import { setupPrismaPostgres } from "../database-providers/prisma-postgres-setup";
import { setupSupabase } from "../database-providers/supabase-setup";
import { setupTurso } from "../database-providers/turso-setup";

export async function setupDatabase(
	config: ProjectConfig,
	cliInput?: { manualDb?: boolean },
) {
	const { database, orm, dbSetup, backend, projectDir } = config;

	if (backend === "convex" || database === "none") {
		if (backend !== "convex") {
			const serverDir = path.join(projectDir, "apps/server");
			const serverDbDir = path.join(serverDir, "src/db");
			if (await fs.pathExists(serverDbDir)) {
				await fs.remove(serverDbDir);
			}
		}
		return;
	}

	const s = spinner();
	const serverDir = path.join(projectDir, "apps/server");

	if (!(await fs.pathExists(serverDir))) {
		return;
	}

	try {
		if (orm === "prisma") {
			if (database === "mysql" && dbSetup === "planetscale") {
				await addPackageDependency({
					dependencies: [
						"@prisma/client",
						"@prisma/adapter-planetscale",
						"@planetscale/database",
					],
					devDependencies: ["prisma"],
					projectDir: serverDir,
				});
			} else if (database === "sqlite" && dbSetup === "turso") {
				await addPackageDependency({
					dependencies: ["@prisma/client", "@prisma/adapter-libsql"],
					devDependencies: ["prisma"],
					projectDir: serverDir,
				});
			} else {
				await addPackageDependency({
					dependencies: ["@prisma/client"],
					devDependencies: ["prisma"],
					projectDir: serverDir,
				});
			}
		} else if (orm === "drizzle") {
			if (database === "sqlite") {
				await addPackageDependency({
					dependencies: ["drizzle-orm", "@libsql/client"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			} else if (database === "postgres") {
				if (dbSetup === "neon") {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "@neondatabase/serverless", "ws"],
						devDependencies: ["drizzle-kit", "@types/ws"],
						projectDir: serverDir,
					});
				} else if (dbSetup === "planetscale") {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "pg"],
						devDependencies: ["drizzle-kit", "@types/pg"],
						projectDir: serverDir,
					});
				} else {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "pg"],
						devDependencies: ["drizzle-kit", "@types/pg"],
						projectDir: serverDir,
					});
				}
			} else if (database === "mysql") {
				if (dbSetup === "planetscale") {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "@planetscale/database"],
						devDependencies: ["drizzle-kit"],
						projectDir: serverDir,
					});
				} else {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "mysql2"],
						devDependencies: ["drizzle-kit"],
						projectDir: serverDir,
					});
				}
			}
		} else if (orm === "mongoose") {
			await addPackageDependency({
				dependencies: ["mongoose"],
				devDependencies: [],
				projectDir: serverDir,
			});
		}

		if (dbSetup === "docker") {
			await setupDockerCompose(config);
		} else if (database === "sqlite" && dbSetup === "turso") {
			await setupTurso(config, cliInput);
		} else if (database === "sqlite" && dbSetup === "d1") {
			await setupCloudflareD1(config);
		} else if (database === "postgres") {
			if (dbSetup === "prisma-postgres") {
				await setupPrismaPostgres(config, cliInput);
			} else if (dbSetup === "neon") {
				await setupNeonPostgres(config, cliInput);
			} else if (dbSetup === "planetscale") {
				await setupPlanetScale(config);
			} else if (dbSetup === "supabase") {
				await setupSupabase(config, cliInput);
			}
		} else if (database === "mysql") {
			if (dbSetup === "planetscale") {
				await setupPlanetScale(config);
			}
		} else if (database === "mongodb" && dbSetup === "mongodb-atlas") {
			await setupMongoDBAtlas(config, cliInput);
		}
	} catch (error) {
		s.stop(pc.red("Failed to set up database"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
	}
}
