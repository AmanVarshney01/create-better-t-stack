import { describe, expect, test } from "bun:test";

import type { ProjectConfig } from "../src/types";
import { buildAnalyticsEvent } from "../src/utils/analytics";

const projectConfig: ProjectConfig = {
  projectName: "private-project",
  projectDir: "/private/project",
  relativePath: "../private/project",
  addonOptions: {
    fumadocs: {
      template: "next-mdx",
      search: "orama",
    },
  },
  dbSetupOptions: {
    neon: {
      projectName: "private-database",
      regionId: "private-region",
    },
  },
  database: "postgres",
  orm: "drizzle",
  backend: "hono",
  runtime: "node",
  frontend: ["next"],
  addons: ["fumadocs"],
  examples: ["todo"],
  auth: "better-auth",
  payments: "polar",
  git: true,
  packageManager: "bun",
  install: true,
  dbSetup: "neon",
  api: "trpc",
  webDeploy: "vercel",
  serverDeploy: "none",
};

describe("buildAnalyticsEvent", () => {
  test("only includes fields from the public analytics contract", () => {
    const event = buildAnalyticsEvent(projectConfig);

    expect(event).not.toHaveProperty("projectName");
    expect(event).not.toHaveProperty("projectDir");
    expect(event).not.toHaveProperty("relativePath");
    expect(event).not.toHaveProperty("addonOptions");
    expect(event).not.toHaveProperty("dbSetupOptions");
    expect(event).toMatchObject({
      database: "postgres",
      backend: "hono",
      frontend: ["next"],
      platform: process.platform,
      node_version: process.version,
    });
  });

  test("sends none for empty multi-select choices", () => {
    const event = buildAnalyticsEvent({
      ...projectConfig,
      frontend: [],
      addons: [],
      examples: [],
    });

    expect(event.frontend).toEqual(["none"]);
    expect(event.addons).toEqual(["none"]);
    expect(event.examples).toEqual(["none"]);
  });
});
