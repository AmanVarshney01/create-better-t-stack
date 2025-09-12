import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectSuccess,
	runTRPCTest,
	type TestConfig,
} from "./test-utils";

describe("CLI Performance Benchmarks", () => {
	beforeAll(async () => {
		await cleanupSmokeDirectory();
	});

	afterAll(async () => {
		await cleanupSmokeDirectory();
	});

	describe("Basic Project Creation Benchmarks", () => {
		it("should benchmark default configuration creation", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-default",
				yes: true,
				install: false, // Skip install for faster benchmarking
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(10000); // Should complete within 10 seconds

			console.log(`✅ Default configuration: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark minimal configuration creation", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-minimal",
				frontend: ["none"],
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				serverDeploy: "none",
				webDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(8000);

			console.log(`✅ Minimal configuration: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark full-stack configuration creation", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-fullstack",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				api: "trpc",
				addons: ["turborepo", "biome"],
				examples: ["todo"],
				dbSetup: "neon",
				webDeploy: "none",
				serverDeploy: "none",
				manualDb: true,
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(15000); // Should complete within 15 seconds

			console.log(`✅ Full-stack configuration: ${duration.toFixed(2)}ms`);
		});
	});

	describe("Database Setup Benchmarks", () => {
		it("should benchmark SQLite with Drizzle setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-sqlite-drizzle",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ SQLite + Drizzle: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark PostgreSQL with Prisma setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-postgres-prisma",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "postgres",
				orm: "prisma",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ PostgreSQL + Prisma: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark MongoDB with Mongoose setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-mongodb-mongoose",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "mongodb",
				orm: "mongoose",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ MongoDB + Mongoose: ${duration.toFixed(2)}ms`);
		});
	});

	describe("Frontend Framework Benchmarks", () => {
		it("should benchmark TanStack Router setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-tanstack-router",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ TanStack Router: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark Next.js setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-nextjs",
				frontend: ["next"],
				backend: "next",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Next.js: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark Nuxt setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-nuxt",
				frontend: ["nuxt"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "orpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Nuxt: ${duration.toFixed(2)}ms`);
		});
	});

	describe("Backend Framework Benchmarks", () => {
		it("should benchmark Hono setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-hono",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Hono: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark Express setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-express",
				frontend: ["tanstack-router"],
				backend: "express",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Express: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark Convex setup", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-convex",
				frontend: ["tanstack-router"],
				backend: "convex",
				runtime: "none",
				database: "none",
				orm: "none",
				auth: "none",
				api: "none",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Convex: ${duration.toFixed(2)}ms`);
		});
	});

	describe("Addon Benchmarks", () => {
		it("should benchmark Turborepo addon", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-turborepo",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["turborepo"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Turborepo addon: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark Biome addon", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-biome",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["biome"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(12000);

			console.log(`✅ Biome addon: ${duration.toFixed(2)}ms`);
		});

		it("should benchmark multiple addons", async () => {
			const startTime = performance.now();

			const result = await runTRPCTest({
				projectName: "benchmark-multiple-addons",
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				database: "sqlite",
				orm: "drizzle",
				auth: "none",
				api: "trpc",
				addons: ["turborepo", "biome", "husky"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			expectSuccess(result);
			expect(duration).toBeLessThan(15000);

			console.log(`✅ Multiple addons: ${duration.toFixed(2)}ms`);
		});
	});

	describe("Performance Regression Tests", () => {
		it("should not exceed performance thresholds", async () => {
			const configurations = [
				{
					name: "Minimal",
					config: {
						projectName: "perf-minimal",
						frontend: ["none"],
						backend: "none",
						runtime: "none",
						database: "none",
						orm: "none",
						auth: "none",
						api: "none",
						addons: ["none"],
						examples: ["none"],
						dbSetup: "none",
						webDeploy: "none",
						serverDeploy: "none",
						install: false,
					},
					threshold: 5000, // 5 seconds
				},
				{
					name: "Default",
					config: {
						projectName: "perf-default",
						yes: true,
						install: false,
					},
					threshold: 8000, // 8 seconds
				},
				{
					name: "Complex",
					config: {
						projectName: "perf-complex",
						frontend: ["tanstack-router"],
						backend: "hono",
						runtime: "bun",
						database: "postgres",
						orm: "prisma",
						auth: "better-auth",
						api: "trpc",
						addons: ["turborepo", "biome"],
						examples: ["todo"],
						dbSetup: "none",
						webDeploy: "none",
						serverDeploy: "none",
						install: false,
					},
					threshold: 12000, // 12 seconds
				},
			];

			for (const { name, config, threshold } of configurations) {
				const startTime = performance.now();

				const result = await runTRPCTest(config as TestConfig);

				const endTime = performance.now();
				const duration = endTime - startTime;

				expectSuccess(result);
				expect(duration).toBeLessThan(threshold);

				console.log(
					`✅ ${name} performance: ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`,
				);
			}
		});
	});
});
