import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

type VirtualConfig = Parameters<typeof createVirtual>[0];

async function createVirtualFiles(config: VirtualConfig) {
  const result = await createVirtual(config);

  if (result.isErr()) {
    throw result.error;
  }

  return collectFiles(result.value.root, result.value.root.path);
}

const baseCloudflareConfig = {
  backend: "hono",
  runtime: "bun",
  database: "sqlite",
  orm: "drizzle",
  auth: "none",
  payments: "none",
  addons: ["none"],
  examples: ["none"],
  dbSetup: "none",
  webDeploy: "cloudflare",
  serverDeploy: "none",
  install: false,
  git: false,
  packageManager: "bun",
} as const;

const webAlchemyScenarios = [
  {
    frontend: "tanstack-router",
    api: "trpc",
    resource: "Vite",
    configPath: "apps/web/vite.config.ts",
  },
  {
    frontend: "react-router",
    api: "trpc",
    resource: "ReactRouter",
    configPath: "apps/web/react-router.config.ts",
  },
  {
    frontend: "tanstack-start",
    api: "trpc",
    resource: "TanStackStart",
    configPath: "apps/web/vite.config.ts",
    configNeedles: ["alchemy/cloudflare/tanstack-start", "alchemy()"],
  },
  {
    frontend: "next",
    api: "trpc",
    resource: "Nextjs",
    configPath: "apps/web/open-next.config.ts",
    configNeedles: ["defineCloudflareConfig"],
  },
  {
    frontend: "nuxt",
    api: "orpc",
    resource: "Nuxt",
    configPath: "apps/web/nuxt.config.ts",
    configNeedles: [
      "alchemy/cloudflare/nuxt",
      "cloudflare-module",
      "nitro-cloudflare-dev",
      "const isNuxtPrepare",
      "isNuxtPrepare ? {} : { cloudflare: alchemy() }",
    ],
  },
  {
    frontend: "svelte",
    api: "orpc",
    resource: "SvelteKit",
    configPath: "apps/web/svelte.config.js",
    configNeedles: ["alchemy/cloudflare/sveltekit", "adapter: alchemy()"],
  },
  {
    frontend: "solid",
    api: "orpc",
    resource: "Vite",
    configPath: "apps/web/vite.config.ts",
  },
  {
    frontend: "astro",
    api: "orpc",
    resource: "Astro",
    configPath: "apps/web/astro.config.mjs",
    configNeedles: ["alchemy/cloudflare/astro", "adapter: alchemy()"],
  },
] as const;

const selfAlchemyScenarios = [
  { frontend: "next", api: "trpc", envNeedle: "@opennextjs/cloudflare" },
  {
    frontend: "tanstack-start",
    api: "trpc",
    envNeedle: 'export { env } from "cloudflare:workers";',
  },
  { frontend: "nuxt", api: "orpc", envNeedle: 'export { env } from "cloudflare:workers";' },
  { frontend: "svelte", api: "orpc", envNeedle: 'import { getRequestEvent } from "$app/server";' },
  { frontend: "astro", api: "orpc", envNeedle: 'export { env } from "cloudflare:workers";' },
] as const;

describe("Alchemy Cloudflare generation", () => {
  it("generates the expected Alchemy resource for every supported web frontend", async () => {
    for (const scenario of webAlchemyScenarios) {
      const files = await createVirtualFiles({
        ...baseCloudflareConfig,
        projectName: `alchemy-web-${scenario.frontend}`,
        frontend: [scenario.frontend],
        api: scenario.api,
      });

      const infraFile = files.get("packages/infra/alchemy.run.ts");
      const rootPackageJson = JSON.parse(files.get("package.json") ?? "{}");
      const webPackageJson = JSON.parse(files.get("apps/web/package.json") ?? "{}");

      expect(infraFile).toContain(`import { ${scenario.resource} } from "alchemy/cloudflare";`);
      expect(infraFile).toContain(`export const web = await ${scenario.resource}("web"`);
      expect(infraFile).toContain("console.log(`Web    -> ${web.url}`);");
      expect(rootPackageJson.scripts.dev).toBe("bun run --filter '*' dev");
      expect(rootPackageJson.scripts.deploy).toBe(
        `bun run --filter @alchemy-web-${scenario.frontend}/infra deploy`,
      );
      expect(rootPackageJson.scripts.destroy).toContain("/infra destroy");
      expect(webPackageJson.scripts.dev).toBeUndefined();
      expect(webPackageJson.scripts["dev:bare"]).toBeDefined();

      const frameworkConfig = files.get(scenario.configPath);
      for (const needle of scenario.configNeedles ?? []) {
        expect(frameworkConfig).toContain(needle);
      }
    }
  });

  it("binds env, auth, and D1 for every self backend frontend on Cloudflare", async () => {
    for (const scenario of selfAlchemyScenarios) {
      const files = await createVirtualFiles({
        ...baseCloudflareConfig,
        projectName: `alchemy-self-${scenario.frontend}`,
        frontend: [scenario.frontend],
        backend: "self",
        runtime: "none",
        auth: "better-auth",
        dbSetup: "d1",
        api: scenario.api,
      });

      const infraFile = files.get("packages/infra/alchemy.run.ts");
      const envFile = files.get("packages/env/src/server.ts");
      const envTypesFile = files.get("packages/env/env.d.ts");

      expect(infraFile).toContain('import { D1Database } from "alchemy/cloudflare";');
      expect(infraFile).toContain("DB: db");
      expect(infraFile).toContain("CORS_ORIGIN: alchemy.env.CORS_ORIGIN!");
      expect(infraFile).toContain("BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!");
      expect(envFile).toContain(scenario.envNeedle);
      expect(envTypesFile).toContain("import { type web as server }");

      if (scenario.frontend === "next" || scenario.frontend === "svelte") {
        expect(envFile).not.toContain('export { env } from "cloudflare:workers";');
      }
    }
  });

  it("uses a Worker resource only for supported Hono Workers backend deploys", async () => {
    const files = await createVirtualFiles({
      ...baseCloudflareConfig,
      projectName: "alchemy-server-hono",
      frontend: ["tanstack-router"],
      webDeploy: "none",
      serverDeploy: "cloudflare",
      runtime: "workers",
      dbSetup: "d1",
      api: "trpc",
    });

    const infraFile = files.get("packages/infra/alchemy.run.ts");
    const envFile = files.get("packages/env/src/server.ts");

    expect(infraFile).toContain('import { Worker } from "alchemy/cloudflare";');
    expect(infraFile).toContain('export const server = await Worker("server"');
    expect(infraFile).toContain("DB: db");
    expect(envFile).toContain('export { env } from "cloudflare:workers";');

    for (const backend of ["express", "fastify", "elysia"] as const) {
      const result = await createVirtual({
        ...baseCloudflareConfig,
        projectName: `alchemy-server-${backend}`,
        frontend: ["tanstack-router"],
        webDeploy: "none",
        serverDeploy: "cloudflare",
        backend,
        runtime: "workers",
        api: "trpc",
      });

      expect(result.isErr()).toBe(true);
    }
  });
});
