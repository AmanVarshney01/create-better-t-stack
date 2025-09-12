import { describe, expect, it } from "vitest";
import {
	expectError,
	expectSuccess,
	PACKAGE_MANAGERS,
	runTRPCTest,
} from "./test-utils";

describe("Basic Configurations", () => {
	describe("Default Configuration", () => {
		it("should create project with --yes flag (default config)", async () => {
			const result = await runTRPCTest({
				projectName: "default-app",
				yes: true,
				install: false,
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.projectName).toBe("default-app");
		});

		it("should create project with explicit default values", async () => {
			const result = await runTRPCTest({
				projectName: "explicit-defaults",
				database: "sqlite",
				orm: "drizzle",
				backend: "hono",
				runtime: "bun",
				frontend: ["tanstack-router"],
				auth: "better-auth",
				api: "trpc",
				addons: ["turborepo"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false, // Skip installation for faster tests
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.projectName).toBe(
				"explicit-defaults",
			);
		});
	});

	describe("Package Managers", () => {
		for (const packageManager of PACKAGE_MANAGERS) {
			it(`should work with ${packageManager}`, async () => {
				const result = await runTRPCTest({
					projectName: `${packageManager}-app`,
					packageManager,
					yes: true,
					install: false,
				});

				expectSuccess(result);
				expect(result.result?.projectConfig.packageManager).toBe(
					packageManager,
				);
			});
		}
	});

	describe("Git Options", () => {
		it("should work with git enabled", async () => {
			const result = await runTRPCTest({
				projectName: "git-enabled",
				yes: true,
				git: true,
				install: false,
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.git).toBe(true);
		});

		it("should work with git disabled", async () => {
			const result = await runTRPCTest({
				projectName: "git-disabled",
				yes: true,
				git: false,
				install: false,
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.git).toBe(false);
		});
	});

	describe("Installation Options", () => {
		it("should work with install enabled", async () => {
			const result = await runTRPCTest({
				projectName: "install-enabled",
				yes: true,
				install: true,
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.install).toBe(true);
		});

		it("should work with install disabled", async () => {
			const result = await runTRPCTest({
				projectName: "install-disabled",
				yes: true,
				install: false,
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.install).toBe(false);
		});
	});

	describe("YOLO Mode", () => {
		it("should bypass validations with --yolo flag", async () => {
			// This would normally fail validation but should pass with yolo
			const result = await runTRPCTest({
				projectName: "yolo-app",
				yolo: true,
				frontend: ["tanstack-router"],
				backend: "hono",
				runtime: "bun",
				api: "trpc",
				database: "mongodb",
				orm: "drizzle", // Incompatible combination
				auth: "better-auth",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				install: false,
			});

			expectSuccess(result);
			expect(result.result?.projectConfig.projectName).toBe("yolo-app");
		});
	});

	describe("Error Handling", () => {
		it("should fail with invalid project name", async () => {
			const result = await runTRPCTest({
				projectName: "<invalid>",
				expectError: true,
			});

			expectError(result, "invalid characters");
		});

		it("should fail when combining --yes with configuration flags", async () => {
			const result = await runTRPCTest({
				projectName: "yes-with-flags",
				yes: true, // Explicitly set yes flag
				database: "postgres",
				orm: "drizzle",
				backend: "hono",
				runtime: "bun",
				frontend: ["tanstack-router"],
				auth: "better-auth",
				api: "trpc",
				addons: ["none"],
				examples: ["none"],
				dbSetup: "none",
				webDeploy: "none",
				serverDeploy: "none",
				expectError: true,
			});

			expectError(
				result,
				"Cannot combine --yes with core stack configuration flags",
			);
		});
	});
});
