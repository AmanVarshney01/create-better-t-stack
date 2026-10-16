import { describe, expect, it } from "bun:test";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseEnv } from "node:util";

import { z } from "zod";

import {
  setupSupabase,
  SUPABASE_CLI_PACKAGE,
} from "../src/helpers/database-providers/supabase-setup";
import type { PackageManager, ProjectConfig } from "../src/types";
import { runWithContextAsync } from "../src/utils/context";
import {
  beginInterruptibleScope,
  endInterruptibleScope,
  startInterruptibleStep,
} from "../src/utils/interrupt";
import { SMOKE_DIR } from "./setup";

const assignedUrl = "postgresql://postgres:postgres@127.0.0.1:28123/postgres";
const callSchema = z.object({
  args: z.array(z.string()),
  cwd: z.string(),
  stack: z.string().nullable(),
});

type FixtureOptions = {
  packageManager?: PackageManager;
  backend?: "hono" | "self";
  mode?: "auto" | "manual";
  fail?: "init" | "start" | "status";
  status?: string;
  existingConfig?: boolean;
  experimentalStack?: boolean;
  hangStatus?: boolean;
};

/** Exercise setup against controllable provider processes and existing credentials. */
async function runFixture(name: string, options: FixtureOptions = {}) {
  const projectDir = path.join(SMOKE_DIR, `supabase-${name}`);
  const dbDirectory = path.join(projectDir, "packages/db");
  const bin = path.join(projectDir, "bin");
  const log = path.join(projectDir, "calls.jsonl");
  const backend = options.backend ?? "hono";
  const appEnv = path.join(projectDir, "apps", backend === "self" ? "web" : "server", ".env");
  await mkdir(bin, { recursive: true });
  await mkdir(dbDirectory, { recursive: true });
  await mkdir(path.dirname(appEnv), { recursive: true });
  const originalEnv =
    "# preserve my settings\nDATABASE_URL=postgresql://existing/db\nDIRECT_URL=postgresql://existing/direct\nCUSTOM=keep\n";
  await writeFile(appEnv, originalEnv);
  const configPath = path.join(dbDirectory, "supabase/config.toml");
  if (options.existingConfig) {
    await mkdir(path.dirname(configPath), { recursive: true });
    await writeFile(
      configPath,
      'project_id = "keep-my-config"\n' +
        (options.experimentalStack ? "[experimental]\nstack = true\n" : ""),
    );
  }
  for (const runner of ["bunx", "npx", "pnpm"]) {
    const file = path.join(bin, runner);
    await writeFile(
      file,
      `#!/usr/bin/env node
import fs from "node:fs";
const args = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(log)}, JSON.stringify({args, cwd: process.cwd(), stack: process.env.SUPABASE_EXPERIMENTAL_STACK ?? null}) + "\\n");
const command = args.find((arg) => ["init", "start", "status"].includes(arg));
if (command === ${JSON.stringify(options.fail ?? "")}) process.exit(1);
if (command === "init") {
  fs.mkdirSync("supabase", {recursive: true});
  fs.writeFileSync("supabase/config.toml", 'project_id = "fixture"\\n');
}
if (command === "status") {
  if (${JSON.stringify(options.hangStatus ?? false)}) setInterval(() => {}, 1000);
  else console.log(${JSON.stringify(options.status ?? JSON.stringify({ DB_URL: assignedUrl }))});
}
`,
    );
    await chmod(file, 0o755);
  }
  const config: ProjectConfig = {
    projectName: name,
    projectDir,
    relativePath: name,
    database: "postgres",
    orm: "drizzle",
    backend,
    runtime: backend === "self" ? "none" : "bun",
    frontend: ["next"],
    addons: [],
    examples: [],
    auth: "none",
    payments: "none",
    git: false,
    packageManager: options.packageManager ?? "bun",
    install: false,
    dbSetup: "supabase",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    dbSetupOptions: { mode: options.mode ?? "auto" },
  };
  const previousPath = process.env.PATH;
  process.env.PATH = `${bin}${path.delimiter}${previousPath ?? ""}`;
  try {
    const result = await runWithContextAsync({ silent: true }, () => setupSupabase(config));
    const calls = (await readFile(log, "utf8").catch(() => ""))
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => callSchema.parse(JSON.parse(line)));
    return {
      result,
      calls,
      env: await readFile(appEnv, "utf8"),
      originalEnv,
      dbDirectory,
      configPath,
    };
  } finally {
    if (previousPath === undefined) delete process.env.PATH;
    else process.env.PATH = previousPath;
  }
}

