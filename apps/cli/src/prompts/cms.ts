import type { Backend, CMS } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getCMSChoice(cms?: CMS, backend?: Backend) {
  if (cms !== undefined) return cms;

  // CMS requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as CMS;
  }

  const options = [
    {
      value: "payload" as const,
      label: "Payload",
      hint: "TypeScript-first headless CMS with Next.js integration",
    },
    {
      value: "sanity" as const,
      label: "Sanity",
      hint: "Real-time collaborative CMS with schema-as-code",
    },
    {
      value: "strapi" as const,
      label: "Strapi",
      hint: "Open-source headless CMS with admin panel",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip headless CMS setup",
    },
  ];

  const response = await navigableSelect<CMS>({
    message: "Select headless CMS",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
