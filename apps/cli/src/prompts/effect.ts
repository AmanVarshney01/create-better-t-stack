import type { Effect } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getEffectChoice(effect?: Effect) {
  if (effect !== undefined) return effect;

  const effectOptions = [
    {
      value: "effect" as const,
      label: "Effect (core)",
      hint: "Powerful effect system for TypeScript",
    },
    {
      value: "effect-full" as const,
      label: "Effect Full",
      hint: "Full Effect ecosystem with schema validation, platform abstractions, and SQL",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "No Effect ecosystem",
    },
  ];

  const response = await navigableSelect<Effect>({
    message: "Select Effect ecosystem",
    options: effectOptions,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
