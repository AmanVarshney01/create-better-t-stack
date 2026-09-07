#!/usr/bin/env bun
// Build and boot actual CLI-generated containers, including runtime env validation.
import assert from "node:assert/strict";
import { appendFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const frontend = process.argv[2] ?? "none";
assert(["none", "next", "nuxt", "solid"].includes(frontend), "Unknown Docker sample");
const repo = resolve(import.meta.dir, "..");
const scratch = mkdtempSync(join(tmpdir(), "bts-varlock-docker-"));
const name = `varlock-docker-${frontend}`;
const project = join(scratch, name);
const service = frontend === "none" ? "server" : "web";
const composeName = `bts-varlock-${frontend}-${process.pid}`;
const container = `${composeName}-runtime`;
const port = frontend === "none" ? "3000" : "3001";

async function run(command: string[], cwd = project, allowFailure = false, timeoutMs = 600_000) {
  console.log(`$ ${command.join(" ")}`);
  const child = Bun.spawn(command, {
    cwd,
    env: { ...process.env, BTS_TELEMETRY: "0" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const timeout = setTimeout(() => child.kill(), timeoutMs);
  try {
    const [code, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    const output = stdout + stderr;
    assert(allowFailure || code === 0, `${command.join(" ")} exited ${code}\n${output}`);
    return { code, output };
  } finally {
    clearTimeout(timeout);
  }
}

const compose = (...args: string[]) => ["docker", "compose", "-p", composeName, ...args];

try {
  await run(
    [
      "bun",
      join(repo, "apps/cli/dist/cli.mjs"),
      "create",
      name,
      "--frontend",
      frontend,
      "--backend",
      frontend === "none" ? "hono" : "none",
      "--runtime",
      frontend === "none" ? "node" : "none",
      "--database",
      "none",
      "--orm",
      "none",
      "--api",
      "none",
      "--auth",
      "none",
      "--payments",
      "none",
      "--addons",
      "none",
      "--examples",
      "none",
      "--package-manager",
      "bun",
      "--no-git",
      "--no-install",
      "--open",
      "none",
      "--db-setup",
      "none",
      "--web-deploy",
      frontend === "none" ? "none" : "docker",
      "--server-deploy",
      frontend === "none" ? "docker" : "none",
      "--directory-conflict",
      "error",
      "--disable-analytics",
      "--no-render-title",
    ],
    scratch,
  );
  // Both build-time and runtime loading must validate this synthetic secret.
  appendFileSync(
    join(project, `apps/${service}/.env.schema`),
    "\n# @type=string(minLength=16)\nBTS_DOCKER_REQUIRED=\n",
  );
  appendFileSync(
    join(project, `apps/${service}/.env`),
    "\nBTS_DOCKER_REQUIRED=bts-synthetic-docker-config\n",
  );
  await run(compose("config", "--quiet"));
  await run(compose("build", service));
  await run(
    compose(
      "run",
      "--detach",
      "--no-deps",
      "--name",
      container,
      "--publish",
      `127.0.0.1::${port}`,
      service,
    ),
  );
  const binding = await run(["docker", "port", container, `${port}/tcp`]);
  const url = `http://${binding.output.trim()}`;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      const body = await response.text();
      if (response.ok && (frontend === "none" ? body === "OK" : /<html/i.test(body))) {
        ready = true;
        break;
      }
    } catch {
      // The container may still be starting; retain its logs if the deadline expires.
    }
    await Bun.sleep(1000);
  }
  const logs = await run(["docker", "logs", container]);
  assert(ready, `Container did not serve a successful response\n${logs.output}`);
  await run([
    "docker",
    "exec",
    container,
    "node",
    "-e",
    "const fs=require('node:fs'); if(!fs.existsSync('.env.schema') || fs.existsSync('.env') || fs.existsSync('.env.local')) process.exit(1)",
  ]);
  const invalid = await run(
    compose(
      "run",
      "--rm",
      "--no-deps",
      "--name",
      `${container}-invalid`,
      "-e",
      "BTS_DOCKER_REQUIRED=",
      service,
    ),
    project,
    true,
    30_000,
  );
  assert(
    invalid.code !== 0 && invalid.code !== 143,
    "Invalid runtime config must exit, not keep serving",
  );
  assert.match(invalid.output, /BTS_DOCKER_REQUIRED/);
  console.log(
    `PASS ${frontend}: image builds, serves HTTP, omits env value files, and rejects invalid runtime config`,
  );
} finally {
  await run(["docker", "rm", "--force", container, `${container}-invalid`], scratch, true);
  await run(["docker", "network", "rm", `${composeName}_default`], scratch, true);
  await run(["docker", "image", "rm", `${composeName}-${service}:latest`], scratch, true);
  rmSync(scratch, { recursive: true, force: true });
}
