import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "@better-t-stack/types";

import { generateNxConfig } from "../../../packages/template-generator/src/processors/nx-generator";
import { generateTurboConfig } from "../../../packages/template-generator/src/processors/turbo-generator";
import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

const baseConfig: ProjectConfig = {
  projectName: "nx-test",
  projectDir: "/tmp/nx-test",
  relativePath: "nx-test",
  frontend: ["tanstack-router"],
  database: "sqlite",
  orm: "drizzle",
  auth: "none",
  payments: "none",
  addons: ["nx"],
  examples: [],
  git: false,
  packageManager: "bun",
  install: false,
  dbSetup: "none",
  backend: "hono",
  runtime: "bun",
  api: "trpc",
  webDeploy: "none",
  serverDeploy: "none",
};

function configWith(overrides: Partial<ProjectConfig>): ProjectConfig {
  return { ...baseConfig, ...overrides };
}

describe("Nx config generator", () => {
  it("marks only long-running tasks as continuous", () => {
    const config = generateNxConfig(baseConfig);

    expect(config.targetDefaults.dev).toEqual({ cache: false, continuous: true });
    expect(config.targetDefaults["db:push"]).toEqual({ cache: false });
    expect(config.targetDefaults["db:generate"]).toEqual({ cache: false });
    expect(config.targetDefaults["db:migrate"]).toEqual({ cache: false });
    expect(config.targetDefaults["db:studio"]).toEqual({ cache: false, continuous: true });
    expect(config.targetDefaults["db:local"]).toEqual({ cache: false, continuous: true });

    const dockerConfig = generateNxConfig(configWith({ dbSetup: "docker" }));
    expect(dockerConfig.targetDefaults["db:start"]).toEqual({ cache: false });
    expect(dockerConfig.targetDefaults["db:watch"]).toEqual({
      cache: false,
      continuous: true,
    });

    const desktopConfig = generateNxConfig(
      configWith({ addons: ["nx", "electrobun"], frontend: ["tanstack-router"] }),
    );
    expect(desktopConfig.targetDefaults["dev:hmr"]).toEqual({
      cache: false,
      continuous: true,
    });
  });

  it("keeps prompt-driven tasks in the interactive Nx TUI", async () => {
    const result = await createVirtual({
      projectName: "nx-interactive",
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      addons: ["nx"],
      examples: [],
      git: false,
      packageManager: "bun",
      install: false,
      dbSetup: "none",
      webDeploy: "cloudflare",
      serverDeploy: "none",
      api: "trpc",
    });

    if (result.isErr()) throw result.error;

    const files = collectFiles(result.value.root, result.value.root.path);
    const packageJson = JSON.parse(files.get("package.json") ?? "{}") as {
      scripts?: Record<string, string>;
    };

    for (const script of ["db:push", "db:generate", "db:migrate", "deploy", "destroy"]) {
      expect(packageJson.scripts?.[script]).toStartWith("nx run-many");
      expect(packageJson.scripts?.[script]).not.toContain("--no-tui");
    }
  });

  it("excludes stack-generated frontend, backend, and database paths from production inputs", () => {
    const productionInputs = generateNxConfig(baseConfig).namedInputs.production;

    expect(productionInputs).toContain("!{workspaceRoot}/apps/web/dist/**");
    expect(productionInputs).toContain("!{workspaceRoot}/apps/web/.tanstack/**");
    expect(productionInputs).toContain("!{workspaceRoot}/apps/web/src/routeTree.gen.ts");
    expect(productionInputs).toContain("!{workspaceRoot}/apps/server/dist/**");
    expect(productionInputs).toContain("!{workspaceRoot}/packages/db/dist/**");
    expect(productionInputs).toContain("!{workspaceRoot}/packages/db/local.db*");
    expect(productionInputs).not.toContain("!{workspaceRoot}/apps/web/.next/**");
    expect(productionInputs).not.toContain("!{workspaceRoot}/packages/db/prisma/generated/**");
    expect(productionInputs).not.toContain("!{workspaceRoot}/.wrangler/**");
  });

  it("excludes Prisma, Turso, and Convex generated paths only for matching stacks", () => {
    const prismaTursoInputs = generateNxConfig(
      configWith({
        dbSetup: "turso",
        orm: "prisma",
      }),
    ).namedInputs.production;

    expect(prismaTursoInputs).toContain("!{workspaceRoot}/packages/db/prisma/generated/**");
    expect(prismaTursoInputs).toContain("!{workspaceRoot}/packages/db/prisma/**/*.db*");
    expect(prismaTursoInputs).toContain("!{workspaceRoot}/packages/db/local.db*");
    expect(prismaTursoInputs).not.toContain(
      "!{workspaceRoot}/packages/backend/convex/_generated/**",
    );

    const convexInputs = generateNxConfig(
      configWith({
        backend: "convex",
        database: "none",
        orm: "none",
      }),
    ).namedInputs.production;

    expect(convexInputs).toContain("!{workspaceRoot}/packages/backend/convex/_generated/**");
    expect(convexInputs).not.toContain("!{workspaceRoot}/apps/server/dist/**");
    expect(convexInputs).not.toContain("!{workspaceRoot}/packages/db/local.db*");
    expect(convexInputs).not.toContain("!{workspaceRoot}/packages/db/prisma/generated/**");
  });

  it("excludes Cloudflare generated paths only for Cloudflare stacks", () => {
    const nextCloudflareInputs = generateNxConfig(
      configWith({
        frontend: ["next"],
        backend: "self",
        database: "none",
        orm: "none",
        api: "none",
        webDeploy: "cloudflare",
      }),
    ).namedInputs.production;

    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/apps/web/.next/**");
    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/apps/web/.open-next/**");
    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/.alchemy/**");
    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/.wrangler/**");
    expect(nextCloudflareInputs).not.toContain("!{workspaceRoot}/apps/server/dist/**");
    expect(nextCloudflareInputs).not.toContain("!{workspaceRoot}/packages/db/dist/**");
  });

  it("registers local D1 tasks only when Wrangler owns local migrations", () => {
    for (const frontend of ["next", "svelte", "solid"] as const) {
      const config = configWith({
        frontend: [frontend],
        backend: "self",
        dbSetup: "d1",
        webDeploy: "cloudflare",
      });

      expect(generateNxConfig(config).targetDefaults["db:migrate:local"]).toEqual({
        cache: false,
      });
      expect(generateTurboConfig(config).tasks["db:migrate:local"]).toEqual({
        cache: false,
        interactive: true,
      });
    }

    for (const frontend of ["nuxt", "astro"] as const) {
      const config = configWith({
        frontend: [frontend],
        backend: "self",
        dbSetup: "d1",
        webDeploy: "cloudflare",
      });

      expect(generateNxConfig(config).targetDefaults["db:migrate:local"]).toBeUndefined();
      expect(generateTurboConfig(config).tasks["db:migrate:local"]).toBeUndefined();
    }

    expect(generateNxConfig(baseConfig).targetDefaults["db:migrate:local"]).toBeUndefined();
    expect(generateTurboConfig(baseConfig).tasks["db:migrate:local"]).toBeUndefined();
  });
});

describe("Turbo config generator", () => {
  it("distinguishes prompt-driven and long-running tasks", () => {
    const config = generateTurboConfig(configWith({ addons: ["turborepo"] }));

    expect(config.tasks["db:push"]).toEqual({ cache: false, interactive: true });
    expect(config.tasks["db:generate"]).toEqual({ cache: false, interactive: true });
    expect(config.tasks["db:migrate"]).toEqual({ cache: false, interactive: true });
    expect(config.tasks["db:studio"]).toEqual({ cache: false, persistent: true });
    expect(config.tasks["db:local"]).toEqual({ cache: false, persistent: true });

    const dockerConfig = generateTurboConfig(
      configWith({ addons: ["turborepo"], dbSetup: "docker" }),
    );
    expect(dockerConfig.tasks["db:start"]).toEqual({ cache: false });
    expect(dockerConfig.tasks["db:watch"]).toEqual({ cache: false, persistent: true });

    const convexConfig = generateTurboConfig(
      configWith({
        addons: ["turborepo"],
        backend: "convex",
        database: "none",
        orm: "none",
      }),
    );
    expect(convexConfig.tasks["dev:setup"]).toEqual({ cache: false, interactive: true });
  });

  it("configures Alchemy deployment tasks for every provider", () => {
    for (const webDeploy of ["cloudflare", "prisma"] as const) {
      const projectConfig = configWith({ webDeploy });
      const turboConfig = generateTurboConfig({
        ...projectConfig,
        addons: ["turborepo"],
      });
      const nxConfig = generateNxConfig(projectConfig);

      expect(turboConfig.tasks.deploy).toEqual({ cache: false, interactive: true });
      expect(turboConfig.tasks.destroy).toEqual({ cache: false, interactive: true });
      expect(nxConfig.targetDefaults.deploy).toEqual({ cache: false });
      expect(nxConfig.targetDefaults.destroy).toEqual({ cache: false });
    }
  });
});
