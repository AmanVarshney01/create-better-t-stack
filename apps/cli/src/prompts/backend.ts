import type { Backend, Frontend } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

// Frontends with built-in server capabilities for backend="self"
const FULLSTACK_FRONTENDS: readonly Frontend[] = [
  "next",
  "tanstack-start",
  "astro",
  "nuxt",
  "svelte",
  "solid-start",
] as const;

export async function getBackendFrameworkChoice(
  backendFramework?: Backend,
  frontends?: Frontend[],
) {
  if (backendFramework !== undefined) return backendFramework;

  const hasIncompatibleFrontend = frontends?.some((f) => f === "solid" || f === "solid-start");
  const hasFullstackFrontend = frontends?.some((f) => FULLSTACK_FRONTENDS.includes(f));

  const backendOptions: Array<{
    value: Backend;
    label: string;
    hint: string;
  }> = [];

  if (hasFullstackFrontend) {
    backendOptions.push({
      value: "self" as const,
      label: "Self (Fullstack)",
      hint: "Use frontend's built-in api routes",
    });
  }

  backendOptions.push(
    {
      value: "hono" as const,
      label: "Hono",
      hint: "Lightweight, ultrafast web framework",
    },
    {
      value: "express" as const,
      label: "Express",
      hint: "Fast, unopinionated, minimalist web framework for Node.js",
    },
    {
      value: "fastify" as const,
      label: "Fastify",
      hint: "Fast, low-overhead web framework for Node.js",
    },
    {
      value: "elysia" as const,
      label: "Elysia",
      hint: "Ergonomic web framework for building backend servers",
    },
    {
      value: "fets" as const,
      label: "feTS",
      hint: "TypeScript HTTP Framework with e2e type-safety",
    },
    {
      value: "nestjs" as const,
      label: "NestJS",
      hint: "Progressive Node.js framework for scalable applications",
    },
    {
      value: "adonisjs" as const,
      label: "AdonisJS",
      hint: "Full-featured MVC framework for Node.js",
    },
    {
      value: "nitro" as const,
      label: "Nitro",
      hint: "Universal server framework from UnJS",
    },
    {
      value: "encore" as const,
      label: "Encore",
      hint: "Backend development platform with built-in infrastructure",
    },
  );

  if (!hasIncompatibleFrontend) {
    backendOptions.push({
      value: "convex" as const,
      label: "Convex",
      hint: "Reactive backend-as-a-service platform",
    });
  }

  backendOptions.push({
    value: "none" as const,
    label: "None",
    hint: "No backend server",
  });

  const response = await navigableSelect<Backend>({
    message: "Select backend",
    options: backendOptions,
    initialValue: hasFullstackFrontend ? "self" : DEFAULT_CONFIG.backend,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
