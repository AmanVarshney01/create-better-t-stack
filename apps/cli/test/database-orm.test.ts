import { describe, it } from "vitest";
import type { Database, ORM } from "../src/types";
import {
	DATABASES,
	expectError,
	expectSuccess,
	runTRPCTest,
} from "./test-utils";

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

	describe("Database-ORM with Authentication", () => {
		it("should work with database + auth", async () => {
			const result = await runTRPCTest({
				projectName: "db-auth",
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				backend: "hono",
				runtime: "bun",
				frontend: ["tanstack-router"],
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

		it("should fail with auth but no database (non-convex backend)", async () => {
			const result = await runTRPCTest({
				projectName: "auth-no-db",
				database: "none",
				orm: "none",
				auth: "better-auth",
				backend: "hono",
				runtime: "bun",
				frontend: ["tanstack-router"],
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Authentication requires a database");
		});

		it("should work with auth but no database (convex backend)", async () => {
			const result = await runTRPCTest({
				projectName: "convex-auth-no-db",
				database: "none",
				orm: "none",
				auth: "none",
				backend: "convex",
				runtime: "none",
				frontend: ["tanstack-router"],
				api: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("All Database Types", () => {
		for (const database of DATABASES) {
			if (database === "none") continue;

			it(`should have valid ORM options for ${database}`, async () => {
				// Test with the most compatible ORM for each database
				const ormMap = {
					sqlite: "drizzle",
					postgres: "drizzle",
					mysql: "drizzle",
					mongodb: "mongoose",
				};

				const orm = ormMap[database as keyof typeof ormMap];

				const result = await runTRPCTest({
					projectName: `test-${database}`,
					database: database as Database,
					orm: orm as ORM,
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
});
