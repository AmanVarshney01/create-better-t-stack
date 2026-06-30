import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { createVirtual } from "../../src/index";
import { collectFiles } from "../setup";
import {
  createSmokeMatrixCases,
  generateMatrixCases,
  getMatrixMode,
  getMatrixShardFromArgs,
  TOTAL_MATRIX_CASES,
  type MatrixShard,
  type MatrixCase,
} from "./cases";
import { classifyMatrixError, formatMatrixConfig } from "./oracle";

const matrixMode = getMatrixMode();

function readPositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const timeoutMs = readPositiveIntEnv(
  "BTS_MATRIX_TIMEOUT_MS",
  matrixMode === "full" ? 1_800_000 : 180_000,
);
const maxFullTestsPerShard = readPositiveIntEnv("BTS_MATRIX_MAX_TESTS_PER_SHARD", 10_000);

interface MatrixRunStats {
  checked: number;
  expectedValid: number;
  expectedInvalid: number;
  actualValid: number;
  actualInvalid: number;
}

interface MatrixTestRow {
  name: string;
  matrixCase: MatrixCase;
}

function formatShard(shard: MatrixShard | undefined) {
  return shard ? `${shard.index + 1}/${shard.total}` : "all";
}

function createStats(): MatrixRunStats {
  return {
    checked: 0,
    expectedValid: 0,
    expectedInvalid: 0,
    actualValid: 0,
    actualInvalid: 0,
  };
}

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join("+") : "none";
}

function formatMatrixCaseName(matrixCase: MatrixCase) {
  const { config, expected, index } = matrixCase;
  const outcome = expected.valid ? "accepts" : `rejects ${expected.rules.join("+")}`;
  return [
    `case ${index}`,
    outcome,
    `${config.backend}/${config.runtime}`,
    `frontends:${formatList(config.frontend)}`,
    `api:${config.api}`,
    `db:${config.database}/${config.orm}`,
    `auth:${config.auth}`,
    `payments:${config.payments}`,
    `dbSetup:${config.dbSetup}`,
    `deploy:${config.webDeploy}/${config.serverDeploy}`,
    `examples:${formatList(config.examples)}`,
  ].join(" ");
}

function createMatrixTestRows(matrixCases: readonly MatrixCase[]): MatrixTestRow[] {
  return matrixCases.map((matrixCase) => ({
    name: formatMatrixCaseName(matrixCase),
    matrixCase,
  }));
}

function getShardCaseCount(shard: MatrixShard) {
  return Math.floor((TOTAL_MATRIX_CASES + shard.total - 1 - shard.index) / shard.total);
}

function failMatrixCase(matrixCase: MatrixCase, message: string): never {
  throw new Error(
    [
      message,
      `Matrix index: ${matrixCase.index}`,
      `Expected rules: ${matrixCase.expected.rules.join(", ") || "(none)"}`,
      "Config:",
      formatMatrixConfig(matrixCase.config),
    ].join("\n"),
  );
}

async function checkMatrixCase(matrixCase: MatrixCase, stats: MatrixRunStats) {
  stats.checked++;
  if (matrixCase.expected.valid) stats.expectedValid++;
  else stats.expectedInvalid++;

  const result = await createVirtual(matrixCase.config);

  if (result.isOk()) {
    stats.actualValid++;

    if (!matrixCase.expected.valid) {
      failMatrixCase(matrixCase, "Expected matrix case to be rejected, but it generated.");
    }

    expect(result.value.fileCount).toBeGreaterThan(0);

    if (matrixMode === "smoke") {
      const files = collectFiles(result.value.root, result.value.root.path);
      if (!files.has("package.json")) {
        failMatrixCase(matrixCase, "Smoke matrix generated no root package.json.");
      }
      JSON.parse(files.get("package.json") ?? "");
    }

    return;
  }

  stats.actualInvalid++;

  if (matrixCase.expected.valid) {
    failMatrixCase(
      matrixCase,
      `Expected matrix case to generate, but it failed with: ${result.error.message}`,
    );
  }

  const rule = classifyMatrixError(result.error.message);
  if (rule === "unknown") {
    failMatrixCase(
      matrixCase,
      `Production validation returned an unclassified error: ${result.error.message}`,
    );
  }
  if (!matrixCase.expected.rules.includes(rule)) {
    failMatrixCase(
      matrixCase,
      `Production validation failed for rule "${rule}", which the matrix oracle did not predict. Error: ${result.error.message}`,
    );
  }
}

