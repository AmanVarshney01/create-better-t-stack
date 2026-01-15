/**
 * Astro Combination Testing Script
 *
 * This script tests all valid Astro configuration combinations
 * to ensure they work correctly with the CLI.
 *
 * Run with: bun run apps/cli/scripts/test-astro-combinations.ts
 */

import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

import type { CreateInput } from "../src/types";

import { create } from "../src/index";

// ============================================
// Types
// ============================================

interface TestConfig extends Partial<CreateInput> {
  projectName: string;
}

interface TestResult {
  config: TestConfig;
  success: boolean;
  error?: string;
  duration: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  failedTests: TestResult[];
}

// ============================================
// Configuration Constants
// ============================================

const ASTRO_INTEGRATIONS = ["react", "vue", "svelte", "solid", "none"] as const;
const BACKENDS = ["hono", "express", "fastify", "elysia", "self", "none"] as const;
const DATABASES = ["sqlite", "postgres", "mysql", "none"] as const;
const APIS = ["trpc", "orpc", "none"] as const;
const RUNTIMES = ["bun", "node"] as const;

const SMOKE_DIR = join(import.meta.dir, "..", ".smoke-astro-combos");

// ============================================
// Compatibility Rules
// ============================================

function isValidCombination(config: TestConfig): { valid: boolean; reason?: string } {
  const { astroIntegration, backend, api, runtime } = config;

  // tRPC requires React integration with Astro
  if (api === "trpc" && astroIntegration !== "react") {
    return { valid: false, reason: "tRPC requires React integration with Astro" };
  }

  // Self backend requires no runtime
  if (backend === "self" && runtime !== "none") {
    return { valid: false, reason: "Self backend requires runtime 'none'" };
  }

  // No backend means no API, database, orm
  if (backend === "none" && api !== "none") {
    return { valid: false, reason: "No backend means no API" };
  }

  // Non-self backends require a runtime
  if (backend !== "self" && backend !== "none" && !runtime) {
    return { valid: false, reason: "Backend requires a runtime" };
  }

  return { valid: true };
}

// ============================================
// Test Generation
// ============================================

function generateValidCombinations(): TestConfig[] {
  const combinations: TestConfig[] = [];
  let counter = 0;

  for (const astroIntegration of ASTRO_INTEGRATIONS) {
    for (const backend of BACKENDS) {
      for (const database of DATABASES) {
        for (const api of APIS) {
          // Skip invalid: backend none should have database none and api none
          if (backend === "none" && (database !== "none" || api !== "none")) {
            continue;
          }

          // Skip invalid: tRPC requires React
          if (api === "trpc" && astroIntegration !== "react") {
            continue;
          }

          // Determine runtime based on backend
          const runtime = backend === "self" || backend === "none" ? "none" : "bun";

          // Determine ORM based on database
          let orm: "drizzle" | "prisma" | "mongoose" | "none" = "none";
          if (database !== "none") {
            orm = database === "mongodb" ? "prisma" : "drizzle";
          }

          counter++;
          const config: TestConfig = {
            projectName: `astro-combo-${counter}`,
            frontend: ["astro"],
            astroIntegration,
            backend: backend as CreateInput["backend"],
            runtime: runtime as CreateInput["runtime"],
            database: database as CreateInput["database"],
            orm,
            api: api as CreateInput["api"],
            auth: "none",
            payments: "none",
            addons: ["none"],
            examples: ["none"],
            dbSetup: "none",
            webDeploy: "none",
            serverDeploy: "none",
            install: false,
            git: true,
            packageManager: "bun",
            directoryConflict: "overwrite",
            disableAnalytics: true,
          };

          const validation = isValidCombination(config);
          if (validation.valid) {
            combinations.push(config);
          }
        }
      }
    }
  }

  return combinations;
}

// ============================================
// Test Runner
// ============================================

async function runSingleTest(config: TestConfig): Promise<TestResult> {
  const startTime = Date.now();
  const projectPath = join(SMOKE_DIR, config.projectName);

  try {
    const result = await create(projectPath, config);

    return {
      config,
      success: result.success,
      error: result.success ? undefined : result.error,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      config,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime,
    };
  }
}

async function runTestsWithConcurrency(
  configs: TestConfig[],
  concurrency: number,
  onProgress?: (completed: number, total: number) => void,
): Promise<TestResult[]> {
  const results: TestResult[] = [];
  let completed = 0;

  // Process in batches
  for (let i = 0; i < configs.length; i += concurrency) {
    const batch = configs.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(runSingleTest));

    results.push(...batchResults);
    completed += batch.length;

    if (onProgress) {
      onProgress(completed, configs.length);
    }
  }

  return results;
}

// ============================================
// Output Formatting
// ============================================

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function printProgress(completed: number, total: number): void {
  const percent = Math.round((completed / total) * 100);
  const bar = "█".repeat(Math.floor(percent / 2)) + "░".repeat(50 - Math.floor(percent / 2));
  process.stdout.write(`\r[${bar}] ${percent}% (${completed}/${total})`);
}

function printSummary(summary: TestSummary): void {
  console.log("\n\n" + "=".repeat(60));
  console.log("TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total tests:    ${summary.total}`);
  console.log(`Passed:         ${summary.passed} ✅`);
  console.log(`Failed:         ${summary.failed} ❌`);
  console.log(`Skipped:        ${summary.skipped} ⏭️`);
  console.log(`Total duration: ${formatDuration(summary.duration)}`);
  console.log("=".repeat(60));

  if (summary.failedTests.length > 0) {
    console.log("\nFAILED TESTS:");
    console.log("-".repeat(60));

    for (const test of summary.failedTests) {
      console.log(`\n❌ ${test.config.projectName}`);
      console.log(`   Integration: ${test.config.astroIntegration}`);
      console.log(`   Backend: ${test.config.backend}`);
      console.log(`   Database: ${test.config.database}`);
      console.log(`   API: ${test.config.api}`);
      console.log(`   Error: ${test.error}`);
    }
  }
}

// ============================================
// Main Entry Point
// ============================================

async function main() {
  console.log("🚀 Astro Combination Testing Script");
  console.log("=".repeat(60));

  // Setup
  console.log("\n📁 Setting up test directory...");
  try {
    await rm(SMOKE_DIR, { recursive: true, force: true });
  } catch {
    // Ignore if doesn't exist
  }
  await mkdir(SMOKE_DIR, { recursive: true });

  // Generate combinations
  console.log("\n📊 Generating valid combinations...");
  const combinations = generateValidCombinations();
  console.log(`   Found ${combinations.length} valid combinations to test`);

  // Run tests
  console.log("\n🧪 Running tests (concurrency: 3)...\n");
  const startTime = Date.now();

  const results = await runTestsWithConcurrency(combinations, 3, (completed, total) => {
    printProgress(completed, total);
  });

  const totalDuration = Date.now() - startTime;

  // Calculate summary
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const failedTests = results.filter((r) => !r.success);

  const summary: TestSummary = {
    total: combinations.length,
    passed,
    failed,
    skipped: 0,
    duration: totalDuration,
    failedTests,
  };

  // Print summary
  printSummary(summary);

  // Cleanup
  console.log("\n🧹 Cleaning up test directory...");
  try {
    await rm(SMOKE_DIR, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
