import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { expect } from "bun:test";
import { create, type CreateOptions, type CreateResult } from "../src/api";
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
  result?: CreateResult;
  error?: string;
  projectDir?: string;
  config: TestConfig;
}

export interface TestConfig extends CreateOptions {
  projectName?: string;
  expectError?: boolean;
  expectedErrorMessage?: string;
}

/**
 * Run test using the new create() API
 * This is much simpler than the old BTS_PROGRAMMATIC approach!
 */
export async function runTRPCTest(config: TestConfig): Promise<TestResult> {
  // Ensure smoke directory exists
  try {
    await mkdir(SMOKE_DIR_PATH, { recursive: true });
  } catch {
    // Directory may already exist
  }

  try {
    // Suppress console output
    suppressConsole();

    const projectName = config.projectName || "default-app";
    const projectPath = join(SMOKE_DIR_PATH, projectName);

    // Use the new clean create() API
    const result = await create({
      projectName: projectPath,
      defaults: config.defaults ?? true,
      frontend: config.frontend,
      backend: config.backend,
      runtime: config.runtime,
      database: config.database,
      orm: config.orm,
      auth: config.auth,
      payments: config.payments,
      api: config.api,
      addons: config.addons,
      examples: config.examples,
      dbSetup: config.dbSetup,
      webDeploy: config.webDeploy,
      serverDeploy: config.serverDeploy,
      git: config.git ?? true,
      packageManager: config.packageManager ?? "bun",
      install: config.install ?? false,
    });

    return {
      success: result.success,
      result: result.success ? result : undefined,
      error: result.success ? undefined : result.error,
      projectDir: result.success ? result.projectDirectory : undefined,
      config,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      config,
    };
  } finally {
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
    defaults: true,
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
