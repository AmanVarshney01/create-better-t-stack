import { describe, expect, test } from "bun:test";

import {
  AnalyticsEventSchema,
  normalizeAnalyticsCLIVersion,
  normalizeAnalyticsNodeVersion,
} from "../src/analytics";

const validEvent = {
  database: "postgres",
  orm: "drizzle",
  backend: "hono",
  runtime: "node",
  frontend: ["next"],
  addons: ["biome"],
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
  cli_version: "3.38.2",
  node_version: "v24.5.0",
  platform: "darwin",
} as const;

describe("AnalyticsEventSchema", () => {
  test("accepts canonical events and strips fields outside the analytics contract", () => {
    const parsed = AnalyticsEventSchema.parse({
      ...validEvent,
      projectName: "private-project",
      addonOptions: { fumadocs: { search: "orama" } },
      dbSetupOptions: { neon: { projectName: "private-database" } },
    });

    expect(parsed).toEqual(validEvent);
  });

  test("keeps legitimate values emitted by older CLI releases", () => {
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        addons: ["ruler"],
        cli_version: "3.24.0",
      }).success,
    ).toBe(true);
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        node_version: "24",
      }).success,
    ).toBe(true);
  });

  test("rejects values that could create unbounded aggregate keys", () => {
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        backend: "x1842_24801",
        frontend: ["f1842_24165"],
        platform: "p1842_29212",
      }).success,
    ).toBe(false);
  });

  test("rejects malformed version identifiers", () => {
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        cli_version: "not-a-version",
      }).success,
    ).toBe(false);
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        node_version: "node-latest",
      }).success,
    ).toBe(false);
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        cli_version: "1842.0.0",
      }).success,
    ).toBe(false);
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        node_version: "v1842.0.0",
      }).success,
    ).toBe(false);
  });

  test("rejects duplicate and contradictory list values", () => {
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        frontend: ["next", "next"],
      }).success,
    ).toBe(false);
    expect(
      AnalyticsEventSchema.safeParse({
        ...validEvent,
        addons: ["none", "biome"],
      }).success,
    ).toBe(false);
  });

  test("normalizes version aggregation keys", () => {
    expect(normalizeAnalyticsCLIVersion("3.38.2-canary.1")).toBe("3.38.2");
    expect(normalizeAnalyticsNodeVersion("v24.5.0")).toBe("v24");
  });

  test("normalizes empty multi-select choices to none", () => {
    const parsed = AnalyticsEventSchema.parse({
      ...validEvent,
      frontend: [],
      addons: [],
      examples: [],
    });

    expect(parsed.frontend).toEqual(["none"]);
    expect(parsed.addons).toEqual(["none"]);
    expect(parsed.examples).toEqual(["none"]);
  });
});
