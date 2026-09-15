import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { Commands } from "./command";
import { caseId, configurations, type Selection } from "./matrix";
import { RunState } from "./state";

const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

const selection: Selection = {
  frontend: ["tanstack-router"],
  backend: "hono",
  runtime: "bun",
  database: "postgres",
  orm: "drizzle",
  dbSetup: "neon",
  api: "trpc",
  auth: "better-auth",
  payments: "none",
  webDeploy: "none",
  serverDeploy: "none",
  packageManager: "bun",
  addons: [],
  examples: ["todo"],
};

test("a bounded matrix preserves explicit empty selections and rejects an incompatible stack", () => {
  const cases = [...configurations(selection)];
  expect(cases).toHaveLength(1);
  expect(cases[0]).toMatchObject(selection);
  expect([...configurations({ ...selection, database: "mongodb" })]).toHaveLength(0);
  expect(caseId(cases[0]!)).toBe(
    caseId({ ...cases[0]!, projectDir: "/different", projectName: "renamed" }),
  );
});

test("resuming keeps failed resources pending until cleanup is explicitly recorded", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "bts-live-state-"));
  directories.push(directory);
  const config = [...configurations(selection)][0]!;
  const state = new RunState(directory, "same-build");
  state.record("case", config, "failed", "browser failed", directory);
  state.resource("case", "neon", "test-project", directory);
  state.close();
  expect(() => new RunState(directory, "different-build")).toThrow("different source");
  const resumed = new RunState(directory, "same-build");
  expect(resumed.result("case")?.status).toBe("failed");
  expect(resumed.resources()).toHaveLength(1);
  resumed.deleted(resumed.resources()[0]!);
  expect(resumed.resources()).toHaveLength(0);
  resumed.close();
});

test("command failures retain useful diagnostics without exposing registered credentials", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "bts-live-command-"));
  directories.push(directory);
  const commands = new Commands(directory, new AbortController().signal);
  commands.secret("test-credential-value");
  await expect(
    commands.run("failure", directory, process.execPath, [
      "-e",
      "console.error('test-credential-value postgres://user:pass@example.test/db'); process.exit(7)",
    ]),
  ).rejects.toThrow("exit 7");
  const log = await Bun.file(path.join(directory, "01-failure.log")).text();
  expect(log).toContain("[REDACTED]");
  expect(log).not.toContain("test-credential-value");
  expect(log).not.toContain("user:pass");
});
