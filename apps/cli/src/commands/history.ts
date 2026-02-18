import { intro, log } from "@clack/prompts";
import pc from "picocolors";

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
    parts.push(entry.stack.frontend.join(", "));
  }

  if (entry.stack.backend && entry.stack.backend !== "none") {
    parts.push(entry.stack.backend);
  }

  if (entry.stack.database && entry.stack.database !== "none") {
    parts.push(entry.stack.database);
  }

  if (entry.stack.orm && entry.stack.orm !== "none") {
    parts.push(entry.stack.orm);
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

export async function historyHandler(input: HistoryCommandInput): Promise<void> {
  if (input.clear) {
    await clearHistory();
    log.success(pc.green("Project history cleared."));
    return;
  }

  const entries = await getHistory(input.limit);

  if (input.json) {
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  if (entries.length === 0) {
    log.info(pc.dim("No projects in history yet."));
    log.info(pc.dim("Create a project with: create-better-fullstack my-app"));
    return;
  }

  renderTitle();
  intro(pc.magenta(`Project History (${entries.length} entries)`));

  for (const [index, entry] of entries.entries()) {
    const num = pc.dim(`${index + 1}.`);
    const name = pc.cyan(pc.bold(entry.projectName));
    const stack = pc.dim(formatStackSummary(entry));

    log.message(`${num} ${name}`);
    log.message(`   ${pc.dim("Created:")} ${formatDate(entry.createdAt)}`);
    log.message(`   ${pc.dim("Path:")} ${entry.projectDir}`);
    log.message(`   ${pc.dim("Stack:")} ${stack}`);
    log.message(`   ${pc.dim("Command:")} ${pc.dim(entry.reproducibleCommand)}`);
    log.message("");
  }
}
