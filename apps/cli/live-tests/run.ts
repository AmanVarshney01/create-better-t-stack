import { createHash } from "node:crypto";
import { mkdir, open, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import { usesAlchemyManagedDatabase, type ProjectConfig } from "@better-t-stack/types";
import { execa } from "execa";
import { z } from "zod";

import { readBtsConfig } from "../src/utils/bts-config";
import { openBrowser, verificationBlockers, verifyBrowser } from "./browser";
import { Blocked, Commands } from "./command";
import { DatabaseAssertions, migrateDatabase } from "./database";
import { startLocal } from "./local";
import { caseId, configurations, selectionSchema } from "./matrix";
import {
  cleanup,
  captureVercelLogs,
  deployAlchemy,
  deployVercel,
  provisionDatabase,
  writeEnvironment,
} from "./providers";
import { verifyServer } from "./server";
import { RunState, type Status } from "./state";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    where: { type: "string" },
    directory: { type: "string" },
    limit: { type: "string" },
    "retry-failed": { type: "boolean", default: false },
    "retain-failed": { type: "boolean", default: false },
  },
});
const action = z.enum(["plan", "run", "report", "cleanup"]).parse(positionals[0] ?? "plan");
if ((action === "run" || action === "cleanup") && process.env.CI)
  throw new Error("Live deployments and cleanup run locally, outside CI.");
const filter = selectionSchema.parse(JSON.parse(values.where ?? "{}"));
const limit = values.limit ? z.coerce.number().int().positive().parse(values.limit) : Infinity;
const root = path.resolve(import.meta.dir, "../../..");
const cli = path.join(root, "apps/cli/dist/cli.mjs");
const existingRun = action === "cleanup" || action === "report";
if (existingRun && !values.directory)
  throw new Error(`${action} requires --directory pointing to an existing run.`);
const gitSha = (await execa("git", ["rev-parse", "HEAD"], { cwd: root })).stdout;
async function hashDirectory(directory: string, sourceHash: ReturnType<typeof createHash>) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await hashDirectory(file, sourceHash);
    else if (entry.isFile())
      sourceHash.update(path.relative(root, file)).update(await readFile(file));
  }
}
async function fingerprint() {
  const sourceHash = createHash("sha256");
  for (const directory of [
    "apps/cli/dist",
    "apps/cli/src",
    "packages/types/dist",
    "packages/template-generator/dist",
    "apps/cli/live-tests",
  ])
    await hashDirectory(path.join(root, directory), sourceHash);
  sourceHash.update(await readFile(path.join(root, "bun.lock")));
  return sourceHash.digest("hex");
}
const binaryHash = existingRun ? "" : await fingerprint();
const identity = JSON.stringify({ gitSha, binaryHash, filter });
const directory = path.resolve(
  values.directory ??
    path.join(
      root,
      "apps/cli/.smoke/live",
      createHash("sha256").update(identity).digest("hex").slice(0, 12),
    ),
);
const state = new RunState(
  directory,
  action === "cleanup" || action === "report" ? undefined : identity,
);
const abort = new AbortController();
for (const signal of ["SIGINT", "SIGTERM"] as const) process.once(signal, () => abort.abort());
let browser: Awaited<ReturnType<typeof openBrowser>> | undefined;
const lockPath = path.join(directory, "runner.lock");
const lock =
  action === "run" || action === "cleanup"
    ? await open(lockPath, "wx", 0o600).catch(() => {
        state.close();
        throw new Error(
          `Run is locked: ${lockPath}. Stop the owning process before removing a stale lock.`,
        );
      })
    : undefined;
if (lock) await lock.writeFile(String(process.pid));

