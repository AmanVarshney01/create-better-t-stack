import type { API, Backend, Database, Examples, Frontend } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { isExampleAIAllowed, isExampleTodoAllowed } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableMultiselect } from "./navigable";

export async function getExamplesChoice(
  examples?: Examples[],
  database?: Database,
  frontends?: Frontend[],
  backend?: Backend,
  api?: API,
) {
  if (examples !== undefined) return examples;

  if (backend === "none") {
    return [];
  }

  let response: Examples[] | symbol = [];
  const options: { value: Examples; label: string; hint: string }[] = [];

  if (isExampleTodoAllowed(backend, database, api)) {
    options.push({
      value: "todo" as const,
      label: "Todo App",
      hint: "A simple CRUD example app",
    });
  }

  if (isExampleAIAllowed(backend, frontends ?? [])) {
    options.push({
      value: "ai" as const,
      label: "AI Chat",
      hint: "A simple AI chat interface using AI SDK",
    });
  }

  if (options.length === 0) return [];

  response = await navigableMultiselect<Examples>({
    message: "Include examples",
    options: options,
    required: false,
    initialValues: DEFAULT_CONFIG.examples?.filter((ex) => options.some((o) => o.value === ex)),
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
