import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend, Frontend } from "../types";
import { supportsConvexBetterAuth } from "../utils/compatibility-rules";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export function getAvailableAuthProviders(
  backend?: Backend,
  frontend: readonly Frontend[] = [],
): Auth[] {
  if (backend === "none") {
    return ["none"];
  }

  const hasClerkCompatibleFrontends = frontend.some((f) =>
    [
      "react-router",
      "tanstack-router",
      "tanstack-start",
      "next",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ].includes(f),
  );

  const options: Auth[] = [];

  if (backend === "convex") {
    if (supportsConvexBetterAuth(frontend)) {
      options.push("better-auth");
    }
  } else {
    options.push("better-auth");
  }

  if (hasClerkCompatibleFrontends) {
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
    message: "Select authentication provider",
    options,
    initialValue: options.some((option) => option.value === DEFAULT_CONFIG.auth)
      ? DEFAULT_CONFIG.auth
      : "none",
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response as Auth;
}
