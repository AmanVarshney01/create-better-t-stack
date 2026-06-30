import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "@better-t-stack/types";

import { getVitePlusIgnorePatterns } from "../../../packages/template-generator/src/processors/vite-plus-generator";

const baseConfig: ProjectConfig = {
  projectName: "vite-plus-test",
  projectDir: "/tmp/vite-plus-test",
  relativePath: "vite-plus-test",
  frontend: ["tanstack-router"],
  database: "sqlite",
  orm: "drizzle",
  auth: "none",
  payments: "none",
  addons: ["vite-plus"],
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

describe("Vite+ config generator", () => {
  it("adds only stack-relevant frontend and backend ignore patterns", () => {
    const patterns = getVitePlusIgnorePatterns(baseConfig);

    expect(patterns).toContain("apps/web/dist/**");
    expect(patterns).toContain("apps/web/.tanstack/**");
    expect(patterns).toContain("apps/web/src/routeTree.gen.ts");
    expect(patterns).toContain("apps/server/dist/**");
    expect(patterns).toContain("packages/db/dist/**");
    expect(patterns).toContain("packages/db/local.db*");
    expect(patterns).not.toContain("apps/web/.next/**");
    expect(patterns).not.toContain("apps/web/.nuxt/**");
    expect(patterns).not.toContain("packages/db/prisma/generated/**");
    expect(patterns).not.toContain("packages/db/prisma/**/*.db*");
    expect(patterns).not.toContain("packages/backend/convex/_generated/**");
    expect(patterns).not.toContain(".wrangler/**");
  });

  it("adds framework-specific ignore patterns for non-Vite frontends", () => {
    const nextPatterns = getVitePlusIgnorePatterns(
      configWith({
        frontend: ["next"],
        backend: "self",
        database: "none",
        orm: "none",
        api: "none",
        webDeploy: "cloudflare",
      }),
    );

    expect(nextPatterns).toContain("apps/web/.next/**");
    expect(nextPatterns).toContain("apps/web/out/**");
    expect(nextPatterns).toContain("apps/web/.open-next/**");
    expect(nextPatterns).toContain(".alchemy/**");
    expect(nextPatterns).toContain(".wrangler/**");
    expect(nextPatterns).not.toContain("packages/db/dist/**");
    expect(nextPatterns).not.toContain("apps/web/.nuxt/**");
    expect(nextPatterns).not.toContain("apps/server/dist/**");

    const nuxtPatterns = getVitePlusIgnorePatterns(
      configWith({
        frontend: ["nuxt"],
        api: "orpc",
      }),
    );

    expect(nuxtPatterns).toContain("apps/web/.nuxt/**");
    expect(nuxtPatterns).toContain("apps/web/.output/**");
    expect(nuxtPatterns).not.toContain("apps/web/.next/**");
  });

  it("adds native and Cloudflare ignore patterns only when selected", () => {
    const patterns = getVitePlusIgnorePatterns(
      configWith({
        frontend: ["native-unistyles"],
        runtime: "workers",
        serverDeploy: "cloudflare",
      }),
    );

    expect(patterns).toContain("apps/native/.expo/**");
    expect(patterns).toContain("apps/native/ios/**");
    expect(patterns).toContain("apps/native/android/**");
    expect(patterns).toContain(".alchemy/**");
    expect(patterns).toContain(".wrangler/**");
  });

  it("adds ORM and Convex generated paths only for matching stacks", () => {
    const prismaPatterns = getVitePlusIgnorePatterns(
      configWith({
        orm: "prisma",
        database: "postgres",
      }),
    );

    expect(prismaPatterns).toContain("packages/db/dist/**");
    expect(prismaPatterns).toContain("packages/db/prisma/generated/**");
    expect(prismaPatterns).not.toContain("packages/db/prisma/**/*.db*");
    expect(prismaPatterns).not.toContain("packages/backend/convex/_generated/**");

    const convexPatterns = getVitePlusIgnorePatterns(
      configWith({
        backend: "convex",
        database: "none",
        orm: "none",
      }),
    );

    expect(convexPatterns).toContain("packages/backend/convex/_generated/**");
    expect(convexPatterns).not.toContain("apps/server/dist/**");
    expect(convexPatterns).not.toContain("packages/db/dist/**");
    expect(convexPatterns).not.toContain("packages/db/prisma/generated/**");
  });

  it("adds Turso local database paths only for matching SQLite stacks", () => {
    const tursoPatterns = getVitePlusIgnorePatterns(
      configWith({
        dbSetup: "turso",
      }),
    );

    expect(tursoPatterns).toContain("packages/db/local.db*");
    expect(tursoPatterns).not.toContain("packages/db/prisma/**/*.db*");

    const prismaTursoPatterns = getVitePlusIgnorePatterns(
      configWith({
        dbSetup: "turso",
        orm: "prisma",
      }),
    );

    expect(prismaTursoPatterns).toContain("packages/db/local.db*");
    expect(prismaTursoPatterns).toContain("packages/db/prisma/**/*.db*");

    const d1Patterns = getVitePlusIgnorePatterns(
      configWith({
        dbSetup: "d1",
        runtime: "workers",
      }),
    );

    expect(d1Patterns).not.toContain("packages/db/local.db*");
    expect(d1Patterns).not.toContain("packages/db/prisma/**/*.db*");
  });
});
