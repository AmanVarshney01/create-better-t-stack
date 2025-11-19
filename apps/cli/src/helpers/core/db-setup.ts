import path from "node:path";
import { spinner } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type { AvailableDependencies } from "../../constants";
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
	const dbPackageDir = path.join(projectDir, "packages/db");
	const webDir = path.join(projectDir, "apps/web");

	if (!(await fs.pathExists(dbPackageDir))) {
		return;
	}

	try {
		if (orm === "prisma") {
			if (database === "mongodb") {
				await addPackageDependency({
					customDependencies: {
						"@prisma/client": "6.19.0",
					},
					customDevDependencies: {
						prisma: "6.19.0",
					},
					projectDir: dbPackageDir,
				});
			} else {
				const prismaDependencies: AvailableDependencies[] = ["@prisma/client"];
				const prismaDevDependencies: AvailableDependencies[] = ["prisma"];

				if (database === "mysql" && dbSetup === "planetscale") {
					prismaDependencies.push(
						"@prisma/adapter-planetscale",
						"@planetscale/database",
					);
				} else if (database === "mysql") {
					prismaDependencies.push("@prisma/adapter-mariadb");
				} else if (database === "sqlite") {
					if (dbSetup === "d1") {
						prismaDependencies.push("@prisma/adapter-d1");
					} else {
						prismaDependencies.push("@prisma/adapter-libsql");
					}
				} else if (database === "postgres") {
					if (dbSetup === "neon") {
						prismaDependencies.push(
							"@prisma/adapter-neon",
							"@neondatabase/serverless",
							"ws",
						);
						prismaDevDependencies.push("@types/ws");
					} else {
						prismaDependencies.push("@prisma/adapter-pg");
						prismaDependencies.push("pg");
						prismaDevDependencies.push("@types/pg");
					}
				}

				await addPackageDependency({
					dependencies: prismaDependencies,
					devDependencies: prismaDevDependencies,
					projectDir: dbPackageDir,
				});
			}

			if (await fs.pathExists(webDir)) {
				if (database === "mongodb") {
					await addPackageDependency({
						customDependencies: {
							"@prisma/client": "6.19.0",
						},
						projectDir: webDir,
					});
				} else {
					await addPackageDependency({
						dependencies: ["@prisma/client"],
						projectDir: webDir,
					});
				}
			}
		} else if (orm === "drizzle") {
			if (database === "sqlite") {
				await addPackageDependency({
					dependencies: ["drizzle-orm", "@libsql/client", "libsql"],
					devDependencies: ["drizzle-kit"],
					projectDir: dbPackageDir,
				});
				await addPackageDependency({
					dependencies: ["@libsql/client", "libsql"],
					projectDir: webDir,
				});
			} else if (database === "postgres") {
				if (dbSetup === "neon") {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "@neondatabase/serverless", "ws"],
						devDependencies: ["drizzle-kit", "@types/ws"],
						projectDir: dbPackageDir,
					});
				} else if (dbSetup === "planetscale") {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "pg"],
						devDependencies: ["drizzle-kit", "@types/pg"],
						projectDir: dbPackageDir,
					});
				} else {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "pg"],
						devDependencies: ["drizzle-kit", "@types/pg"],
						projectDir: dbPackageDir,
					});
				}
			} else if (database === "mysql") {
				if (dbSetup === "planetscale") {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "@planetscale/database"],
						devDependencies: ["drizzle-kit"],
						projectDir: dbPackageDir,
					});
				} else {
					await addPackageDependency({
						dependencies: ["drizzle-orm", "mysql2"],
						devDependencies: ["drizzle-kit"],
						projectDir: dbPackageDir,
					});
				}
			}
		} else if (orm === "mongoose") {
			await addPackageDependency({
				dependencies: ["mongoose"],
				devDependencies: [],
				projectDir: dbPackageDir,
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
