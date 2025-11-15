import { describe, it } from "vitest";
import type { Backend, Frontend, Runtime } from "../src/types";
import {
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("Backend and Runtime Combinations", () => {
	describe("Valid Backend-Runtime Combinations", () => {
		const validCombinations = [
			// Standard backend-runtime combinations
			{ backend: "hono" as const, runtime: "bun" as const },
			{ backend: "hono" as const, runtime: "node" as const },
			{ backend: "hono" as const, runtime: "workers" as const },

			{ backend: "express" as const, runtime: "bun" as const },
			{ backend: "express" as const, runtime: "node" as const },

			{ backend: "fastify" as const, runtime: "bun" as const },
			{ backend: "fastify" as const, runtime: "node" as const },

			{ backend: "elysia" as const, runtime: "bun" as const },

			// Special cases
			{ backend: "convex" as const, runtime: "none" as const },
			{ backend: "none" as const, runtime: "none" as const },
			{ backend: "self" as const, runtime: "none" as const },
		];

		for (const { backend, runtime } of validCombinations) {
			it(`should work with ${backend} + ${runtime}`, async () => {
				const config: TestConfig = {
					projectName: `${backend}-${runtime}`,
					backend,
					runtime,
					frontend: ["tanstack-router"],
					webDeploy: "none",
					serverDeploy: "none",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					install: false,
				};

				// Set appropriate defaults based on backend
				if (backend === "convex") {
					config.database = "none";
					config.orm = "none";
					config.auth = "clerk";
					config.api = "none";
				} else if (backend === "none") {
					config.database = "none";
					config.orm = "none";
					config.auth = "none";
					config.api = "none";
				} else if (backend === "self") {
					config.frontend = ["next"];
					config.database = "sqlite";
					config.orm = "drizzle";
					config.auth = "better-auth";
					config.api = "trpc";
				} else {
					config.database = "sqlite";
					config.orm = "drizzle";
					config.auth = "none";
					config.api = "trpc";
				}

				// Set server deployment for workers runtime
				if (runtime === "workers") {
					config.serverDeploy = "alchemy";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("Invalid Backend-Runtime Combinations", () => {
		const invalidCombinations = [
			// Workers runtime only works with Hono
			{
				backend: "express" as const,
				runtime: "workers" as const,
				error:
					"Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend",
			},
			{
				backend: "fastify",
				runtime: "workers",
				error:
					"Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend",
			},
			{
				backend: "elysia",
				runtime: "workers",
				error:
					"Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend",
			},

			// Convex backend requires runtime none
			{
				backend: "convex",
				runtime: "bun",
				error: "Convex backend requires '--runtime none'",
			},
			{
				backend: "convex",
				runtime: "node",
				error: "Convex backend requires '--runtime none'",
			},
			{
				backend: "convex",
				runtime: "workers",
				error: "Convex backend requires '--runtime none'",
			},

			// Backend none requires runtime none
			{
				backend: "none",
				runtime: "bun",
				error: "Backend 'none' requires '--runtime none'",
			},
			{
				backend: "none",
				runtime: "node",
				error: "Backend 'none' requires '--runtime none'",
			},
			{
				backend: "none",
				runtime: "workers",
				error: "Backend 'none' requires '--runtime none'",
			},

			// Self backend requires runtime none
			{
				backend: "self",
				runtime: "bun",
				error: "Backend 'self' (fullstack) requires '--runtime none'",
				frontend: ["next"], // Need to specify Next.js frontend for self backend
			},
			{
				backend: "self",
				runtime: "node",
				error: "Backend 'self' (fullstack) requires '--runtime none'",
				frontend: ["next"], // Need to specify Next.js frontend for self backend
			},
			{
				backend: "self",
				runtime: "workers",
				error: "Backend 'self' (fullstack) requires '--runtime none'",
				frontend: ["next"], // Need to specify Next.js frontend for self backend
			},

			// Runtime none only works with convex, none, or self backend
			{
				backend: "hono",
				runtime: "none",
				error:
					"'--runtime none' is only supported with '--backend convex', '--backend none', or '--backend self'",
			},
			{
				backend: "express",
				runtime: "none",
				error:
					"'--runtime none' is only supported with '--backend convex', '--backend none', or '--backend self'",
			},
		];

		for (const { backend, runtime, error, frontend } of invalidCombinations) {
			it(`should fail with ${backend} + ${runtime}`, async () => {
				const config: TestConfig = {
					projectName: `invalid-${backend}-${runtime}`,
					backend: backend as Backend,
					runtime: runtime as Runtime,
					frontend: (frontend || ["tanstack-router"]) as Frontend[],
					auth: "none",
					api: "trpc",
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					expectError: true,
				};

				// Set appropriate defaults based on backend
				if (backend === "convex") {
					config.database = "none";
					config.orm = "none";
					config.auth = "clerk";
					config.api = "none";
				} else if (backend === "none") {
					config.database = "none";
					config.orm = "none";
					config.auth = "none";
					config.api = "none";
				} else if (backend === "self") {
					config.database = "sqlite";
					config.orm = "drizzle";
					config.auth = "better-auth";
					config.api = "trpc";
				} else {
					config.database = "sqlite";
					config.orm = "drizzle";
					config.auth = "none";
					config.api = "trpc";
				}

				const result = await runTRPCTest(config);
				expectError(result, error);
			});
		}
	});

	describe("Convex Backend Constraints", () => {
		it("should enforce all convex constraints", async () => {
			const result = await runTRPCTest({
				projectName: "convex-app",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should work convex with better-auth (tanstack-router)", async () => {
			const result = await runTRPCTest({
				projectName: "convex-better-auth-success",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "better-auth",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
			});

			expectSuccess(result);
		});

		it("should fail convex with database", async () => {
			const result = await runTRPCTest({
				projectName: "convex-with-db",
				backend: "convex",
				runtime: "none",
				database: "postgres",
				orm: "drizzle",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Convex backend requires '--database none'");
		});
	});

	describe("Workers Runtime Constraints", () => {
		it("should work with workers + hono + compatible database", async () => {
			const result = await runTRPCTest({
				projectName: "workers-compatible",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "alchemy", // Workers requires server deployment
				install: false,
			});

			expectSuccess(result);
		});

		it("should fail workers with mongodb", async () => {
			const result = await runTRPCTest({
				projectName: "workers-mongodb",
				backend: "hono",
				runtime: "workers",
				database: "mongodb",
				orm: "prisma",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database",
			);
		});

		it("should fail workers without server deployment", async () => {
			const result = await runTRPCTest({
				projectName: "workers-no-deploy",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cloudflare Workers runtime requires a server deployment",
			);
		});
	});

	describe("All Backend Types", () => {
		const backends = [
			"hono",
			"express",
			"fastify",
			"elysia",
			"convex",
			"none",
			"self",
		] as const;

		for (const backend of backends) {
			it(`should work with appropriate defaults for ${backend}`, async () => {
				const config: TestConfig = {
					projectName: `test-${backend}`,
					backend: backend as Backend,
					frontend: ["tanstack-router"],
					addons: ["none"],
					examples: ["none"],
					dbSetup: "none",
					webDeploy: "none",
					serverDeploy: "none",
					install: false,
				};

				// Set appropriate defaults for each backend
				switch (backend) {
					case "convex":
						config.runtime = "none";
						config.database = "none";
						config.orm = "none";
						config.auth = "clerk";
						config.api = "none";
						break;
					case "none":
						config.runtime = "none";
						config.database = "none";
						config.orm = "none";
						config.auth = "none";
						config.api = "none";
						break;
					case "self":
						config.frontend = ["next"]; // Self backend only works with Next.js
						config.runtime = "none";
						config.database = "sqlite";
						config.orm = "drizzle";
						config.auth = "better-auth";
						config.api = "trpc";
						break;
					case "elysia":
						config.runtime = "bun";
						config.database = "sqlite";
						config.orm = "drizzle";
						config.auth = "none";
						config.api = "trpc";
						break;
					default:
						config.runtime = "bun";
						config.database = "sqlite";
						config.orm = "drizzle";
						config.auth = "none";
						config.api = "trpc";
				}

				const result = await runTRPCTest(config);
				expectSuccess(result);
			});
		}
	});

	describe("Self Backend Constraints", () => {
		it("should work with self backend and Next.js frontend", async () => {
			const result = await runTRPCTest({
				projectName: "self-backend-success",
				backend: "self",
				runtime: "none",
				frontend: ["next"],
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
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

		it("should fail self backend with non-Next.js frontend", async () => {
			const result = await runTRPCTest({
				projectName: "self-backend-invalid-frontend",
				backend: "self",
				runtime: "none",
				frontend: ["tanstack-router"], // Invalid frontend for self backend
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
				install: false,
			});

			expectError(
				result,
				"Backend 'self' (fullstack) currently only supports Next.js frontend. Please use --frontend next. Support for Nuxt, SvelteKit, and TanStack Start will be added in a future update.",
			);
		});

		it("should fail self backend with non-none runtime", async () => {
			const result = await runTRPCTest({
				projectName: "self-backend-invalid-runtime",
				backend: "self",
				runtime: "bun", // Invalid runtime for self backend
				frontend: ["next"],
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
				install: false,
			});

			expectError(
				result,
				"Backend 'self' (fullstack) requires '--runtime none'",
			);
		});
	});
});
