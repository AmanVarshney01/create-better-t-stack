import { join } from "node:path";
import { pathExists, readFile, readJSON } from "fs-extra";
import { afterAll, describe, expect, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectSuccess,
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

			expectSuccess(result);
			const configPkgPath = join(result.projectDir!, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);
		});

		it("should NOT create tsconfig.base.json at root", async () => {
			const result = await runTRPCTest({
				projectName: "no-root-tsconfig",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const rootTsConfigBase = join(result.projectDir!, "tsconfig.base.json");
			expect(await pathExists(rootTsConfigBase)).toBe(false);
		});

		it("should create tsconfig.json at root that extends config package", async () => {
			const result = await runTRPCTest({
				projectName: "root-tsconfig",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const rootTsConfig = join(result.projectDir!, "tsconfig.json");
			expect(await pathExists(rootTsConfig)).toBe(true);

			const content = await readFile(rootTsConfig, "utf-8");
			expect(content).toContain("@root-tsconfig/config/tsconfig.base.json");
		});

		it("should create package.json in config package", async () => {
			const result = await runTRPCTest({
				projectName: "config-pkg-json",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const configPkgJson = join(
				result.projectDir!,
				"packages/config/package.json",
			);
			expect(await pathExists(configPkgJson)).toBe(true);

			const pkgJson = await readJSON(configPkgJson);
			expect(pkgJson.name).toBe("@config-pkg-json/config");
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

			expectSuccess(result);
			const configTsConfigBase = join(
				result.projectDir!,
				"packages/config/tsconfig.base.json",
			);
			expect(await pathExists(configTsConfigBase)).toBe(true);

			const content = await readJSON(configTsConfigBase);
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

			expectSuccess(result);
			const configTsConfig = join(
				result.projectDir!,
				"packages/config/tsconfig.json",
			);
			expect(await pathExists(configTsConfig)).toBe(true);
		});
	});

	describe("Root Configuration", () => {
		it("should include config package in root package.json devDependencies", async () => {
			const result = await runTRPCTest({
				projectName: "root-config-dep",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				packageManager: "pnpm",
				install: false,
			});

			expectSuccess(result);
			const rootPkgJson = join(result.projectDir!, "package.json");
			const pkgJson = await readJSON(rootPkgJson);

			expect(pkgJson.devDependencies).toBeDefined();
			expect(pkgJson.devDependencies["@root-config-dep/config"]).toBe(
				"workspace:*",
			);
		});

		it("should use workspace:* for pnpm package manager", async () => {
			const result = await runTRPCTest({
				projectName: "pnpm-workspace",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				packageManager: "pnpm",
				install: false,
			});

			expectSuccess(result);
			const rootPkgJson = await readJSON(
				join(result.projectDir!, "package.json"),
			);
			expect(rootPkgJson.devDependencies["@pnpm-workspace/config"]).toBe(
				"workspace:*",
			);
		});
	});

	describe("Workspace Package References", () => {
		it("should configure db package to extend config package", async () => {
			const result = await runTRPCTest({
				projectName: "db-config-ref",
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const dbTsConfig = join(result.projectDir!, "packages/db/tsconfig.json");
			expect(await pathExists(dbTsConfig)).toBe(true);

			const content = await readFile(dbTsConfig, "utf-8");
			expect(content).toContain("@db-config-ref/config/tsconfig.base.json");
		});

		it("should configure api package to extend config package", async () => {
			const result = await runTRPCTest({
				projectName: "api-config-ref",
				backend: "hono",
				runtime: "node",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const apiTsConfig = join(
				result.projectDir!,
				"packages/api/tsconfig.json",
			);
			expect(await pathExists(apiTsConfig)).toBe(true);

			const content = await readFile(apiTsConfig, "utf-8");
			expect(content).toContain("@api-config-ref/config/tsconfig.base.json");
		});

		it("should configure server app to extend config package", async () => {
			const result = await runTRPCTest({
				projectName: "server-config-ref",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const serverTsConfig = join(
				result.projectDir!,
				"apps/server/tsconfig.json",
			);
			expect(await pathExists(serverTsConfig)).toBe(true);

			const content = await readFile(serverTsConfig, "utf-8");
			expect(content).toContain("@server-config-ref/config/tsconfig.base.json");
		});

		it("should configure auth package to extend config package", async () => {
			const result = await runTRPCTest({
				projectName: "auth-config-ref",
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const authTsConfig = join(
				result.projectDir!,
				"packages/auth/tsconfig.json",
			);
			expect(await pathExists(authTsConfig)).toBe(true);

			const content = await readFile(authTsConfig, "utf-8");
			expect(content).toContain("@auth-config-ref/config/tsconfig.base.json");
		});
	});

	describe("Package Dependencies", () => {
		it("should add config package to db package devDependencies", async () => {
			const result = await runTRPCTest({
				projectName: "db-dep",
				backend: "hono",
				runtime: "node",
				database: "sqlite",
				orm: "drizzle",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const dbPkgJson = await readJSON(
				join(result.projectDir!, "packages/db/package.json"),
			);

			expect(dbPkgJson.devDependencies).toBeDefined();
			expect(dbPkgJson.devDependencies["@db-dep/config"]).toBe("workspace:*");
		});

		it("should add config package to api package devDependencies", async () => {
			const result = await runTRPCTest({
				projectName: "api-dep",
				backend: "hono",
				runtime: "node",
				api: "trpc",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const apiPkgJson = await readJSON(
				join(result.projectDir!, "packages/api/package.json"),
			);

			expect(apiPkgJson.devDependencies).toBeDefined();
			expect(apiPkgJson.devDependencies["@api-dep/config"]).toBe("workspace:*");
		});

		it("should add config package to server app devDependencies", async () => {
			const result = await runTRPCTest({
				projectName: "server-dep",
				backend: "hono",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const serverPkgJson = await readJSON(
				join(result.projectDir!, "apps/server/package.json"),
			);

			expect(serverPkgJson.devDependencies).toBeDefined();
			expect(serverPkgJson.devDependencies["@server-dep/config"]).toBe(
				"workspace:*",
			);
		});

		it("should add config package to auth package devDependencies", async () => {
			const result = await runTRPCTest({
				projectName: "auth-dep",
				backend: "hono",
				runtime: "node",
				database: "postgres",
				orm: "drizzle",
				auth: "better-auth",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const authPkgJson = await readJSON(
				join(result.projectDir!, "packages/auth/package.json"),
			);

			expect(authPkgJson.devDependencies).toBeDefined();
			expect(authPkgJson.devDependencies["@auth-dep/config"]).toBe(
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

			expectSuccess(result);
			const configTsConfigBase = await readJSON(
				join(result.projectDir!, "packages/config/tsconfig.base.json"),
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

			expectSuccess(result);
			const configTsConfigBase = await readJSON(
				join(result.projectDir!, "packages/config/tsconfig.base.json"),
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

			expectSuccess(result);
			const configPkgPath = join(result.projectDir!, "packages/config");
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

			expectSuccess(result);
			const configPkgPath = join(result.projectDir!, "packages/config");
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

			expectSuccess(result);
			const configPkgPath = join(result.projectDir!, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);
		});

		it("should work with different APIs", async () => {
			const result = await runTRPCTest({
				projectName: "orpc-api",
				backend: "hono",
				runtime: "node",
				api: "orpc",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const apiTsConfig = join(
				result.projectDir!,
				"packages/api/tsconfig.json",
			);
			const content = await readFile(apiTsConfig, "utf-8");
			expect(content).toContain("@orpc-api/config/tsconfig.base.json");
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

			expectSuccess(result);
			const configPkgPath = join(result.projectDir!, "packages/config");
			expect(await pathExists(configPkgPath)).toBe(true);

			const turboJson = join(result.projectDir!, "turbo.json");
			expect(await pathExists(turboJson)).toBe(true);
		});
	});

	describe("Cross-Stack Compatibility", () => {
		it("should work with full stack (hono + trpc + drizzle + better-auth)", async () => {
			const result = await runTRPCTest({
				projectName: "full-stack",
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

			expectSuccess(result);

			const packages = [
				"packages/config",
				"packages/db",
				"packages/api",
				"packages/auth",
			];

			for (const pkg of packages) {
				const pkgPath = join(result.projectDir!, pkg);
				expect(await pathExists(pkgPath)).toBe(true);
			}

			const dbTsConfig = await readFile(
				join(result.projectDir!, "packages/db/tsconfig.json"),
				"utf-8",
			);
			expect(dbTsConfig).toContain("@full-stack/config/tsconfig.base.json");
		});

		it("should work with express backend", async () => {
			const result = await runTRPCTest({
				projectName: "express-stack",
				backend: "express",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const serverTsConfig = await readFile(
				join(result.projectDir!, "apps/server/tsconfig.json"),
				"utf-8",
			);
			expect(serverTsConfig).toContain(
				"@express-stack/config/tsconfig.base.json",
			);
		});

		it("should work with fastify backend", async () => {
			const result = await runTRPCTest({
				projectName: "fastify-stack",
				backend: "fastify",
				runtime: "node",
				frontend: ["tanstack-router"],
				install: false,
			});

			expectSuccess(result);
			const serverTsConfig = await readFile(
				join(result.projectDir!, "apps/server/tsconfig.json"),
				"utf-8",
			);
			expect(serverTsConfig).toContain(
				"@fastify-stack/config/tsconfig.base.json",
			);
		});
	});
});
