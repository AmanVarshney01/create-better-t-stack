#!/usr/bin/env bun
// Opt-in migration experiment. Changes only CLI-generated temporary projects.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";

interface Manifest {
  name: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: { catalog?: Record<string, string> };
}

const repo = resolve(import.meta.dir, "..");
const secret = "bts-varlock-synthetic-secret-not-a-real-credential";

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (["node_modules", ".git", ".turbo"].includes(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

async function run(
  command: string[],
  cwd: string,
  env: Record<string, string> = {},
  expectedFailure = false,
) {
  const child = Bun.spawn(command, {
    cwd,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const timeout = setTimeout(() => child.kill(), 180_000);
  try {
    const [code, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    const output = stdout + stderr;
    assert.equal(code !== 0, expectedFailure, `${command.join(" ")}\n${output}`);
    return output;
  } finally {
    clearTimeout(timeout);
  }
}

function migrate(project: string) {
  const scripts = new Map<string, string>();
  for (const path of files(project).filter((path) => path.endsWith("/package.json"))) {
    const manifest: Manifest = JSON.parse(readFileSync(path, "utf8"));
    scripts.set(path, JSON.stringify(manifest.scripts));
    for (const dependencies of [manifest.dependencies, manifest.devDependencies]) {
      if (!dependencies) continue;
      for (const name of Object.keys(dependencies)) {
        if (name === "dotenv" || name.startsWith("@t3-oss/env-")) delete dependencies[name];
      }
    }
    if (
      ["apps/server/package.json", "apps/web/package.json", "packages/env/package.json"].includes(
        relative(project, path),
      )
    ) {
      manifest.dependencies ??= {};
      manifest.dependencies.varlock = "1.18.0";
    }
    if (path === join(project, "apps/web/package.json")) {
      manifest.devDependencies ??= {};
      manifest.devDependencies["@varlock/vite-integration"] = "1.5.1";
    }
    if (manifest.workspaces?.catalog) delete manifest.workspaces.catalog.dotenv;
    writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  }
  const write = (path: string, content: string) => writeFileSync(join(project, path), content);
  for (const path of ["bunfig.toml", "apps/server/bunfig.toml", "apps/web/bunfig.toml"]) {
    write(path, "env = false\n");
  }
  write(
    ".env.schema",
    `# @defaultRequired=true
# @defaultSensitive=true
# ---
# @public
SHARED_LABEL=root-default
ROOT_ONLY_SECRET=
`,
  );
  write(".env.local", `SHARED_LABEL=root-local\nROOT_ONLY_SECRET=${secret}\n`);
  for (const app of ["server", "web"]) {
    const fields =
      app === "server"
        ? "# @public @type=url\nCORS_ORIGIN=http://localhost:3001\n# @public @type=enum(development,production,test)\nNODE_ENV=development\n# @type=string(minLength=16)\nBTS_SERVER_SECRET=\n"
        : "# @public @type=url\nVITE_SERVER_URL=http://localhost:3000\n# @type=string(minLength=16)\nBTS_BUILD_SECRET=\n";
    write(
      `apps/${app}/.env.schema`,
      `# @currentEnv=$APP_ENV
# @import(../../, pick=[SHARED_LABEL])
# @defaultRequired=true
# @defaultSensitive=true
# @generateTsTypes(path=../../packages/env/src/${app}-env.ts, exposeEnv=local)
# ---
# @public @type=enum(development,preview,production,test)
APP_ENV=preview
${fields}`,
    );
    write(
      `apps/${app}/.env.local`,
      `${app === "server" ? "BTS_SERVER_SECRET" : "BTS_BUILD_SECRET"}=${secret}\n`,
    );
  }
  write("apps/web/.env.preview", "VITE_SERVER_URL=http://localhost:4300\n");
  write("apps/web/.env.production", "VITE_SERVER_URL=http://localhost:4400\n");
  write(
    "packages/env/src/server.ts",
    'import "varlock/auto-load";\nexport { ENV as env } from "./server-env";\n',
  );
  write("packages/env/src/web.ts", 'export { ENV as env } from "./web-env";\n');
  const vite = join(project, "apps/web/vite.config.ts");
  writeFileSync(
    vite,
    'import { varlockVitePlugin } from "@varlock/vite-integration";\n' +
      readFileSync(vite, "utf8").replace("plugins: [", "plugins: [varlockVitePlugin(),"),
  );
  const route = join(project, "apps/web/src/routes/index.tsx");
  writeFileSync(
    route,
    'import { env } from "@varlock-smoke/env/web";\n' +
      readFileSync(route, "utf8").replace(
        "<h2",
        '<p data-testid="server-url">{env.VITE_SERVER_URL}</p><span>{env.SHARED_LABEL}</span><h2',
      ),
  );
  write(
    "apps/web/src/env-isolation.ts",
    `import { env } from "@varlock-smoke/env/web";
const excludesServerSecret: "BTS_SERVER_SECRET" extends keyof typeof env ? never : true = true;
const excludesRootSecret: "ROOT_ONLY_SECRET" extends keyof typeof env ? never : true = true;
void excludesServerSecret;
void excludesRootSecret;
`,
  );
  write(".gitignore", readFileSync(join(project, ".gitignore"), "utf8") + "\n!.env.schema\n");
  return scripts;
}

async function verify(turbo: boolean) {
  const scratch = mkdtempSync(join(tmpdir(), "bts-varlock-"));
  const project = join(scratch, "varlock-smoke");
  console.log(`Checking Varlock with ${turbo ? "Turborepo" : "Bun workspaces"}`);
  try {
    await run(
      [
        "bun",
        join(repo, "apps/cli/dist/cli.mjs"),
        "create",
        "varlock-smoke",
        "--frontend",
        "tanstack-router",
        "--backend",
        "hono",
        "--runtime",
        "bun",
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
        turbo ? "turborepo" : "none",
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
        "none",
        "--server-deploy",
        "none",
        "--directory-conflict",
        "error",
        "--disable-analytics",
        "--no-render-title",
      ],
      scratch,
    );
    const originalScripts = migrate(project);
    if (turbo) {
      const path = join(project, "turbo.json");
      const config = JSON.parse(readFileSync(path, "utf8"));
      config.globalEnv = [
        ...new Set([
          ...(config.globalEnv ?? []),
          "APP_ENV",
          "BTS_BUILD_SECRET",
          "BTS_SERVER_SECRET",
        ]),
      ];
      config.globalDependencies = [
        ...new Set([...(config.globalDependencies ?? []), ".env*", "apps/*/.env*"]),
      ];
      writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`);
    }
    await run(["bun", "install"], project);
    for (const app of ["server", "web"]) {
      await run(["bun", "x", "--no-install", "varlock", "codegen"], join(project, "apps", app));
      const types = readFileSync(join(project, `packages/env/src/${app}-env.ts`), "utf8");
      assert(!types.includes("declare module"), "Env types must not augment the global module");
      assert(!types.includes("ROOT_ONLY_SECRET"), "pick must exclude unrelated root config");
    }
    await run(["bun", "run", "check-types"], project);
    await run(["bun", "run", "build"], project);
    const bundle = () =>
      files(join(project, "apps/web/dist"))
        .map((path) => readFileSync(path, "utf8"))
        .join("\n");
    assert(
      bundle().includes("http://localhost:4300"),
      "App preview environment must select .env.preview",
    );
    assert(bundle().includes("root-local"), "Directory imports must include root value files");
    assert(!bundle().includes(secret), "Synthetic secret leaked into the browser bundle");
    await run(["bun", "run", "build"], project, { APP_ENV: "production" });
    assert(
      bundle().includes("http://localhost:4400"),
      "Root process override must reach the build in strict Turbo mode",
    );
    assert(!bundle().includes(secret), "Synthetic secret leaked into the production bundle");
    const invalidBuild = await run(
      ["bun", "run", "build"],
      project,
      { BTS_BUILD_SECRET: "" },
      true,
    );
    assert(invalidBuild.includes("BTS_BUILD_SECRET"), "Build must report the missing variable");
    const server = join(project, "apps/server");
    const invalidStartup = await run(
      ["bun", "run", "start"],
      server,
      { BTS_SERVER_SECRET: "" },
      true,
    );
    assert(
      invalidStartup.includes("BTS_SERVER_SECRET"),
      "Startup must report the missing variable",
    );
    for (const runtime of ["node", "bun"]) {
      const output = await run(
        [
          runtime,
          "--input-type=module",
          "-e",
          'import "varlock/auto-load"; import { ENV } from "varlock/env"; if (ENV.APP_ENV !== "preview" || ENV.CORS_ORIGIN !== "http://localhost:3001" || !ENV.BTS_SERVER_SECRET) throw new Error("Env was not loaded"); console.log("env-ready");',
        ],
        server,
      );
      assert(output.includes("env-ready"));
    }
    // Run the built Hono handler without binding a fixed port.
    const response = await run(
      [
        "bun",
        "-e",
        'const {default: app} = await import("./dist/index.mjs"); const response = await app.request("http://localhost/", {headers: {origin: "http://localhost:3001"}}); if (response.status !== 200 || await response.text() !== "OK" || response.headers.get("access-control-allow-origin") !== "http://localhost:3001") throw new Error("Built server failed"); console.log("server-ready");',
      ],
      server,
    );
    assert(response.includes("server-ready"));
    for (const [path, original] of originalScripts) {
      const manifest: Manifest = JSON.parse(readFileSync(path, "utf8"));
      assert.equal(JSON.stringify(manifest.scripts), original, "App scripts must remain unchanged");
      for (const dependencies of [manifest.dependencies, manifest.devDependencies]) {
        assert(
          !Object.keys(dependencies ?? {}).some(
            (name) => name === "dotenv" || name.startsWith("@t3-oss/env-"),
          ),
        );
      }
    }
    console.log(
      `Passed: ${turbo ? "Turborepo strict mode" : "Bun workspaces"}, build, types, Node/Bun loading, Hono runtime, missing env, public/secret separation`,
    );
  } finally {
    rmSync(scratch, { recursive: true });
  }
}

await run(["bun", "run", "build:cli"], repo);
await verify(false);
await verify(true);
