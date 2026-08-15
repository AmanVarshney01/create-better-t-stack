import { describe, expect, test } from "bun:test";

import {
  adjustAnalyticsStats,
  createEmptyAnalyticsStats,
  type AnalyticsEventFields,
} from "../convex/analytics_helpers";

const legitimateEvent: AnalyticsEventFields = {
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
};

const poisonedEvent: AnalyticsEventFields = {
  ...legitimateEvent,
  backend: "x1842_24801",
  frontend: ["f1842_24165"],
  cli_version: "v1842",
  node_version: undefined,
  platform: "p1842_29212",
};

describe("adjustAnalyticsStats", () => {
  test("counts empty and missing selections as none", () => {
    const stats = adjustAnalyticsStats(
      createEmptyAnalyticsStats(),
      [
        {
          event: {
            ...legitimateEvent,
            frontend: [],
            addons: [],
            examples: undefined,
          },
          creationTime: Date.UTC(2026, 7, 10, 4),
        },
      ],
      1,
    );

    expect(stats.frontend).toEqual({ none: 1 });
    expect(stats.addons).toEqual({ none: 1 });
    expect(stats.examples).toEqual({ none: 1 });
    expect(stats.stackCombinations).toEqual({ "hono + none": 1 });
  });

  test("normalizes version keys during ingestion", () => {
    const stats = adjustAnalyticsStats(
      createEmptyAnalyticsStats(),
      [
        {
          event: {
            ...legitimateEvent,
            cli_version: "3.38.2-canary.1",
            node_version: "v24.5.0",
          },
          creationTime: Date.UTC(2026, 7, 10, 4),
        },
      ],
      1,
    );

    expect(stats.cliVersion).toEqual({ "3.38.2": 1 });
    expect(stats.nodeVersion).toEqual({ v24: 1 });
  });

  test("quarantining a poisoned event reverses every aggregate it changed", () => {
    const withBothEvents = adjustAnalyticsStats(
      createEmptyAnalyticsStats(),
      [
        { event: poisonedEvent, creationTime: Date.UTC(2026, 7, 9, 3) },
        { event: legitimateEvent, creationTime: Date.UTC(2026, 7, 10, 4) },
      ],
      1,
      { legacyVersionKeys: true },
    );
    const repaired = adjustAnalyticsStats(
      withBothEvents,
      [{ event: poisonedEvent, creationTime: Date.UTC(2026, 7, 9, 3) }],
      -1,
      { legacyVersionKeys: true },
    );
    const expected = adjustAnalyticsStats(
      createEmptyAnalyticsStats(),
      [{ event: legitimateEvent, creationTime: Date.UTC(2026, 7, 10, 4) }],
      1,
    );

    expect(repaired).toEqual(expected);
  });
});
