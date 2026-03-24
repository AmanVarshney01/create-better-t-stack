import { afterAll, beforeAll } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

export const SMOKE_DIR = join(import.meta.dir, "..", ".smoke");

type VirtualFileNode = {
  type: "file";
  path: string;
  content: string;
};

type VirtualDirectoryNode = {
  type: "directory";
  path: string;
  children: VirtualNode[];
};

export type VirtualNode = VirtualFileNode | VirtualDirectoryNode;

export async function ensureSmokeDirectory() {
  await mkdir(SMOKE_DIR, { recursive: true });
}

export async function cleanupSmokeDirectory() {
  await rm(SMOKE_DIR, { recursive: true, force: true });
}

export function collectFiles(
  node: VirtualNode,
  rootPath: string,
  files = new Map<string, string>(),
) {
  if (node.type === "file") {
    const relativePath = node.path.startsWith(`${rootPath}/`)
      ? node.path.slice(rootPath.length + 1)
      : node.path;
    files.set(relativePath, node.content);
    return files;
  }

  for (const child of node.children) {
    collectFiles(child, rootPath, files);
  }

  return files;
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
