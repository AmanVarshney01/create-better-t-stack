import envPaths from "env-paths";
import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../types";

import { getLatestCLIVersion } from "./get-latest-cli-version";

const paths = envPaths("better-t-stack", { suffix: "" });
const HISTORY_FILE = "history.json";

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

async function ensureHistoryDir(): Promise<void> {
  await fs.ensureDir(getHistoryDir());
}

export async function readHistory(): Promise<HistoryData> {
  const historyPath = getHistoryPath();

  try {
    if (await fs.pathExists(historyPath)) {
      const data = await fs.readJson(historyPath);
      return data as HistoryData;
    }
  } catch {
    // If file is corrupted, return empty history
  }

  return { version: 1, entries: [] };
}

export async function addToHistory(
  config: ProjectConfig,
  reproducibleCommand: string,
): Promise<void> {
  await ensureHistoryDir();

  const history = await readHistory();

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

  await fs.writeJson(getHistoryPath(), history, { spaces: 2 });
}

export async function getHistory(limit = 10): Promise<ProjectHistoryEntry[]> {
  const history = await readHistory();
  return history.entries.slice(0, limit);
}

export async function clearHistory(): Promise<void> {
  const historyPath = getHistoryPath();

  if (await fs.pathExists(historyPath)) {
    await fs.remove(historyPath);
  }
}

export async function removeFromHistory(id: string): Promise<boolean> {
  const history = await readHistory();
  const initialLength = history.entries.length;

  history.entries = history.entries.filter((entry) => entry.id !== id);

  if (history.entries.length < initialLength) {
    await fs.writeJson(getHistoryPath(), history, { spaces: 2 });
    return true;
  }

  return false;
}
