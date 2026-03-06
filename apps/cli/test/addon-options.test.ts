import { describe, expect, it } from "bun:test";
import fs from "fs-extra";
import path from "node:path";

import { add, create } from "../src/index";
import { readBtsConfig } from "../src/utils/bts-config";

const SMOKE_DIR_PATH = path.join(import.meta.dir, "..", ".smoke");

describe("Addon options", () => {
  it("persists addonOptions during create and uses create-json reproducible command", async () => {
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
      ruler: {
        assistants: ["agentsmd", "claude", "codex"] as const,
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
      addons: ["wxt", "opentui", "fumadocs", "mcp", "ruler", "skills", "ultracite"],
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
    expect(result.value.reproducibleCommand).toContain("create-json --input");

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
});
