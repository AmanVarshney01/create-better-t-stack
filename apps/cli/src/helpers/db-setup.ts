import path from "node:path";
import { spinner } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import { addPackageDependency } from "../utils/add-package-deps";
import { setupMongoDBAtlas } from "./mongodb-atlas-setup";
import { setupPrismaPostgres } from "./prisma-postgres-setup";
import { setupTurso } from "./turso-setup";

import { setupNeonPostgres } from "./neon-setup";

import type { ProjectConfig } from "../types";

export async function setupDatabase(config: ProjectConfig): Promise<void> {
	const { projectName, database, orm, dbSetup, backend } = config;

	if (backend === "convex" || database === "none") {
		if (backend !== "convex") {
			const projectDir = path.resolve(process.cwd(), projectName);
			const serverDir = path.join(projectDir, "apps/server");
			const serverDbDir = path.join(serverDir, "src/db");
			if (await fs.pathExists(serverDbDir)) {
				await fs.remove(serverDbDir);
			}
		}
		return;
	}

	const projectDir = path.resolve(process.cwd(), projectName);
	const s = spinner();
	const serverDir = path.join(projectDir, "apps/server");

	if (!(await fs.pathExists(serverDir))) {
		return;
	}

	try {
		if (orm === "prisma") {
			await addPackageDependency({
				dependencies: ["@prisma/client"],
				devDependencies: ["prisma"],
				projectDir: serverDir,
			});
		} else if (orm === "drizzle") {
			if (database === "sqlite") {
				await addPackageDependency({
					dependencies: ["drizzle-orm", "@libsql/client"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			} else if (database === "postgres") {
				await addPackageDependency({
					dependencies: ["drizzle-orm", "pg"],
					devDependencies: ["drizzle-kit", "@types/pg"],
					projectDir: serverDir,
				});
			} else if (database === "mysql") {
				await addPackageDependency({
					dependencies: ["drizzle-orm", "mysql2"],
					devDependencies: ["drizzle-kit"],
					projectDir: serverDir,
				});
			}
		} else if (orm === "mongoose") {
			await addPackageDependency({
				dependencies: ["mongoose"],
				devDependencies: [],
				projectDir: serverDir,
			});
		}

		if (database === "sqlite" && dbSetup === "turso") {
			await setupTurso(config);
		} else if (database === "postgres") {
			if (orm === "prisma" && dbSetup === "prisma-postgres") {
				await setupPrismaPostgres(config);
			} else if (dbSetup === "neon") {
				await setupNeonPostgres(config);
			}
		} else if (database === "mongodb" && dbSetup === "mongodb-atlas") {
			await setupMongoDBAtlas(config);
		}
	} catch (error) {
		s.stop(pc.red("Failed to set up database"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
	}
}
