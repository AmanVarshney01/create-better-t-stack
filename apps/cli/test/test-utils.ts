import { rm } from "node:fs/promises";
import { join } from "node:path";
import { createRouterClient } from "@orpc/server";
import { ensureDir } from "fs-extra";
import { expect } from "vitest";
import { router } from "../src/index";
import type { CreateInput, InitResult } from "../src/types";
import {
	AddonsSchema,
	APISchema,
	AuthSchema,
	BackendSchema,
	DatabaseSchema,
	DatabaseSetupSchema,
	ExamplesSchema,
	FrontendSchema,
	ORMSchema,
	PackageManagerSchema,
	PaymentsSchema,
	RuntimeSchema,
	ServerDeploySchema,
	WebDeploySchema,
} from "../src/types";

// Create oRPC caller for direct function calls instead of subprocess
const defaultContext = {};

/**
 * Clean up the entire .smoke directory
 */
export async function cleanupSmokeDirectory() {
	const smokeDir = join(process.cwd(), ".smoke");
	try {
		await rm(smokeDir, { recursive: true, force: true });
	} catch {
		// Ignore cleanup errors
	}
}

export interface TestResult {
	success: boolean;
	result?: InitResult;
	error?: string;
	projectDir?: string;
	config: TestConfig;
}

export interface TestConfig extends CreateInput {
	projectName?: string;
	expectError?: boolean;
	expectedErrorMessage?: string;
}

/**
 * Run tRPC test using direct function calls instead of subprocess
 * This delegates all validation to the CLI's existing logic - much simpler!
 */
export async function runTRPCTest(config: TestConfig): Promise<TestResult> {
	const smokeDir = join(process.cwd(), ".smoke");
	await ensureDir(smokeDir);

	// Store original environment
	const originalProgrammatic = process.env.BTS_PROGRAMMATIC;

	try {
		// Set programmatic mode to ensure errors are thrown instead of process.exit
		process.env.BTS_PROGRAMMATIC = "1";

		const caller = createRouterClient(router, { context: defaultContext });
		const projectName = config.projectName || "default-app";
		const projectPath = join(smokeDir, projectName);

		// Determine if we should use --yes or not
		// Only core stack flags conflict with --yes flag (from CLI error message)
		const coreStackFlags: (keyof TestConfig)[] = [
			"database",
			"orm",
			"backend",
			"runtime",
			"frontend",
			"addons",
			"examples",
			"auth",
			"payments",
			"dbSetup",
			"api",
			"webDeploy",
			"serverDeploy",
		];
		const hasSpecificCoreConfig = coreStackFlags.some(
			(flag) => config[flag] !== undefined,
		);

		// Only use --yes if no core stack flags are provided and not explicitly disabled
		const willUseYesFlag =
			config.yes !== undefined ? config.yes : !hasSpecificCoreConfig;

		// Provide defaults for missing core stack options to avoid prompts
		// But don't provide core stack defaults when yes: true is explicitly set
		const coreStackDefaults = willUseYesFlag
			? {}
			: {
					frontend: ["tanstack-router"] as Frontend[],
					backend: "hono" as Backend,
					runtime: "bun" as Runtime,
					api: "trpc" as API,
					database: "sqlite" as Database,
					orm: "drizzle" as ORM,
					auth: "none" as Auth,
					payments: "none" as Payments,
					addons: ["none"] as Addons[],
					examples: ["none"] as Examples[],
					dbSetup: "none" as DatabaseSetup,
					webDeploy: "none" as WebDeploy,
					serverDeploy: "none" as ServerDeploy,
				};

		// Build options object - let the CLI handle all validation
		const options: CreateInput = {
			renderTitle: false,
			install: config.install ?? false,
			git: config.git ?? true,
			packageManager: config.packageManager ?? "pnpm",
			directoryConflict: "overwrite",
			verbose: true, // Need verbose to get the result
			disableAnalytics: true,
			yes: willUseYesFlag,
			...coreStackDefaults,
			...config,
		};

		// Remove our test-specific properties
		const {
			projectName: _,
			expectError: __,
			expectedErrorMessage: ___,
			...cleanOptions
		} = options as TestConfig;

		const result = await caller.init([projectPath, cleanOptions]);

		return {
			success: result?.success ?? false,
			result: result?.success ? result : undefined,
			error: result?.success ? undefined : result?.error,
			projectDir: result?.success ? result?.projectDirectory : undefined,
			config,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
			config,
		};
	} finally {
		// Always restore original environment
		if (originalProgrammatic === undefined) {
			delete process.env.BTS_PROGRAMMATIC;
		} else {
			process.env.BTS_PROGRAMMATIC = originalProgrammatic;
		}
	}
}

export function expectSuccess(result: TestResult) {
	if (!result.success) {
		console.error("Test failed:");
		console.error("Error:", result.error);
		if (result.result) {
			console.error("Result:", result.result);
		}
	}
	expect(result.success).toBe(true);
	expect(result.result).toBeDefined();
}

