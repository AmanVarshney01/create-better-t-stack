import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { afterAll, beforeAll } from "bun:test";

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
