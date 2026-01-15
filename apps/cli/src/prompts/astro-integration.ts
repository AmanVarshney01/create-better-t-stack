import type { AstroIntegration } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getAstroIntegrationChoice(
  astroIntegration?: AstroIntegration,
): Promise<AstroIntegration | symbol> {
  if (astroIntegration !== undefined) return astroIntegration;

  const response = await navigableSelect<AstroIntegration>({
    message: "Choose Astro UI framework integration",
    options: [
      {
        value: "react" as const,
        label: "React",
        hint: "Full React component support (required for tRPC)",
      },
      {
        value: "vue" as const,
        label: "Vue",
        hint: "Vue 3 component support",
      },
      {
        value: "svelte" as const,
        label: "Svelte",
        hint: "Svelte component support",
      },
      {
        value: "solid" as const,
        label: "Solid",
        hint: "SolidJS component support",
      },
      {
        value: "none" as const,
        label: "None",
        hint: "Astro components only (no client-side JS framework)",
      },
    ],
    initialValue: "react",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
