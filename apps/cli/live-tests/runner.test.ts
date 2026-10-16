import { Database } from "bun:sqlite";
import { afterEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";

import { usesAlchemyManagedDatabase } from "@better-t-stack/types";
import { request } from "@playwright/test";
import { z } from "zod";

import { waitForDeployment } from "./browser";
import { cleanResources } from "./cleanup";
import { Commands } from "./command";
import { DatabaseAssertions } from "./database";
import { caseId, configurations, type Selection } from "./matrix";
import { assertPreviewProtected } from "./providers";
import { RunState } from "./state";
import { checkDeployedProjectTypes } from "./typecheck";
import { verifyRuntime } from "./verification";

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

test("manual and managed databases remain distinct deploy cases", () => {
  const managed = [...configurations({ ...selection, serverDeploy: "prisma" })][0]!;
  const manual = [
    ...configurations({
      ...selection,
      serverDeploy: "prisma",
      dbSetupOptions: { mode: "manual" },
    }),
  ][0]!;
  expect(usesAlchemyManagedDatabase(managed)).toBe(true);
  expect(usesAlchemyManagedDatabase(manual)).toBe(false);
  expect(manual.dbSetupOptions).toEqual({ mode: "manual" });
  expect(caseId(managed)).not.toBe(caseId(manual));
});

test("deferred typechecks cover server and native errors without rebuilding Start", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "bts-live-typechecks-"));
  directories.push(directory);
  symlinkSync(
    path.resolve(import.meta.dir, "../../../node_modules"),
    path.join(directory, "node_modules"),
  );
  const valid = 'export const value: string = "ok";';
  for (const workspace of ["packages/api", "apps/server", "apps/native", "apps/web"]) {
    const workspaceDirectory = path.join(directory, workspace);
    mkdirSync(workspaceDirectory, { recursive: true });
    writeFileSync(
      path.join(workspaceDirectory, "package.json"),
      JSON.stringify({
        scripts: {
          "check-types":
            workspace === "apps/web"
              ? "exit 99"
              : "node ../../node_modules/typescript/bin/tsc --noEmit",
        },
      }),
    );
    writeFileSync(
      path.join(workspaceDirectory, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { types: [], skipLibCheck: true }, include: ["index.ts"] }),
    );
    writeFileSync(path.join(workspaceDirectory, "index.ts"), valid);
  }
  const commands = new Commands(directory, new AbortController().signal);
  await checkDeployedProjectTypes(directory, "bun", commands);
  for (const workspace of ["packages-api", "apps-server", "apps-native", "web"])
    expect(
      readdirSync(directory).some((name) => name.endsWith(`check-types-${workspace}.log`)),
    ).toBe(true);

  for (const app of ["native", "server"]) {
    const source = path.join(directory, "apps", app, "index.ts");
    writeFileSync(source, "export const value: string = 123;");
    await expect(checkDeployedProjectTypes(directory, "bun", commands)).rejects.toThrow(
      `check-types-apps-${app} failed`,
    );
    writeFileSync(source, valid);
  }
}, 30000);

