import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

type CreateOptions = Parameters<typeof createVirtual>[0];

const baseConfig = {
  projectName: "nitro-test",
  frontend: ["tanstack-router"],
  backend: "nitro",
  runtime: "node",
  api: "orpc",
  database: "sqlite",
  orm: "drizzle",
  dbSetup: "none",
  auth: "better-auth",
  payments: "none",
  addons: ["turborepo"],
  examples: ["todo"],
  webDeploy: "none",
  serverDeploy: "none",
  packageManager: "bun",
  install: false,
  git: false,
} satisfies CreateOptions;

async function generate(overrides: Partial<CreateOptions> = {}) {
  const result = await createVirtual({ ...baseConfig, ...overrides } as CreateOptions);
  if (result.isErr()) throw result.error;
  return collectFiles(result.value.root, result.value.root.path);
}

describe("Nitro backend", () => {
  it("generates the native Nitro 3 standalone structure", async () => {
    const files = await generate({
      projectName: "nitro-standalone",
      runtime: "node",
      api: "none",
      database: "none",
      orm: "none",
      auth: "none",
      examples: ["none"],
    });

    expect(files.get("apps/server/nitro.config.ts")).toContain('defaultPreset: "node"');
    expect(files.get("apps/server/nitro.config.ts")).toContain('serverDir: "./server"');
    expect(files.get("apps/server/server/routes/index.get.ts")).toContain(
      'defineHandler(() => "OK")',
    );
    expect(files.has("apps/server/src/index.ts")).toBe(false);
    expect(files.has("apps/server/server/routes/rpc/[...].ts")).toBe(false);
    expect(files.has("apps/server/server/routes/api/auth/[...all].ts")).toBe(false);

    const packageJson = files.get("apps/server/package.json") ?? "";
    expect(packageJson).toContain('"build": "nitro build"');
    expect(packageJson).toContain('"dev": "nitro dev --port 3000"');
    expect(packageJson).toContain('"start": "node .output/server/index.mjs"');
    expect(packageJson).toContain('"nitro": "^3.0.260610-beta"');
    expect(packageJson).not.toContain("tsdown");
    expect(packageJson).not.toContain("hono");
  });

  it("uses Web Request adapters for oRPC and Better Auth", async () => {
    const files = await generate({ projectName: "nitro-orpc-auth" });

    expect(files.get("apps/server/server/routes/rpc/[...].ts")).toContain(
      "handler.handle(event.req",
    );
    expect(files.get("apps/server/server/routes/api-reference/[...].ts")).toContain(
      'prefix: "/api-reference"',
    );
    expect(files.get("apps/server/server/routes/api/auth/[...all].ts")).toContain(
      "auth.handler(event.req)",
    );
    expect(files.get("packages/api/src/context.ts")).toContain("request: Request;");
    expect(files.get("packages/api/src/context.ts")).toContain(
      "auth.api.getSession({ headers: request.headers })",
    );
  });

  it("uses the tRPC fetch adapter and Clerk request authentication", async () => {
    const files = await generate({
      projectName: "nitro-trpc-clerk",
      runtime: "bun",
      api: "trpc",
      auth: "clerk",
      examples: ["none"],
    });

    expect(files.get("apps/server/nitro.config.ts")).toContain('defaultPreset: "bun"');
    expect(files.get("apps/server/server/routes/trpc/[...].ts")).toContain("fetchRequestHandler({");
    expect(files.get("packages/api/src/context.ts")).toContain(
      "clerkClient.authenticateRequest(request",
    );
    expect(files.get("packages/env/src/server.ts")).toContain(
      "CLERK_PUBLISHABLE_KEY: z.string().min(1)",
    );

    const serverPackage = files.get("apps/server/package.json") ?? "";
    const apiPackage = files.get("packages/api/package.json") ?? "";
    expect(serverPackage).toContain('"@trpc/server"');
    expect(serverPackage).not.toContain("@hono/trpc-server");
    expect(apiPackage).toContain('"@clerk/backend"');
  });

  it("generates the native redirect and AI routes when selected", async () => {
    const files = await generate({
      projectName: "nitro-native-ai",
      frontend: ["tanstack-router", "native-bare"],
      payments: "polar",
      examples: ["todo", "ai"],
    });

    expect(files.get("apps/server/server/routes/polar/success.get.ts")).toContain(
      "Response.redirect(redirectUrl, 302)",
    );
    expect(files.get("apps/server/server/routes/ai.post.ts")).toContain("await event.req.json()");
  });

  it("generates first-class Docker, Prisma, Vercel, and Cloudflare contracts", async () => {
    const dockerFiles = await generate({
      projectName: "nitro-docker",
      serverDeploy: "docker",
    });
    const dockerfile = dockerFiles.get("apps/server/Dockerfile") ?? "";
    expect(dockerfile).toContain("COPY --from=builder /app/apps/server/.output ./");
    expect(dockerfile).toContain('CMD ["node", "server/index.mjs"]');
    expect(dockerfile).not.toContain("dist/index.mjs");

    const prismaFiles = await generate({
      projectName: "nitro-prisma",
      serverDeploy: "prisma",
    });
    const infra = prismaFiles.get("packages/infra/alchemy.run.ts") ?? "";
    expect(infra).toContain('command: "bun run build"');
    expect(infra).toContain('outdir: ".output"');
    expect(infra).toContain('entrypoint: "server/index.mjs"');
    expect(infra).not.toContain('framework: "bun"');
    expect(infra).not.toContain('entrypoint: "src/index.ts"');

    const vercelFiles = await generate({
      projectName: "nitro-vercel",
      serverDeploy: "vercel",
    });
    const vercel = JSON.parse(vercelFiles.get("vercel.json") ?? "{}") as {
      services?: {
        server?: { root?: string; framework?: string; entrypoint?: string };
      };
    };
    expect(vercel.services?.server).toMatchObject({
      root: "apps/server",
      framework: "nitro",
    });
    expect(vercel.services?.server).not.toHaveProperty("entrypoint");

    const cloudflareFiles = await generate({
      projectName: "nitro-cloudflare",
      runtime: "workers",
      serverDeploy: "cloudflare",
    });
    const cloudflareInfra = cloudflareFiles.get("packages/infra/alchemy.run.ts") ?? "";
    expect(cloudflareFiles.get("apps/server/nitro.config.ts")).toContain(
      'defaultPreset: "cloudflare_module"',
    );
    expect(cloudflareFiles.get("apps/server/nitro.config.ts")).toContain("nodeCompat: true");
    expect(cloudflareFiles.get("apps/server/package.json")).toContain('"start": "nitro preview"');
    expect(cloudflareInfra).toContain('Command.Build("server-build", {');
    expect(cloudflareInfra).toContain('cwd: "../../apps/server"');
    expect(cloudflareInfra).toContain('outdir: ".output"');
    expect(cloudflareInfra).toContain("`${outdir}/server/index.mjs`");
    expect(cloudflareInfra).toContain('directory: "../../apps/server/.output/public"');
    expect(cloudflareInfra).toContain("bundle: false");
    expect(cloudflareInfra).toContain('flags: ["nodejs_compat"]');
    expect(cloudflareInfra).toContain("port: 3000");
    expect(cloudflareInfra).not.toContain('main: "../../apps/server/src/index.ts"');
    expect(cloudflareFiles.get("apps/server/server/routes/api/auth/[...all].ts")).toContain(
      "createAuth().handler(event.req)",
    );
    expect(cloudflareFiles.get("packages/api/src/context.ts")).toContain(
      "createAuth().api.getSession",
    );
  });

  it("rejects evlog before generation", async () => {
    const evlog = await createVirtual({
      ...baseConfig,
      projectName: "nitro-evlog-rejected",
      addons: ["evlog"],
    });
    expect(evlog.isErr()).toBe(true);
    expect(evlog.isErr() && evlog.error.message).toContain("evlog addon supports");
  });

  it("tracks Nitro output in task-runner configuration", async () => {
    const files = await generate({ projectName: "nitro-turbo", frontend: ["solid"] });
    const turbo = JSON.parse(files.get("turbo.json") ?? "{}") as {
      tasks?: { build?: { outputs?: string[] } };
    };
    expect(turbo.tasks?.build?.outputs).toContain(".output/**");
    expect(turbo.tasks?.build?.outputs?.filter((output) => output === ".output/**")).toHaveLength(
      1,
    );

    const nxFiles = await generate({
      projectName: "nitro-nx",
      addons: ["nx"],
    });
    expect(nxFiles.get("nx.json")).toContain("!{workspaceRoot}/apps/server/.output/**");
  });

  it.each([
    ["sqlite", "drizzle"],
    ["sqlite", "prisma"],
    ["postgres", "drizzle"],
    ["postgres", "prisma"],
    ["mysql", "drizzle"],
    ["mysql", "prisma"],
    ["mongodb", "mongoose"],
    ["mongodb", "prisma"],
  ] as const)("composes the %s and %s database packages", async (database, orm) => {
    const files = await generate({
      projectName: `nitro-${database}-${orm}`,
      database,
      orm,
      auth: "none",
      examples: ["none"],
    });

    expect(files.has("apps/server/nitro.config.ts")).toBe(true);
    expect(files.has("packages/db/package.json")).toBe(true);
    expect(files.get("apps/server/package.json")).toContain(`@nitro-${database}-${orm}/db`);
  });

  it.each([
    ["tanstack-router", "trpc"],
    ["react-router", "trpc"],
    ["tanstack-start", "orpc"],
    ["next", "orpc"],
    ["nuxt", "orpc"],
    ["svelte", "orpc"],
    ["solid", "orpc"],
    ["astro", "orpc"],
    ["native-bare", "orpc"],
    ["native-uniwind", "orpc"],
    ["native-unistyles", "orpc"],
  ] as const)("composes the %s frontend with %s", async (frontend, api) => {
    const files = await generate({
      projectName: `nitro-${frontend}`,
      frontend: [frontend],
      api,
      auth: "none",
      examples: ["none"],
    });

    expect(files.has("apps/server/nitro.config.ts")).toBe(true);
    expect(
      files.has(
        frontend.startsWith("native-") ? "apps/native/package.json" : "apps/web/package.json",
      ),
    ).toBe(true);
  });
});
