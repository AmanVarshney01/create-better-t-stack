import { describe, it } from "vitest";
import {
	DB_SETUPS,
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("Database Setup Configurations", () => {
	describe("SQLite Database Setups", () => {
		it("should work with Turso + SQLite", async () => {
			const result = await runTRPCTest({
				projectName: "turso-sqlite",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "turso",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with D1 + SQLite + Workers", async () => {
			const result = await runTRPCTest({
				projectName: "d1-sqlite-workers",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "d1",
				backend: "hono",
				runtime: "workers",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "alchemy",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with Turso + non-SQLite database", async () => {
			const result = await runTRPCTest({
				projectName: "turso-postgres-fail",
				database: "postgres",
				orm: "drizzle",
				dbSetup: "turso",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				expectError: true,
			});

			expectError(result, "Turso setup requires SQLite database");
		});
	});

	describe("PostgreSQL Database Setups", () => {
		it("should work with Neon + PostgreSQL", async () => {
			const result = await runTRPCTest({
				projectName: "neon-postgres",
				database: "postgres",
				orm: "drizzle",
				dbSetup: "neon",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with Supabase + PostgreSQL", async () => {
			const result = await runTRPCTest({
				projectName: "supabase-postgres",
				database: "postgres",
				orm: "drizzle",
				dbSetup: "supabase",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with Prisma PostgreSQL setup", async () => {
			const result = await runTRPCTest({
				projectName: "prisma-postgres-setup",
				database: "postgres",
				orm: "prisma",
				dbSetup: "prisma-postgres",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with Neon + non-PostgreSQL database", async () => {
			const result = await runTRPCTest({
				projectName: "neon-mysql-fail",
				database: "mysql",
				orm: "drizzle",
				dbSetup: "neon",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				expectError: true,
			});

			expectError(result, "Neon setup requires PostgreSQL database");
		});
	});

	describe("MySQL Database Setups", () => {
		it("should work with PlanetScale + MySQL", async () => {
			const result = await runTRPCTest({
				projectName: "planetscale-mysql",
				database: "mysql",
				orm: "drizzle",
				dbSetup: "planetscale",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with PlanetScale + PostgreSQL", async () => {
			const result = await runTRPCTest({
				projectName: "planetscale-postgres",
				database: "postgres",
				orm: "drizzle",
				dbSetup: "planetscale",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("MongoDB Database Setups", () => {
		it("should work with MongoDB Atlas + MongoDB", async () => {
			const result = await runTRPCTest({
				projectName: "mongodb-atlas",
				database: "mongodb",
				orm: "mongoose",
				dbSetup: "mongodb-atlas",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with MongoDB Atlas + non-MongoDB database", async () => {
			const result = await runTRPCTest({
				projectName: "mongodb-atlas-sqlite-fail",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "mongodb-atlas",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				expectError: true,
			});

			expectError(result, "MongoDB Atlas setup requires MongoDB database");
		});
	});

	describe("Docker Database Setup", () => {
		it("should work with Docker + PostgreSQL", async () => {
			const result = await runTRPCTest({
				projectName: "docker-postgres",
				database: "postgres",
				orm: "drizzle",
				dbSetup: "docker",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with Docker + MySQL", async () => {
			const result = await runTRPCTest({
				projectName: "docker-mysql",
				database: "mysql",
				orm: "drizzle",
				dbSetup: "docker",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with Docker + MongoDB", async () => {
			const result = await runTRPCTest({
				projectName: "docker-mongodb",
				database: "mongodb",
				orm: "mongoose",
				dbSetup: "docker",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with Docker + SQLite", async () => {
			const result = await runTRPCTest({
				projectName: "docker-sqlite-fail",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "docker",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				expectError: true,
			});

			expectError(
				result,
				"Docker setup is not compatible with SQLite database",
			);
		});
	});

	describe("No Database Setup", () => {
		it("should work with dbSetup none", async () => {
			const result = await runTRPCTest({
				projectName: "no-db-setup",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "none",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with dbSetup but no database", async () => {
			const result = await runTRPCTest({
				projectName: "db-setup-no-db-fail",
				database: "none",
				orm: "none",
				dbSetup: "turso",
				backend: "hono",
				runtime: "bun",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Database setup requires a database. Please choose a database or set '--db-setup none'.",
			);
		});
	});

	describe("Special Runtime Constraints", () => {
		it("should work with D1 + Workers runtime", async () => {
			const result = await runTRPCTest({
				projectName: "d1-workers-valid",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "none",
				backend: "hono",
				runtime: "workers",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "alchemy",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with D1 + non-Workers runtime", async () => {
			const result = await runTRPCTest({
				projectName: "d1-node-fail",
				database: "sqlite",
				orm: "drizzle",
				dbSetup: "d1",
				backend: "hono",
				runtime: "node",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cloudflare D1 setup requires SQLite database and Cloudflare Workers runtime",
			);
		});
	});

	describe("All Database Setup Types", () => {
		for (const dbSetup of DB_SETUPS) {
			if (dbSetup === "none") continue;

			it(`should work with ${dbSetup} in appropriate setup`, async () => {
				const config: TestConfig = {
					projectName: `test-${dbSetup}`,
					dbSetup,
					backend: "hono",
					runtime: "bun",
					auth: "none",
					api: "trpc",
					frontend: ["tanstack-router"],
					addons: ["none"],
					examples: ["none"],
					webDeploy: "none",
					serverDeploy: "none",
					manualDb: true,
					install: false,
				};

				// Set appropriate database and ORM for each setup
				switch (dbSetup) {
					case "turso":
						config.database = "sqlite";
						config.orm = "drizzle";
						break;
					case "neon":
					case "supabase":
					case "prisma-postgres":
						config.database = "postgres";
						config.orm = "drizzle";
						break;
					case "planetscale":
						config.database = "mysql";
						config.orm = "drizzle";
						break;
					case "mongodb-atlas":
						config.database = "mongodb";
						config.orm = "mongoose";
						break;
					case "d1":
						config.database = "sqlite";
						config.orm = "drizzle";
						config.runtime = "workers";
						config.serverDeploy = "alchemy";
						break;
					case "docker":
						config.database = "postgres";
						config.orm = "drizzle";
						break;
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});
});