test("deployment readiness retries a connection reset and a temporary 404", async () => {
  let attempts = 0;
  const server = createServer((incoming, response) => {
    attempts++;
    if (attempts === 1) incoming.socket.destroy();
    else response.writeHead(attempts === 2 ? 404 : 200).end("ready");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = z.object({ port: z.number().int().positive() }).parse(server.address());
  const context = await request.newContext();
  try {
    await waitForDeployment(context, `http://127.0.0.1:${port}`);
    expect(attempts).toBe(3);
  } finally {
    await context.dispose();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("preview protection accepts denials and Vercel login redirects, not application redirects", () => {
  for (const status of [401, 403])
    expect(() => assertPreviewProtected(new Response(null, { status }))).not.toThrow();
  expect(() =>
    assertPreviewProtected(
      new Response(null, {
        status: 307,
        headers: { location: "https://vercel.com/login" },
      }),
    ),
  ).not.toThrow();
  for (const location of [
    "/login",
    "https://app.example.test/login",
    "https://vercel.com.example.test/login",
  ])
    expect(() =>
      assertPreviewProtected(new Response(null, { status: 307, headers: { location } })),
    ).toThrow("Deployment Protection");
  for (const status of [200, 500])
    expect(() => assertPreviewProtected(new Response(null, { status }))).toThrow(
      "Deployment Protection",
    );
});

test("a bounded matrix preserves explicit empty selections and rejects an incompatible stack", () => {
  const cases = [...configurations(selection)];
  expect(cases).toHaveLength(1);
  expect(cases[0]).toMatchObject(selection);
  expect([...configurations({ ...selection, database: "mongodb" })]).toHaveLength(0);
  expect(caseId(cases[0]!)).toBe(
    caseId({ ...cases[0]!, projectDir: "/different", projectName: "renamed" }),
  );
});

test("none sentinels produce the same server-only case as empty selections", () => {
  const serverOnly = { ...selection, frontend: [], auth: "none", examples: [] } satisfies Selection;
  const empty = [...configurations(serverOnly)];
  const sentinels = [
    ...configurations({ ...serverOnly, frontend: ["none"], addons: ["none"], examples: ["none"] }),
  ];
  expect(empty).toHaveLength(1);
  expect(sentinels).toEqual(empty);
  expect(caseId(sentinels[0]!)).toBe(caseId(empty[0]!));
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

test("cleanup attempts every resource, retains failures, and redacts distinct logs", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "bts-live-cleanup-"));
  directories.push(directory);
  const state = new RunState(directory, "cleanup-test");
  state.resource("case", "neon", "deleted", directory);
  state.resource("case", "vercel-intent", "retained", directory);
  const previousSecret = process.env.BTS_TEST_API_KEY;
  process.env.BTS_TEST_API_KEY = "cleanup-test-credential";
  const commands = new Commands(directory, new AbortController().signal);
  if (previousSecret === undefined) delete process.env.BTS_TEST_API_KEY;
  else process.env.BTS_TEST_API_KEY = previousSecret;
  const attempted: string[] = [];
  try {
    await expect(
      cleanResources(state, commands, undefined, async (resource, sharedCommands) => {
        attempted.push(resource.id);
        await sharedCommands.run("cleanup", directory, process.execPath, [
          "-e",
          "console.log('cleanup-test-credential')",
        ]);
        if (resource.id === "retained")
          throw new Error("cleanup-test-credential could not be removed");
      }),
    ).rejects.toThrow("Cleanup incomplete: [REDACTED] could not be removed");
    expect(attempted).toEqual(["retained", "deleted"]);
    expect(state.resources().map((resource) => resource.id)).toEqual(["retained"]);
    for (const name of ["01-cleanup.log", "02-cleanup.log"])
      expect(await Bun.file(path.join(directory, name)).text()).toBe("[REDACTED]");
  } finally {
    state.close();
  }
});

test("a server-only verification succeeds without a browser installation", async () => {
  const config = [
    ...configurations({
      ...selection,
      frontend: ["none"],
      api: "none",
      auth: "none",
      examples: [],
    }),
  ][0]!;
  const server = Bun.serve({ port: 0, fetch: () => new Response("OK") });
  let browserRequested = false;
  try {
    await verifyRuntime(config, { server: server.url.href }, "/unused", "production", async () => {
      browserRequested = true;
      throw new Error("Chromium is not installed");
    });
    expect(browserRequested).toBe(false);
  } finally {
    await server.stop(true);
  }
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

test("database assertions fail on missing, duplicated, or incorrectly persisted records", async () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "bts-live-database-"));
  directories.push(directory);
  const file = path.join(directory, "test.db");
  const writer = new Database(file);
  writer.exec(
    "CREATE TABLE user (email TEXT, name TEXT); CREATE TABLE todo (text TEXT, completed INTEGER);",
  );
  const database = new DatabaseAssertions(`file:${file}`);
  try {
    await expect(database.user("test@example.test")).rejects.toThrow();
    writer.query("INSERT INTO user VALUES (?, ?)").run("test@example.test", "Live Test");
    await database.user("test@example.test");
    writer.query("INSERT INTO todo VALUES (?, ?)").run("Task", 0);
    await database.todo("Task", false);
    await expect(database.todo("Task", true)).rejects.toThrow();
    writer.exec("UPDATE todo SET completed=1");
    await database.todo("Task", true);
    await expect(database.todo("Task", undefined)).rejects.toThrow();
    writer.exec("INSERT INTO todo SELECT * FROM todo");
    await expect(database.todo("Task", true)).rejects.toThrow();
    writer.exec("DELETE FROM todo");
    await database.todo("Task", undefined);
  } finally {
    await database.close();
    writer.close();
  }
});
