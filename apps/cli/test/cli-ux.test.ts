import { describe, expect, it } from "bun:test";
import { PassThrough } from "node:stream";
import { stripVTControlCharacters } from "node:util";

import { formatHistoryEntry } from "../src/commands/history";
import { gatherConfig } from "../src/prompts/config-prompts";
import { isCancel, isGoBack, navigableSelect } from "../src/prompts/navigable";
import { navigableGroup } from "../src/prompts/navigable-group";
import type { ProjectConfig } from "../src/types";
import { getCliSubcommandCommand } from "../src/utils/cli-invocation";
import { getPromptProgress, runWithContextAsync, type PromptProgress } from "../src/utils/context";
import { getConfigSections } from "../src/utils/display-config";

describe("CLI flow presentation", () => {
  it("supports back navigation through custom streams", async () => {
    const input = new PassThrough();
    const output = Object.assign(new PassThrough(), { columns: 80, rows: 20 });
    let rendered = "";
    output.on("data", (chunk) => (rendered += chunk));

    const resultPromise = runWithContextAsync({}, () =>
      navigableSelect({
        message: "Pick a framework",
        options: [
          { value: "next", label: "Next.js" },
          { value: "nuxt", label: "Nuxt" },
        ],
        input,
        output,
      }),
    );

    input.write("b");

    expect(isGoBack(await resultPromise)).toBe(true);
    const plainRendered = stripVTControlCharacters(rendered);
    expect(plainRendered).toContain("Pick a framework");
    expect(plainRendered).toContain("back");
    expect(plainRendered).toContain("↶  Pick a framework");
    expect(plainRendered).not.toContain("■");
  });

  it("limits long lists and honors AbortSignal cancellation", async () => {
    const input = new PassThrough();
    const output = Object.assign(new PassThrough(), { columns: 60, rows: 10 });
    const controller = new AbortController();
    let rendered = "";
    output.on("data", (chunk) => (rendered += chunk));

    const resultPromise = runWithContextAsync({}, () =>
      navigableSelect({
        message: "Pick an option",
        options: Array.from({ length: 20 }, (_, index) => ({
          value: index,
          label: `Option ${index + 1}`,
        })),
        input,
        output,
        signal: controller.signal,
      }),
    );

    controller.abort();

    expect(isCancel(await resultPromise)).toBe(true);
    expect(rendered).toContain("...");
    expect(rendered).not.toContain("Option 20");
  });

  it("tracks staged progress while a navigable group runs", async () => {
    const seen: PromptProgress[] = [];

    await runWithContextAsync({}, async () => {
      const result = await navigableGroup<{ frontend: string; database: string }>(
        {
          frontend: async () => {
            seen.push(getPromptProgress()!);
            return "next";
          },
          database: async () => {
            seen.push(getPromptProgress()!);
            return "postgres";
          },
        },
        {
          sections: [
            { label: "App", prompts: ["frontend"] },
            { label: "Data", prompts: ["database"] },
          ],
        },
      );

      expect(result).toEqual({ frontend: "next", database: "postgres" });
      expect(getPromptProgress()).toBeUndefined();
    });

    expect(seen).toEqual([
      {
        current: 1,
        total: 2,
        section: "App",
        sectionCurrent: 1,
        sectionTotal: 1,
      },
      {
        current: 2,
        total: 2,
        section: "Data",
        sectionCurrent: 1,
        sectionTotal: 1,
      },
    ]);
  });

  it("keeps incompatible preselected values when YOLO validation is disabled", async () => {
    const result = await runWithContextAsync({}, () =>
      gatherConfig(
        {
          frontend: ["nuxt"],
          backend: "hono",
          runtime: "bun",
          api: "trpc",
          database: "mongodb",
          orm: "drizzle",
          dbSetup: "none",
          auth: "none",
          payments: "none",
          addons: ["none"],
          examples: ["none"],
          webDeploy: "none",
          serverDeploy: "none",
          git: false,
          packageManager: "bun",
          install: false,
        },
        "yolo-app",
        "/tmp/yolo-app",
        "yolo-app",
        { skipCompatibilityChecks: true },
      ),
    );

    expect(result.frontend).toEqual(["nuxt"]);
    expect(result.api).toBe("trpc");
    expect(result.database).toBe("mongodb");
    expect(result.orm).toBe("drizzle");
  });

  it("groups the selected stack and uses product-facing labels", () => {
    const config = {
      projectName: "acme-app",
      relativePath: "apps/acme-app",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      api: "trpc",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "neon",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo", "mcp"],
      examples: [],
      packageManager: "pnpm",
      git: true,
      install: false,
    } satisfies Partial<ProjectConfig>;

    expect(getConfigSections(config)).toEqual([
      {
        title: "Project",
        rows: [
          { label: "Name", value: "acme-app" },
          { label: "Directory", value: "apps/acme-app" },
        ],
      },
      {
        title: "Application",
        rows: [
          { label: "Frontend", value: "TanStack Router" },
          { label: "Backend", value: "Hono" },
          { label: "Runtime", value: "Bun" },
          { label: "API", value: "tRPC" },
        ],
      },
      {
        title: "Data",
        rows: [
          { label: "Database", value: "PostgreSQL" },
          { label: "ORM", value: "Drizzle" },
          { label: "Setup", value: "Neon" },
        ],
      },
      {
        title: "Product",
        rows: [
          { label: "Auth", value: "Better Auth" },
          { label: "Payments", value: "None" },
          { label: "Addons", value: "Turborepo, MCP servers" },
          { label: "Examples", value: "None" },
        ],
      },
      {
        title: "Delivery",
        rows: [
          { label: "Package manager", value: "pnpm" },
          { label: "Git", value: "Yes" },
          { label: "Install deps", value: "No" },
        ],
      },
    ]);
  });

  it("formats history as a compact, human-readable recreation entry", () => {
    const output = formatHistoryEntry(
      {
        id: "history-1",
        projectName: "acme-app",
        projectDir: "/work/acme-app",
        createdAt: "2026-07-23T04:30:00.000Z",
        stack: {
          frontend: ["tanstack-router"],
          backend: "hono",
          database: "sqlite",
          orm: "drizzle",
          runtime: "bun",
          auth: "better-auth",
          payments: "none",
          api: "trpc",
          addons: ["turborepo"],
          examples: ["none"],
          dbSetup: "none",
          packageManager: "bun",
        },
        cliVersion: "1.0.0",
        reproducibleCommand: "bun create better-t-stack@latest acme-app --yes",
      },
      0,
    );

    expect(output).toContain("1. acme-app");
    expect(output).toContain("Location");
    expect(output).toContain("TanStack Router + Hono + SQLite + Drizzle");
    expect(output).toContain("Recreate");
    expect(output).toContain("bun create better-t-stack@latest acme-app --yes");
    expect(output).not.toContain("tanstack-router");
  });

  it("uses the active package runner for follow-up commands", () => {
    expect(getCliSubcommandCommand("history", "npm", "bun/1.3.0")).toBe(
      "bunx create-better-t-stack@latest history",
    );
    expect(getCliSubcommandCommand("history", "bun", "npm/11.0.0")).toBe(
      "npx create-better-t-stack@latest history",
    );
    expect(getCliSubcommandCommand("history", "npm", "pnpm/10.0.0")).toBe(
      "pnpm dlx create-better-t-stack@latest history",
    );
    expect(getCliSubcommandCommand("history", "bun", "")).toBe(
      "bunx create-better-t-stack@latest history",
    );
  });
});
