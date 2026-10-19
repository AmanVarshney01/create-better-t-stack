import { expect } from "bun:test";
import { tmpdir } from "node:os";
import path from "node:path";

import { execa } from "execa";
import fs from "fs-extra";
import { z } from "zod";

import {
  commandTimeoutMs,
  fetchWhenReady,
  formatOutput,
  getAvailablePort,
  runCommand,
} from "./harness";
import type { SelectedBuildSample } from "./samples";

export async function validateSolidBuildArtifacts(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.frontend?.includes("solid")) return;

  const serverEntry =
    sample.config.webDeploy === "cloudflare"
      ? "apps/web/dist/server/server.js"
      : "apps/web/.output/server/index.mjs";
  expect(await fs.pathExists(path.join(projectDir, serverEntry))).toBe(true);
}

export async function validatePwaBuildArtifacts(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.addons?.includes("pwa")) return;
  const frontend = sample.config.frontend ?? [];
  const publicDir = path.join(
    projectDir,
    "apps/web",
    frontend.includes("solid")
      ? ".output/public"
      : frontend.includes("react-router")
        ? "build/client"
        : frontend.includes("next")
          ? "public"
          : "dist",
  );
  expect(await fs.pathExists(path.join(publicDir, "sw.js"))).toBe(true);
  if (frontend.includes("next")) {
    expect(await fs.pathExists(path.join(publicDir, "offline.html"))).toBe(true);
    const port = await getAvailablePort();
    const runtime = execa(
      "bun",
      ["run", "start", "--hostname", "127.0.0.1", "--port", String(port)],
      {
        cwd: path.join(projectDir, "apps/web"),
        all: true,
        reject: false,
      },
    );
    try {
      const response = await fetchWhenReady(`http://127.0.0.1:${port}/sw.js`);
      expect(response?.status).toBe(200);
      expect(response?.headers.get("content-type")).toBe("application/javascript; charset=utf-8");
      expect(response?.headers.get("cache-control")).toBe("no-cache, no-store, must-revalidate");
      expect(response?.headers.get("content-security-policy")).toBe(
        "default-src 'self'; script-src 'self'",
      );
    } finally {
      runtime.kill("SIGTERM");
      await runtime;
    }
    return;
  }
  if (frontend.includes("tanstack-router")) {
    expect(await fs.pathExists(path.join(publicDir, "registerSW.js"))).toBe(true);
  }
  const manifest = await fs.readJson(path.join(publicDir, "manifest.webmanifest"));
  expect(manifest.start_url).toBe("/");
  expect(manifest.icons.length).toBeGreaterThan(0);
  for (const icon of manifest.icons) {
    expect(await fs.pathExists(path.join(publicDir, icon.src))).toBe(true);
  }
  if (frontend.includes("solid")) {
    const port = await getAvailablePort();
    const runtime = execa("node", [".output/server/index.mjs"], {
      cwd: path.join(projectDir, "apps/web"),
      all: true,
      reject: false,
      env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
    });
    try {
      // Nitro records asset sizes during its build. Generating a worker later
      // can leave stale metadata and truncate the script sent to browsers.
      for (const asset of [
        "sw.js",
        "offline.html",
        ...manifest.icons.map((icon: { src: string }) => icon.src),
      ]) {
        const response = await fetchWhenReady(`http://127.0.0.1:${port}/${asset}`);
        expect(response?.status).toBe(200);
        expect(Buffer.from(await response!.arrayBuffer())).toEqual(
          await fs.readFile(path.join(publicDir, asset)),
        );
      }
    } finally {
      runtime.kill("SIGTERM");
      await runtime;
    }
  }
}
export function isStartClerkSample(sample: SelectedBuildSample) {
  return sample.config.frontend?.includes("tanstack-start") && sample.config.auth === "clerk";
}

export async function writeStartCsrfProbe(sample: SelectedBuildSample, projectDir: string) {
  if (!isStartClerkSample(sample)) return;
  await fs.outputFile(
    path.join(projectDir, "apps/web/src/routes/csrf-probe.tsx"),
    `import { createServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

const probe = createServerFn({ method: "POST" }).handler(() => new Response("bts-csrf-probe-ok"));
export const Route = createFileRoute("/csrf-probe")({
  component: () => <p data-csrf-url={probe.url}>CSRF probe</p>,
});
`,
  );
}

