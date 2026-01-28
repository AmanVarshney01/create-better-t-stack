import type { AiDocs } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableMultiselect } from "./navigable";

const AI_DOCS_OPTIONS = [
  {
    value: "claude-md" as const,
    label: "CLAUDE.md",
    hint: "Claude Code CLI documentation",
  },
  {
    value: "agents-md" as const,
    label: "Agents.md",
    hint: "Generic AI assistant documentation",
  },
  {
    value: "cursorrules" as const,
    label: ".cursorrules",
    hint: "Cursor IDE rules file",
  },
  {
    value: "none" as const,
    label: "None",
    hint: "Skip AI documentation",
  },
];

export async function getAiDocsChoice(aiDocs?: AiDocs[]) {
  if (aiDocs !== undefined) return aiDocs;

  const response = await navigableMultiselect<AiDocs>({
    message: "Generate AI documentation files?",
    options: AI_DOCS_OPTIONS,
    initialValues: DEFAULT_CONFIG.aiDocs as AiDocs[],
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  // If "none" is selected, return empty array
  if (response.includes("none")) return [];

  return response;
}
