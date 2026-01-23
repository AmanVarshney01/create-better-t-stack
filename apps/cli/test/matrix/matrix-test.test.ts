/**
 * Matrix Testing Suite
 *
 * Validates ALL valid frontend × backend × database × ORM combinations
 * by programmatically generating valid combinations from compatibility rules,
 * then validating each generated template.
 *
 * Run with: bun test ./test/matrix/matrix-test.test.ts
 *
 * Test Tiers:
 * - Tier 1: Frontend × Backend × Database × ORM (core stack)
 * - Tier 2: Tier 1 + API variations
 * - Tier 3: Tier 2 + Auth variations
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";

import { createVirtual } from "../../src/index";
import {
  validateAllTypeScriptFiles,
  validateAllJSONFiles,
  checkAllFilesForHandlebars,
  validateAllVueFiles,
  validateAllSvelteFiles,
  formatValidationErrors,
  resetSharedProject,
  disposeSharedProject,
  type ValidationResult,
} from "../validation-utils";
import {
  generateValidCombinations,
  generateTier1Combinations,
  getCombinationStats,
  printCombinationSummary,
  type MatrixCombination,
} from "./combination-generator";

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

/**
 * Configure which tier to test
 * - Tier 1: ~1451 combinations
 * - Tier 2: ~5588 combinations (with API variations)
 * - Tier 3: ~16579 combinations (with Auth variations)
 *
 * Performance modes:
 * - full: Run all combinations (slow, thorough)
 * - fast: Run batched tests with parallel validation (faster)
 * - sample: Only test representative subset (~5-10% of combinations)
 */
const TEST_CONFIG = {
  /** Run Tier 1 tests (core stack) */
  tier1: true,
  /** Run Tier 2 tests (+ API variations) */
  tier2: false,
  /** Run Tier 3 tests (+ Auth variations) */
  tier3: false,
  /** Print detailed stats before running tests */
  printStats: true,
  /** Log each combination as it's tested */
  verbose: false,

  // ============== PERFORMANCE OPTIONS ==============
  /**
   * Test mode:
   * - "full": Individual test per combination (most verbose output)
   * - "batched": Group combinations into batches for parallel validation
   * - "sample": Only test a representative sample (~10% of combinations)
   */
  mode: (process.env.MATRIX_MODE as "full" | "batched" | "sample") || "batched",

  /** Batch size for "batched" mode - smaller = less memory usage */
  batchSize: Number(process.env.MATRIX_BATCH_SIZE) || 20,

  /** Sample percentage for "sample" mode (0.1 = 10%) */
  samplePercent: Number(process.env.MATRIX_SAMPLE) || 0.1,

  /** Concurrent validations within a batch - lower = less memory */
  concurrency: Number(process.env.MATRIX_CONCURRENCY) || 5,
};

// ============================================================================
// TEST TRACKING
// ============================================================================

interface TestStats {
  passed: number;
  failed: number;
  skipped: number;
  failedCombinations: string[];
  startTime: number;
  endTime?: number;
}

