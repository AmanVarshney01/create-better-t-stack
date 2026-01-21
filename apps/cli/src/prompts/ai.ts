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
      value: "mastra" as const,
      label: "Mastra",
      hint: "TypeScript-native AI agent framework with workflows",
    },
    {
      value: "voltagent" as const,
      label: "VoltAgent",
      hint: "AI Agent framework with memory, workflows, and observability",
    },
    {
      value: "langgraph" as const,
      label: "LangGraph.js",
      hint: "Graph-based agent orchestration with stateful workflows",
    },
    {
      value: "openai-agents" as const,
      label: "OpenAI Agents SDK",
      hint: "Official multi-agent framework with handoffs and guardrails",
    },
    {
      value: "google-adk" as const,
      label: "Google ADK",
      hint: "Code-first agent development kit for building AI agents",
    },
    {
      value: "modelfusion" as const,
      label: "ModelFusion",
      hint: "Type-safe AI library for multi-provider text generation",
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
