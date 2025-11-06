import { afterAll, describe, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectSuccessWithProjectDir,
	runTRPCTest,
	validateConfigPackageSetup,
} from "./test-utils";

describe("Config Package Feature", () => {
	afterAll(async () => {
		await cleanupSmokeDirectory();
	});

	describe("Basic Stack Configurations", () => {
		it("should validate hono + node stack", async () => {
			const projectName = "hono-node";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate hono + bun stack", async () => {
			const projectName = "hono-bun";

			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate express + node stack", async () => {
			const projectName = "express-node";

			const result = await runTRPCTest({
				projectName,
				backend: "express",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate fastify + node stack", async () => {
			const projectName = "fastify-node";

			const result = await runTRPCTest({
				projectName,
				backend: "fastify",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});
	});

	describe("Full Stack with Authentication", () => {
		it("should validate full stack with better-auth", async () => {
			const projectName = "full-stack-auth";

			const result = await runTRPCTest({
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
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});
	});

	describe("API Variants", () => {
		it("should validate stack with tRPC", async () => {
			const projectName = "trpc-api";

			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				api: "trpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate stack with oRPC", async () => {
			const projectName = "orpc-api";

			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				api: "orpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});
	});

	describe("Edge Cases", () => {
		it("should validate frontend-only stack (no backend)", async () => {
			const projectName = "frontend-only";

			const result = await runTRPCTest({
				projectName,
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				auth: "none",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate convex backend", async () => {
			const projectName = "convex-backend";

			const result = await runTRPCTest({
				projectName,
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["next"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate self-hosted backend", async () => {
			const projectName = "self-backend";

			const result = await runTRPCTest({
				projectName,
				backend: "self",
				runtime: "none",
				api: "trpc",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["next"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate stack without database", async () => {
			const projectName = "no-database";

			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "none",
				orm: "none",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});

		it("should validate stack with turborepo addon", async () => {
			const projectName = "with-turborepo";

			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			});
			const projectDir = expectSuccessWithProjectDir(result);
			await validateConfigPackageSetup(projectDir, projectName, result.config);
		});
	});
});
