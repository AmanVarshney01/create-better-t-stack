import { afterAll, beforeAll, describe, it } from "vitest";
import {
	cleanupSmokeDirectory,
	runTRPCTest,
	validateConfigPackageSetup,
	validateTurboPrune,
} from "./test-utils";

describe("Config Package Feature", () => {
	beforeAll(async () => {
		await cleanupSmokeDirectory();
	});
	afterAll(async () => {
		await cleanupSmokeDirectory();
	});

	describe("Basic Stack Configurations", () => {
		it("should validate hono + pnpm + turbo stack", async () => {
			const result = await runTRPCTest({
				projectName: "hono-pnpm",
				backend: "hono",
				runtime: "node",
				packageManager: "pnpm",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			});
			await validateConfigPackageSetup(result);
			await validateTurboPrune(result);
		});

		it("should validate hono + pnpm + turbo + wrangler stack", async () => {
			const result = await runTRPCTest({
				projectName: "hono-pnpm-turbo-wrangler",
				backend: "hono",
				runtime: "workers",
				packageManager: "pnpm",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				serverDeploy: "wrangler",
				webDeploy: "wrangler",
				install: false,
			});
			await validateConfigPackageSetup(result);
			await validateTurboPrune(result);
		});

		it("should validate hono + node stack", async () => {
			const result = await runTRPCTest({
				projectName: "hono-node",
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate hono + bun stack", async () => {
			const result = await runTRPCTest({
				projectName: "hono-bun",
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate express + node stack", async () => {
			const result = await runTRPCTest({
				projectName: "express-node",
				backend: "express",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate fastify + node stack", async () => {
			const result = await runTRPCTest({
				projectName: "fastify-node",
				backend: "fastify",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});
	});

	describe("Full Stack with Authentication", () => {
		it("should validate full stack with better-auth", async () => {
			const result = await runTRPCTest({
				projectName: "full-stack-auth",
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				api: "trpc",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			});
			await validateConfigPackageSetup(result);
			await validateTurboPrune(result);
		});
	});

	describe("API Variants", () => {
		it("should validate stack with tRPC", async () => {
			const result = await runTRPCTest({
				projectName: "trpc-api",
				backend: "hono",
				runtime: "node",
				api: "trpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate stack with oRPC", async () => {
			const result = await runTRPCTest({
				projectName: "orpc-api",
				backend: "hono",
				runtime: "node",
				api: "orpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});
	});

	describe("Edge Cases", () => {
		it("should validate frontend-only stack (no backend)", async () => {
			const result = await runTRPCTest({
				projectName: "frontend-only",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				auth: "none",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate convex backend", async () => {
			const result = await runTRPCTest({
				projectName: "convex-backend",
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["next"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate self-hosted backend", async () => {
			const result = await runTRPCTest({
				projectName: "self-backend",
				backend: "self",
				runtime: "none",
				api: "trpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["next"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate stack without database", async () => {
			const result = await runTRPCTest({
				projectName: "no-database",
				backend: "hono",
				runtime: "node",
				database: "none",
				orm: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});
			await validateConfigPackageSetup(result);
		});

		it("should validate stack with turborepo addon", async () => {
			const result = await runTRPCTest({
				projectName: "with-turborepo",
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			});
			await validateConfigPackageSetup(result);
			await validateTurboPrune(result);
		});
	});
});
