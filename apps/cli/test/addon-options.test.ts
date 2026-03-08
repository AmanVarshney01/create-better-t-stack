import { beforeEach, describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { add, create } from "../src/index";
import { readBtsConfig } from "../src/utils/bts-config";

const SMOKE_DIR_PATH = path.join(import.meta.dir, "..", ".smoke");

describe("Addon options", () => {
  beforeEach(() => {
    process.env.BTS_SKIP_EXTERNAL_COMMANDS = "1";
    process.env.BTS_TEST_MODE = "1";
  });

  it("persists addonOptions during create and keeps reproducible command on normal flags", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "addon-options-create");
    await fs.remove(projectPath);

    const addonOptions = {
      wxt: { template: "react" as const, devPort: 5555 },
      opentui: { template: "react" as const },
      fumadocs: { template: "next-mdx" as const, devPort: 4000 },
      mcp: {
        scope: "project" as const,
        servers: ["context7"] as const,
        agents: ["cursor", "codex"] as const,
      },
      skills: {
        scope: "project" as const,
        agents: ["cursor", "codex"] as const,
        selections: [
          {
            source: "vercel-labs/agent-skills" as const,
            skills: ["web-design-guidelines"],
          },
        ],
      },
      ultracite: {
        linter: "biome" as const,
        editors: ["vscode", "cursor"] as const,
        agents: ["claude", "codex"] as const,
        hooks: ["claude"] as const,
      },
    };

    const result = await create(projectPath, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      api: "trpc",
      addons: ["wxt", "opentui", "fumadocs", "mcp", "skills", "ultracite"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      addonOptions,
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    expect(result.value.projectConfig.addonOptions).toEqual(addonOptions);
    expect(result.value.reproducibleCommand).toContain("--frontend tanstack-router");
    expect(result.value.reproducibleCommand).toContain(
      "--addons wxt opentui fumadocs mcp skills ultracite",
    );
    expect(result.value.reproducibleCommand).not.toContain("create-json --input");

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.addonOptions).toEqual(addonOptions);
  });

  it("persists addonOptions during add", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "addon-options-add");
    await fs.remove(projectPath);

    const createResult = await create(projectPath, {
      yes: true,
      install: false,
      disableAnalytics: true,
    });

    expect(createResult.isOk()).toBe(true);
    if (createResult.isErr()) return;

    const addonOptions = {
      wxt: { template: "react" as const },
      mcp: {
        scope: "project" as const,
        servers: ["context7"] as const,
        agents: ["cursor"] as const,
      },
    };

    const addResult = await add({
      projectDir: projectPath,
      addons: ["wxt", "mcp"],
      addonOptions,
      install: false,
      packageManager: "bun",
    });

    expect(addResult?.success).toBe(true);

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.addonOptions).toEqual(addonOptions);
    expect(btsConfig?.addons).toEqual(expect.arrayContaining(["turborepo", "wxt", "mcp"]));
  });

  it("deep merges nested addonOptions during add", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "addon-options-deep-merge");
    await fs.remove(projectPath);

    const createResult = await create(projectPath, {
      yes: true,
      install: false,
      disableAnalytics: true,
    });

    expect(createResult.isOk()).toBe(true);
    if (createResult.isErr()) return;

    const firstAddResult = await add({
      projectDir: projectPath,
      addons: ["mcp"],
      addonOptions: {
        mcp: {
          scope: "project",
          servers: ["context7"],
        },
      },
      install: false,
      packageManager: "bun",
    });

    expect(firstAddResult?.success).toBe(true);

    const secondAddResult = await add({
      projectDir: projectPath,
      addons: ["wxt"],
      addonOptions: {
        mcp: {
          agents: ["codex"],
        },
        wxt: {
          template: "react",
        },
      },
      install: false,
      packageManager: "bun",
    });

    expect(secondAddResult?.success).toBe(true);

    const btsConfig = await readBtsConfig(projectPath);
    expect(btsConfig?.addonOptions).toEqual({
      mcp: {
        scope: "project",
        servers: ["context7"],
        agents: ["codex"],
      },
      wxt: {
        template: "react",
      },
    });
  });
});
