import { expect } from "bun:test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import type {
  CreateInput,
  InitResult,
  Database,
  ORM,
  Backend,
  Runtime,
  Frontend,
  Addons,
  Examples,
  Auth,
  Payments,
  API,
  WebDeploy,
  ServerDeploy,
  DatabaseSetup,
  CSSFramework,
  UILibrary,
  Effect,
  Email,
  StateManagement,
  Forms,
  Testing,
  Validation,
  Realtime,
  Animation,
  FileUpload,
  Logging,
  Observability,
  CMS,
  Caching,
  Ecosystem,
  AI,
  JobQueue,
} from "../src/types";

import { create } from "../src/index";
import {
  AddonsSchema,
  AISchema,
  AnimationSchema,
  APISchema,
  AstroIntegrationSchema,
  AuthSchema,
  BackendSchema,
  CMSSchema,
  CSSFrameworkSchema,
  DatabaseSchema,
  DatabaseSetupSchema,
  EcosystemSchema,
  EffectSchema,
  ExamplesSchema,
  FileUploadSchema,
  LoggingSchema,
  ObservabilitySchema,
  CachingSchema,
  FormsSchema,
  FrontendSchema,
  ORMSchema,
  PackageManagerSchema,
  PaymentsSchema,
  RealtimeSchema,
  RuntimeSchema,
  ServerDeploySchema,
  StateManagementSchema,
  TestingSchema,
  UILibrarySchema,
  ValidationSchema,
  WebDeploySchema,
  RustWebFrameworkSchema,
  RustFrontendSchema,
  RustOrmSchema,
  RustApiSchema,
  RustCliSchema,
  RustLibrariesSchema,
} from "../src/types";

// Smoke directory path - use the same as setup.ts
const SMOKE_DIR_PATH = join(import.meta.dir, "..", ".smoke");

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
 * Run test using the programmatic create() API instead of the router.
 * The create() API runs in silent mode and returns JSON instead of calling process.exit().
 */
