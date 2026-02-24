import type { Auth, Backend } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";
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
    if (isCancel(response)) return exitCancelled("Operation cancelled");
    return response as Auth;
  }

  // NextAuth and Stack Auth only work with Next.js frontend and self backend
  const hasNextJs = frontend?.includes("next");
  const hasTanStackStart = frontend?.includes("tanstack-start");
  const isSelfBackend = backend === "self";
  const supportsNextJsAuth = hasNextJs && isSelfBackend;
  const hasNativeFrontend = frontend?.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const supportsClerkSelf =
    isSelfBackend && !hasNativeFrontend && Boolean(hasNextJs || hasTanStackStart);

  const options = [
    {
      value: "better-auth",
      label: "Better-Auth",
      hint: "comprehensive auth framework for TypeScript",
    },
  ];

  if (supportsClerkSelf) {
    options.push({
      value: "clerk",
      label: "Clerk",
      hint: "More than auth, Complete User Management",
    });
  }

  if (supportsNextJsAuth) {
    options.push({
      value: "nextauth",
      label: "Auth.js (NextAuth)",
      hint: "Authentication for Next.js (formerly NextAuth.js)",
    });
    options.push({
      value: "stack-auth",
      label: "Stack Auth",
      hint: "Open-source Auth0/Clerk alternative",
    });
    options.push({
      value: "supabase-auth",
      label: "Supabase Auth",
      hint: "Auth with Supabase platform integration",
    });
    options.push({
      value: "auth0",
      label: "Auth0",
      hint: "Flexible identity platform for authentication",
    });
  }

  options.push({ value: "none", label: "None", hint: "No authentication" });

  const response = await navigableSelect({
    message: "Select authentication provider",
    options,
    initialValue: DEFAULT_CONFIG.auth,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response as Auth;
}