export async function bootAndValidateStartCsrf(sample: SelectedBuildSample, projectDir: string) {
  if (!isStartClerkSample(sample)) return;
  const port = await getAvailablePort();
  const origin = `http://127.0.0.1:${port}`;
  const runtime = execa(
    "bun",
    [
      "-e",
      'import server from "./dist/server/server.js"; Bun.serve({ fetch: (request) => server.fetch(request), hostname: "127.0.0.1", port: Number(process.env.PORT) });',
    ],
    {
      cwd: path.join(projectDir, "apps/web"),
      all: true,
      reject: false,
      timeout: commandTimeoutMs,
      killDescendants: true,
      env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
    },
  );
  try {
    const page = await fetchWhenReady(`${origin}/csrf-probe`);
    if (!page) {
      throw new Error(`CSRF probe page did not become ready at ${origin}/csrf-probe`);
    }
    if (page.status !== 200) {
      throw new Error(
        `CSRF probe page returned ${page.status} at ${page.url}: ${await page.text()}`,
      );
    }
    expect(page.status).toBe(200);
    const endpoint = /data-csrf-url="([^"]+)"/.exec(await page.text())?.[1];
    if (!endpoint) {
      throw new Error("CSRF probe page did not include a server function URL");
    }
    const invoke = (requestOrigin: string) =>
      fetch(new URL(endpoint, origin), {
        method: "POST",
        headers: { origin: requestOrigin },
        signal: AbortSignal.timeout(5000),
      });
    const allowed = await invoke(origin);
    expect(allowed.status).toBe(200);
    expect(await allowed.text()).toContain("bts-csrf-probe-ok");
    expect((await invoke("https://cross-origin.example.test")).status).toBe(403);
  } catch (error) {
    runtime.kill("SIGTERM");
    const result = await runtime;
    throw new Error(`TanStack Start CSRF runtime failed:\n${result.all}`, { cause: error });
  } finally {
    runtime.kill("SIGTERM");
    await runtime;
  }
}
export async function bootAndValidateStartAuthRuntime(
  sample: SelectedBuildSample,
  projectDir: string,
) {
  if (!sample.checks.includes("start-auth-runtime")) return;

  await runCommand(sample.name, projectDir, sample.packageManager, ["run", "db:push"]);
  const port = await getAvailablePort();
  const origin = `http://127.0.0.1:${port}`;
  const runtime = execa("node", [".output/server/index.mjs"], {
    cwd: path.join(projectDir, "apps/web"),
    all: true,
    reject: false,
    timeout: commandTimeoutMs,
    killDescendants: true,
    env: { ...process.env, BETTER_AUTH_URL: origin, HOST: "127.0.0.1", PORT: String(port) },
  });
  const rpc = (procedure: string, cookie = "") =>
    fetch(`${origin}/api/rpc/${procedure}`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ json: null }),
      signal: AbortSignal.timeout(5000),
    });

  try {
    expect((await fetchWhenReady(`${origin}/`))?.status).toBe(200);
    expect(await (await rpc("healthCheck")).json()).toEqual({ json: "OK" });
    expect((await rpc("privateData")).status).toBe(401);
    const signup = await fetch(`${origin}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify({
        name: "Generated test",
        email: "generated@example.test",
        password: "Generated-test-password-2026",
      }),
      signal: AbortSignal.timeout(5000),
    });
    expect(signup.status).toBe(200);
    const cookie = signup.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    expect(cookie).not.toBe("");
    const session = await fetch(`${origin}/api/auth/get-session`, {
      headers: { cookie },
      signal: AbortSignal.timeout(5000),
    });
    expect(await session.json()).toMatchObject({ user: { email: "generated@example.test" } });
    expect((await rpc("privateData", cookie)).status).toBe(200);
    expect((await rpc("privateData")).status).toBe(401);

    // Todo CRUD and persistence are verified by the local live runner.
  } catch (error) {
    runtime.kill("SIGTERM");
    const result = await runtime;
    throw new Error(`TanStack Start runtime failed:\n${result.all}`, { cause: error });
  } finally {
    runtime.kill("SIGTERM");
    await runtime;
  }
}

export async function bootAndValidateNuxtAuthRuntime(
  sample: SelectedBuildSample,
  projectDir: string,
) {
  if (!sample.checks.includes("nuxt-auth-runtime")) return;

  await runCommand(sample.name, path.join(projectDir, "packages/db"), sample.packageManager, [
    "run",
    "db:push",
  ]);
  const apiPort = await getAvailablePort();
  const webPort = await getAvailablePort();
  const apiOrigin = `http://127.0.0.1:${apiPort}`;
  const webOrigin = `http://127.0.0.1:${webPort}`;
  const api = execa(
    "bun",
    [
      "-e",
      'import app from "./dist/index.mjs"; Bun.serve({ fetch: app.fetch, hostname: "127.0.0.1", port: Number(process.env.PORT) });',
    ],
    {
      cwd: path.join(projectDir, "apps/server"),
      all: true,
      reject: false,
      timeout: commandTimeoutMs,
      env: {
        ...process.env,
        PORT: String(apiPort),
        BETTER_AUTH_URL: apiOrigin,
        CORS_ORIGIN: webOrigin,
      },
    },
  );
  const web = execa("node", [".output/server/index.mjs"], {
    cwd: path.join(projectDir, "apps/web"),
    all: true,
    reject: false,
    timeout: commandTimeoutMs,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(webPort),
      NUXT_SERVER_URL: apiOrigin,
      NUXT_PUBLIC_SERVER_URL: apiOrigin,
    },
  });
  try {
    expect((await fetchWhenReady(apiOrigin))?.status).toBe(200);
    const signup = await fetch(`${apiOrigin}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: webOrigin },
      body: JSON.stringify({
        name: "Nuxt SSR",
        email: "nuxt-ssr@example.test",
        password: "Generated-test-password-2026",
      }),
      signal: AbortSignal.timeout(5000),
    });
    expect(signup.status).toBe(200);
    const cookie = signup.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    expect(cookie).not.toBe("");
    const authenticated = await fetchWhenReady(`${webOrigin}/ssr-auth-probe`, {
      headers: { cookie },
    });
    expect(authenticated?.status).toBe(200);
    expect(await authenticated!.text()).toContain("data-ssr-user>nuxt-ssr@example.test</p>");
    const anonymous = await fetchWhenReady(`${webOrigin}/ssr-auth-probe`);
    expect(anonymous?.status).toBe(200);
    expect(await anonymous!.text()).toContain("data-ssr-user>anonymous</p>");
  } finally {
    api.kill("SIGTERM");
    web.kill("SIGTERM");
    const results = await Promise.all([api, web]);
    for (const result of results) console.info(formatOutput(result.all));
  }
}

export async function bootAndValidateAxiomRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.config.addons?.includes("axiom")) return;
  const received: Array<{ path?: string; status?: number }> = [];
  const collector = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    async fetch(request) {
      const events = z
        .array(z.object({ path: z.string().optional(), status: z.number().optional() }))
        .parse(await request.json());
      received.push(...events);
      return Response.json({ ingested: events.length, failed: 0 });
    },
  });
  const port = await getAvailablePort();
  const runtime = execa("node", [".output/server/index.mjs"], {
    cwd: path.join(projectDir, "apps/web"),
    all: true,
    reject: false,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: String(port),
      AXIOM_API_KEY: "xaat-local-test",
      AXIOM_DATASET: "generated-test",
      AXIOM_EDGE_URL: collector.url.toString(),
    },
  });
  try {
    expect((await fetchWhenReady(`http://127.0.0.1:${port}/`))?.status).toBe(200);
    expect((await fetchWhenReady(`http://127.0.0.1:${port}/missing-axiom-test`))?.status).toBe(404);
    for (let attempt = 0; attempt < 100 && received.length < 2; attempt++) await Bun.sleep(50);
    expect(received).toEqual(
      expect.arrayContaining([
        { path: "/", status: 200 },
        { path: "/missing-axiom-test", status: 404 },
      ]),
    );
  } finally {
    runtime.kill("SIGTERM");
    await runtime;
    collector.stop(true);
  }
}

export async function bootAndValidatePrismaWebArtifact(
  sample: SelectedBuildSample,
  projectDir: string,
) {
  if (sample.config.webDeploy !== "prisma") return;

  const frontend = sample.config.frontend ?? [];
  const entrypoint = frontend.includes("react-router")
    ? "build/server/index.js"
    : frontend.includes("svelte")
      ? "build/index.js"
      : frontend.includes("solid") || frontend.includes("tanstack-start")
        ? ".output/server/index.mjs"
        : undefined;
  if (!entrypoint) return;

  const webDir = path.join(projectDir, "apps/web");
  const runtimeRoot = await fs.mkdtemp(path.join(tmpdir(), "bts-prisma-artifact-"));
  const artifactDirectory = entrypoint.split("/")[0]!;
  await fs.copy(path.join(webDir, artifactDirectory), path.join(runtimeRoot, artifactDirectory));
  const port = await getAvailablePort();
  const runtime = execa("bun", [entrypoint], {
    cwd: runtimeRoot,
    all: true,
    reject: false,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
  });

  let failure: unknown;
  try {
    for (const pathname of ["/"]) {
      const response = await fetchWhenReady(`http://127.0.0.1:${port}${pathname}`);
      expect(response?.status).toBe(200);
    }
    if (sample.config.backend === "self" && sample.config.api === "orpc") {
      const prefix = frontend.includes("tanstack-start") ? "/api/rpc" : "/rpc";
      const response = await fetchWhenReady(`http://127.0.0.1:${port}${prefix}/healthCheck`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: null }),
      });
      expect(response?.status).toBe(200);
      expect(await response?.json()).toEqual({ json: "OK" });
    }
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  await fs.remove(runtimeRoot);
  if (failure) {
    throw new Error(
      [`Generated Prisma runtime probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

export async function bootAndValidateAstroWebsite(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.checks.includes("astro-website")) return;

  const infraDir = path.join(projectDir, "packages/infra");
  const port = await getAvailablePort();
  // Use the same builder and dependency packager as Prisma.Website.Astro, without cloud resources.
  const probe = "astro-website-probe.ts";
  await fs.writeFile(
    path.join(infraDir, probe),
    `import assert from "node:assert/strict";
import path from "node:path";
import * as Effect from "effect/Effect";
import * as BunServices from "@effect/platform-bun/BunServices";
import { make } from "@alchemy.run/frontend-frameworks/astro";
import { stageWebsiteArtifact } from "alchemy/Prisma/Website/Artifact";

async function check(origin: string) {
  let root: Response | undefined;
  for (let attempt = 0; attempt < 100; attempt++) {
    root = await fetch(origin, { signal: AbortSignal.timeout(10000) }).catch(() => undefined);
    if (root) break;
    await Bun.sleep(100);
  }
  assert.equal(root?.status, 200);
  const rpc = await fetch(new URL("/rpc/healthCheck", origin), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ json: null }),
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(rpc.status, 200);
  assert.deepEqual(await rpc.json(), { json: "OK" });
}

await Effect.runPromise(Effect.gen(function* () {
  const root = path.resolve("../../apps/web");
  const framework = yield* make({ root, target: "@alchemy.run/frontend-frameworks/astro/node" });
  const built = yield* framework.build({ root });
  const entry = built.serverModules?.[0];
  assert.ok(built.distDirectory && entry);
  const artifact = yield* stageWebsiteArtifact({
    root,
    distDir: built.distDirectory,
    serverEntry: path.join(built.distDirectory, entry.name),
  });
  yield* Effect.acquireRelease(
    Effect.sync(() => Bun.spawn(["bun", artifact.entrypoint], {
      cwd: artifact.directory,
      env: { ...process.env, HOST: "127.0.0.1", NODE_ENV: "production", PORT: "${port}" },
      stdout: "inherit",
      stderr: "inherit",
    })),
    (child) => Effect.promise(async () => {
      child.kill("SIGTERM");
      await child.exited;
    }),
  );
  yield* Effect.tryPromise(() => check("http://127.0.0.1:${port}/"));
  const dev = yield* framework.dev({ root, host: "127.0.0.1", port: 0 });
  yield* Effect.tryPromise(() => check(dev.url));
  console.log("Astro Website isolated production and native dev RPC passed");
}).pipe(Effect.provide(BunServices.layer), Effect.scoped));
`,
  );
  try {
    await runCommand(sample.name, infraDir, sample.packageManager, ["run", "check-types"]);
    await runCommand(sample.name, infraDir, "bun", [probe]);
  } finally {
    await fs.remove(path.join(infraDir, probe));
  }
}

export async function bootAndValidateSolidRuntime(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.checks.includes("solid-runtime")) return;

  const webDir = path.join(projectDir, "apps/web");
  const port = await getAvailablePort();
  const runtime = execa("node", [".output/server/index.mjs"], {
    cwd: webDir,
    all: true,
    reject: false,
    env: {
      ...process.env,
      CORS_ORIGIN: `http://127.0.0.1:${port}`,
      DATABASE_URL: "file:./local.db",
      HOST: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
  });

  let failure: unknown;
  try {
    const root = await fetchWhenReady(`http://127.0.0.1:${port}/`);
    expect(root?.status).toBe(200);
    expect(await root?.text()).toContain("Connected");

    const health = await fetchWhenReady(`http://127.0.0.1:${port}/rpc/healthCheck`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: null }),
    });
    expect(health?.status).toBe(200);
    expect(await health?.json()).toEqual({ json: "OK" });

    const missing = await fetchWhenReady(`http://127.0.0.1:${port}/missing-page`);
    expect(missing?.status).toBe(404);
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  if (failure) {
    throw new Error(
      [`Generated Solid runtime probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

export async function bootAndValidateSolidDevRuntime(
  sample: SelectedBuildSample,
  projectDir: string,
) {
  if (!sample.checks.includes("solid-dev-runtime")) return;

  const webDir = path.join(projectDir, "apps/web");
  const port = await getAvailablePort();
  const runtime = execa(
    sample.packageManager,
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: webDir,
      all: true,
      reject: false,
      env: {
        ...process.env,
        CORS_ORIGIN: `http://127.0.0.1:${port}`,
        DATABASE_URL: "file:./local.db",
      },
    },
  );

  let failure: unknown;
  try {
    for (let request = 0; request < 2; request++) {
      const root = await fetchWhenReady(`http://127.0.0.1:${port}/`);
      expect(root?.status).toBe(200);
      expect(await root?.text()).toContain("Connected");
    }

    const health = await fetchWhenReady(`http://127.0.0.1:${port}/rpc/healthCheck`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: null }),
    });
    expect(health?.status).toBe(200);
    expect(await health?.json()).toEqual({ json: "OK" });

    const missing = await fetchWhenReady(`http://127.0.0.1:${port}/missing-page`);
    expect(missing?.status).toBe(404);
  } catch (error) {
    failure = error;
  } finally {
    runtime.kill("SIGTERM");
  }

  const result = await runtime;
  if (failure) {
    throw new Error(
      [`Generated Solid dev probe failed: ${String(failure)}`, formatOutput(result.all)]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
}

export async function writeSyntheticBuildConfig(projectDir: string) {
  const publishableKey = `pk_test_${Buffer.from("clerk.example.test$").toString("base64")}`;
  for (const app of ["web", "server", "native"]) {
    const file = path.join(projectDir, "apps", app, ".env");
    if (!(await fs.pathExists(file))) continue;
    let content = await fs.readFile(file, "utf8");
    content = content.replaceAll("https://example.convex.", "https://bts-build-test.convex.");
    content = content.replace(/^\s*#?\s*([A-Z][A-Z0-9_]*)=\s*$/gm, (line, key: string) => {
      if (key.endsWith("CLERK_PUBLISHABLE_KEY")) return `${key}=${publishableKey}`;
      if (key === "CLERK_SECRET_KEY") return `${key}=sk_test_bts_synthetic_build_key`;
      if (key === "GOOGLE_GENERATIVE_AI_API_KEY") return `${key}=bts-synthetic-build-key`;
      if (key === "POLAR_ACCESS_TOKEN") return `${key}=bts-synthetic-polar-build-token`;
      return line;
    });
    await fs.writeFile(file, content);
  }
}

