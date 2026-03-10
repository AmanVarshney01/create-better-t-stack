import { DEFAULT_CONFIG } from "../constants";
import type { Auth, Backend } from "../types";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getAuthChoice(
  auth: Auth | undefined,
  backend?: Backend,
  frontend?: string[],
) {
  if (auth !== undefined) return auth;
  if (backend === "none") {
    return "none" as Auth;
  }
  const supportedBetterAuthFrontends = frontend?.some((f) =>
    [
      "tanstack-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ].includes(f),
  );

  const hasClerkCompatibleFrontends = frontend?.some((f) =>
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

  const options = [];

  if (backend === "convex") {
    if (supportedBetterAuthFrontends) {
      options.push({
        value: "better-auth",
        label: "Better-Auth",
        hint: "comprehensive auth framework for TypeScript",
      });
    }
  } else {
    options.push({
      value: "better-auth",
      label: "Better-Auth",
      hint: "comprehensive auth framework for TypeScript",
    });
  }

  if (hasClerkCompatibleFrontends) {
    options.push({
      value: "clerk",
      label: "Clerk",
      hint: "More than auth, Complete User Management",
    });
  }

  if (options.length === 0) {
    return "none" as Auth;
  }

  options.push({ value: "none", label: "None", hint: "No auth" });

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
