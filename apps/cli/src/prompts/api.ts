import type { API, AstroIntegration, Backend, Frontend } from "../types";

import { allowedApisForFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getApiChoice(
  Api?: API | undefined,
  frontend?: Frontend[],
  backend?: Backend,
  astroIntegration?: AstroIntegration,
) {
  if (backend === "convex" || backend === "none") {
    return "none";
  }

  const allowed = allowedApisForFrontends(frontend ?? [], astroIntegration);

  if (Api) {
    return allowed.includes(Api) ? Api : allowed[0];
  }
  const apiOptionMap: Record<API, { value: API; label: string; hint: string }> = {
    trpc: {
      value: "trpc",
      label: "tRPC",
      hint: "End-to-end typesafe APIs made easy",
    },
    orpc: {
      value: "orpc",
      label: "oRPC",
      hint: "End-to-end type-safe APIs that adhere to OpenAPI standards",
    },
    "ts-rest": {
      value: "ts-rest",
      label: "ts-rest",
      hint: "RPC-like client, contract, and server implementation for REST APIs",
    },
    garph: {
      value: "garph",
      label: "Garph",
      hint: "Fullstack GraphQL framework with end-to-end type safety",
    },
    none: {
      value: "none",
      label: "None",
      hint: "No API layer (e.g. for full-stack frameworks like Next.js with Route Handlers)",
    },
  };

  const apiOptions = allowed.map((a) => apiOptionMap[a as API]);

  const apiType = await navigableSelect<API>({
    message: "Select API type",
    options: apiOptions,
    initialValue: apiOptions[0].value,
  });

  if (isCancel(apiType)) return exitCancelled("Operation cancelled");

  return apiType;
}