export async function writeOrpcInferenceChecks(sample: SelectedBuildSample, projectDir: string) {
  if (sample.config.api !== "orpc") return;
  const root = z
    .object({ name: z.string() })
    .parse(await fs.readJson(path.join(projectDir, "package.json")));
  const routerFile = path.join(projectDir, "packages/api/src/routers/index.ts");
  const originals = new Map([[routerFile, await fs.readFile(routerFile, "utf8")]]);
  const probeFiles: string[] = [];
  await fs.appendFile(
    routerFile,
    `\nexport const typeBoundaryProbe = {
  read: publicProcedure.handler(() => {
    const values: number[] = [];
    return values[0];
  }),
};
export type TypeBoundaryProbeClient = RouterClient<typeof typeBoundaryProbe>;\n`,
  );
  const checks = [
    `import type { AppRouterClient, TypeBoundaryProbeClient } from "@${root.name}/api/routers/index";`,
    "type IsAny<T> = 0 extends (1 & T) ? true : false;",
    "type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;",
    "type Assert<T extends true> = T;",
    "type Health = Awaited<ReturnType<AppRouterClient['healthCheck']>>;",
    "export type HealthIsTyped = Assert<IsAny<Health> extends false ? true : false>;",
    "type IndexedOutput = Awaited<ReturnType<TypeBoundaryProbeClient['read']>>;",
    "export type ServerOptionsPreserved = Assert<IsEqual<IndexedOutput, number | undefined>>;",
    "export async function checkClient(client: AppRouterClient) {",
    "  const health: string = await client.healthCheck();",
    "  // @ts-expect-error Health check output is not a number.",
    "  const invalidHealth: number = await client.healthCheck();",
  ];
  if (sample.config.examples?.includes("todo")) {
    checks.push(
      '  await client.todo.create({ text: "valid" });',
      "  // @ts-expect-error Todo input must retain its string type in the client.",
      "  await client.todo.create({ text: 123 });",
      "  const todos = await client.todo.getAll();",
      "  const text: string = todos[0]!.text;",
      "  const completed: boolean = todos[0]!.completed;",
      "  // @ts-expect-error Database-derived output must not become any.",
      "  todos[0]!.text = 123;",
      "  // @ts-expect-error Unknown database fields must be rejected.",
      "  todos[0]!.nonexistentField;",
      "  void [text, completed];",
    );
  }
  if (sample.config.auth === "better-auth") {
    const authFile = path.join(projectDir, "packages/auth/src/index.ts");
    const authSource = await fs.readFile(authFile, "utf8");
    originals.set(authFile, authSource);
    await fs.writeFile(
      authFile,
      authSource.replace(
        "emailAndPassword:",
        `user: {
      additionalFields: { role: { type: "string", required: true, defaultValue: "member", input: false } },
    },
    emailAndPassword:`,
      ),
    );
    checks.push(
      "  const privateData = await client.privateData();",
      "  const email: string = privateData.user!.email;",
      "  const role: string = privateData.user!.role;",
      "  // @ts-expect-error Auth-derived output must not become any.",
      "  privateData.user!.email = 123;",
      "  // @ts-expect-error Configured Better Auth fields must reach the RPC client without becoming any.",
      "  privateData.user!.role = 123;",
      "  void [email, role];",
    );
  }
  checks.push("  return { health, invalidHealth };", "}");
  for (const app of ["web", "native", "server"]) {
    const dir = path.join(projectDir, "apps", app);
    if (!(await fs.pathExists(dir))) continue;
    const source =
      app === "native"
        ? dir
        : app === "web" && sample.config.frontend?.includes("nuxt")
          ? path.join(dir, "app")
          : path.join(dir, "src");
    const probeFile = path.join(source, "orpc-inference-check.ts");
    probeFiles.push(probeFile);
    await fs.outputFile(probeFile, checks.join("\n"));
  }
  return async () => {
    for (const [file, content] of originals) await fs.writeFile(file, content);
    for (const file of probeFiles) await fs.remove(file);
  };
}

/** A server-rendered page that calls a private oRPC procedure, for the Nuxt auth runtime check. */
export async function writeNuxtSsrAuthProbe(sample: SelectedBuildSample, projectDir: string) {
  if (!sample.checks.includes("nuxt-auth-runtime")) return;
  await fs.outputFile(
    path.join(projectDir, "apps/web/app/pages/ssr-auth-probe.vue"),
    `<script setup lang="ts">
const { $orpc } = useNuxtApp();
let user = "anonymous";
try {
  user = (await $orpc.privateData.call()).user!.email;
} catch {}
</script>
<template><p data-ssr-user>{{ user }}</p></template>`,
  );
}
