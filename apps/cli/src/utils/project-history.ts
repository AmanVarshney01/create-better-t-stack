import { Result, TaggedError } from "better-result";
import envPaths from "env-paths";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../types";

import { getLatestCLIVersion } from "./get-latest-cli-version";

const paths = envPaths("better-t-stack", { suffix: "" });
const HISTORY_FILE = "history.json";

export class HistoryError extends TaggedError("HistoryError")<{
  message: string;
  cause?: unknown;
}>() {}

export type ProjectHistoryEntry = {
  id: string;
  projectName: string;
  projectDir: string;
  createdAt: string;
  stack: {
    frontend: string[];
    backend: string;
    database: string;
    orm: string;
    runtime: string;
    auth: string;
    payments: string;
    api: string;
    addons: string[];
    examples: string[];
    dbSetup: string;
    packageManager: string;
  };
  cliVersion: string;
  reproducibleCommand: string;
};

type HistoryData = {
  version: number;
  entries: ProjectHistoryEntry[];
};

function getHistoryDir(): string {
  return paths.data;
}

function getHistoryPath(): string {
  return path.join(paths.data, HISTORY_FILE);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function emptyHistory(): HistoryData {
  return { version: 1, entries: [] };
}

async function ensureHistoryDir(): Promise<Result<void, HistoryError>> {
  return Result.tryPromise({
    try: async () => {
      await fs.ensureDir(getHistoryDir());
    },
    catch: (e) =>
      new HistoryError({
        message: `Failed to create history directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

export async function readHistory(): Promise<Result<HistoryData, HistoryError>> {
  const historyPath = getHistoryPath();

  const existsResult = await Result.tryPromise({
    try: async () => await fs.pathExists(historyPath),
    catch: (e) =>
      new HistoryError({
        message: `Failed to check history file: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (existsResult.isErr()) {
    return existsResult;
  }

  if (!existsResult.value) {
    return Result.ok(emptyHistory());
  }

  const readResult = await Result.tryPromise({
    try: async () => (await fs.readJson(historyPath)) as HistoryData,
    catch: (e) =>
      new HistoryError({
        message: `Failed to read history file: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  // If the file is corrupted/unreadable JSON, fall back to empty history.
  if (readResult.isErr()) {
    return Result.ok(emptyHistory());
  }

  return Result.ok(readResult.value);
}

async function writeHistory(history: HistoryData): Promise<Result<void, HistoryError>> {
  const ensureDirResult = await ensureHistoryDir();
  if (ensureDirResult.isErr()) {
    return ensureDirResult;
  }

  return Result.tryPromise({
    try: async () => {
      await fs.writeJson(getHistoryPath(), history, { spaces: 2 });
    },
    catch: (e) =>
      new HistoryError({
        message: `Failed to write history file: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

export async function addToHistory(
  config: ProjectConfig,
  reproducibleCommand: string,
): Promise<Result<void, HistoryError>> {
  const historyResult = await readHistory();
  if (historyResult.isErr()) {
    return historyResult;
  }
  const history = historyResult.value;

  const entry: ProjectHistoryEntry = {
    id: generateId(),
    projectName: config.projectName,
    projectDir: config.projectDir,
    createdAt: new Date().toISOString(),
    stack: {
      frontend: config.frontend,
      backend: config.backend,
      database: config.database,
      orm: config.orm,
      runtime: config.runtime,
      auth: config.auth,
      payments: config.payments,
      api: config.api,
      addons: config.addons,
      examples: config.examples,
      dbSetup: config.dbSetup,
      packageManager: config.packageManager,
    },
    cliVersion: getLatestCLIVersion(),
    reproducibleCommand,
  };

  // Add new entry at the beginning (newest first)
  history.entries.unshift(entry);

  // Keep only the last 100 entries to prevent file from growing too large
  if (history.entries.length > 100) {
    history.entries = history.entries.slice(0, 100);
  }

  return await writeHistory(history);
}

export async function getHistory(limit = 10): Promise<Result<ProjectHistoryEntry[], HistoryError>> {
  const historyResult = await readHistory();
  if (historyResult.isErr()) {
    return historyResult;
  }
  return Result.ok(historyResult.value.entries.slice(0, limit));
}

export async function clearHistory(): Promise<Result<void, HistoryError>> {
  const historyPath = getHistoryPath();

  return Result.tryPromise({
    try: async () => {
      if (await fs.pathExists(historyPath)) {
        await fs.remove(historyPath);
      }
    },
    catch: (e) =>
      new HistoryError({
        message: `Failed to clear history: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

export async function removeFromHistory(id: string): Promise<Result<boolean, HistoryError>> {
  const historyResult = await readHistory();
  if (historyResult.isErr()) {
    return historyResult;
  }

  const history = historyResult.value;
  const initialLength = history.entries.length;
  history.entries = history.entries.filter((entry) => entry.id !== id);

  if (history.entries.length < initialLength) {
    const writeResult = await writeHistory(history);
    if (writeResult.isErr()) {
      return writeResult;
    }
    return Result.ok(true);
  }

  return Result.ok(false);
}
