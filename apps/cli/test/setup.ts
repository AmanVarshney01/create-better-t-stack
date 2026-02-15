import { afterAll, beforeAll } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const TEST_RUN_ID = process.env.BFS_TEST_RUN_ID ?? `${process.pid}`;
export const SMOKE_DIR = process.env.BFS_SMOKE_DIR ?? join(import.meta.dir, "..", ".smoke", TEST_RUN_ID);

export async function ensureSmokeDirectory() {
  await mkdir(SMOKE_DIR, { recursive: true });
}

export async function cleanupSmokeDirectory() {
  await rm(SMOKE_DIR, { recursive: true, force: true });
}

// Global setup - runs once before all tests
beforeAll(
  async () => {
  try {
    // Isolated per-run smoke directory keeps cleanup fast and avoids cross-run contention.
    await cleanupSmokeDirectory();
    await ensureSmokeDirectory();
  } catch (error) {
    console.error("Failed to setup smoke directory:", error);
    throw error;
  }
  },
  120000,
);

// Global teardown - runs once after all tests
afterAll(
  async () => {
  try {
    await cleanupSmokeDirectory();
  } catch {
    // Ignore cleanup errors on teardown
  }
  },
  120000,
);