function defineMatrixSuite(
  title: string,
  rows: readonly MatrixTestRow[],
  options: { shard: string; totalMatrixCases?: number; logStart?: boolean },
) {
  const stats = createStats();

  describe(title, () => {
    if (options.logStart) {
      beforeAll(() => {
        console.info(
          JSON.stringify({
            event: "matrix:start",
            mode: matrixMode,
            shard: options.shard,
            totalMatrixCases: options.totalMatrixCases,
            tests: rows.length,
          }),
        );
      });
    }

    afterAll(() => {
      expect(stats.checked).toBe(rows.length);
      expect(stats.expectedValid).toBe(stats.actualValid);
      expect(stats.expectedInvalid).toBe(stats.actualInvalid);

      console.info(
        JSON.stringify({
          mode: matrixMode,
          shard: options.shard,
          totalMatrixCases: options.totalMatrixCases,
          ...stats,
        }),
      );
    });

    test.each(rows)(
      "$name",
      async ({ matrixCase }) => {
        await checkMatrixCase(matrixCase, stats);
      },
      timeoutMs,
    );
  });
}

if (matrixMode === "smoke") {
  const smokeCases = createSmokeMatrixCases();
  defineMatrixSuite("Create smoke matrix", createMatrixTestRows(smokeCases), { shard: "all" });
}

if (matrixMode === "full") {
  const shard = getMatrixShardFromArgs();
  const minimumShardTotal = Math.ceil(TOTAL_MATRIX_CASES / maxFullTestsPerShard);

  if (!shard) {
    describe("Create full matrix", () => {
      test("requires BTS_MATRIX_SHARD for individual full matrix tests", () => {
        throw new Error(
          `Full matrix has ${TOTAL_MATRIX_CASES.toLocaleString()} cases. Set BTS_MATRIX_SHARD=1/N to run individual tests for one shard. Use N >= ${minimumShardTotal.toLocaleString()} or raise BTS_MATRIX_MAX_TESTS_PER_SHARD if you intentionally want larger shards.`,
        );
      });
    });
  } else {
    const shardCaseCount = getShardCaseCount(shard);

    if (shardCaseCount === 0) {
      describe(`Create full matrix shard ${formatShard(shard)}`, () => {
        test("contains at least one matrix case", () => {
          throw new Error(
            `Matrix shard ${formatShard(shard)} contains no cases for ${TOTAL_MATRIX_CASES.toLocaleString()} total combinations.`,
          );
        });
      });
    } else if (shardCaseCount > maxFullTestsPerShard) {
      describe(`Create full matrix shard ${formatShard(shard)}`, () => {
        test("uses a small enough shard for individual full matrix tests", () => {
          throw new Error(
            `Matrix shard ${formatShard(shard)} would register ${shardCaseCount.toLocaleString()} tests. Use at least ${minimumShardTotal.toLocaleString()} shards or raise BTS_MATRIX_MAX_TESTS_PER_SHARD if you intentionally want larger shards.`,
          );
        });
      });
    } else {
      const fullCases = [...generateMatrixCases(shard)];
      defineMatrixSuite(
        `Create full matrix shard ${formatShard(shard)}`,
        createMatrixTestRows(fullCases),
        { shard: formatShard(shard), totalMatrixCases: TOTAL_MATRIX_CASES, logStart: true },
      );
    }
  }
}
