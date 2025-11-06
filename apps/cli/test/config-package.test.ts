import { afterAll, describe, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectSuccessWithProjectDir,
	runTRPCTest,
	type TestConfig,
	validateConfigPackageSetup,
} from "./test-utils";

describe("Config Package Feature", () => {
	afterAll(async () => {
		await cleanupSmokeDirectory();
	});

	describe("Basic Stack Configurations", () => {
		it("should validate hono + node stack", async () => {
			const projectName = "hono-node";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate hono + bun stack", async () => {
			const projectName = "hono-bun";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate express + node stack", async () => {
			const projectName = "express-node";
			const config: TestConfig = {
				projectName,
				backend: "express",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate fastify + node stack", async () => {
			const projectName = "fastify-node";
			const config: TestConfig = {
				projectName,
				backend: "fastify",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});
	});

	describe("Full Stack with Authentication", () => {
		it("should validate full stack with better-auth", async () => {
			const projectName = "full-stack-auth";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				api: "trpc",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});
	});

	describe("API Variants", () => {
		it("should validate stack with tRPC", async () => {
			const projectName = "trpc-api";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "node",
				api: "trpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate stack with oRPC", async () => {
			const projectName = "orpc-api";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "node",
				api: "orpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});
	});

	describe("Edge Cases", () => {
		it("should validate frontend-only stack (no backend)", async () => {
			const projectName = "frontend-only";
			const config: TestConfig = {
				projectName,
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				auth: "none",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate convex backend", async () => {
			const projectName = "convex-backend";
			const config: TestConfig = {
				projectName,
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["next"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate self-hosted backend", async () => {
			const projectName = "self-backend";
			const config: TestConfig = {
				projectName,
				backend: "self",
				runtime: "none",
				api: "trpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["next"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate stack without database", async () => {
			const projectName = "no-database";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "node",
				database: "none",
				orm: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});

		it("should validate stack with turborepo addon", async () => {
			const projectName = "with-turborepo";
			const config: TestConfig = {
				projectName,
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			};

			const result = await runTRPCTest(config);
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, config);
		});
	});
});