export async function runTRPCTest(config: TestConfig): Promise<TestResult> {
  // Ensure smoke directory exists (may be called before global setup in some cases)
  try {
    await mkdir(SMOKE_DIR_PATH, { recursive: true });
  } catch {
    // Directory may already exist
  }

  const projectName = config.projectName || "default-app";
  const projectPath = join(SMOKE_DIR_PATH, projectName);

  // Determine if we should use --yes or not
  // Only core stack flags conflict with --yes flag (from CLI error message)
  const coreStackFlags: (keyof TestConfig)[] = [
    "ecosystem",
    "database",
    "orm",
    "backend",
    "runtime",
    "frontend",
    "astroIntegration",
    "addons",
    "examples",
    "auth",
    "payments",
    "email",
    "fileUpload",
    "dbSetup",
    "api",
    "webDeploy",
    "serverDeploy",
    "cssFramework",
    "uiLibrary",
    "effect",
    "stateManagement",
    "forms",
    "testing",
    "validation",
    "realtime",
    "animation",
    "logging",
    "observability",
    "caching",
    "cms",
    "ai",
    "jobQueue",
  ];
  const hasSpecificCoreConfig = coreStackFlags.some((flag) => config[flag] !== undefined);

  // Only use --yes if no core stack flags are provided and not explicitly disabled
  const willUseYesFlag = config.yes !== undefined ? config.yes : !hasSpecificCoreConfig;

  // Provide defaults for missing core stack options to avoid prompts
  // But don't provide core stack defaults when yes: true is explicitly set
  const coreStackDefaults = willUseYesFlag
    ? {}
    : {
        ecosystem: "typescript" as Ecosystem,
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
        cssFramework: "tailwind" as CSSFramework,
        // Use "none" as default - compatible with all frontends
        // Tests for specific UI libraries should specify explicitly
        uiLibrary: "none" as UILibrary,
        effect: "none" as Effect,
        email: "none" as Email,
        fileUpload: "none" as FileUpload,
        stateManagement: "none" as StateManagement,
        forms: "react-hook-form" as Forms,
        testing: "vitest" as Testing,
        validation: "zod" as Validation,
        realtime: "none" as Realtime,
        animation: "none" as Animation,
        logging: "none" as Logging,
        observability: "none" as Observability,
        caching: "none" as Caching,
        cms: "none" as CMS,
        ai: "none" as AI,
        jobQueue: "none" as JobQueue,
      };

  // Build options object - let the CLI handle all validation
  // Remove test-specific properties before passing to create()
  const { projectName: _, expectError: __, expectedErrorMessage: ___, ...restConfig } = config;

  const options: Partial<CreateInput> = {
    install: config.install ?? false,
    git: config.git ?? true,
    packageManager: config.packageManager ?? "bun",
    directoryConflict: "overwrite",
    disableAnalytics: true,
    yes: willUseYesFlag,
    // Always provide ecosystem to avoid prompting (it's required for all tests)
    ecosystem: config.ecosystem ?? ("typescript" as Ecosystem),
    ...coreStackDefaults,
    ...restConfig,
  };

  // Use the programmatic create() API which runs in silent mode
  // and returns JSON errors instead of calling process.exit()
  const result = await create(projectPath, options);

  return {
    success: result.success,
    result: result.success ? result : undefined,
    error: result.success ? undefined : result.error,
    projectDir: result.success ? result.projectDirectory : undefined,
    config,
  };
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

// Test data generators inferred from Zod schemas
export const PACKAGE_MANAGERS = extractEnumValues(PackageManagerSchema);
export const DATABASES = extractEnumValues(DatabaseSchema);
export const ORMS = extractEnumValues(ORMSchema);
export const BACKENDS = extractEnumValues(BackendSchema);
export const RUNTIMES = extractEnumValues(RuntimeSchema);
export const FRONTENDS = extractEnumValues(FrontendSchema);
export const ASTRO_INTEGRATIONS = extractEnumValues(AstroIntegrationSchema);
export const ADDONS = extractEnumValues(AddonsSchema);
export const EXAMPLES = extractEnumValues(ExamplesSchema);
export const AUTH_PROVIDERS = extractEnumValues(AuthSchema);
export const PAYMENTS_PROVIDERS = extractEnumValues(PaymentsSchema);
export const API_TYPES = extractEnumValues(APISchema);
export const WEB_DEPLOYS = extractEnumValues(WebDeploySchema);
export const SERVER_DEPLOYS = extractEnumValues(ServerDeploySchema);
export const DB_SETUPS = extractEnumValues(DatabaseSetupSchema);
export const CSS_FRAMEWORKS = extractEnumValues(CSSFrameworkSchema);
export const UI_LIBRARIES = extractEnumValues(UILibrarySchema);
export const EFFECTS = extractEnumValues(EffectSchema);
export const STATE_MANAGEMENTS = extractEnumValues(StateManagementSchema);
export const FORMS = extractEnumValues(FormsSchema);
export const TESTINGS = extractEnumValues(TestingSchema);
export const VALIDATIONS = extractEnumValues(ValidationSchema);
export const REALTIMES = extractEnumValues(RealtimeSchema);
export const ANIMATIONS = extractEnumValues(AnimationSchema);
export const FILE_UPLOADS = extractEnumValues(FileUploadSchema);
export const LOGGINGS = extractEnumValues(LoggingSchema);
export const OBSERVABILITIES = extractEnumValues(ObservabilitySchema);
export const AI_SDKS = extractEnumValues(AISchema);
export const CMS_OPTIONS = extractEnumValues(CMSSchema);
export const CACHINGS = extractEnumValues(CachingSchema);
export const ECOSYSTEMS = extractEnumValues(EcosystemSchema);
export const RUST_WEB_FRAMEWORKS = extractEnumValues(RustWebFrameworkSchema);
export const RUST_FRONTENDS = extractEnumValues(RustFrontendSchema);
export const RUST_ORMS = extractEnumValues(RustOrmSchema);
export const RUST_APIS = extractEnumValues(RustApiSchema);
export const RUST_CLIS = extractEnumValues(RustCliSchema);
export const RUST_LIBRARIES = extractEnumValues(RustLibrariesSchema);

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