export function expectSuccessWithProjectDir(result: TestResult): string {
	expectSuccess(result);
	expect(result.projectDir).toBeDefined();
	return result.projectDir as string;
}

/**
 * Helper functions for generating expected config package references
 */
export function configPackageName(projectName: string): string {
	return `@${projectName}/config`;
}

export function configTsConfigReference(projectName: string): string {
	return `@${projectName}/config/tsconfig.base.json`;
}

/**
 * Comprehensive validation helper for config package setup
 * Validates all expected files and references based on the CreateInput configuration
 */
export async function validateConfigPackageSetup(
	result: TestResult,
): Promise<void> {
	const { pathExists, readFile, readJSON } = await import("fs-extra");
	const { join } = await import("node:path");
	const { expect } = await import("vitest");

	// Extract data from result
	const projectDir = expectSuccessWithProjectDir(result);
	const config = result.config;
	const projectName = config.projectName as string;

	// 1. Config package structure
	expect(await pathExists(join(projectDir, "packages/config"))).toBe(true);

	// 2. Config package.json
	const configPkgJson = await readJSON(
		join(projectDir, "packages/config/package.json"),
	);
	expect(configPkgJson.name).toBe(configPackageName(projectName));
	expect(configPkgJson.private).toBe(true);

	// 3. Config tsconfig.base.json
	const configTsConfigBase = await readJSON(
		join(projectDir, "packages/config/tsconfig.base.json"),
	);
	expect(configTsConfigBase.compilerOptions).toBeDefined();
	expect(configTsConfigBase.compilerOptions.strict).toBe(true);

	// Check runtime-specific types
	if (
		config.runtime === "node" ||
		config.runtime === "workers" ||
		config.runtime === "none"
	) {
		expect(configTsConfigBase.compilerOptions.types).toContain("node");
	} else if (config.runtime === "bun") {
		expect(configTsConfigBase.compilerOptions.types).toContain("bun");
	}

	// 4. Config tsconfig.json
	expect(
		await pathExists(join(projectDir, "packages/config/tsconfig.json")),
	).toBe(true);

	// 5. Root configuration
	expect(await pathExists(join(projectDir, "tsconfig.base.json"))).toBe(false);

	const rootTsConfig = await readFile(
		join(projectDir, "tsconfig.json"),
		"utf-8",
	);
	expect(rootTsConfig).toContain(configTsConfigReference(projectName));

	const rootPkgJson = await readJSON(join(projectDir, "package.json"));
	expect(rootPkgJson.devDependencies[configPackageName(projectName)]).toBe(
		"workspace:*",
	);

	// 6. Workspace packages based on config
	const shouldHaveDb =
		config.database && config.database !== "none" && config.orm !== "none";
	const shouldHaveApi = config.api && config.api !== "none";
	const shouldHaveAuth = config.auth && config.auth !== "none";
	const shouldHaveServer =
		config.backend && !["none", "convex", "self"].includes(config.backend);

	if (shouldHaveDb) {
		const dbTsConfig = await readFile(
			join(projectDir, "packages/db/tsconfig.json"),
			"utf-8",
		);
		expect(dbTsConfig).toContain(configTsConfigReference(projectName));

		const dbPkgJson = await readJSON(
			join(projectDir, "packages/db/package.json"),
		);
		expect(dbPkgJson.devDependencies[configPackageName(projectName)]).toBe(
			"workspace:*",
		);
	}

	if (shouldHaveApi) {
		const apiTsConfig = await readFile(
			join(projectDir, "packages/api/tsconfig.json"),
			"utf-8",
		);
		expect(apiTsConfig).toContain(configTsConfigReference(projectName));

		const apiPkgJson = await readJSON(
			join(projectDir, "packages/api/package.json"),
		);
		expect(apiPkgJson.devDependencies[configPackageName(projectName)]).toBe(
			"workspace:*",
		);
	}

	if (shouldHaveAuth) {
		const authTsConfig = await readFile(
			join(projectDir, "packages/auth/tsconfig.json"),
			"utf-8",
		);
		expect(authTsConfig).toContain(configTsConfigReference(projectName));

		const authPkgJson = await readJSON(
			join(projectDir, "packages/auth/package.json"),
		);
		expect(authPkgJson.devDependencies[configPackageName(projectName)]).toBe(
			"workspace:*",
		);
	}

	if (shouldHaveServer) {
		const serverTsConfig = await readFile(
			join(projectDir, "apps/server/tsconfig.json"),
			"utf-8",
		);
		expect(serverTsConfig).toContain(configTsConfigReference(projectName));

		const serverPkgJson = await readJSON(
			join(projectDir, "apps/server/package.json"),
		);
		expect(serverPkgJson.devDependencies[configPackageName(projectName)]).toBe(
			"workspace:*",
		);
	}
}

/**
 * Validate that turbo prune works correctly for turborepo projects
 * Only runs if the project has turborepo addon enabled
 * Generates lockfile without installing dependencies, then runs turbo prune
 */