async function cleanCase(id: string, commands: Commands) {
  const resources = state.resources(id).reverse();
  const failures: string[] = [];
  for (const resource of resources) {
    try {
      await cleanup(resource, commands);
      state.deleted(resource);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (failures.length) throw new Error(`Cleanup incomplete: ${failures.join("; ")}`);
}

async function executeCase(selection: ProjectConfig, id: string) {
  const previous = state.result(id);
  if (previous?.status === "passed" || (previous?.status === "failed" && !values["retry-failed"]))
    return;
  const caseDirectory = path.join(directory, id, `attempt-${Date.now()}`);
  await mkdir(caseDirectory, { recursive: true, mode: 0o700 });
  const name = `bts-live-${path.basename(directory).slice(0, 6)}-${id.slice(0, 12)}`;
  const project = path.join(caseDirectory, name);
  const config = { ...selection, projectName: name, relativePath: name, projectDir: project };
  const commands = new Commands(caseDirectory, abort.signal);
  for (const [key, value] of Object.entries(process.env))
    if (value && /TOKEN|SECRET|PASSWORD|API_KEY/.test(key)) commands.secret(value);
  let status: Status = "running";
  let detail = "";
  let database: DatabaseAssertions | undefined;
  state.record(id, config, status, detail, caseDirectory);
  try {
    if (state.resources(id).length) await cleanCase(id, commands);
    const blockers = verificationBlockers(config);
    const targets = new Set([config.webDeploy, config.serverDeploy].filter((t) => t !== "none"));
    if (targets.has("vercel") && targets.size > 1)
      blockers.push("Mixed-provider URL wiring verification required");
    if (targets.has("docker")) blockers.push("Docker execution adapter required");
    if (
      config.dbSetup !== "neon" &&
      config.database !== "none" &&
      !(config.database === "sqlite" && config.dbSetup === "none" && targets.size === 0) &&
      !usesAlchemyManagedDatabase(config) &&
      config.dbSetup !== "d1"
    )
      blockers.push(`Provisioner required: ${config.dbSetup}/${config.database}`);
    if (blockers.length) throw new Blocked(blockers.join("; "));
    await writeFile(path.join(caseDirectory, "config.json"), JSON.stringify(config, null, 2));
    const { projectDir: _dir, relativePath: _rel, ...input } = config;
    await commands.run("generate", caseDirectory, "node", [
      cli,
      "create-json",
      "--json",
      JSON.stringify({
        ...input,
        frontend: input.frontend.length ? input.frontend : ["none"],
        addons: input.addons.length ? input.addons : ["none"],
        examples: input.examples.length ? input.examples : ["none"],
        directoryConflict: "error",
        disableAnalytics: true,
        dbSetupOptions: { mode: usesAlchemyManagedDatabase(config) ? "alchemy" : "manual" },
      }),
    ]);
    const saved = await readBtsConfig(project);
    if (!saved) throw new Error("Generated project did not save a valid bts.jsonc");
    const normalize = (value: ProjectConfig[keyof typeof filter] | undefined) =>
      Array.isArray(value) ? value.filter((item) => item !== "none").sort() : value;
    for (const key of selectionSchema.keyof().options) {
      if (JSON.stringify(normalize(saved[key])) !== JSON.stringify(normalize(config[key])))
        throw new Error(
          `CLI generated a different ${key}: expected ${JSON.stringify(config[key])}, received ${JSON.stringify(saved[key])}`,
        );
    }
    const databaseUrl = await provisionDatabase(config, state, id, commands);
    await writeEnvironment(config, databaseUrl, commands);
    if (databaseUrl) {
      await migrateDatabase(config, commands);
      database = new DatabaseAssertions(databaseUrl);
    }
    if (config.addons.some((addon) => ["biome", "oxlint", "vite-plus"].includes(addon)))
      await commands.run("check", project, config.packageManager, ["run", "check"]);
    await commands.run("check-types", project, config.packageManager, ["run", "check-types"]);
    browser ??= await openBrowser();
    if (targets.has("vercel")) {
      for (const stage of ["production", "preview"] as const) {
        const deployment = await deployVercel(config, state, id, commands, stage);
        await writeFile(
          path.join(caseDirectory, `${stage}-deployment.json`),
          JSON.stringify(deployment, null, 2),
          { mode: 0o600 },
        );
        const verificationErrors: unknown[] = [];
        try {
          if (config.frontend.length)
            await verifyBrowser(
              browser,
              config,
              deployment,
              caseDirectory,
              stage,
              database,
              stage === "preview" ? "production" : undefined,
            );
          else
            await verifyServer(
              config,
              deployment,
              stage,
              database,
              stage === "preview" ? "production" : undefined,
            );
        } catch (error) {
          verificationErrors.push(error);
        }
        try {
          await captureVercelLogs(config, deployment, commands, stage);
        } catch (error) {
          verificationErrors.push(error);
        }
        if (verificationErrors.length) throw new Error(verificationErrors.map(String).join("\n"));
      }
    } else if (targets.size === 0) {
      await commands.run("build", project, config.packageManager, ["run", "build"]);
      for (const mode of ["development", "production"] as const) {
        const deployment = await startLocal(config, commands, mode);
        if (config.frontend.length)
          await verifyBrowser(
            browser,
            config,
            deployment,
            caseDirectory,
            mode,
            database,
            mode === "production" ? "development" : undefined,
          );
        else
          await verifyServer(
            config,
            deployment,
            mode,
            database,
            mode === "production" ? "development" : undefined,
          );
        await commands.stopAll();
      }
    } else {
      const deployment = await deployAlchemy(config, state, id, commands);
      await writeFile(
        path.join(caseDirectory, "deployment.json"),
        JSON.stringify(deployment, null, 2),
        { mode: 0o600 },
      );
      if (config.frontend.length)
        await verifyBrowser(browser, config, deployment, caseDirectory, "alchemy");
      else await verifyServer(config, deployment, "alchemy");
    }
    status = "passed";
  } catch (error) {
    status = abort.signal.aborted ? "interrupted" : error instanceof Blocked ? "blocked" : "failed";
    detail = commands.redact(error instanceof Error ? error.message : String(error));
  } finally {
    try {
      await database?.close();
    } catch (error) {
      status = "failed";
      detail += `\nDatabase connection cleanup failed: ${commands.redact(String(error))}`;
    }
    try {
      await commands.stopAll();
    } catch (error) {
      status = "failed";
      detail += `\nLocal process cleanup failed: ${commands.redact(String(error))}`;
    }
    if (!abort.signal.aborted && !(values["retain-failed"] && status === "failed")) {
      try {
        await cleanCase(id, commands);
      } catch (error) {
        status = "failed";
        detail += `\n${commands.redact(String(error))}`;
      }
    }
    state.record(id, config, status, detail, caseDirectory);
    console.log(
      `${status.toUpperCase()} ${id}: ${detail || `${config.frontend.join("+")}/${config.orm}/${config.dbSetup}/${config.webDeploy}`}`,
    );
  }
}

try {
  console.log(`Run: ${directory}\nCommit: ${gitSha}\nSelection: ${JSON.stringify(filter)}`);
  if (action === "report")
    console.log(
      JSON.stringify(
        {
          metadata: state.db.query("SELECT * FROM metadata").all(),
          summary: state.summary(),
          cases: state.db
            .query("SELECT id, status, detail, directory FROM cases ORDER BY id")
            .all(),
          pendingResources: state.resources(),
        },
        null,
        2,
      ),
    );
  else if (action === "cleanup") {
    for (const resource of state.resources().reverse()) {
      const commands = new Commands(directory, abort.signal);
      await cleanup(resource, commands);
      state.deleted(resource);
    }
  } else {
    let count = 0;
    let complete = true;
    for (const config of configurations(filter)) {
      if (abort.signal.aborted || count >= limit) {
        complete = false;
        break;
      }
      const id = caseId(config);
      if (action === "run") {
        if ((await fingerprint()) !== binaryHash)
          throw new Error(
            "CLI or runner changed during this run; start a new run with the updated inputs.",
          );
        await executeCase(config, id);
      }
      count++;
      if (count % 10_000 === 0)
        console.log(
          `${count.toLocaleString()} configurations ${action === "plan" ? "counted" : "visited"}`,
        );
    }
    state.metadata("enumerationComplete", String(complete));
    state.metadata("enumerated", String(count));
    console.log(
      `${count.toLocaleString()} configurations; enumeration ${complete ? "complete" : "incomplete"}.`,
    );
    console.log(state.summary());
    if (
      !complete ||
      count === 0 ||
      state.db.query("SELECT 1 FROM cases WHERE status <> 'passed' LIMIT 1").get() ||
      state.resources().length
    )
      process.exitCode = 1;
  }
} finally {
  try {
    await browser?.close();
  } finally {
    state.close();
    if (lock) {
      await lock.close();
      await unlink(lockPath);
    }
  }
}
