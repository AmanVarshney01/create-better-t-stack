import {
  supportsClerkFrontend,
  supportsClerkBackend,
  isFrontendAllowedWithBackend,
} from "@better-t-stack/types";

import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend, Frontend } from "../types";
import { supportsConvexBetterAuth } from "../utils/compatibility-rules";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

export function getAvailableAuthProviders(
  backend?: Backend,
  frontend: readonly Frontend[] = [],
): Auth[] {
  if (backend === "none") {
    return ["none"];
  }

  const options: Auth[] = [];

  if (backend === "convex") {
    if (
      supportsConvexBetterAuth(frontend) &&
      frontend.every((f) => isFrontendAllowedWithBackend(f, backend, "better-auth"))
    ) {
      options.push("better-auth");
    }
  } else {
    options.push("better-auth");
  }

  if (supportsClerkFrontend(frontend) && supportsClerkBackend(backend, frontend)) {
    options.push("clerk");
  }

  if (options.length === 0) {
    return ["none"];
  }

  return [...options, "none"];
}

export async function getAuthChoice(
  auth: Auth | undefined,
  backend?: Backend,
  frontend: readonly Frontend[] = [],
  previousValue?: Auth,
) {
  if (auth !== undefined) return auth;
  const availableProviders = getAvailableAuthProviders(backend, frontend);

  if (availableProviders.length === 1 && availableProviders[0] === "none") {
    return "none" as Auth;
  }

  const options = availableProviders.map((provider) => {
    switch (provider) {
      case "better-auth":
        return {
          value: "better-auth",
          label: "Better-Auth",
          hint: "comprehensive auth framework for TypeScript",
        };
      case "clerk":
        return {
          value: "clerk",
          label: "Clerk",
          hint: "More than auth, Complete User Management",
        };
      default:
        return { value: "none", label: "None", hint: "No auth" };
    }
  });

  const response = await navigableSelect({
    message: "Choose authentication",
    options,
    initialValue: preferValidInitial(
      options,
      previousValue,
      options.some((option) => option.value === DEFAULT_CONFIG.auth) ? DEFAULT_CONFIG.auth : "none",
    ),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response as Auth;
}
