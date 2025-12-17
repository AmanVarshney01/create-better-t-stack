import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createRouterClient } from "@orpc/server";
import { expect } from "bun:test";
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

// Re-export setup utilities for backward compatibility
export { cleanupSmokeDirectory, ensureSmokeDirectory, SMOKE_DIR } from "./setup";

// Smoke directory path - use the same as setup.ts
const SMOKE_DIR_PATH = join(import.meta.dir, "..", ".smoke");

// Create oRPC caller for direct function calls instead of subprocess
const defaultContext = {};

// Store original console methods to prevent race conditions when restoring
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

let suppressionCount = 0;

function suppressConsole() {
  if (suppressionCount === 0) {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
    process.stdout.write = (() => true) as any;
    process.stderr.write = (() => true) as any;
  }
  suppressionCount++;
}

function restoreConsole() {
  suppressionCount--;
  if (suppressionCount <= 0) {
    suppressionCount = 0;
    console.log = originalConsoleLog;
    console.info = originalConsoleInfo;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
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
  // Ensure smoke directory exists (may be called before global setup in some cases)
  try {
    await mkdir(SMOKE_DIR_PATH, { recursive: true });
  } catch {
    // Directory may already exist
  }

  // Store original environment
  const originalProgrammatic = process.env.BTS_PROGRAMMATIC;

  try {
    // Set programmatic mode to ensure errors are thrown instead of process.exit
    process.env.BTS_PROGRAMMATIC = "1";

    // Suppress console output
    suppressConsole();

    const caller = createRouterClient(router, { context: defaultContext });
    const projectName = config.projectName || "default-app";
    const projectPath = join(SMOKE_DIR_PATH, projectName);

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
    const hasSpecificCoreConfig = coreStackFlags.some((flag) => config[flag] !== undefined);

    // Only use --yes if no core stack flags are provided and not explicitly disabled
    const willUseYesFlag = config.yes !== undefined ? config.yes : !hasSpecificCoreConfig;

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
      packageManager: config.packageManager ?? "bun",
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

    // Restore console methods
    restoreConsole();
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
function extractEnumValues<T extends string>(schema: { options: readonly T[] }): readonly T[] {
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
export function createBasicConfig(overrides: Partial<TestConfig> = {}): TestConfig {
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
