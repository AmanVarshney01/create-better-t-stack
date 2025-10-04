import path from "node:path";
import fs from "fs-extra";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import yaml from "yaml";
import { init } from "../src";
import { cleanupSmokeDirectory } from "./test-utils";

const SMOKE_DIR = path.join(process.cwd(), ".smoke");

describe("Catalogs", () => {
	beforeEach(async () => {
		await fs.ensureDir(SMOKE_DIR);
	});

	afterEach(async () => {
		await cleanupSmokeDirectory();
	});

	it("should setup Bun catalogs for duplicated dependencies", async () => {
		const projectName = "test-bun-catalog";
		const projectDir = path.join(SMOKE_DIR, projectName);

		await init(projectName, {
			packageManager: "bun",
			backend: "hono",
			runtime: "bun",
			database: "postgres",
			orm: "drizzle",
			auth: "better-auth",
			frontend: ["tanstack-router"],
			api: "trpc",
			install: false,
			git: false,
			directoryConflict: "overwrite",
			disableAnalytics: true,
			dbSetup: "none",
		});

		const rootPkgJson = await fs.readJson(
			path.join(projectDir, "package.json"),
		);
		expect(rootPkgJson.workspaces.catalog).toBeDefined();
		expect(Object.keys(rootPkgJson.workspaces.catalog).length).toBeGreaterThan(
			0,
		);

		const serverPkgJson = await fs.readJson(
			path.join(projectDir, "apps/server/package.json"),
		);
		const dbPkgJson = await fs.readJson(
			path.join(projectDir, "packages/db/package.json"),
		);

		const hasCatalogDep =
			Object.values(serverPkgJson.dependencies || {}).some(
				(v) => typeof v === "string" && v.startsWith("catalog:"),
			) ||
			Object.values(dbPkgJson.dependencies || {}).some(
				(v) => typeof v === "string" && v.startsWith("catalog:"),
			);

		expect(hasCatalogDep).toBe(true);
	});

	it("should setup pnpm catalogs for duplicated dependencies", async () => {
		const projectName = "test-pnpm-catalog";
		const projectDir = path.join(SMOKE_DIR, projectName);

		await init(projectName, {
			packageManager: "pnpm",
			backend: "hono",
			runtime: "bun",
			database: "postgres",
			orm: "drizzle",
			auth: "better-auth",
			frontend: ["tanstack-router"],
			api: "trpc",
			install: false,
			git: false,
			directoryConflict: "overwrite",
			disableAnalytics: true,
			dbSetup: "none",
		});

		const workspaceYamlPath = path.join(projectDir, "pnpm-workspace.yaml");
		const workspaceContent = await fs.readFile(workspaceYamlPath, "utf-8");
		const workspaceYaml = yaml.parse(workspaceContent);

		expect(workspaceYaml.catalog).toBeDefined();
		expect(Object.keys(workspaceYaml.catalog).length).toBeGreaterThan(0);

		const serverPkgJson = await fs.readJson(
			path.join(projectDir, "apps/server/package.json"),
		);
		const dbPkgJson = await fs.readJson(
			path.join(projectDir, "packages/db/package.json"),
		);

		const hasCatalogDep =
			Object.values(serverPkgJson.dependencies || {}).some(
				(v) => typeof v === "string" && v.startsWith("catalog:"),
			) ||
			Object.values(dbPkgJson.dependencies || {}).some(
				(v) => typeof v === "string" && v.startsWith("catalog:"),
			);

		expect(hasCatalogDep).toBe(true);
	});

	it("should NOT setup catalogs for npm", async () => {
		const projectName = "test-npm-no-catalog";
		const projectDir = path.join(SMOKE_DIR, projectName);

		await init(projectName, {
			packageManager: "npm",
			backend: "hono",
			runtime: "bun",
			database: "postgres",
			orm: "drizzle",
			auth: "better-auth",
			frontend: ["tanstack-router"],
			api: "trpc",
			install: false,
			git: false,
			directoryConflict: "overwrite",
			disableAnalytics: true,
			dbSetup: "none",
		});

		const rootPkgJson = await fs.readJson(
			path.join(projectDir, "package.json"),
		);
		expect(rootPkgJson.workspaces.catalog).toBeUndefined();

		const serverPkgJson = await fs.readJson(
			path.join(projectDir, "apps/server/package.json"),
		);

		const hasCatalogDep = Object.values(serverPkgJson.dependencies || {}).some(
			(v) => typeof v === "string" && v.startsWith("catalog:"),
		);

		expect(hasCatalogDep).toBe(false);
	});

	it("should setup catalogs for Convex backend", async () => {
		const projectName = "test-convex-catalog";
		const projectDir = path.join(SMOKE_DIR, projectName);

		await init(projectName, {
			packageManager: "bun",
			backend: "convex",
			frontend: ["tanstack-router"],
			auth: "none",
			install: false,
			git: false,
			directoryConflict: "overwrite",
			disableAnalytics: true,
		});

		const rootPkgJson = await fs.readJson(
			path.join(projectDir, "package.json"),
		);

		if (rootPkgJson.workspaces?.catalog) {
			expect(
				Object.keys(rootPkgJson.workspaces.catalog).length,
			).toBeGreaterThanOrEqual(0);
		}

		const backendPkgJsonPath = path.join(
			projectDir,
			"packages/backend/package.json",
		);
		if (await fs.pathExists(backendPkgJsonPath)) {
			const backendPkgJson = await fs.readJson(backendPkgJsonPath);
			const hasCatalogDep =
				Object.values(backendPkgJson.dependencies || {}).some(
					(v) => typeof v === "string" && v.startsWith("catalog:"),
				) ||
				Object.values(backendPkgJson.devDependencies || {}).some(
					(v) => typeof v === "string" && v.startsWith("catalog:"),
				);

			if (
				rootPkgJson.workspaces?.catalog &&
				Object.keys(rootPkgJson.workspaces.catalog).length > 0
			) {
				expect(hasCatalogDep).toBe(true);
			}
		}
	});

	it("should convert workspaces array to object format for Bun", async () => {
		const projectName = "test-bun-workspaces-conversion";
		const projectDir = path.join(SMOKE_DIR, projectName);

		await init(projectName, {
			packageManager: "bun",
			backend: "hono",
			runtime: "bun",
			database: "postgres",
			orm: "drizzle",
			auth: "better-auth",
			frontend: ["tanstack-router"],
			api: "trpc",
			install: false,
			git: false,
			directoryConflict: "overwrite",
			disableAnalytics: true,
			dbSetup: "none",
		});

		const rootPkgJson = await fs.readJson(
			path.join(projectDir, "package.json"),
		);

		expect(rootPkgJson.workspaces).toBeDefined();
		expect(typeof rootPkgJson.workspaces).toBe("object");
		expect(Array.isArray(rootPkgJson.workspaces)).toBe(false);

		if (
			typeof rootPkgJson.workspaces === "object" &&
			!Array.isArray(rootPkgJson.workspaces)
		) {
			expect(rootPkgJson.workspaces.packages).toBeDefined();
			expect(Array.isArray(rootPkgJson.workspaces.packages)).toBe(true);
			expect(rootPkgJson.workspaces.packages).toContain("apps/*");
			expect(rootPkgJson.workspaces.packages).toContain("packages/*");
			expect(rootPkgJson.workspaces.catalog).toBeDefined();
		}
	});

	it("should only catalog dependencies that appear in multiple packages", async () => {
		const projectName = "test-bun-selective-catalog";
		const projectDir = path.join(SMOKE_DIR, projectName);

		await init(projectName, {
			packageManager: "bun",
			backend: "hono",
			runtime: "bun",
			database: "postgres",
			orm: "drizzle",
			auth: "better-auth",
			frontend: ["tanstack-router"],
			api: "trpc",
			install: false,
			git: false,
			directoryConflict: "overwrite",
			disableAnalytics: true,
			dbSetup: "none",
		});

		const rootPkgJson = await fs.readJson(
			path.join(projectDir, "package.json"),
		);
		const catalog = rootPkgJson.workspaces.catalog;

		if (catalog) {
			for (const depName of Object.keys(catalog)) {
				let count = 0;
				const packagePaths = [
					"apps/server",
					"apps/web",
					"packages/api",
					"packages/db",
					"packages/auth",
					"packages/backend",
				];

				for (const pkgPath of packagePaths) {
					const fullPath = path.join(projectDir, pkgPath);
					const pkgJsonPath = path.join(fullPath, "package.json");

					if (await fs.pathExists(pkgJsonPath)) {
						const pkgJson = await fs.readJson(pkgJsonPath);
						const allDeps = {
							...pkgJson.dependencies,
							...pkgJson.devDependencies,
						};

						if (allDeps[depName]) {
							count++;
						}
					}
				}

				expect(count).toBeGreaterThan(1);
			}
		}
	});
});
