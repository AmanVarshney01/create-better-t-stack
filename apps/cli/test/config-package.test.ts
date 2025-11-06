import { join } from "node:path";
import { pathExists, readFile, readJSON } from "fs-extra";
import { afterAll, describe, expect, it } from "vitest";
import {
	cleanupSmokeDirectory,
	configPackageName,
	configTsConfigReference,
	expectSuccessWithProjectDir,
	runTRPCTest,
} from "./test-utils";

describe("Config Package Feature", () => {
	afterAll(async () => {
		await cleanupSmokeDirectory();
	});

	describe("Config Package Structure", () => {
		it("should create config package at packages/config", async () => {
			const result = await runTRPCTest({
				projectName: "config-pkg-structure",
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(await pathExists(join(projectDir, "packages/config"))).toBe(true);
		});

		it("should NOT create tsconfig.base.json at root", async () => {
			const result = await runTRPCTest({
				projectName: "no-root-tsconfig",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(await pathExists(join(projectDir, "tsconfig.base.json"))).toBe(
				false,
			);
		});

		it("should create tsconfig.json at root that extends config package", async () => {
			const projectName = "root-tsconfig";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(await pathExists(join(projectDir, "tsconfig.json"))).toBe(true);

			const content = await readFile(join(projectDir, "tsconfig.json"), "utf-8");
			expect(content).toContain(configTsConfigReference(projectName));
		});

		it("should create package.json in config package", async () => {
			const projectName = "config-pkg-json";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "packages/config/package.json")),
			).toBe(true);

			const pkgJson = await readJSON(
				join(projectDir, "packages/config/package.json"),
			);
			expect(pkgJson.name).toBe(configPackageName(projectName));
			expect(pkgJson.private).toBe(true);
		});

		it("should create tsconfig.base.json in config package", async () => {
			const result = await runTRPCTest({
				projectName: "config-tsconfig-base",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "packages/config/tsconfig.base.json")),
			).toBe(true);

			const content = await readJSON(
				join(projectDir, "packages/config/tsconfig.base.json"),
			);
			expect(content.compilerOptions).toBeDefined();
			expect(content.compilerOptions.strict).toBe(true);
			expect(content.compilerOptions.target).toBe("ESNext");
		});

		it("should create tsconfig.json in config package", async () => {
			const result = await runTRPCTest({
				projectName: "config-tsconfig",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "packages/config/tsconfig.json")),
			).toBe(true);
		});
	});

	describe("Root Configuration", () => {
		it("should include config package in root package.json devDependencies", async () => {
			const projectName = "root-config-dep";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				packageManager: "pnpm",
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);
			const pkgJson = await readJSON(join(projectDir, "package.json"));

			expect(pkgJson.devDependencies).toBeDefined();
			expect(pkgJson.devDependencies[configPackageName(projectName)]).toBe(
				"workspace:*",
			);
		});

		it("should use workspace:* for pnpm package manager", async () => {
			const projectName = "pnpm-workspace";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				packageManager: "pnpm",
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);
			const pkgJson = await readJSON(join(projectDir, "package.json"));

			expect(pkgJson.devDependencies[configPackageName(projectName)]).toBe(
				"workspace:*",
			);
		});
	});

	describe("Workspace Package References", () => {
		it("should configure db package to extend config package", async () => {
			const projectName = "db-config-ref";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "packages/db/tsconfig.json")),
			).toBe(true);

			const content = await readFile(
				join(projectDir, "packages/db/tsconfig.json"),
				"utf-8",
			);
			expect(content).toContain(configTsConfigReference(projectName));
		});

		it("should configure api package to extend config package", async () => {
			const projectName = "api-config-ref";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "packages/api/tsconfig.json")),
			).toBe(true);

			const content = await readFile(
				join(projectDir, "packages/api/tsconfig.json"),
				"utf-8",
			);
			expect(content).toContain(configTsConfigReference(projectName));
		});

		it("should configure server app to extend config package", async () => {
			const projectName = "server-config-ref";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "apps/server/tsconfig.json")),
			).toBe(true);

			const content = await readFile(
				join(projectDir, "apps/server/tsconfig.json"),
				"utf-8",
			);
			expect(content).toContain(configTsConfigReference(projectName));
		});

		it("should configure auth package to extend config package", async () => {
			const projectName = "auth-config-ref";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			expect(
				await pathExists(join(projectDir, "packages/auth/tsconfig.json")),
			).toBe(true);

			const content = await readFile(
				join(projectDir, "packages/auth/tsconfig.json"),
				"utf-8",
			);
			expect(content).toContain(configTsConfigReference(projectName));
		});
	});

	describe("Package Dependencies", () => {
		it("should add config package to db package devDependencies", async () => {
			const projectName = "db-dep";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);
			const dbPkgJson = await readJSON(
				join(projectDir, "packages/db/package.json"),
			);

			expect(dbPkgJson.devDependencies).toBeDefined();
			expect(dbPkgJson.devDependencies[configPackageName(projectName)]).toBe(
				"workspace:*",
			);
		});

		it("should add config package to api package devDependencies", async () => {
			const projectName = "api-dep";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);
			const apiPkgJson = await readJSON(
				join(projectDir, "packages/api/package.json"),
			);

			expect(apiPkgJson.devDependencies).toBeDefined();
			expect(apiPkgJson.devDependencies[configPackageName(projectName)]).toBe(
				"workspace:*",
			);
		});

		it("should add config package to server app devDependencies", async () => {
			const projectName = "server-dep";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);
			const serverPkgJson = await readJSON(
				join(projectDir, "apps/server/package.json"),
			);

			expect(serverPkgJson.devDependencies).toBeDefined();
			expect(serverPkgJson.devDependencies[configPackageName(projectName)]).toBe(
				"workspace:*",
			);
		});

		it("should add config package to auth package devDependencies", async () => {
			const projectName = "auth-dep";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);
			const authPkgJson = await readJSON(
				join(projectDir, "packages/auth/package.json"),
			);

			expect(authPkgJson.devDependencies).toBeDefined();
			expect(authPkgJson.devDependencies[configPackageName(projectName)]).toBe(
				"workspace:*",
			);
		});
	});

	describe("Runtime-Specific Configuration", () => {
		it("should include node types for node runtime", async () => {
			const result = await runTRPCTest({
				projectName: "node-runtime",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const configTsConfigBase = await readJSON(
				join(projectDir, "packages/config/tsconfig.base.json"),
			);

			expect(configTsConfigBase.compilerOptions.types).toContain("node");
		});

		it("should include bun types for bun runtime", async () => {
			const result = await runTRPCTest({
				projectName: "bun-runtime",
				backend: "hono",
				runtime: "bun",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const configTsConfigBase = await readJSON(
				join(projectDir, "packages/config/tsconfig.base.json"),
			);

			expect(configTsConfigBase.compilerOptions.types).toContain("bun");
		});
	});

	describe("Edge Cases", () => {
		it("should create config package with backend: none", async () => {
			const result = await runTRPCTest({
				projectName: "no-backend",
				backend: "none",
				runtime: "none",
				database: "none",
				orm: "none",
				api: "none",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const configPkgPath = join(projectDir, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);
		});

		it("should create config package with self-hosted backend", async () => {
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

			const projectDir = expectSuccessWithProjectDir(result);

			const configPkgPath = join(projectDir, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);
		});

		it("should create config package with convex backend", async () => {
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

			const projectDir = expectSuccessWithProjectDir(result);

			const configPkgPath = join(projectDir, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);
		});

		it("should work with different APIs", async () => {
			const projectName = "orpc-api";
			const result = await runTRPCTest({
				projectName,
				backend: "hono",
				runtime: "node",
				api: "orpc",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const content = await readFile(
				join(projectDir, "packages/api/tsconfig.json"),
				"utf-8",
			);
			expect(content).toContain(configTsConfigReference(projectName));
		});

		it("should work with turborepo addon", async () => {
			const result = await runTRPCTest({
				projectName: "with-turborepo",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				addons: ["turborepo"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const configPkgPath = join(projectDir, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);

			const turboJson = join(projectDir, "turbo.json");
			expect(await pathExists(turboJson)).toBe(true);
		});
	});

	describe("Cross-Stack Compatibility", () => {
		it("should work with full stack (hono + trpc + drizzle + better-auth)", async () => {
			const projectName = "full-stack";
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

			const packages = [
				"packages/config",
				"packages/db",
				"packages/api",
				"packages/auth",
			];

			for (const pkg of packages) {
				expect(await pathExists(join(projectDir, pkg))).toBe(true);
			}

			const dbTsConfig = await readFile(
				join(projectDir, "packages/db/tsconfig.json"),
				"utf-8",
			);
			expect(dbTsConfig).toContain(configTsConfigReference(projectName));
		});

		it("should work with express backend", async () => {
			const projectName = "express-stack";
			const result = await runTRPCTest({
				projectName,
				backend: "express",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const serverTsConfig = await readFile(
				join(projectDir, "apps/server/tsconfig.json"),
				"utf-8",
			);
			expect(serverTsConfig).toContain(configTsConfigReference(projectName));
		});

		it("should work with fastify backend", async () => {
			const projectName = "fastify-stack";
			const result = await runTRPCTest({
				projectName,
				backend: "fastify",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			const projectDir = expectSuccessWithProjectDir(result);

			const serverTsConfig = await readFile(
				join(projectDir, "apps/server/tsconfig.json"),
				"utf-8",
			);
			expect(serverTsConfig).toContain(configTsConfigReference(projectName));
		});
	});
});
