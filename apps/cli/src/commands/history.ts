import { intro, log, outro } from "@clack/prompts";
import pc from "picocolors";

import { formatConfigValue } from "../utils/display-config";
import { clearHistory, getHistory, type ProjectHistoryEntry } from "../utils/project-history";
import { renderTitle } from "../utils/render-title";

export type HistoryCommandInput = {
  limit: number;
  clear: boolean;
  json: boolean;
};

function formatStackSummary(entry: ProjectHistoryEntry): string {
  const parts: string[] = [];

  if (entry.stack.frontend.length > 0 && !entry.stack.frontend.includes("none")) {
    parts.push(formatConfigValue(entry.stack.frontend));
  }

  if (entry.stack.backend && entry.stack.backend !== "none") {
    parts.push(formatConfigValue(entry.stack.backend));
  }

  if (entry.stack.database && entry.stack.database !== "none") {
    parts.push(formatConfigValue(entry.stack.database));
  }

  if (entry.stack.orm && entry.stack.orm !== "none") {
    parts.push(formatConfigValue(entry.stack.orm));
  }

  return parts.length > 0 ? parts.join(" + ") : "minimal";
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHistoryEntry(entry: ProjectHistoryEntry, index: number): string {
  const rows = [
    { label: "Created", value: formatDate(entry.createdAt) },
    { label: "Location", value: entry.projectDir },
    { label: "Stack", value: formatStackSummary(entry) },
  ];
  const labelWidth = Math.max(...rows.map(({ label }) => label.length));
  const details = rows
    .map(({ label, value }) => `${pc.dim(label.padEnd(labelWidth))}  ${value}`)
    .join("\n");

  return `${pc.cyan(pc.bold(`${index + 1}. ${entry.projectName}`))}\n${details}\n${pc.dim(
    "Recreate",
  )}\n${pc.cyan(entry.reproducibleCommand)}`;
}

export async function historyHandler(input: HistoryCommandInput): Promise<void> {
  if (input.clear) {
    const clearResult = await clearHistory();
    if (clearResult.isErr()) {
      log.warn(pc.yellow(clearResult.error.message));
      return;
    }
    log.success(pc.green("Project history cleared."));
    return;
  }

  const historyResult = await getHistory(input.limit);
  if (historyResult.isErr()) {
    log.warn(pc.yellow(historyResult.error.message));
    return;
  }
  const entries = historyResult.value;

  if (input.json) {
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  renderTitle();
  intro(pc.magenta(`Project history · ${entries.length}`));

  if (entries.length === 0) {
    outro(
      `${pc.dim("No saved projects yet · create one with")} ${pc.cyan(
        "create-better-t-stack my-app",
      )}`,
    );
    return;
  }

  log.message(entries.map(formatHistoryEntry).join("\n\n"));
  outro(pc.dim("Run a command above to recreate that project"));
}
