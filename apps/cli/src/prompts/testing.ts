import type { Testing } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getTestingChoice(testing?: Testing) {
  if (testing !== undefined) return testing;

  const options = [
    {
      value: "vitest" as const,
      label: "Vitest",
      hint: "Blazing fast Vite-native unit test framework",
    },
    {
      value: "vitest-playwright" as const,
      label: "Vitest + Playwright",
      hint: "Both unit and E2E testing for complete coverage",
    },
    {
      value: "playwright" as const,
      label: "Playwright",
      hint: "End-to-end testing framework by Microsoft",
    },
    {
      value: "jest" as const,
      label: "Jest",
      hint: "Classic testing framework with wide ecosystem",
    },
    {
      value: "cypress" as const,
      label: "Cypress",
      hint: "E2E testing with time travel debugging",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip testing framework setup",
    },
  ];

  const response = await navigableSelect<Testing>({
    message: "Select testing framework",
    options,
    initialValue: "vitest",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
