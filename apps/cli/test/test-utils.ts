import { expect } from "bun:test";
import { join } from "node:path";

import { create } from "../src/index";
import type { CreateInput, InitResult } from "../src/types";
import { PackageManagerSchema, ServerDeploySchema, WebDeploySchema } from "../src/types";
import { SMOKE_DIR } from "./setup";
import { assertWorkspaceGraph } from "./workspace-graph";

export type TestConfig = CreateInput;

export interface TestResult {
  success: boolean;
  result?: InitResult;
  error?: string;
  projectDir?: string;
}

const defaultStack = {
  frontend: ["tanstack-router"],
  backend: "hono",
  runtime: "bun",
  api: "trpc",
  database: "sqlite",
  orm: "drizzle",
  auth: "none",
  payments: "none",
  addons: ["none"],
  examples: ["none"],
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
} satisfies CreateInput;

export async function runCreateTest({
  projectName = "default-app",
  ...config
}: TestConfig): Promise<TestResult> {
  const yes = config.yes ?? false;
  const result = await create(join(SMOKE_DIR, projectName), {
    install: false,
    git: false,
    packageManager: "bun",
    directoryConflict: "overwrite",
    disableAnalytics: true,
    yes,
    ...(yes ? undefined : defaultStack),
    ...config,
  });

  if (result.isErr()) return { success: false, error: result.error.message };

  if (!config.dryRun) await assertWorkspaceGraph(result.value.projectDirectory);
  return {
    success: true,
    result: result.value,
    projectDir: result.value.projectDirectory,
  };
}

export function expectSuccess(
  result: TestResult,
): asserts result is TestResult & { success: true; result: InitResult; projectDir: string } {
  if (!result.success) throw new Error(result.error ?? "Project creation failed");
  expect(result.result).toBeDefined();
  expect(result.projectDir).toBeDefined();
}

export function expectError(result: TestResult, expectedMessage?: string) {
  expect(result.success).toBe(false);
  if (expectedMessage) expect(result.error).toContain(expectedMessage);
}

export const PACKAGE_MANAGERS = PackageManagerSchema.options;
export const WEB_DEPLOYS = WebDeploySchema.options;
export const SERVER_DEPLOYS = ServerDeploySchema.options;
