import type { Ecosystem } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getEcosystemChoice(ecosystem?: Ecosystem) {
  if (ecosystem !== undefined) return ecosystem;

  const ecosystemOptions = [
    {
      value: "typescript" as const,
      label: "TypeScript",
      hint: "Full-stack TypeScript with React, Vue, Svelte, and more",
    },
    {
      value: "rust" as const,
      label: "Rust",
      hint: "Rust ecosystem with Axum, Leptos, and more",
    },
    {
      value: "python" as const,
      label: "Python",
      hint: "Python ecosystem with FastAPI, Django, and AI/ML tools",
    },
    {
      value: "go" as const,
      label: "Go",
      hint: "Go ecosystem with Gin, Echo, GORM, and more",
    },
  ];

  const response = await navigableSelect<Ecosystem>({
    message: "Select ecosystem",
    options: ecosystemOptions,
    initialValue: "typescript",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
