import { afterAll, beforeAll } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

export const SMOKE_DIR = join(import.meta.dir, "..", ".smoke");

export async function ensureSmokeDirectory() {
  await mkdir(SMOKE_DIR, { recursive: true });
}

export async function cleanupSmokeDirectory() {
  await rm(SMOKE_DIR, { recursive: true, force: true });
}

// Global setup - runs once before all tests
beforeAll(async () => {
  try {
    process.env.BTS_SKIP_EXTERNAL_COMMANDS = "1";
    process.env.BTS_TEST_MODE = "1";
    await cleanupSmokeDirectory();
    await ensureSmokeDirectory();
  } catch (error) {
    console.error("Failed to setup smoke directory:", error);
    throw error;
  }
});

// Global teardown - runs once after all tests
afterAll(async () => {
  try {
    await cleanupSmokeDirectory();
  } catch {
    // Ignore cleanup errors on teardown
  }
});
