/**
 * EXAMPLE FILE FOR RALPH
 *
 * This file shows how to add a new option category to the CLI.
 * Use this as a reference when implementing new schema options.
 *
 * This example adds AI SDK options to the CLI.
 */

// ============================================================================
// STEP 1: Update packages/types/src/schemas.ts
// ============================================================================

// Add the new schema definition (place with other schemas):
/*
export const AISchema = z
  .enum(["vercel-ai", "langchain", "llamaindex", "none"])
  .describe("AI SDK");
*/

// Add to ProjectConfigSchema:
/*
export const ProjectConfigSchema = z.object({
  // ... existing fields ...
  ai: AISchema,
});
*/

// Add to CreateInputSchema:
/*
export const CreateInputSchema = z.object({
  // ... existing fields ...
  ai: AISchema.optional(),
});
*/

// Export values:
/*
export const AI_VALUES = AISchema.options;
*/

// ============================================================================
// STEP 2: Create apps/cli/src/prompts/ai.ts
// ============================================================================

/*
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
*/

// ============================================================================
// STEP 3: Add dependencies to packages/template-generator/src/processors/
// ============================================================================

// Create ai-deps.ts or add to existing processor:
/*
import type { ProjectConfig } from "../types";
import { addDeps } from "../utils/add-deps";

export function processAIDeps(config: ProjectConfig) {
  const { ai } = config;

  switch (ai) {
    case "vercel-ai":
      addDeps(config, "dependencies", ["ai", "@ai-sdk/openai"]);
      break;
    case "langchain":
      addDeps(config, "dependencies", ["langchain", "@langchain/openai"]);
      break;
    case "llamaindex":
      addDeps(config, "dependencies", ["llamaindex"]);
      break;
  }
}
*/

// ============================================================================
// STEP 4: Update apps/cli/src/constants.ts
// ============================================================================

// Add default value:
/*
export const DEFAULT_CONFIG_BASE = {
  // ... existing defaults ...
  ai: "none",
} as const;
*/

// ============================================================================
// STEP 5: Wire up in CLI flow (apps/cli/src/helpers/core/create-project.ts)
// ============================================================================

// Import and call the prompt in the appropriate place in the CLI flow

// ============================================================================
// SUMMARY OF FILES TO MODIFY/CREATE:
// ============================================================================
// 1. packages/types/src/schemas.ts - Add schema definition
// 2. apps/cli/src/prompts/ai.ts - Create prompt file (NEW)
// 3. packages/template-generator/src/processors/ai-deps.ts - Add deps (NEW)
// 4. apps/cli/src/constants.ts - Add default
// 5. apps/cli/src/helpers/core/create-project.ts - Wire up prompt
// 6. Update BetterTStackConfigSchema if needed

export {};
