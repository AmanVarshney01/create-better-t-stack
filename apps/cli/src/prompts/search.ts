import type { Backend, Search } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getSearchChoice(search?: Search, backend?: Backend) {
  if (search !== undefined) return search;

  // Search requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as Search;
  }

  const options = [
    {
      value: "meilisearch" as const,
      label: "Meilisearch",
      hint: "Lightning-fast search engine with typo tolerance",
    },
    {
      value: "typesense" as const,
      label: "Typesense",
      hint: "Fast, typo-tolerant search with built-in vector search",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip search engine setup",
    },
  ];

  const response = await navigableSelect<Search>({
    message: "Select search engine",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
