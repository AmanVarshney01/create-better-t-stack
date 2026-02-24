import type { Backend, Examples, Frontend, Runtime } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { isExampleAIAllowed, isExampleChatSdkAllowed } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableMultiselect } from "./navigable";

export async function getExamplesChoice(
  examples?: Examples[],
  frontends?: Frontend[],
  backend?: Backend,
  runtime?: Runtime,
) {
  if (examples !== undefined) return examples;

  if (backend === "none") {
    return [];
  }

  let response: Examples[] | symbol = [];
  const options: { value: Examples; label: string; hint: string }[] = [];

  if (isExampleAIAllowed(backend, frontends ?? [])) {
    options.push({
      value: "ai" as const,
      label: "AI Chat",
      hint: "A simple AI chat interface using AI SDK",
    });
  }

  if (isExampleChatSdkAllowed(backend, frontends ?? [], runtime)) {
    options.push({
      value: "chat-sdk" as const,
      label: "Chat SDK Bots",
      hint: "Framework-specific Chat SDK bot example (Slack/Discord/GitHub depending on stack)",
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
