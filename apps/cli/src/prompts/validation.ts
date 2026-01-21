import type { Validation } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getValidationChoice(validation?: Validation) {
  if (validation !== undefined) return validation;

  const options = [
    {
      value: "zod" as const,
      label: "Zod",
      hint: "TypeScript-first schema validation (recommended)",
    },
    {
      value: "valibot" as const,
      label: "Valibot",
      hint: "Smaller bundle alternative to Zod (~1KB)",
    },
    {
      value: "arktype" as const,
      label: "ArkType",
      hint: "TypeScript-first validation, 2-4x faster than Zod",
    },
    {
      value: "typebox" as const,
      label: "TypeBox",
      hint: "JSON Schema type builder for TypeScript",
    },
    {
      value: "typia" as const,
      label: "Typia",
      hint: "Super-fast validation via compile-time transform",
    },
    {
      value: "runtypes" as const,
      label: "Runtypes",
      hint: "Runtime type validation with composable validators",
    },
    {
      value: "effect-schema" as const,
      label: "@effect/schema",
      hint: "Effect ecosystem schema validation with powerful transformations",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Use Zod internally only (no additional library)",
    },
  ];

  const response = await navigableSelect<Validation>({
    message: "Select validation library",
    options,
    initialValue: "zod",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
