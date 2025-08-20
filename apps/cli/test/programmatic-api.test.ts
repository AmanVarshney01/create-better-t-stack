import { join } from "node:path";
import { ensureDir, existsSync, readFile, remove } from "fs-extra";
import { parse as parseJsonc } from "jsonc-parser";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { init } from "../src/index";
import type { BetterTStackConfig } from "../src/types";

let testCounter = 0;
let tmpDir: string;
let originalCwd: string;

async function createTmpDir() {
	testCounter++;
	const dir = join(__dirname, "..", `.prog-test-${testCounter}`);
	if (existsSync(dir)) {
		await remove(dir);
	}
	await ensureDir(dir);
	return dir;
}

function assertProjectExists(dir: string) {
	expect(existsSync(dir)).toBe(true);
	expect(existsSync(join(dir, "package.json"))).toBe(true);
	expect(existsSync(join(dir, "bts.jsonc"))).toBe(true);
}

async function assertBtsConfig(
	dir: string,
	expectedConfig: Partial<{
		frontend: string[];
		backend: string;
		database: string;
		orm: string;
		api: string;
		runtime: string;
		addons: string[];
	}>,
) {
	const configPath = join(dir, "bts.jsonc");
	expect(existsSync(configPath)).toBe(true);

	const configContent = await readFile(configPath, "utf-8");
	const config: BetterTStackConfig = parseJsonc(configContent);

	if (expectedConfig.frontend) {
		expect(config.frontend).toEqual(expectedConfig.frontend);
	}
	if (expectedConfig.backend) {
		expect(config.backend).toBe(expectedConfig.backend);
	}
	if (expectedConfig.database) {
		expect(config.database).toBe(expectedConfig.database);
	}
	if (expectedConfig.orm) {
		expect(config.orm).toBe(expectedConfig.orm);
	}
	if (expectedConfig.api) {
		expect(config.api).toBe(expectedConfig.api);
	}
	if (expectedConfig.runtime) {
		expect(config.runtime).toBe(expectedConfig.runtime);
	}
	if (expectedConfig.addons) {
		expect(config.addons).toEqual(expectedConfig.addons);
	}
}

