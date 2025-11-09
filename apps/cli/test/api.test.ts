import { describe, it } from "vitest";
import type {
	API,
	Backend,
	Database,
	Examples,
	Frontend,
	ORM,
	Runtime,
} from "../src/types";
import {
	API_TYPES,
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("API Configurations", () => {
	describe("tRPC API", () => {
		it("should work with tRPC + React frontends", async () => {
			const reactFrontends = [
				"tanstack-router",
				"react-router",
				"tanstack-start",
				"next",
			];

			for (const frontend of reactFrontends) {
				const result = await runTRPCTest({
					projectName: `trpc-${frontend}`,
					api: "trpc",
					frontend: [frontend as Frontend],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			}
		});

		it("should work with tRPC + native frontends", async () => {
			const nativeFrontends = [
				"native-bare",
				"native-uniwind",
				"native-unistyles",
			];

			for (const frontend of nativeFrontends) {
				const result = await runTRPCTest({
					projectName: `trpc-${frontend}`,
					api: "trpc",
					frontend: [frontend as Frontend],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			}
		});

		it("should fail with tRPC + Nuxt", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-nuxt-fail",
				api: "trpc",
				frontend: ["nuxt"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "tRPC API is not supported with 'nuxt' frontend");
		});

		it("should fail with tRPC + Svelte", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-svelte-fail",
				api: "trpc",
				frontend: ["svelte"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "tRPC API is not supported with 'svelte' frontend");
		});

		it("should fail with tRPC + Solid", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-solid-fail",
				api: "trpc",
				frontend: ["solid"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "tRPC API is not supported with 'solid' frontend");
		});

		it("should work with tRPC + all compatible backends", async () => {
			const backends = ["hono", "express", "fastify", "elysia", "self"];

			for (const backend of backends) {
				const config: TestConfig = {
					projectName: `trpc-${backend}`,
					api: "trpc",
					backend: backend as Backend,
					frontend: backend === "self" ? ["next"] : ["tanstack-router"],
					database: "sqlite",
					orm: "drizzle",
					auth: backend === "self" ? "better-auth" : "none",
					addons: ["none"],
					examples: ["none"],
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
			}
		});
	});

	describe("oRPC API", () => {
		it("should work with oRPC + all frontends", async () => {
			const frontends = [
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

			for (const frontend of frontends) {
				const result = await runTRPCTest({
					projectName: `orpc-${frontend}`,
					api: "orpc",
					frontend: [frontend as Frontend],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			}
		});

		it("should work with oRPC + all compatible backends", async () => {
			const backends = ["hono", "express", "fastify", "elysia"];

			for (const backend of backends) {
				const config: TestConfig = {
					projectName: `orpc-${backend}`,
					api: "orpc",
					backend: backend as Backend,
					frontend: ["tanstack-router"],
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Set appropriate runtime
				if (backend === "elysia") {
					config.runtime = "bun";
				} else {
					config.runtime = "bun";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			}
		});
	});

	describe("No API", () => {
		it("should work with API none + basic setup", async () => {
			const result = await runTRPCTest({
				projectName: "no-api",
				api: "none",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with API none + frontend only", async () => {
			const result = await runTRPCTest({
				projectName: "no-api-frontend-only",
				api: "none",
				frontend: ["tanstack-router"],
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with API none + convex", async () => {
			const result = await runTRPCTest({
				projectName: "no-api-convex",
				api: "none",
				frontend: ["tanstack-router"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail with API none + examples (non-convex backend)", async () => {
			const result = await runTRPCTest({
				projectName: "no-api-examples-fail",
				api: "none",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cannot use '--examples' when '--api' is set to 'none'",
			);
		});

		it("should work with API none + examples + convex backend", async () => {
			const result = await runTRPCTest({
				projectName: "no-api-examples-convex",
				api: "none",
				frontend: ["tanstack-router"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				addons: ["none"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("API with Different Database Combinations", () => {
		const apiDatabaseCombinations = [
			{ api: "trpc", database: "sqlite", orm: "drizzle" },
			{ api: "trpc", database: "postgres", orm: "drizzle" },
			{ api: "trpc", database: "mysql", orm: "prisma" },
			{ api: "trpc", database: "mongodb", orm: "mongoose" },
			{ api: "orpc", database: "sqlite", orm: "drizzle" },
			{ api: "orpc", database: "postgres", orm: "prisma" },
			{ api: "orpc", database: "mysql", orm: "drizzle" },
			{ api: "orpc", database: "mongodb", orm: "prisma" },
		];

		for (const { api, database, orm } of apiDatabaseCombinations) {
			it(`should work with ${api} + ${database} + ${orm}`, async () => {
				const result = await runTRPCTest({
					projectName: `${api}-${database}-${orm}`,
					api: api as API,
					database: database as Database,
					orm: orm as ORM,
					frontend: ["tanstack-router"],
					backend: "hono",
					runtime: "bun",
					auth: "none",
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

	describe("API with Authentication", () => {
		it("should work with tRPC + better-auth", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-better-auth",
				api: "trpc",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with oRPC + better-auth", async () => {
			const result = await runTRPCTest({
				projectName: "orpc-better-auth",
				api: "orpc",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with API none + convex + clerk", async () => {
			const result = await runTRPCTest({
				projectName: "no-api-convex-clerk",
				api: "none",
				auth: "clerk",
				frontend: ["tanstack-router"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
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

	describe("API with Examples", () => {
		it("should work with tRPC + todo example", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-todo",
				api: "trpc",
				examples: ["todo"],
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with oRPC + AI example", async () => {
			const result = await runTRPCTest({
				projectName: "orpc-ai",
				api: "orpc",
				examples: ["ai"],
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work with both APIs + both examples", async () => {
			const apiExampleCombinations = [
				{ api: "trpc", examples: ["todo", "ai"] },
				{ api: "orpc", examples: ["todo", "ai"] },
			];

			for (const { api, examples } of apiExampleCombinations) {
				const result = await runTRPCTest({
					projectName: `${api}-both-examples`,
					api: api as API,
					examples: examples as Examples[],
					frontend: ["tanstack-router"],
					backend: "hono",
					runtime: "bun",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				});

				expectSuccess(result);
			}
		});
	});

	describe("All API Types", () => {
		for (const api of API_TYPES) {
			it(`should work with ${api} in appropriate setup`, async () => {
				const config: TestConfig = {
					projectName: `test-${api}`,
					api,
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Set appropriate setup for each API type
				if (api === "none") {
					config.frontend = ["tanstack-router"];
					config.backend = "none";
					config.runtime = "none";
					config.database = "none";
					config.orm = "none";
					config.auth = "none";
				} else {
					config.frontend = ["tanstack-router"];
					config.backend = "hono";
					config.runtime = "bun";
					config.database = "sqlite";
					config.orm = "drizzle";
					config.auth = "none";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("API Edge Cases", () => {
		it("should handle API with complex frontend combinations", async () => {
			const result = await runTRPCTest({
				projectName: "api-complex-frontend",
				api: "trpc",
				frontend: ["tanstack-router", "native-bare"], // Web + Native
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should handle API with workers runtime", async () => {
			const result = await runTRPCTest({
				projectName: "api-workers",
				api: "trpc",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "wrangler", // Required for workers
				install: false,
			});

			expectSuccess(result);
		});

		it("should handle API constraints with different runtimes", async () => {
			const runtimeApiCombinations = [
				{ runtime: "bun", api: "trpc" },
				{ runtime: "node", api: "orpc" },
				{ runtime: "workers", api: "trpc" },
			];

			for (const { runtime, api } of runtimeApiCombinations) {
				const config: TestConfig = {
					projectName: `${runtime}-${api}`,
					api: api as API,
					runtime: runtime as Runtime,
					frontend: ["tanstack-router"],
					backend: "hono",
					database: "sqlite",
					orm: "drizzle",
					auth: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Handle workers runtime requirements
				if (runtime === "workers") {
					config.serverDeploy = "wrangler";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			}
		});
	});
});
