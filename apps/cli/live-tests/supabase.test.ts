import { afterEach, expect, spyOn, test } from "bun:test";
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { cleanResources } from "./cleanup";
import { Commands } from "./command";
import { configurations } from "./matrix";
import { cleanup, provisionDatabase, supabaseTestEnv } from "./providers";
import { RunState } from "./state";

const directories: string[] = [];
afterEach(async () => {
  for (const directory of directories.splice(0))
    await rm(directory, { recursive: true, force: true });
});

async function fixture() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "bts-supabase-runner-"));
  directories.push(directory);
  const dbDirectory = path.join(directory, "packages/db");
  await mkdir(dbDirectory, { recursive: true });
  const state = new RunState(directory, "supabase-test");
  state.resource("case", "supabase", directory, dbDirectory);
  const commands = new Commands(directory, new AbortController().signal);
  return { directory, dbDirectory, state, commands };
}

test("Supabase cleanup finds exact project roots across branch changes and destroys only recorded fixtures", async () => {
  const { dbDirectory, state, commands } = await fixture();
  const run = spyOn(commands, "run")
    .mockResolvedValueOnce(
      JSON.stringify({
        stacks: [
          { id: "branch-a", project_root: await realpath(dbDirectory) },
          { id: "branch-b", project_root: await realpath(dbDirectory) },
          { id: "unrelated", project_root: `${dbDirectory}-other` },
        ],
      }),
    )
    .mockResolvedValueOnce("destroyed");
  try {
    await cleanResources(state, commands);
    expect(state.resources()).toHaveLength(0);
    const destroy = run.mock.calls[1]!;
    expect(destroy[3]).toEqual(
      expect.arrayContaining(["--stack-id", "branch-a", "--stack-id", "branch-b"]),
    );
    expect(destroy[3]).not.toContain("unrelated");
    expect(destroy[4]).toEqual(supabaseTestEnv);
  } finally {
    state.close();
  }
});

test("Supabase cleanup tolerates initialization failing before a stack exists", async () => {
  const { state, commands } = await fixture();
  const run = spyOn(commands, "run").mockResolvedValueOnce('{"stacks":[]}');
  try {
    await cleanup(state.resources()[0]!, commands);
    expect(run).toHaveBeenCalledTimes(1);
  } finally {
    state.close();
  }
});

test("failed Supabase cleanup remains recorded for a later retry", async () => {
  const { dbDirectory, state, commands } = await fixture();
  spyOn(commands, "run")
    .mockResolvedValueOnce(
      JSON.stringify({ stacks: [{ id: "owned", project_root: await realpath(dbDirectory) }] }),
    )
    .mockRejectedValueOnce(new Error("destroy failed"));
  try {
    await expect(cleanResources(state, commands)).rejects.toThrow("destroy failed");
    expect(state.resources()).toHaveLength(1);
  } finally {
    state.close();
  }
});

test("Supabase verification rejects a CLI setup that saved the wrong database URL", async () => {
  const { directory, state, commands } = await fixture();
  const base = [
    ...configurations({
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "supabase",
      dbSetupOptions: { mode: "auto" },
      auth: "better-auth",
      api: "trpc",
      payments: "none",
      webDeploy: "none",
      serverDeploy: "none",
      packageManager: "bun",
      addons: [],
      examples: ["todo"],
    }),
  ][0]!;
  const config = { ...base, projectDir: directory };
  const url = "postgresql://postgres:postgres@127.0.0.1:28123/postgres";
  await mkdir(path.join(directory, "apps/server"), { recursive: true });
  await writeFile(
    path.join(directory, "apps/server/.env"),
    `DATABASE_URL=${url}\nDIRECT_URL=postgresql://wrong/db\n`,
  );
  const run = spyOn(commands, "run").mockResolvedValue(JSON.stringify({ DB_URL: url }));
  try {
    await expect(provisionDatabase(config, state, "case", commands)).rejects.toThrow(
      "did not save",
    );
    await writeFile(
      path.join(directory, "apps/server/.env"),
      `DATABASE_URL=${url}\nDIRECT_URL=${url}\n`,
    );
    expect(await provisionDatabase(config, state, "case", commands)).toBe(url);
    expect(run).toHaveBeenCalledTimes(2);
  } finally {
    state.close();
  }
});