export async function validateTurboPrune(result: TestResult): Promise<void> {
	const { expect } = await import("vitest");
	const { execa } = await import("execa");

	// Extract data from result
	const projectDir = expectSuccessWithProjectDir(result);
	const config = result.config;

	// Only run this validation if turborepo addon is enabled
	const hasTurborepo =
		config.addons &&
		Array.isArray(config.addons) &&
		config.addons.includes("turborepo");

	if (!hasTurborepo) {
		return;
	}

	const packageManager = config.packageManager || "pnpm";

	// Generate lockfile without installing dependencies
	try {
		if (packageManager === "pnpm") {
			await execa("pnpm", ["install", "--lockfile-only"], {
				cwd: projectDir,
			});
		} else if (packageManager === "npm") {
			await execa("npm", ["install", "--package-lock-only"], {
				cwd: projectDir,
			});
		} else if (packageManager === "bun") {
			// Bun doesn't have --lockfile-only, so we skip for bun
			// or use bun install which is fast anyway
			await execa("bun", ["install", "--frozen-lockfile"], {
				cwd: projectDir,
				reject: false, // Don't fail if frozen-lockfile doesn't exist
			});
		}
	} catch (error) {
		console.error("Failed to generate lockfile:");
		console.error(error);
		expect.fail(
			`Failed to generate lockfile: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	// Determine package manager command for running turbo
	const command =
		packageManager === "npm"
			? "npx"
			: packageManager === "bun"
				? "bunx"
				: "pnpm";

	// Test turbo prune for both server and web targets
	const targets = ["server", "web"];

	for (const target of targets) {
		const args =
			packageManager === "pnpm"
				? ["dlx", "turbo", "prune", target, "--docker"]
				: ["turbo", "prune", target, "--docker"];

		try {
			await execa(command, args, {
				cwd: projectDir,
			});
		} catch (error) {
			console.error(`turbo prune ${target} failed:`);
			console.error(error);
			expect.fail(
				`turbo prune ${target} --docker failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}

export function expectError(result: TestResult, expectedMessage?: string) {
	expect(result.success).toBe(false);
	if (expectedMessage) {
		expect(result.error).toContain(expectedMessage);
	}
}

// Helper function to create properly typed test configs
export function createTestConfig(
	config: Partial<TestConfig> & { projectName: string },
): TestConfig {
	return config as TestConfig;
}

/**
 * Extract enum values from a Zod enum schema
 */
function extractEnumValues<T extends string>(schema: {
	options: readonly T[];
}): readonly T[] {
	return schema.options;
}

// Inferred types and values from Zod schemas - no duplication with types.ts!
export type PackageManager = (typeof PackageManagerSchema)["options"][number];
export type Database = (typeof DatabaseSchema)["options"][number];
export type ORM = (typeof ORMSchema)["options"][number];
export type Backend = (typeof BackendSchema)["options"][number];
export type Runtime = (typeof RuntimeSchema)["options"][number];
export type Frontend = (typeof FrontendSchema)["options"][number];
export type Addons = (typeof AddonsSchema)["options"][number];
export type Examples = (typeof ExamplesSchema)["options"][number];
export type Auth = (typeof AuthSchema)["options"][number];
export type Payments = (typeof PaymentsSchema)["options"][number];
export type API = (typeof APISchema)["options"][number];
export type WebDeploy = (typeof WebDeploySchema)["options"][number];
export type ServerDeploy = (typeof ServerDeploySchema)["options"][number];
export type DatabaseSetup = (typeof DatabaseSetupSchema)["options"][number];

// Test data generators inferred from Zod schemas
export const PACKAGE_MANAGERS = extractEnumValues(PackageManagerSchema);
export const DATABASES = extractEnumValues(DatabaseSchema);
export const ORMS = extractEnumValues(ORMSchema);
export const BACKENDS = extractEnumValues(BackendSchema);
export const RUNTIMES = extractEnumValues(RuntimeSchema);
export const FRONTENDS = extractEnumValues(FrontendSchema);
export const ADDONS = extractEnumValues(AddonsSchema);
export const EXAMPLES = extractEnumValues(ExamplesSchema);
export const AUTH_PROVIDERS = extractEnumValues(AuthSchema);
export const PAYMENTS_PROVIDERS = extractEnumValues(PaymentsSchema);
export const API_TYPES = extractEnumValues(APISchema);
export const WEB_DEPLOYS = extractEnumValues(WebDeploySchema);
export const SERVER_DEPLOYS = extractEnumValues(ServerDeploySchema);
export const DB_SETUPS = extractEnumValues(DatabaseSetupSchema);

// Convenience functions for common test patterns
export function createBasicConfig(
	overrides: Partial<TestConfig> = {},
): TestConfig {
	return {
		projectName: "test-app",
		yes: true, // Use defaults
		install: false,
		git: true,
		...overrides,
	};
}

export function createCustomConfig(config: Partial<TestConfig>): TestConfig {
	return {
		projectName: "test-app",
		install: false,
		git: true,
		...config,
	};
}