const stats: TestStats = {
  passed: 0,
  failed: 0,
  skipped: 0,
  failedCombinations: [],
  startTime: Date.now(),
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate a single combination using createVirtual
 */
async function validateCombination(combo: MatrixCombination): Promise<{
  success: boolean;
  ts: ValidationResult;
  json: ValidationResult;
  handlebars: ValidationResult;
  vue: ValidationResult;
  svelte: ValidationResult;
  error?: string;
}> {
  try {
    const result = await createVirtual({
      projectName: `matrix-${combo.id}`,
      ecosystem: "typescript",
      frontend: combo.frontend,
      backend: combo.backend,
      database: combo.database,
      orm: combo.orm,
      api: combo.api,
      auth: combo.auth,
      runtime: combo.runtime,
      astroIntegration: combo.astroIntegration,
    });

    if (!result.success || !result.tree) {
      return {
        success: false,
        ts: {
          valid: false,
          errors: [{ file: "N/A", type: "syntax", message: result.error || "Generation failed" }],
        },
        json: { valid: true, errors: [] },
        handlebars: { valid: true, errors: [] },
        vue: { valid: true, errors: [] },
        svelte: { valid: true, errors: [] },
        error: result.error,
      };
    }

    return {
      success: true,
      ts: validateAllTypeScriptFiles(result.tree),
      json: validateAllJSONFiles(result.tree),
      handlebars: checkAllFilesForHandlebars(result.tree),
      vue: validateAllVueFiles(result.tree),
      svelte: validateAllSvelteFiles(result.tree),
    };
  } catch (error) {
    return {
      success: false,
      ts: {
        valid: false,
        errors: [
          {
            file: "N/A",
            type: "syntax",
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      },
      json: { valid: true, errors: [] },
      handlebars: { valid: true, errors: [] },
      vue: { valid: true, errors: [] },
      svelte: { valid: true, errors: [] },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Format combination for display
 */
function formatCombination(combo: MatrixCombination): string {
  const parts = [
    `frontend=${combo.frontend.join("+")}`,
    `backend=${combo.backend}`,
    `db=${combo.database}`,
    `orm=${combo.orm}`,
    `api=${combo.api}`,
    `runtime=${combo.runtime}`,
  ];
  if (combo.auth !== "none") {
    parts.push(`auth=${combo.auth}`);
  }
  if (combo.astroIntegration && combo.astroIntegration !== "none") {
    parts.push(`astro=${combo.astroIntegration}`);
  }
  return parts.join(", ");
}

/**
 * Validate multiple combinations in parallel with concurrency limit
 * Memory-optimized: cleans up after each chunk to prevent OOM
 */
async function validateBatch(
  combinations: MatrixCombination[],
  concurrency: number,
): Promise<
  { combo: MatrixCombination; result: Awaited<ReturnType<typeof validateCombination>> }[]
> {
  const results: {
    combo: MatrixCombination;
    result: Awaited<ReturnType<typeof validateCombination>>;
  }[] = [];

  // Process in chunks to limit concurrency
  for (let i = 0; i < combinations.length; i += concurrency) {
    const chunk = combinations.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (combo) => ({
        combo,
        result: await validateCombination(combo),
      })),
    );
    results.push(...chunkResults);

    // Aggressive memory cleanup after EVERY chunk
    resetSharedProject();

    // Trigger garbage collection if available (Bun supports this)
    if (typeof Bun !== "undefined" && Bun.gc) {
      Bun.gc(true);
    }
  }

  return results;
}

/**
 * Sample combinations to get representative subset
 * Uses stratified sampling to ensure coverage across all dimensions
 */
function sampleCombinations(
  combinations: MatrixCombination[],
  percent: number,
): MatrixCombination[] {
  if (percent >= 1) return combinations;

  const targetCount = Math.max(10, Math.ceil(combinations.length * percent));

  // Group by frontend to ensure coverage
  const byFrontend = new Map<string, MatrixCombination[]>();
  for (const combo of combinations) {
    const key = combo.frontend.join("+");
    if (!byFrontend.has(key)) byFrontend.set(key, []);
    byFrontend.get(key)!.push(combo);
  }

  const sampled: MatrixCombination[] = [];
  const perGroup = Math.ceil(targetCount / byFrontend.size);

  for (const [, combos] of byFrontend) {
    // Take evenly spaced samples from each group
    const step = Math.max(1, Math.floor(combos.length / perGroup));
    for (let i = 0; i < combos.length && sampled.length < targetCount; i += step) {
      sampled.push(combos[i]);
    }
  }

  return sampled;
}

// ============================================================================
// TEST SUITES
// ============================================================================

describe("Matrix Testing - Tier 1: Core Stack", () => {
  const allCombinations = generateTier1Combinations();

  // Apply sampling if in sample mode
  const combinations =
    TEST_CONFIG.mode === "sample"
      ? sampleCombinations(allCombinations, TEST_CONFIG.samplePercent)
      : allCombinations;

  beforeAll(() => {
    if (TEST_CONFIG.printStats) {
      const tierStats = getCombinationStats();
      console.log("\n");
      console.log("=".repeat(60));
      console.log("MATRIX TESTING - TIER 1: Core Stack");
      console.log("=".repeat(60));
      console.log(`Mode: ${TEST_CONFIG.mode.toUpperCase()}`);
      if (TEST_CONFIG.mode === "sample") {
        console.log(
          `Sample: ${(TEST_CONFIG.samplePercent * 100).toFixed(0)}% (${combinations.length} of ${allCombinations.length})`,
        );
      } else if (TEST_CONFIG.mode === "batched") {
        console.log(
          `Batch size: ${TEST_CONFIG.batchSize} | Concurrency: ${TEST_CONFIG.concurrency}`,
        );
      }
      console.log(`Testing ${combinations.length} valid combinations`);
      console.log(
        `Theoretical: ${tierStats.totalTheoretical} | Valid: ${tierStats.validCombinations}`,
      );
      console.log(`Coverage: ${tierStats.coveragePercent}%`);
      console.log("=".repeat(60));
      console.log("\n");
    }
  });

  afterAll(() => {
    stats.endTime = Date.now();
    const duration = (stats.endTime - stats.startTime) / 1000;
    const tested = stats.passed + stats.failed;
    const avgTime = tested > 0 ? duration / tested : 0;

    console.log("\n");
    console.log("=".repeat(60));
    console.log("MATRIX TESTING - RESULTS");
    console.log("=".repeat(60));
    console.log(`Mode: ${TEST_CONFIG.mode.toUpperCase()}`);
    console.log(`Passed: ${stats.passed}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Skipped: ${stats.skipped}`);
    console.log(`Total Time: ${duration.toFixed(2)}s`);
    console.log(`Avg Time per Test: ${(avgTime * 1000).toFixed(0)}ms`);

    if (stats.failedCombinations.length > 0) {
      console.log("\nFailed Combinations:");
      for (const id of stats.failedCombinations) {
        console.log(`  - ${id}`);
      }
    }
    console.log("=".repeat(60));

    // Cleanup shared ts-morph project
    disposeSharedProject();
  });

  // ============== BATCHED MODE ==============
  if (TEST_CONFIG.mode === "batched") {
    // Split into batches and create one test per batch
    const batches: MatrixCombination[][] = [];
    for (let i = 0; i < combinations.length; i += TEST_CONFIG.batchSize) {
      batches.push(combinations.slice(i, i + TEST_CONFIG.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const startIdx = batchIndex * TEST_CONFIG.batchSize;
      const endIdx = Math.min(startIdx + batch.length, combinations.length);

      it(`batch ${batchIndex + 1}/${batches.length} (combinations ${startIdx + 1}-${endIdx})`, async () => {
        const results = await validateBatch(batch, TEST_CONFIG.concurrency);

        const failures: string[] = [];
        for (const { combo, result } of results) {
          if (
            !result.success ||
            !result.ts.valid ||
            !result.json.valid ||
            !result.handlebars.valid
          ) {
            failures.push(combo.id);
            stats.failed++;
            stats.failedCombinations.push(combo.id);

            if (!result.success) {
              console.error(`\nGeneration failed for ${combo.id}: ${result.error}`);
            } else if (!result.ts.valid) {
              console.error(`\nTypeScript errors for ${combo.id}:`);
              console.error(formatValidationErrors(result.ts));
            } else if (!result.json.valid) {
              console.error(`\nJSON errors for ${combo.id}:`);
              console.error(formatValidationErrors(result.json));
            }
          } else {
            stats.passed++;
          }
        }

        // Aggressive memory cleanup after each batch
        resetSharedProject();
        if (typeof Bun !== "undefined" && Bun.gc) {
          Bun.gc(true);
        }

        expect(failures.length).toBe(0);
      });
    }
  } else {
    // ============== FULL/SAMPLE MODE (individual tests) ==============
    for (const combo of combinations) {
      it(`validates: ${combo.id}`, async () => {
        if (TEST_CONFIG.verbose) {
          console.log(`  Testing: ${formatCombination(combo)}`);
        }

        const result = await validateCombination(combo);

        // Check generation success
        if (!result.success) {
          stats.failed++;
          stats.failedCombinations.push(combo.id);
          console.error(`\nGeneration failed for ${combo.id}:`);
          console.error(`  Error: ${result.error}`);
          expect(result.success).toBe(true);
          return;
        }

        // Check TypeScript validation
        if (!result.ts.valid) {
          stats.failed++;
          stats.failedCombinations.push(combo.id);
          console.error(`\nTypeScript errors for ${combo.id}:`);
          console.error(formatValidationErrors(result.ts));
          expect(result.ts.valid).toBe(true);
          return;
        }

        // Check JSON validation
        if (!result.json.valid) {
          stats.failed++;
          stats.failedCombinations.push(combo.id);
          console.error(`\nJSON errors for ${combo.id}:`);
          console.error(formatValidationErrors(result.json));
          expect(result.json.valid).toBe(true);
          return;
        }

        // Check Handlebars validation
        if (!result.handlebars.valid) {
          stats.failed++;
          stats.failedCombinations.push(combo.id);
          console.error(`\nHandlebars errors for ${combo.id}:`);
          console.error(formatValidationErrors(result.handlebars));
          expect(result.handlebars.valid).toBe(true);
          return;
        }

        // Check Vue validation (if applicable)
        if (!result.vue.valid) {
          stats.failed++;
          stats.failedCombinations.push(combo.id);
          console.error(`\nVue errors for ${combo.id}:`);
          console.error(formatValidationErrors(result.vue));
          expect(result.vue.valid).toBe(true);
          return;
        }

        // Check Svelte validation (if applicable)
        if (!result.svelte.valid) {
          stats.failed++;
          stats.failedCombinations.push(combo.id);
          console.error(`\nSvelte errors for ${combo.id}:`);
          console.error(formatValidationErrors(result.svelte));
          expect(result.svelte.valid).toBe(true);
          return;
        }

        stats.passed++;
        expect(result.success).toBe(true);
        expect(result.ts.valid).toBe(true);
        expect(result.json.valid).toBe(true);
        expect(result.handlebars.valid).toBe(true);
      });
    }
  }
});

// ============================================================================
// TIER 2 TESTS (Optional - API Variations)
// ============================================================================

describe.skipIf(!TEST_CONFIG.tier2)("Matrix Testing - Tier 2: API Variations", () => {
  const combinations = generateValidCombinations({ includeTier2: true });

  beforeAll(() => {
    if (TEST_CONFIG.printStats) {
      const tierStats = getCombinationStats({ includeTier2: true });
      console.log("\n");
      console.log("=".repeat(60));
      console.log("MATRIX TESTING - TIER 2: API Variations");
      console.log("=".repeat(60));
      console.log(`Testing ${combinations.length} valid combinations`);
      console.log(
        `Theoretical: ${tierStats.totalTheoretical} | Valid: ${tierStats.validCombinations}`,
      );
      console.log(`Coverage: ${tierStats.coveragePercent}%`);
      console.log("=".repeat(60));
    }
  });

  for (const combo of combinations) {
    it(`validates: ${combo.id}`, async () => {
      const result = await validateCombination(combo);

      expect(result.success).toBe(true);
      expect(result.ts.valid).toBe(true);
      expect(result.json.valid).toBe(true);
      expect(result.handlebars.valid).toBe(true);
    });
  }
});

// ============================================================================
// TIER 3 TESTS (Optional - Auth Variations)
// ============================================================================

describe.skipIf(!TEST_CONFIG.tier3)("Matrix Testing - Tier 3: Auth Variations", () => {
  const combinations = generateValidCombinations({ includeTier3: true });

  beforeAll(() => {
    if (TEST_CONFIG.printStats) {
      const tierStats = getCombinationStats({ includeTier3: true });
      console.log("\n");
      console.log("=".repeat(60));
      console.log("MATRIX TESTING - TIER 3: Auth Variations");
      console.log("=".repeat(60));
      console.log(`Testing ${combinations.length} valid combinations`);
      console.log(
        `Theoretical: ${tierStats.totalTheoretical} | Valid: ${tierStats.validCombinations}`,
      );
      console.log(`Coverage: ${tierStats.coveragePercent}%`);
      console.log("=".repeat(60));
    }
  });

  for (const combo of combinations) {
    it(`validates: ${combo.id}`, async () => {
      const result = await validateCombination(combo);

      expect(result.success).toBe(true);
      expect(result.ts.valid).toBe(true);
      expect(result.json.valid).toBe(true);
      expect(result.handlebars.valid).toBe(true);
    });
  }
});

// ============================================================================
// COVERAGE REPORT TEST
// ============================================================================

describe("Matrix Testing - Coverage Report", () => {
  it("should generate coverage statistics", () => {
    const tier1Stats = getCombinationStats();
    const tier2Stats = getCombinationStats({ includeTier2: true });
    const tier3Stats = getCombinationStats({ includeTier3: true });

    console.log("\n");
    console.log("=".repeat(60));
    console.log("COVERAGE REPORT");
    console.log("=".repeat(60));
    console.log(`Tier 1 (Core Stack):`);
    console.log(`  Theoretical: ${tier1Stats.totalTheoretical.toLocaleString()}`);
    console.log(`  Valid: ${tier1Stats.validCombinations.toLocaleString()}`);
    console.log(`  Coverage: ${tier1Stats.coveragePercent}%`);
    console.log("");
    console.log(`Tier 2 (+ API):`);
    console.log(`  Theoretical: ${tier2Stats.totalTheoretical.toLocaleString()}`);
    console.log(`  Valid: ${tier2Stats.validCombinations.toLocaleString()}`);
    console.log(`  Coverage: ${tier2Stats.coveragePercent}%`);
    console.log("");
    console.log(`Tier 3 (+ Auth):`);
    console.log(`  Theoretical: ${tier3Stats.totalTheoretical.toLocaleString()}`);
    console.log(`  Valid: ${tier3Stats.validCombinations.toLocaleString()}`);
    console.log(`  Coverage: ${tier3Stats.coveragePercent}%`);
    console.log("=".repeat(60));

    // Verify reasonable coverage numbers
    expect(tier1Stats.validCombinations).toBeGreaterThan(100);
    expect(tier1Stats.validCombinations).toBeLessThan(2000);
    expect(tier2Stats.validCombinations).toBeGreaterThan(tier1Stats.validCombinations);
    expect(tier3Stats.validCombinations).toBeGreaterThan(tier2Stats.validCombinations);
  });

  it("should print combination summary", () => {
    printCombinationSummary();
    expect(true).toBe(true);
  });
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

describe("Matrix Testing - Edge Cases", () => {
  it("should validate Convex with Clerk (special combination)", async () => {
    const result = await validateCombination({
      id: "convex-clerk-special",
      frontend: ["tanstack-router"],
      backend: "convex",
      database: "none",
      orm: "none",
      api: "none",
      auth: "clerk",
      runtime: "none",
    });

    expect(result.success).toBe(true);
    expect(result.ts.valid).toBe(true);
    expect(result.json.valid).toBe(true);
  });

  it("should validate Next.js with NextAuth (special combination)", async () => {
    const result = await validateCombination({
      id: "next-nextauth-special",
      frontend: ["next"],
      backend: "self",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "nextauth",
      runtime: "none",
    });

    expect(result.success).toBe(true);
    expect(result.ts.valid).toBe(true);
    expect(result.json.valid).toBe(true);
  });

  it("should validate Astro with React integration", async () => {
    const result = await validateCombination({
      id: "astro-react-special",
      frontend: ["astro"],
      backend: "self",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      runtime: "none",
      astroIntegration: "react",
    });

    expect(result.success).toBe(true);
    expect(result.ts.valid).toBe(true);
    expect(result.json.valid).toBe(true);
  });

  it("should validate MongoDB with Mongoose", async () => {
    const result = await validateCombination({
      id: "mongodb-mongoose-special",
      frontend: ["tanstack-router"],
      backend: "hono",
      database: "mongodb",
      orm: "mongoose",
      api: "trpc",
      auth: "none",
      runtime: "bun",
    });

    expect(result.success).toBe(true);
    expect(result.ts.valid).toBe(true);
    expect(result.json.valid).toBe(true);
  });

  it("should validate Workers runtime with compatible stack", async () => {
    const result = await validateCombination({
      id: "workers-hono-special",
      frontend: ["tanstack-router"],
      backend: "hono",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      runtime: "workers",
    });

    expect(result.success).toBe(true);
    expect(result.ts.valid).toBe(true);
    expect(result.json.valid).toBe(true);
  });

  it("should validate Elysia with Bun runtime", async () => {
    const result = await validateCombination({
      id: "elysia-bun-special",
      frontend: ["tanstack-router"],
      backend: "elysia",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      runtime: "bun",
    });

    expect(result.success).toBe(true);
    expect(result.ts.valid).toBe(true);
    expect(result.json.valid).toBe(true);
  });
});
