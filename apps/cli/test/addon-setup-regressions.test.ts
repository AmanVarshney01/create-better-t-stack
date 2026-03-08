import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { setupMcp, getRecommendedMcpServers } from "../src/helpers/addons/mcp-setup";
import { setupSkills } from "../src/helpers/addons/skills-setup";
import type { ProjectConfig } from "../src/types";
import { runWithContextAsync } from "../src/utils/context";
import { SMOKE_DIR } from "./setup";

function createProjectConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: "test-app",
    projectDir: path.join(SMOKE_DIR, "addon-setup-regressions"),
    relativePath: ".",
    database: "sqlite",
    orm: "drizzle",
    backend: "hono",
    runtime: "bun",
    frontend: ["tanstack-router"],
    addons: ["none"],
    examples: ["none"],
    auth: "none",
    payments: "none",
    git: false,
    packageManager: "bun",
    install: false,
    dbSetup: "none",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    ...overrides,
  };
}

async function writeFakeBunx(binDir: string, markerFile: string, exitCode = 99) {
  const bunxPath = path.join(binDir, "bunx");
  await fs.ensureDir(binDir);
  await fs.writeFile(
    bunxPath,
    `#!/bin/sh
printf '%s\n' "$*" >> "${markerFile}"
exit ${exitCode}
`,
  );
  await fs.chmod(bunxPath, 0o755);
}

async function runWithFakeBunx<T>(
  projectDir: string,
  callback: () => Promise<T>,
  exitCode = 99,
): Promise<{ markerFile: string; result: T }> {
  const binDir = path.join(projectDir, ".fake-bin");
  const markerFile = path.join(projectDir, "runner.log");
  await fs.ensureDir(projectDir);
  await writeFakeBunx(binDir, markerFile, exitCode);

  const previousPath = process.env.PATH;
  const previousSkipExternal = process.env.BTS_SKIP_EXTERNAL_COMMANDS;
  const previousTestMode = process.env.BTS_TEST_MODE;

  process.env.PATH = `${binDir}${path.delimiter}${previousPath ?? ""}`;
  delete process.env.BTS_SKIP_EXTERNAL_COMMANDS;
  delete process.env.BTS_TEST_MODE;

  try {
    const result = await callback();
    return { markerFile, result };
  } finally {
    if (previousPath === undefined) {
      delete process.env.PATH;
    } else {
      process.env.PATH = previousPath;
    }

    if (previousSkipExternal === undefined) {
      delete process.env.BTS_SKIP_EXTERNAL_COMMANDS;
    } else {
      process.env.BTS_SKIP_EXTERNAL_COMMANDS = previousSkipExternal;
    }

    if (previousTestMode === undefined) {
      delete process.env.BTS_TEST_MODE;
    } else {
      process.env.BTS_TEST_MODE = previousTestMode;
    }
  }
}

describe("Addon setup regressions", () => {
  it("uses a package execution command for the Better T Stack MCP server target", () => {
    const servers = getRecommendedMcpServers(createProjectConfig(), "project");
    const betterTStackServer = servers.find((server) => server.key === "better-t-stack");

    expect(betterTStackServer?.target).toBe("bunx create-better-t-stack@latest mcp");
  });

  it("preserves explicit empty MCP selections in silent mode", async () => {
    const projectDir = path.join(SMOKE_DIR, "mcp-explicit-empty");
    await fs.remove(projectDir);

    const config = createProjectConfig({
      projectDir,
      addons: ["mcp"],
      addonOptions: {
        mcp: {
          scope: "project",
          servers: [],
          agents: [],
        },
      },
    });

    const { markerFile, result } = await runWithFakeBunx(projectDir, () =>
      runWithContextAsync({ silent: true }, () => setupMcp(config)),
    );

    expect(result.isOk()).toBe(true);
    expect(await fs.pathExists(markerFile)).toBe(false);
  });

  it("installs explicitly configured MCP servers even when they are not recommended", async () => {
    const projectDir = path.join(SMOKE_DIR, "mcp-nonrecommended-server");
    await fs.remove(projectDir);

    const config = createProjectConfig({
      projectDir,
      addons: ["mcp"],
      addonOptions: {
        mcp: {
          scope: "project",
          servers: ["next-devtools"],
          agents: ["cursor"],
        },
      },
    });

    const { markerFile, result } = await runWithFakeBunx(
      projectDir,
      () => runWithContextAsync({ silent: true }, () => setupMcp(config)),
      0,
    );

    expect(result.isOk()).toBe(true);
    expect(await fs.readFile(markerFile, "utf8")).toContain("--name next-devtools");
  });

  it("returns an error when every requested MCP install fails", async () => {
    const projectDir = path.join(SMOKE_DIR, "mcp-all-installs-fail");
    await fs.remove(projectDir);

    const config = createProjectConfig({
      projectDir,
      addons: ["mcp"],
      addonOptions: {
        mcp: {
          scope: "project",
          servers: ["context7"],
          agents: ["cursor"],
        },
      },
    });

    const { markerFile, result } = await runWithFakeBunx(projectDir, () =>
      runWithContextAsync({ silent: true }, () => setupMcp(config)),
    );

    expect(result.isErr()).toBe(true);
    expect(await fs.readFile(markerFile, "utf8")).toContain("context7");
  });

  it("preserves an explicit empty skills agent list in silent mode", async () => {
    const projectDir = path.join(SMOKE_DIR, "skills-explicit-empty-agents");
    await fs.remove(projectDir);

    const config = createProjectConfig({
      projectDir,
      frontend: ["next"],
      addons: ["skills"],
      addonOptions: {
        skills: {
          scope: "project",
          agents: [],
          selections: [
            {
              source: "vercel-labs/agent-skills",
              skills: ["web-design-guidelines"],
            },
          ],
        },
      },
    });

    const { markerFile, result } = await runWithFakeBunx(projectDir, () =>
      runWithContextAsync({ silent: true }, () => setupSkills(config)),
    );

    expect(result.isOk()).toBe(true);
    expect(await fs.pathExists(markerFile)).toBe(false);
  });

  it("uses persisted skills options and preserves explicit non-recommended selections", async () => {
    const projectDir = path.join(SMOKE_DIR, "skills-persisted-selections");
    await fs.remove(projectDir);
    await fs.ensureDir(projectDir);
    await fs.writeFile(
      path.join(projectDir, "bts.jsonc"),
      JSON.stringify({
        version: "0.0.0-test",
        createdAt: new Date(0).toISOString(),
        projectName: "test-app",
        database: "sqlite",
        orm: "drizzle",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
        addons: ["skills"],
        examples: ["none"],
        auth: "none",
        payments: "none",
        packageManager: "bun",
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        addonOptions: {
          skills: {
            scope: "project",
            agents: ["codex"],
            selections: [
              {
                source: "vercel/turborepo",
                skills: ["turborepo"],
              },
            ],
          },
        },
      }),
    );

    const config = createProjectConfig({
      projectDir,
      frontend: ["tanstack-router"],
      addons: ["skills"],
    });

    const { markerFile, result } = await runWithFakeBunx(
      projectDir,
      () => runWithContextAsync({ silent: true }, () => setupSkills(config)),
      0,
    );

    expect(result.isOk()).toBe(true);
    const commandLog = await fs.readFile(markerFile, "utf8");
    expect(commandLog).toContain("skills@latest add vercel/turborepo");
    expect(commandLog).toContain("--agent codex");
    expect(commandLog).toContain("--skill turborepo");
  });
});
