import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { StackDisplay } from "@/components/stack/stack-display";
import { DEFAULT_STACK, type StackState } from "@/lib/constant";

// For now, parse search params manually - will be migrated to proper zod validation in Phase 3
function parseStackFromSearch(search: Record<string, unknown>): StackState {
  const parseArray = (value: unknown, defaultValue: string[]): string[] => {
    if (typeof value === "string") {
      return value.split(",").filter(Boolean);
    }
    return defaultValue;
  };

  const parseString = (value: unknown, defaultValue: string | null): string => {
    if (typeof value === "string") {
      return value;
    }
    return defaultValue ?? "";
  };

  // Use direct URL key strings to avoid type issues
  return {
    ecosystem: parseString(search["eco"], DEFAULT_STACK.ecosystem) as StackState["ecosystem"],
    projectName: parseString(search["name"], DEFAULT_STACK.projectName),
    webFrontend: parseArray(search["fe-w"], DEFAULT_STACK.webFrontend),
    nativeFrontend: parseArray(search["fe-n"], DEFAULT_STACK.nativeFrontend),
    astroIntegration: parseString(
      search["ai"],
      DEFAULT_STACK.astroIntegration,
    ) as StackState["astroIntegration"],
    cssFramework: parseString(
      search["css"],
      DEFAULT_STACK.cssFramework,
    ) as StackState["cssFramework"],
    uiLibrary: parseString(search["ui"], DEFAULT_STACK.uiLibrary) as StackState["uiLibrary"],
    runtime: parseString(search["rt"], DEFAULT_STACK.runtime) as StackState["runtime"],
    backend: parseString(search["be"], DEFAULT_STACK.backend) as StackState["backend"],
    api: parseString(search["api"], DEFAULT_STACK.api) as StackState["api"],
    database: parseString(search["db"], DEFAULT_STACK.database) as StackState["database"],
    orm: parseString(search["orm"], DEFAULT_STACK.orm) as StackState["orm"],
    dbSetup: parseString(search["dbs"], DEFAULT_STACK.dbSetup) as StackState["dbSetup"],
    auth: parseString(search["au"], DEFAULT_STACK.auth) as StackState["auth"],
    payments: parseString(search["pay"], DEFAULT_STACK.payments) as StackState["payments"],
    email: parseString(search["em"], DEFAULT_STACK.email) as StackState["email"],
    fileUpload: parseString(search["fu"], DEFAULT_STACK.fileUpload) as StackState["fileUpload"],
    logging: parseString(search["log"], DEFAULT_STACK.logging) as StackState["logging"],
    observability: parseString(
      search["obs"],
      DEFAULT_STACK.observability,
    ) as StackState["observability"],
    backendLibraries: parseString(
      search["bl"],
      DEFAULT_STACK.backendLibraries,
    ) as StackState["backendLibraries"],
    stateManagement: parseString(
      search["sm"],
      DEFAULT_STACK.stateManagement,
    ) as StackState["stateManagement"],
    validation: parseString(search["val"], DEFAULT_STACK.validation) as StackState["validation"],
    testing: parseString(search["tst"], DEFAULT_STACK.testing) as StackState["testing"],
    realtime: parseString(search["rt2"], DEFAULT_STACK.realtime) as StackState["realtime"],
    animation: parseString(search["anim"], DEFAULT_STACK.animation) as StackState["animation"],
    codeQuality: parseArray(search["cq"], DEFAULT_STACK.codeQuality),
    documentation: parseArray(search["doc"], DEFAULT_STACK.documentation),
    appPlatforms: parseArray(search["ap"], DEFAULT_STACK.appPlatforms),
    packageManager: parseString(
      search["pm"],
      DEFAULT_STACK.packageManager,
    ) as StackState["packageManager"],
    examples: parseArray(search["ex"], DEFAULT_STACK.examples),
    git: parseString(search["git"], DEFAULT_STACK.git) as StackState["git"],
    install: parseString(search["i"], DEFAULT_STACK.install) as StackState["install"],
    webDeploy: parseString(search["wd"], DEFAULT_STACK.webDeploy) as StackState["webDeploy"],
    serverDeploy: parseString(
      search["sd"],
      DEFAULT_STACK.serverDeploy,
    ) as StackState["serverDeploy"],
    yolo: parseString(search["yolo"], DEFAULT_STACK.yolo) as StackState["yolo"],
    // Rust ecosystem fields
    rustWebFramework: parseString(
      search["rwf"],
      DEFAULT_STACK.rustWebFramework,
    ) as StackState["rustWebFramework"],
    rustFrontend: parseString(
      search["rfe"],
      DEFAULT_STACK.rustFrontend,
    ) as StackState["rustFrontend"],
    rustOrm: parseString(search["rorm"], DEFAULT_STACK.rustOrm) as StackState["rustOrm"],
    rustApi: parseString(search["rapi"], DEFAULT_STACK.rustApi) as StackState["rustApi"],
    rustCli: parseString(search["rcli"], DEFAULT_STACK.rustCli) as StackState["rustCli"],
    rustLibraries: parseString(
      search["rlib"],
      DEFAULT_STACK.rustLibraries,
    ) as StackState["rustLibraries"],
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
