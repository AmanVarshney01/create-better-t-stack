import { describe, it } from "vitest";
import type { Backend, Database, Frontend, ORM } from "../src/types";
import {
	AUTH_PROVIDERS,
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("Authentication Configurations", () => {
	describe("Better-Auth Provider", () => {
		it("should work with better-auth + database", async () => {
			const result = await runTRPCTest({
				projectName: "better-auth-db",
				auth: "better-auth",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with better-auth + different databases", async () => {
			const databases = ["sqlite", "postgres", "mysql"];

			for (const database of databases) {
				const result = await runTRPCTest({
					projectName: `better-auth-${database}`,
					auth: "better-auth",
					backend: "hono",
					runtime: "bun",
					database: database as Database,
					orm: "drizzle",
					api: "trpc",
					frontend: ["tanstack-router"],
					addons: ["turborepo"],
					examples: ["todo"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			}
		});

		it("should work with better-auth + mongodb + mongoose", async () => {
			const result = await runTRPCTest({
				projectName: "better-auth-mongodb",
				auth: "better-auth",
				backend: "hono",
				runtime: "bun",
				database: "mongodb",
				orm: "mongoose",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with better-auth + no database (non-convex)", async () => {
			const result = await runTRPCTest({
				projectName: "better-auth-no-db-fail",
				auth: "better-auth",
				backend: "hono",
				runtime: "bun",
				database: "none",
				orm: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Authentication requires a database");
		});

		it("should work with better-auth + convex backend (tanstack-router)", async () => {
			const result = await runTRPCTest({
				projectName: "better-auth-convex-success",
				auth: "better-auth",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
			});

			expectSuccess(result);
		});

		it("should work with better-auth + all compatible frontends", async () => {
			const compatibleFrontends = [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
				"nuxt",
				"svelte",
				"solid",
				"native-bare",
				"native-uniwind",
				"native-unistyles",
			];

			for (const frontend of compatibleFrontends) {
				const config: TestConfig = {
					projectName: `better-auth-${frontend}`,
					auth: "better-auth",
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					frontend: [frontend as Frontend],
					addons: ["turborepo"],
					examples: ["todo"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Handle API compatibility
				if (["nuxt", "svelte", "solid"].includes(frontend)) {
					config.api = "orpc";
				} else {
					config.api = "trpc";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			}
		});
	});

	describe("Clerk Provider", () => {
		it("should work with clerk + convex", async () => {
			const result = await runTRPCTest({
				projectName: "clerk-convex",
				auth: "clerk",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with clerk + non-convex backend", async () => {
			const result = await runTRPCTest({
				projectName: "clerk-non-convex-fail",
				auth: "clerk",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				addons: ["turborepo"],
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				expectError: true,
			});

			expectError(
				result,
				"Clerk authentication is only supported with the Convex backend",
			);
		});

		it("should work with clerk + compatible frontends", async () => {
			const compatibleFrontends = [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
				"native-bare",
				"native-uniwind",
				"native-unistyles",
			];

			for (const frontend of compatibleFrontends) {
				const result = await runTRPCTest({
					projectName: `clerk-${frontend}`,
					auth: "clerk",
					backend: "convex",
					runtime: "none",
					database: "none",
					webDeploy: "none",
					serverDeploy: "none",
					addons: ["turborepo"],
					dbSetup: "none",
					examples: ["todo"],
					orm: "none",
					api: "none",
					frontend: [frontend as Frontend],
					install: false,
				});

				expectSuccess(result);
			}
		});

		it("should fail with clerk + incompatible frontends", async () => {
			const incompatibleFrontends = ["nuxt", "svelte", "solid"];

			for (const frontend of incompatibleFrontends) {
				const result = await runTRPCTest({
					projectName: `clerk-${frontend}-fail`,
					auth: "clerk",
					backend: "convex",
					runtime: "none",
					database: "none",
					orm: "none",
					api: "none",
					frontend: [frontend as Frontend],
					addons: ["turborepo"],
					examples: ["todo"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					expectError: true,
				});

				expectError(result, "Clerk authentication is not compatible");
			}
		});
	});

	describe("No Authentication", () => {
		it("should work with auth none", async () => {
			const result = await runTRPCTest({
				projectName: "no-auth",
				auth: "none",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with auth none + no database", async () => {
			const result = await runTRPCTest({
				projectName: "no-auth-no-db",
				auth: "none",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with auth none + convex", async () => {
			const result = await runTRPCTest({
				projectName: "no-auth-convex",
				auth: "none",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("Authentication with Different Backends", () => {
		const backends = ["hono", "express", "fastify", "elysia", "self"];

		for (const backend of backends) {
			it(`should work with better-auth + ${backend}`, async () => {
				const config: TestConfig = {
					projectName: `better-auth-${backend}`,
					auth: "better-auth",
					backend: backend as Backend,
					database: "sqlite",
					orm: "drizzle",
					api: "trpc",
					frontend: backend === "self" ? ["next"] : ["tanstack-router"],
					addons: ["turborepo"],
					examples: ["todo"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Set appropriate runtime
				if (backend === "elysia") {
					config.runtime = "bun";
				} else if (backend === "self") {
					config.runtime = "none";
				} else {
					config.runtime = "bun";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("Authentication with Different ORMs", () => {
		const ormCombinations = [
			{ database: "sqlite", orm: "drizzle" },
			{ database: "sqlite", orm: "prisma" },
			{ database: "postgres", orm: "drizzle" },
			{ database: "postgres", orm: "prisma" },
			{ database: "mysql", orm: "drizzle" },
			{ database: "mysql", orm: "prisma" },
			{ database: "mongodb", orm: "mongoose" },
			{ database: "mongodb", orm: "prisma" },
		];

		for (const { database, orm } of ormCombinations) {
			it(`should work with better-auth + ${database} + ${orm}`, async () => {
				const result = await runTRPCTest({
					projectName: `better-auth-${database}-${orm}`,
					auth: "better-auth",
					backend: "hono",
					runtime: "bun",
					database: database as Database,
					orm: orm as ORM,
					api: "trpc",
					frontend: ["tanstack-router"],
					addons: ["turborepo"],
					examples: ["todo"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			});
		}
	});

	describe("All Auth Providers", () => {
		for (const auth of AUTH_PROVIDERS) {
			it(`should work with ${auth} in appropriate setup`, async () => {
				const config: TestConfig = {
					projectName: `test-${auth}`,
					auth,
					frontend: ["tanstack-router"],
					addons: ["turborepo"],
					examples: ["todo"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Set appropriate setup for each auth provider
				if (auth === "clerk") {
					config.backend = "convex";
					config.runtime = "none";
					config.database = "none";
					config.orm = "none";
					config.api = "none";
				} else if (auth === "better-auth") {
					config.backend = "hono";
					config.runtime = "bun";
					config.database = "sqlite";
					config.orm = "drizzle";
					config.api = "trpc";
				} else {
					// none
					config.backend = "hono";
					config.runtime = "bun";
					config.database = "sqlite";
					config.orm = "drizzle";
					config.api = "trpc";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("Auth Edge Cases", () => {
		it("should handle auth with complex frontend combinations", async () => {
			const result = await runTRPCTest({
				projectName: "auth-web-native-combo",
				auth: "better-auth",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router", "native-bare"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should handle auth constraints with workers runtime", async () => {
			const result = await runTRPCTest({
				projectName: "auth-workers",
				auth: "better-auth",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "alchemy",
				install: false,
			});

			expectSuccess(result);
		});
	});
});
