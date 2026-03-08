import { describe, expect, it } from "bun:test";
import { join } from "node:path";

import fs from "fs-extra";

import { postProcessTuiWorkspace, resolveTuiTemplate } from "../src/helpers/addons/tui-setup";
import type { ProjectConfig } from "../src/types";
import { runWithContextAsync } from "../src/utils/context";
import { SMOKE_DIR } from "./setup";

function createTuiConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: "test-app",
    projectDir: SMOKE_DIR,
    relativePath: "test-app",
    database: "sqlite",
    orm: "drizzle",
    backend: "hono",
    runtime: "bun",
    frontend: ["tanstack-router"],
    addons: ["opentui"],
    examples: ["none"],
    auth: "none",
    payments: "none",
    git: true,
    packageManager: "bun",
    install: false,
    dbSetup: "none",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    ...overrides,
  };
}

describe("OpenTUI setup", () => {
  it("defaults to the core template in silent mode", async () => {
    const template = await runWithContextAsync({ silent: true }, async () =>
      resolveTuiTemplate(createTuiConfig()),
    );

    expect(template).toBe("core");
  });

  it("uses persisted addon options before falling back to the silent default", async () => {
    const template = await runWithContextAsync({ silent: true }, async () =>
      resolveTuiTemplate(
        createTuiConfig({
          addonOptions: {
            opentui: {
              template: "react",
            },
          },
        }),
      ),
    );

    expect(template).toBe("react");
  });

  it("injects check-types and removes nested lockfiles during post-processing", async () => {
    const tuiDir = join(SMOKE_DIR, "tui-post-process");
    await fs.ensureDir(tuiDir);
    await fs.writeJson(join(tuiDir, "package.json"), {
      name: "tui",
      scripts: {
        dev: "opentui dev",
      },
    });

    await fs.writeFile(join(tuiDir, "bun.lock"), "");
    await fs.writeFile(join(tuiDir, "pnpm-lock.yaml"), "");

    const result = await postProcessTuiWorkspace(tuiDir);

    expect(result.isOk()).toBe(true);

    const packageJson = await fs.readJson(join(tuiDir, "package.json"));
    expect(packageJson.scripts["check-types"]).toBe("tsc --noEmit");
    expect(await fs.pathExists(join(tuiDir, "bun.lock"))).toBe(false);
    expect(await fs.pathExists(join(tuiDir, "pnpm-lock.yaml"))).toBe(false);
  });
});
