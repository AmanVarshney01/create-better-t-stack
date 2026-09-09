import { expect, test } from "bun:test";
import { join } from "node:path";

import { execa } from "execa";
import fs from "fs-extra";

import { SMOKE_DIR } from "./setup";

const cliPath = join(import.meta.dir, "../dist/cli.mjs");

function runCli(args: string[]) {
  return execa("node", [cliPath, ...args], {
    cwd: SMOKE_DIR,
    timeout: 15_000,
    env: { BTS_TELEMETRY: "0", BTS_SKIP_EXTERNAL_COMMANDS: "0", BTS_TEST_MODE: "0" },
  });
}

test("schema stdout is valid JSON for command-line consumers", async () => {
  const { stdout } = await runCli(["schema", "--name", "createInput"]);
  expect(JSON.parse(stdout)).toMatchObject({ type: "object" });
});

test("create-json preserves dry-run behavior and emits a JSON result", async () => {
  const { stdout } = await runCli([
    "create-json",
    "--json",
    JSON.stringify({
      projectName: "json-dry-run",
      yes: true,
      install: false,
      git: false,
      dryRun: true,
      disableAnalytics: true,
    }),
  ]);
  expect(JSON.parse(stdout)).toMatchObject({ success: true });
  expect(await fs.pathExists(join(SMOKE_DIR, "json-dry-run"))).toBe(false);
});

test("default create respects negated flags and add-json creates a workspace package", async () => {
  const projectDir = join(SMOKE_DIR, "command-output");
  await runCli([
    "command-output",
    "--yes",
    "--no-install",
    "--no-git",
    "--no-render-title",
    "--disable-analytics",
  ]);
  expect(await fs.pathExists(join(projectDir, "bts.jsonc"))).toBe(true);
  expect(await fs.pathExists(join(projectDir, "node_modules"))).toBe(false);
  expect(await fs.pathExists(join(projectDir, ".git"))).toBe(false);

  const { stdout } = await runCli([
    "add-json",
    "--json",
    JSON.stringify({ projectDir, package: "shared", install: false, disableAnalytics: true }),
  ]);
  expect(JSON.parse(stdout)).toMatchObject({ success: true });
  expect(await fs.pathExists(join(projectDir, "packages/shared/src/index.ts"))).toBe(true);
});