describe("Supabase stable local setup", () => {
  for (const packageManager of ["bun", "npm", "pnpm"] as const) {
    for (const backend of ["hono", "self"] as const) {
      it(`writes the assigned database URL for ${packageManager}/${backend}`, async () => {
        const fixture = await runFixture(`${packageManager}-${backend}`, {
          packageManager,
          backend,
        });
        expect(fixture.result.isOk()).toBe(true);
        expect(parseEnv(fixture.env)).toEqual({
          DATABASE_URL: assignedUrl,
          DIRECT_URL: assignedUrl,
          CUSTOM: "keep",
        });
        expect(fixture.env).toContain("# preserve my settings");
        expect(fixture.calls).toHaveLength(3);
        for (const call of fixture.calls) {
          expect(call.cwd).toBe(fixture.dbDirectory);
          expect(call.stack).toBe("0");
          expect(call.args).not.toContain("--experimental");
          expect(call.args).not.toContain("--preparation");
          expect(call.args).toContain(SUPABASE_CLI_PACKAGE);
        }
        expect(fixture.calls[0]!.args).toContain("init");
        expect(fixture.calls[1]!.args).toContain("start");
        expect(fixture.calls[2]!.args.slice(-2)).toEqual(["--output", "json"]);
        expect(await readFile(fixture.configPath, "utf8")).not.toMatch(/^\s*stack\s*=\s*true/m);
      });
    }
  }

  it("preserves existing Supabase configuration instead of reinitializing it", async () => {
    const fixture = await runFixture("existing-config", { existingConfig: true });
    expect(fixture.result.isOk()).toBe(true);
    expect(fixture.calls).toHaveLength(2);
    expect(await readFile(fixture.configPath, "utf8")).toContain('project_id = "keep-my-config"');
  });

  it("leaves manually configured credentials untouched and runs no provider commands", async () => {
    const fixture = await runFixture("manual", { mode: "manual" });
    expect(fixture.result.isOk()).toBe(true);
    expect(fixture.calls).toEqual([]);
    expect(fixture.env).toBe(fixture.originalEnv);
  });

  it("forces Docker even when existing configuration and the parent environment enable stacks", async () => {
    const previousStack = process.env.SUPABASE_EXPERIMENTAL_STACK;
    process.env.SUPABASE_EXPERIMENTAL_STACK = "1";
    try {
      const fixture = await runFixture("force-docker", {
        existingConfig: true,
        experimentalStack: true,
      });
      expect(fixture.result.isOk()).toBe(true);
      expect(fixture.calls).toHaveLength(2);
      expect(fixture.calls.every((call) => call.stack === "0")).toBe(true);
      expect(await readFile(fixture.configPath, "utf8")).toContain("stack = true");
      expect(process.env.SUPABASE_EXPERIMENTAL_STACK).toBe("1");
    } finally {
      if (previousStack === undefined) delete process.env.SUPABASE_EXPERIMENTAL_STACK;
      else process.env.SUPABASE_EXPERIMENTAL_STACK = previousStack;
    }
  });

  it("interrupts a hanging status process without replacing existing credentials", async () => {
    beginInterruptibleScope();
    startInterruptibleStep();
    const pending = runFixture("cancel-status", { hangStatus: true });
    try {
      const log = path.join(SMOKE_DIR, "supabase-cancel-status/calls.jsonl");
      let statusStarted = false;
      for (let attempt = 0; attempt < 200; attempt++) {
        const calls = await readFile(log, "utf8").catch(() => "");
        if (calls.includes('"status"')) {
          statusStarted = true;
          break;
        }
        await Bun.sleep(20);
      }
      expect(statusStarted).toBe(true);
      process.emit("SIGINT");
      const fixture = await pending;
      expect(fixture.result.isErr()).toBe(true);
      expect(fixture.calls).toHaveLength(3);
      expect(fixture.env).toBe(fixture.originalEnv);
    } finally {
      process.emit("SIGINT");
      await pending;
      endInterruptibleScope();
    }
  });

  for (const fail of ["init", "start", "status"] as const) {
    it(`reports ${fail} failures without replacing credentials with a guessed URL`, async () => {
      const fixture = await runFixture(`fail-${fail}`, { fail });
      expect(fixture.result.isErr()).toBe(true);
      expect(fixture.calls).toHaveLength(["init", "start", "status"].indexOf(fail) + 1);
      expect(fixture.env).toBe(fixture.originalEnv);
    });
  }

  for (const [index, status] of ["not json", "{}", '{"DB_URL":"https://example.test"}'].entries()) {
    it(`rejects invalid status output ${index} without changing the environment`, async () => {
      const fixture = await runFixture(`invalid-status-${index}`, { status });
      expect(fixture.calls).toHaveLength(3);
      expect(fixture.result.isErr()).toBe(true);
      expect(fixture.env).toBe(fixture.originalEnv);
    });
  }
});
