import type { AI } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getAIChoice(ai?: AI) {
  if (ai !== undefined) return ai;

  const aiOptions = [
    {
      value: "vercel-ai" as const,
      label: "Vercel AI SDK",
      hint: "The AI Toolkit for TypeScript - supports OpenAI, Anthropic, Google, etc.",
    },
    {
      value: "langchain" as const,
      label: "LangChain",
      hint: "Build context-aware reasoning applications",
    },
    {
      value: "llamaindex" as const,
      label: "LlamaIndex",
      hint: "Data framework for LLM applications",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No AI SDK",
    },
  ];

  const response = await navigableSelect<AI>({
    message: "Select AI SDK",
    options: aiOptions,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
