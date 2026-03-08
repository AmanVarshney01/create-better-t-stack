import type { Auth, Backend } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { getSupportedCapabilityOptions } from "../types";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getAuthChoice(
  auth: Auth | undefined,
  backend?: Backend,
  frontend?: string[],
  ecosystem: "typescript" | "go" = "typescript",
) {
  if (auth !== undefined) return auth;
  const authOptionOrder = [
    { value: "better-auth" },
    { value: "go-better-auth" },
    { value: "clerk" },
    { value: "nextauth" },
    { value: "stack-auth" },
    { value: "supabase-auth" },
    { value: "auth0" },
    { value: "none" },
  ] as const satisfies ReadonlyArray<{ value: Auth }>;

  const supportedOptions = getSupportedCapabilityOptions("auth", {
    ecosystem,
    backend,
    frontend,
  });
  const options = authOptionOrder.flatMap(({ value }) => {
    const option = supportedOptions.find((candidate) => candidate.id === value);
    return option ? [option] : [];
  });

  if (options.length === 1 && options[0]?.id === "none") {
    return "none" as Auth;
  }

  const response = await navigableSelect({
    message: "Select authentication provider",
    options: options.map((option) => ({
      value: option.id,
      label: option.label,
      hint: option.promptHint,
    })),
    initialValue: options.some((option) => option.id === DEFAULT_CONFIG.auth)
      ? DEFAULT_CONFIG.auth
      : (options.find((option) => option.id !== "none")?.id ?? "none"),
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response as Auth;
}
