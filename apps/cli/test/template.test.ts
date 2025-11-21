import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	getTemplateConfig,
	getTemplateDescription,
	listAvailableTemplates,
	TEMPLATE_PRESETS,
} from "../src/utils/templates";
import {
	cleanupSmokeDirectory,
	createTestConfig,
	expectSuccess,
	expectSuccessWithProjectDir,
	runTRPCTest,
} from "./test-utils";

describe("Template Functionality", () => {
	beforeAll(async () => {
		await cleanupSmokeDirectory();
	});

	afterAll(async () => {
		await cleanupSmokeDirectory();
	});

	describe("Template Configuration", () => {
		it("should have configurations for all templates", () => {
			const templates = listAvailableTemplates();
			expect(templates.length).toBeGreaterThan(0);

			for (const template of templates) {
				const config = TEMPLATE_PRESETS[template];
				expect(config).toBeDefined();
				expect(config).not.toBeNull();
			}
		});

		it("should return null for 'none' template", () => {
			const config = getTemplateConfig("none");
			expect(config).toBeNull();
		});

		it("should have descriptions for all templates", () => {
			const templates = listAvailableTemplates();

			for (const template of templates) {
				const description = getTemplateDescription(template);
				expect(description).toBeDefined();
				expect(description.length).toBeGreaterThan(0);
			}
		});

		it("should have valid configuration structure", () => {
			const mernConfig = getTemplateConfig("mern");
			expect(mernConfig).toBeDefined();
			expect(mernConfig).toHaveProperty("database");
			expect(mernConfig).toHaveProperty("orm");
			expect(mernConfig).toHaveProperty("backend");
			expect(mernConfig).toHaveProperty("runtime");
			expect(mernConfig).toHaveProperty("frontend");
			expect(mernConfig).toHaveProperty("api");
			expect(mernConfig).toHaveProperty("auth");
			expect(mernConfig).toHaveProperty("payments");
			expect(mernConfig).toHaveProperty("addons");
			expect(mernConfig).toHaveProperty("examples");
			expect(mernConfig).toHaveProperty("git");
			expect(mernConfig).toHaveProperty("install");
			expect(mernConfig).toHaveProperty("dbSetup");
		});
	});

	describe("MERN Template", () => {
		it("should scaffold MERN stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "mern-test",
					template: "mern",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.database).toBe("mongodb");
			expect(result.result?.projectConfig.orm).toBe("mongoose");
			expect(result.result?.projectConfig.backend).toBe("express");
			expect(result.result?.projectConfig.runtime).toBe("node");
			expect(result.result?.projectConfig.frontend).toContain(
				"tanstack-router",
			);
		});
	});

	describe("T3 Stack Template", () => {
		it("should scaffold T3 stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "t3-test",
					template: "t3",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.database).toBe("postgres");
			expect(result.result?.projectConfig.orm).toBe("drizzle");
			expect(result.result?.projectConfig.backend).toBe("none");
			expect(result.result?.projectConfig.frontend).toContain("next");
			expect(result.result?.projectConfig.api).toBe("trpc");
			expect(result.result?.projectConfig.auth).toBe("better-auth");
		});
	});

	describe("Convex Templates", () => {
		it("should scaffold Convex React stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "convex-react-test",
					template: "convex-react",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.backend).toBe("convex");
			expect(result.result?.projectConfig.database).toBe("none");
			expect(result.result?.projectConfig.orm).toBe("none");
			expect(result.result?.projectConfig.frontend).toContain(
				"tanstack-router",
			);
			expect(result.result?.projectConfig.auth).toBe("better-auth");
		});

		it("should scaffold Convex Next.js stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "convex-next-test",
					template: "convex-next",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.backend).toBe("convex");
			expect(result.result?.projectConfig.frontend).toContain("next");
			expect(result.result?.projectConfig.auth).toBe("better-auth");
		});
	});

	describe("Modern Stack Templates", () => {
		it("should scaffold Hono React stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "hono-react-test",
					template: "hono-react",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.backend).toBe("hono");
			expect(result.result?.projectConfig.runtime).toBe("bun");
			expect(result.result?.projectConfig.database).toBe("sqlite");
			expect(result.result?.projectConfig.orm).toBe("drizzle");
			expect(result.result?.projectConfig.api).toBe("trpc");
		});

		it("should scaffold Elysia React stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "elysia-react-test",
					template: "elysia-react",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.backend).toBe("elysia");
			expect(result.result?.projectConfig.runtime).toBe("bun");
			expect(result.result?.projectConfig.database).toBe("sqlite");
		});
	});

	describe("Minimal Template", () => {
		it("should scaffold minimal stack correctly", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "minimal-test",
					template: "minimal",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(projectDir)).toBe(true);
			expect(result.result?.projectConfig.database).toBe("none");
			expect(result.result?.projectConfig.orm).toBe("none");
			expect(result.result?.projectConfig.auth).toBe("none");
			expect(result.result?.projectConfig.backend).toBe("hono");
			expect(result.result?.projectConfig.frontend).toContain(
				"tanstack-router",
			);
		});
	});

	describe("Template Override", () => {
		it("should allow overriding template options", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "override-test",
					template: "mern",
					auth: "better-auth",
				}),
			);

			expectSuccess(result);
			expect(result.result?.projectConfig.database).toBe("mongodb");
			expect(result.result?.projectConfig.auth).toBe("better-auth");
		});

		it("should allow overriding frontend in template", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "frontend-override-test",
					template: "hono-react",
					frontend: ["next"],
				}),
			);

			expectSuccess(result);
			expect(result.result?.projectConfig.backend).toBe("hono");
			expect(result.result?.projectConfig.frontend).toContain("next");
		});
	});

	describe("Template File Structure", () => {
		it("should create correct file structure for MERN template", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "mern-structure-test",
					template: "mern",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(join(projectDir, "package.json"))).toBe(true);
			expect(existsSync(join(projectDir, "packages/db"))).toBe(true);
			expect(existsSync(join(projectDir, "apps/server"))).toBe(true);
			expect(existsSync(join(projectDir, "apps/web"))).toBe(true);
		});

		it("should create correct file structure for Convex template", async () => {
			const result = await runTRPCTest(
				createTestConfig({
					projectName: "convex-structure-test",
					template: "convex-react",
				}),
			);

			expectSuccess(result);
			const projectDir = expectSuccessWithProjectDir(result);

			expect(existsSync(join(projectDir, "package.json"))).toBe(true);
			expect(existsSync(join(projectDir, "convex"))).toBe(true);
			expect(existsSync(join(projectDir, "apps/web"))).toBe(true);
			expect(existsSync(join(projectDir, "packages/db"))).toBe(false);
		});
	});
});
