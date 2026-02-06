import type { Backend, Runtime } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getRuntimeChoice(runtime?: Runtime, backend?: Backend) {
  if (backend === "convex" || backend === "none" || backend === "self") {
    return "none";
  }

  if (runtime !== undefined) return runtime;

  const runtimeOptions: Array<{
    value: Runtime;
    label: string;
    hint: string;
  }> = [
    {
      value: "bun",
      label: "Bun",
      hint: "Fast all-in-one JavaScript runtime",
    },
    {
      value: "node",
      label: "Node.js",
      hint: "Traditional Node.js runtime",
    },
  ];

  if (backend === "hono") {
    runtimeOptions.push({
      value: "workers",
      label: "Cloudflare Workers",
      hint: "Edge runtime on Cloudflare's global network",
    });
  }

  const response = await navigableSelect<Runtime>({
    message: "Select runtime",
    options: runtimeOptions,
    initialValue: DEFAULT_CONFIG.runtime,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