describe("Programmatic API - Fast Tests", () => {
	beforeEach(async () => {
		originalCwd = process.cwd();
		tmpDir = await createTmpDir();
		process.chdir(tmpDir);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		if (existsSync(tmpDir)) {
			await remove(tmpDir);
		}
	});

	describe("Core functionality", () => {
		test("creates minimal project successfully", async () => {
			const result = await init("test-app", {
				yes: true,
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			expect(result.projectConfig.projectName).toBe("test-app");
			expect(result.projectDirectory).toContain("test-app");
			expect(result.reproducibleCommand).toContain("test-app");
			expect(typeof result.elapsedTimeMs).toBe("number");
			expect(result.elapsedTimeMs).toBeGreaterThan(0);

			assertProjectExists(result.projectDirectory);
		}, 15000);

		test("returns complete result structure", async () => {
			const result = await init("result-test", {
				yes: true,
				install: false,
				git: false,
			});

			expect(result).toHaveProperty("success");
			expect(result).toHaveProperty("projectConfig");
			expect(result).toHaveProperty("reproducibleCommand");
			expect(result).toHaveProperty("timeScaffolded");
			expect(result).toHaveProperty("elapsedTimeMs");
			expect(result).toHaveProperty("projectDirectory");
			expect(result).toHaveProperty("relativePath");
		}, 15000);

		test("handles project with custom name", async () => {
			const result = await init("custom-name", {
				yes: true,
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			expect(result.projectConfig.projectName).toBe("custom-name");
			expect(result.projectDirectory).toContain("custom-name");
		}, 15000);
	});

	describe("Configuration options", () => {
		test("creates project with Next.js frontend", async () => {
			const result = await init("next-app", {
				yes: true,
				frontend: ["next"],
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				frontend: ["next"],
			});
		}, 15000);

		test("creates project with Fastify backend", async () => {
			const result = await init("fastify-app", {
				yes: true,
				backend: "fastify",
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				backend: "fastify",
			});
		}, 15000);

		test("creates project with PostgreSQL + Prisma", async () => {
			const result = await init("pg-app", {
				yes: true,
				database: "postgres",
				orm: "prisma",
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				database: "postgres",
				orm: "prisma",
			});
		}, 15000);

		test("creates project with oRPC API", async () => {
			const result = await init("orpc-app", {
				yes: true,
				api: "orpc",
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				api: "orpc",
			});
		}, 15000);

		test("creates project with Node runtime", async () => {
			const result = await init("node-app", {
				yes: true,
				runtime: "node",
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				runtime: "node",
			});
		}, 15000);

		test("creates project with Biome addon", async () => {
			const result = await init("biome-app", {
				yes: true,
				addons: ["biome"],
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				addons: ["biome"],
			});
		}, 15000);

		test("creates project with analytics disabled", async () => {
			const result = await init("no-analytics-app", {
				yes: true,
				disableAnalytics: true,
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			expect(result.projectConfig.projectName).toBe("no-analytics-app");
		}, 15000);
	});

	describe("Error scenarios", () => {
		test("handles invalid project name", async () => {
			await expect(
				init("", {
					yes: true,
					install: false,
					git: false,
				}),
			).rejects.toThrow("Project name cannot be empty");
		});

		test("handles invalid characters in project name", async () => {
			await expect(
				init("invalid<name>", {
					yes: true,
					install: false,
					git: false,
				}),
			).rejects.toThrow("invalid characters");
		});

		test("handles incompatible database + ORM combination", async () => {
			await expect(
				init("incompatible", {
					yes: true,
					database: "mongodb",
					orm: "drizzle",
					install: false,
					git: false,
					yolo: false,
				}),
			).rejects.toThrow(/Drizzle ORM does not support MongoDB/);
		});

		test("handles auth without database", async () => {
			await expect(
				init("auth-no-db", {
					yes: true,
					auth: true,
					database: "none",
					install: false,
					git: false,
					yolo: false,
				}),
			).rejects.toThrow(/Authentication requires/);
		});

		test("handles directory conflict with error strategy", async () => {
			const result1 = await init("conflict-test", {
				yes: true,
				install: false,
				git: false,
			});

			expect(result1.success).toBe(true);

			const result2 = await init("conflict-test", {
				yes: true,
				install: false,
				git: false,
				directoryConflict: "error",
			});

			expect(result2.success).toBe(false);
			expect(result2.error).toMatch(/already exists/);
		}, 20000);
	});

	describe("Advanced features", () => {
		test("creates project with multiple addons", async () => {
			const result = await init("multi-addon", {
				yes: true,
				addons: ["biome", "turborepo"],
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				addons: ["biome", "turborepo"],
			});
		}, 15000);

		test("creates project with authentication enabled", async () => {
			const result = await init("auth-app", {
				yes: true,
				auth: true,
				database: "sqlite",
				orm: "drizzle",
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			await assertBtsConfig(result.projectDirectory, {
				database: "sqlite",
				orm: "drizzle",
			});
			expect(result.projectConfig.auth).toBe(true);
		}, 15000);

		test("validates reproducible command format", async () => {
			const result = await init("repro-test", {
				yes: true,
				frontend: ["next"],
				backend: "fastify",
				database: "postgres",
				orm: "prisma",
				install: false,
				git: false,
			});

			expect(result.success).toBe(true);
			expect(result.reproducibleCommand).toContain("repro-test");
			expect(result.reproducibleCommand).toContain("--frontend next");
			expect(result.reproducibleCommand).toContain("--backend fastify");
			expect(result.reproducibleCommand).toContain("--database postgres");
			expect(result.reproducibleCommand).toContain("--orm prisma");
			expect(result.reproducibleCommand).toContain("--no-install");
			expect(result.reproducibleCommand).toContain("--no-git");
		}, 15000);
	});
});
