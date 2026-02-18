import { afterAll, describe, expect, it } from "bun:test";
import { execa } from "execa";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import * as JSONC from "jsonc-parser";

const CLI_ENTRY = resolve(import.meta.dir, "..", "src", "cli.ts");
const TEMP_ROOTS: string[] = [];

async function makeTempRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), prefix));
  TEMP_ROOTS.push(root);
  return root;
}

async function runCli(
  args: string[],
  options: {
    cwd: string;
    env?: Record<string, string>;
  },
) {
  return execa("bun", ["run", CLI_ENTRY, ...args], {
    cwd: options.cwd,
    env: {
      ...process.env,
      CI: "true",
      ...options.env,
    },
    reject: false,
  });
}

async function readJsoncFile(path: string): Promise<unknown> {
  const raw = await readFile(path, "utf8");
  const errors: JSONC.ParseError[] = [];
  const parsed = JSONC.parse(raw, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  });
  if (errors.length > 0) {
    throw new Error(`Failed to parse JSONC: ${path}`);
  }
  return parsed;
}

afterAll(async () => {
  await Promise.all(TEMP_ROOTS.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("CLI add command", () => {
  it("adds addon via --addons and is idempotent for already-installed addon", async () => {
    const root = await makeTempRoot("bfs-add-test-");
    const projectName = "app";
    const projectDir = join(root, projectName);

    const createResult = await runCli(
      ["create", projectName, "--yes", "--no-install", "--no-git", "--disable-analytics"],
      { cwd: root },
    );

    expect(createResult.exitCode).toBe(0);

    const addResult = await runCli(
      ["add", "--project-dir", projectDir, "--addons", "mcp"],
      {
        cwd: root,
        env: {
          BFS_SKIP_EXTERNAL_COMMANDS: "1",
        },
      },
    );

    expect(addResult.exitCode).toBe(0);
    expect(addResult.stdout).toContain("Successfully added: mcp");

    const config = (await readJsoncFile(join(projectDir, "bts.jsonc"))) as {
      addons?: string[];
    };

    expect(config.addons).toBeDefined();
    expect(config.addons).toContain("mcp");

    const secondAddResult = await runCli(
      ["add", "--project-dir", projectDir, "--addons", "mcp"],
      {
        cwd: root,
        env: {
          BFS_SKIP_EXTERNAL_COMMANDS: "1",
        },
      },
    );

    expect(secondAddResult.exitCode).toBe(0);
    expect(secondAddResult.stdout).toContain("No new addons selected.");
  });
});

describe("CLI history command", () => {
  it("prints JSON history and supports clear", async () => {
    const root = await makeTempRoot("bfs-history-test-");
    const homeDir = join(root, "home");
    await mkdir(homeDir, { recursive: true });

    const sharedEnv = {
      HOME: homeDir,
      XDG_CONFIG_HOME: join(homeDir, ".config"),
      XDG_DATA_HOME: join(homeDir, ".local", "share"),
    };

    const createResult = await runCli(
      ["create", "history-app", "--yes", "--no-install", "--no-git", "--disable-analytics"],
      { cwd: root, env: sharedEnv },
    );
    expect(createResult.exitCode).toBe(0);

    const historyJson = await runCli(["history", "--json", "--limit", "1"], {
      cwd: root,
      env: sharedEnv,
    });
    expect(historyJson.exitCode).toBe(0);

    const parsedHistory = JSON.parse(historyJson.stdout) as Array<{
      projectName: string;
      projectDir: string;
      reproducibleCommand: string;
    }>;

    expect(parsedHistory.length).toBe(1);
    expect(parsedHistory[0]?.projectName).toBe("history-app");
    expect(parsedHistory[0]?.projectDir).toContain("history-app");
    expect(parsedHistory[0]?.reproducibleCommand).toMatch(
      /(create-better-fullstack|bun create better-fullstack@latest)/,
    );

    const clearResult = await runCli(["history", "--clear"], {
      cwd: root,
      env: sharedEnv,
    });
    expect(clearResult.exitCode).toBe(0);

    const historyAfterClear = await runCli(["history", "--json", "--limit", "1"], {
      cwd: root,
      env: sharedEnv,
    });
    expect(historyAfterClear.exitCode).toBe(0);

    const parsedAfterClear = JSON.parse(historyAfterClear.stdout) as unknown[];
    expect(parsedAfterClear).toEqual([]);
  });
});
