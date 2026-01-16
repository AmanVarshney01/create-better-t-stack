import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { StackDisplay } from "@/app/(home)/stack/_components/stack-display";
import { DEFAULT_STACK, type StackState } from "@/lib/constant";
import { stackUrlKeys } from "@/lib/stack-url-keys";

// For now, parse search params manually - will be migrated to proper zod validation in Phase 3
function parseStackFromSearch(search: Record<string, unknown>): StackState {
  const parseArray = (value: unknown, defaultValue: string[]): string[] => {
    if (typeof value === "string") {
      return value.split(",").filter(Boolean);
    }
    return defaultValue;
  };

  const parseString = (value: unknown, defaultValue: string): string => {
    if (typeof value === "string") {
      return value;
    }
    return defaultValue;
  };

  return {
    projectName: parseString(search[stackUrlKeys.projectName], DEFAULT_STACK.projectName),
    webFrontend: parseArray(search[stackUrlKeys.webFrontend], DEFAULT_STACK.webFrontend),
    nativeFrontend: parseArray(search[stackUrlKeys.nativeFrontend], DEFAULT_STACK.nativeFrontend),
    astroIntegration: parseString(
      search[stackUrlKeys.astroIntegration],
      DEFAULT_STACK.astroIntegration,
    ) as StackState["astroIntegration"],
    runtime: parseString(
      search[stackUrlKeys.runtime],
      DEFAULT_STACK.runtime,
    ) as StackState["runtime"],
    backend: parseString(
      search[stackUrlKeys.backend],
      DEFAULT_STACK.backend,
    ) as StackState["backend"],
    api: parseString(search[stackUrlKeys.api], DEFAULT_STACK.api) as StackState["api"],
    database: parseString(
      search[stackUrlKeys.database],
      DEFAULT_STACK.database,
    ) as StackState["database"],
    orm: parseString(search[stackUrlKeys.orm], DEFAULT_STACK.orm) as StackState["orm"],
    dbSetup: parseString(
      search[stackUrlKeys.dbSetup],
      DEFAULT_STACK.dbSetup,
    ) as StackState["dbSetup"],
    auth: parseString(search[stackUrlKeys.auth], DEFAULT_STACK.auth) as StackState["auth"],
    payments: parseString(
      search[stackUrlKeys.payments],
      DEFAULT_STACK.payments,
    ) as StackState["payments"],
    packageManager: parseString(
      search[stackUrlKeys.packageManager],
      DEFAULT_STACK.packageManager,
    ) as StackState["packageManager"],
    addons: parseArray(search[stackUrlKeys.addons], DEFAULT_STACK.addons),
    examples: parseArray(search[stackUrlKeys.examples], DEFAULT_STACK.examples),
    git: parseString(search[stackUrlKeys.git], DEFAULT_STACK.git) as StackState["git"],
    install: parseString(
      search[stackUrlKeys.install],
      DEFAULT_STACK.install,
    ) as StackState["install"],
    webDeploy: parseString(
      search[stackUrlKeys.webDeploy],
      DEFAULT_STACK.webDeploy,
    ) as StackState["webDeploy"],
    serverDeploy: parseString(
      search[stackUrlKeys.serverDeploy],
      DEFAULT_STACK.serverDeploy,
    ) as StackState["serverDeploy"],
    yolo: parseString(search[stackUrlKeys.yolo], DEFAULT_STACK.yolo) as StackState["yolo"],
  };
}

export const Route = createFileRoute("/stack")({
  head: ({ search }) => {
    const stackState = parseStackFromSearch(search as Record<string, unknown>);
    const projectName = stackState.projectName || "my-better-t-app";
    const title = `${projectName} – Better-T-Stack`;

    return {
      meta: [
        { title },
        {
          name: "description",
          content: "View and share your custom tech stack configuration",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "View and share your custom tech stack configuration",
        },
        { property: "og:url", content: "https://better-t-stack.dev/stack" },
        {
          property: "og:image",
          content: "https://r2.better-t-stack.dev/og.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        {
          name: "twitter:description",
          content: "View and share your custom tech stack configuration",
        },
        {
          name: "twitter:image",
          content: "https://r2.better-t-stack.dev/og.png",
        },
      ],
    };
  },
  component: StackPage,
});

function StackPage() {
  const search = Route.useSearch();
  const stackState = parseStackFromSearch(search as Record<string, unknown>);

  return (
    <Suspense>
      <StackDisplay stackState={stackState} />
    </Suspense>
  );
}
