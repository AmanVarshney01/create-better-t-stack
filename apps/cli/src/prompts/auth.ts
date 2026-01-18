import type { Auth, Backend } from "../types";

import { DEFAULT_CONFIG } from "../constants";
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
  if (backend === "convex") {
    const supportedBetterAuthFrontends = frontend?.some((f) =>
      [
        "tanstack-router",
        "tanstack-start",
        "next",
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

    if (supportedBetterAuthFrontends) {
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
      initialValue: "none",
    });
    if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });
    return response as Auth;
  }

  const response = await navigableSelect({
    message: "Select authentication provider",
    options: [
      {
        value: "better-auth",
        label: "Better-Auth",
        hint: "comprehensive auth framework for TypeScript",
      },
      { value: "none", label: "None" },
    ],
    initialValue: DEFAULT_CONFIG.auth,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response as Auth;
}
