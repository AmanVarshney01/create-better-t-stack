import { afterAll, beforeAll } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

export const SMOKE_DIR = join(import.meta.dir, "..", ".smoke", String(process.pid));
const SMOKE_HOOK_TIMEOUT_MS = process.env.BTS_BUILD_SAMPLES === "1" ? 180_000 : 30_000;

export async function ensureSmokeDirectory() {
  await mkdir(SMOKE_DIR, { recursive: true });
}

export async function cleanupSmokeDirectory() {
  await rm(SMOKE_DIR, { recursive: true, force: true });
}

beforeAll(async () => {
  process.env.BTS_SKIP_EXTERNAL_COMMANDS = "1";
  process.env.BTS_TEST_MODE = "1";
  await cleanupSmokeDirectory();
  await ensureSmokeDirectory();
}, SMOKE_HOOK_TIMEOUT_MS);

afterAll(cleanupSmokeDirectory, SMOKE_HOOK_TIMEOUT_MS);
