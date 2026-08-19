import { isCancel as isClackCancel, text } from "@clack/prompts";

import type { AddedApp, ProjectConfig } from "../types";
import { AppNameSchema } from "../types";
import { validateAddAppFrontendCompatibility } from "../utils/compatibility-rules";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export type AddAppFrontend = AddedApp["frontend"];

const WEB_FRONTEND_OPTIONS: { value: AddAppFrontend; label: string; hint: string }[] = [
  {
    value: "tanstack-router",
    label: "TanStack Router",
    hint: "Modern and scalable routing for React Applications",
  },
  {
    value: "react-router",
    label: "React Router",
    hint: "A user‑obsessed, standards‑focused, multi‑strategy router",
  },
  {
    value: "next",
    label: "Next.js",
    hint: "The React Framework for the Web",
  },
  {
    value: "nuxt",
    label: "Nuxt",
    hint: "The Progressive Web Framework for Vue.js",
  },
  {
    value: "svelte",
    label: "Svelte",
    hint: "web development for the rest of us",
  },
  {
    value: "solid",
    label: "Solid",
    hint: "Simple and performant reactivity for building user interfaces",
  },
  {
    value: "astro",
    label: "Astro",
    hint: "The web framework for content-driven websites",
  },
  {
    value: "tanstack-start",
    label: "TanStack Start",
    hint: "SSR, Server Functions, API Routes and more with TanStack Router",
  },
];

/** Validates an app name against the schema and taken names; returns an error message or undefined. */
export function validateAppName(name: string, takenNames: ReadonlySet<string>) {
  const result = AppNameSchema.safeParse(name);
  if (!result.success) {
    return result.error.issues[0]?.message || "Invalid app name";
  }
  if (takenNames.has(name)) {
    return `An app named '${name}' already exists in this project`;
  }
  return undefined;
}

/** Prompts for the new app's name with live validation. */
export async function getAppName(takenNames: ReadonlySet<string>): Promise<string> {
  const response = await text({
    message: "What should the new app be called?",
    placeholder: "admin",
    validate: (value) => validateAppName(String(value ?? "").trim(), takenNames),
  });

  if (isClackCancel(response)) {
    throw new UserCancelledError({ message: "Operation cancelled" });
  }

  return String(response).trim();
}

/** Frameworks an extra app may use, given the project's api/auth/backend. */
export function getCompatibleAppFrontends(
  config: Pick<ProjectConfig, "api" | "auth" | "backend">,
): AddAppFrontend[] {
  return WEB_FRONTEND_OPTIONS.filter((option) =>
    validateAddAppFrontendCompatibility(option.value, config).isOk(),
  ).map((option) => option.value);
}

/** Prompts for the new app's framework, offering only compatible options. */
export async function getAppFrontend(
  config: Pick<ProjectConfig, "api" | "auth" | "backend">,
): Promise<AddAppFrontend> {
  const options = WEB_FRONTEND_OPTIONS.filter((option) =>
    validateAddAppFrontendCompatibility(option.value, config).isOk(),
  );

  const response = await navigableSelect<AddAppFrontend>({
    message: "Choose a framework for the new app",
    options,
  });

  if (isCancel(response)) {
    throw new UserCancelledError({ message: "Operation cancelled" });
  }

  return response as AddAppFrontend;
}
