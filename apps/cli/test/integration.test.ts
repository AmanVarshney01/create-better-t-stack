import { describe, it } from "vitest";
import type { Backend, Runtime } from "../src/types";
import {
	expectError,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("Integration Tests - Real World Scenarios", () => {
	describe("Complete Stack Configurations", () => {
		it("should create full-stack React app with tRPC", async () => {
			const result = await runTRPCTest({
				projectName: "fullstack-react-trpc",
				backend: "hono",
				runtime: "workers",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["biome", "turborepo"],
				examples: ["todo", "ai"],
				dbSetup: "none",
				webDeploy: "wrangler",
				serverDeploy: "wrangler",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Nuxt app with oRPC", async () => {
			const result = await runTRPCTest({
				projectName: "nuxt-orpc-app",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "orpc",
				frontend: ["nuxt"],
				addons: ["biome", "husky"],
				examples: ["ai"], // AI works with Nuxt
				dbSetup: "none",
				webDeploy: "alchemy",
				serverDeploy: "alchemy",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Next.js fullstack app with self backend", async () => {
			const result = await runTRPCTest({
				projectName: "nextjs-fullstack-app",
				backend: "self",
				runtime: "none",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["next"],
				addons: ["biome", "turborepo"],
				examples: ["todo", "ai"],
				dbSetup: "none",
				webDeploy: "alchemy",
				serverDeploy: "none", // No server deployment for self backend
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Svelte app with oRPC", async () => {
			const result = await runTRPCTest({
				projectName: "svelte-orpc-app",
				backend: "hono",
				runtime: "bun",
				database: "mysql",
				orm: "prisma",
				auth: "better-auth",
				api: "orpc",
				frontend: ["svelte"],
				addons: ["turborepo", "oxlint"],
				examples: ["todo"], // Todo works with Svelte
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Convex app with Clerk auth", async () => {
			const result = await runTRPCTest({
				projectName: "convex-clerk-app",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["biome", "turborepo"],
				examples: ["todo", "ai"],
				dbSetup: "none",
				webDeploy: "wrangler",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create mobile app with React Native", async () => {
			const result = await runTRPCTest({
				projectName: "mobile-app",
				backend: "hono",
				runtime: "bun",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["native-bare"],
				addons: ["biome", "turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create hybrid web + mobile app", async () => {
			const result = await runTRPCTest({
				projectName: "hybrid-web-mobile",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["tanstack-router", "native-unistyles"],
				addons: ["biome", "turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Cloudflare Workers app", async () => {
			const result = await runTRPCTest({
				projectName: "cloudflare-workers-app",
				backend: "hono",
				runtime: "workers",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["biome"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "wrangler",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create MongoDB + Mongoose app", async () => {
			const result = await runTRPCTest({
				projectName: "mongodb-mongoose-app",
				backend: "express",
				runtime: "node",
				database: "mongodb",
				orm: "mongoose",
				auth: "better-auth",
				api: "trpc",
				frontend: ["react-router"],
				addons: ["husky", "turborepo"],
				examples: ["todo"],
				dbSetup: "none",
				webDeploy: "alchemy",
				serverDeploy: "alchemy",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Next.js fullstack app", async () => {
			const result = await runTRPCTest({
				projectName: "nextjs-fullstack",
				backend: "self",
				runtime: "none",
				database: "postgres",
				orm: "prisma",
				auth: "better-auth",
				api: "trpc",
				frontend: ["next"],
				addons: ["biome", "turborepo", "pwa"],
				examples: ["ai"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create Solid.js app with oRPC", async () => {
			const result = await runTRPCTest({
				projectName: "solid-orpc-app",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "better-auth",
				api: "orpc",
				frontend: ["solid"],
				addons: ["biome", "pwa"],
				examples: ["todo"], // AI not compatible with Solid
				dbSetup: "none",
				webDeploy: "wrangler",
				serverDeploy: "wrangler",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("Frontend-only Configurations", () => {
		it("should create frontend-only React app", async () => {
			const result = await runTRPCTest({
				projectName: "frontend-only-react",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				frontend: ["tanstack-router"],
				addons: ["biome", "pwa"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "wrangler",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});

		it("should create frontend-only Nuxt app", async () => {
			const result = await runTRPCTest({
				projectName: "frontend-only-nuxt",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				frontend: ["nuxt"],
				addons: ["biome", "husky"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "alchemy",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
		});
	});

	describe("Complex Error Scenarios", () => {
		it("should fail with incompatible stack combination", async () => {
			// MongoDB + Drizzle is not supported
			const result = await runTRPCTest({
				projectName: "incompatible-stack-fail",
				backend: "hono",
				runtime: "bun",
				database: "mongodb",
				orm: "drizzle", // Not compatible with MongoDB
				auth: "better-auth",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Drizzle ORM does not support MongoDB");
		});

		it("should fail with workers + incompatible database", async () => {
			const result = await runTRPCTest({
				projectName: "workers-mongodb-fail",
				backend: "hono",
				runtime: "workers",
				database: "mongodb", // Not compatible with Workers
				orm: "mongoose",
				auth: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "wrangler",
				expectError: true,
			});

			expectError(
				result,
				"Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database",
			);
		});

		it("should fail with tRPC + incompatible frontend", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-nuxt-fail",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["nuxt"], // tRPC not compatible with Nuxt
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "tRPC API is not supported with 'nuxt' frontend");
		});

		it("should fail with Clerk + incompatible frontend", async () => {
			const result = await runTRPCTest({
				projectName: "clerk-svelte-fail",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "clerk",
				api: "none",
				frontend: ["svelte"], // Clerk + Convex not compatible with Svelte
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Clerk authentication is not compatible");
		});

		it("should fail with addon incompatibility", async () => {
			const result = await runTRPCTest({
				projectName: "pwa-native-fail",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["native-bare"],
				addons: ["pwa"], // PWA not compatible with native-only
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "pwa addon requires one of these frontends");
		});

		it("should fail with example incompatibility", async () => {
			const result = await runTRPCTest({
				projectName: "ai-solid-fail",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc",
				frontend: ["solid"],
				addons: ["none"],
				examples: ["ai"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"The 'ai' example is not compatible with the Solid frontend",
			);
		});

		it("should fail with payments incompatibility", async () => {
			const result = await runTRPCTest({
				projectName: "polar-no-auth-fail",
				backend: "hono",
				runtime: "bun",
				database: "none",
				orm: "none",
				auth: "none",
				payments: "polar",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "Polar payments requires Better Auth");
		});

		it("should fail with deployment constraint violation", async () => {
			const result = await runTRPCTest({
				projectName: "web-deploy-no-frontend-fail",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				frontend: ["native-bare"], // Only native, no web
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "wrangler", // Requires web frontend
				serverDeploy: "none",
				expectError: true,
			});

			expectError(result, "'--web-deploy' requires a web frontend");
		});
	});

	describe("Edge Case Combinations", () => {
		it("should handle maximum complexity configuration", async () => {
			const result = await runTRPCTest({
				projectName: "max-complexity",
				backend: "hono",
				runtime: "bun",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				frontend: ["tanstack-router", "native-bare"],
				addons: ["biome", "husky", "turborepo"],
				examples: ["todo", "ai"],
				dbSetup: "none",
				webDeploy: "wrangler",
				serverDeploy: "wrangler",
				install: false,
			});

			expectSuccess(result);
		});

		it("should handle minimal configuration", async () => {
			const result = await runTRPCTest({
				projectName: "minimal-config",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
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

		it("should handle all package managers", async () => {
			const packageManagers = ["npm", "pnpm", "bun"];

			for (const packageManager of packageManagers) {
				const result = await runTRPCTest({
					projectName: `pkg-manager-${packageManager}`,
					backend: "hono",
					runtime: "bun",
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
					install: false,
				});

				expectSuccess(result);
			}
		});

		it("should handle different runtime environments", async () => {
			const runtimeConfigs = [
				{ runtime: "bun", backend: "hono" },
				{ runtime: "node", backend: "express" },
				{ runtime: "workers", backend: "hono" },
				{ runtime: "none", backend: "convex" },
			];

			for (const { runtime, backend } of runtimeConfigs) {
				const config: TestConfig = {
					projectName: `runtime-${runtime}-${backend}`,
					runtime: runtime as Runtime,
					backend: backend as Backend,
					frontend: ["tanstack-router"],
					install: false,
				};

				// Set appropriate defaults
				if (backend === "convex") {
					config.database = "none";
					config.orm = "none";
					config.auth = "clerk";
					config.api = "none";
					config.addons = ["none"];
					config.examples = ["none"];
					config.dbSetup = "none";
					config.webDeploy = "none";
					config.serverDeploy = "none";
				} else {
					config.database = "sqlite";
					config.orm = "drizzle";
					config.auth = "none";
					config.api = "trpc";
					config.addons = ["none"];
					config.examples = ["none"];
					config.dbSetup = "none";
					config.webDeploy = "none";
					config.serverDeploy = "none";
				}

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
