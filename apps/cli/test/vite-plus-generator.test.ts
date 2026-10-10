import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "@better-t-stack/types";
import { parse } from "yaml";

import { VirtualFileSystem } from "../../../packages/template-generator/src/core/virtual-fs";
import { processPackageConfigs } from "../../../packages/template-generator/src/post-process/package-configs";
import { getVitePlusIgnorePatterns } from "../../../packages/template-generator/src/processors/vite-plus-generator";
import { processPnpmWorkspaceConfig } from "../../../packages/template-generator/src/template-handlers/extras";
import { dependencyVersionMap } from "../../../packages/template-generator/src/utils/add-deps";

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
  it.each(["bun", "npm", "pnpm"] as const)(
    "aligns the Vite core alias with the toolchain for %s",
    (packageManager) => {
      const vfs = new VirtualFileSystem();
      vfs.writeJson("package.json", {
        devDependencies: { "vite-plus": dependencyVersionMap["vite-plus"] },
      });
      vfs.writeJson("apps/web/package.json", {
        scripts: { build: "vite build" },
        devDependencies: { vite: "^8.0.0" },
      });
      const config = configWith({ packageManager });
      processPnpmWorkspaceConfig(vfs, config);
      processPackageConfigs(vfs, config);
      const root = vfs.readJson<{
        devDependencies: Record<string, string>;
        overrides?: Record<string, string>;
      }>("package.json")!;
      const web = vfs.readJson<{
        scripts: Record<string, string>;
        devDependencies: Record<string, string>;
      }>("apps/web/package.json")!;
      const alias = `npm:@voidzero-dev/vite-plus-core@${root.devDependencies["vite-plus"]}`;
      expect(web.devDependencies.vite).toBe(alias);
      expect(web.scripts.build).toBe("vp build");
      if (packageManager === "pnpm") {
        const workspace = parse(vfs.readFile("pnpm-workspace.yaml") ?? "");
        expect(workspace.overrides["vite@*"]).toBe(alias);
        expect(workspace.overrides.vite).toBeUndefined();
        expect(root.overrides?.vite).toBeUndefined();
      } else {
        expect(root.overrides?.vite).toBe(alias);
        if (packageManager === "bun") expect(root.devDependencies.vite).toBe(alias);
      }
    },
  );

  it.each(["", "toolchain"])("preserves pnpm's %s catalog reference when adding Vite+", (name) => {
    const vfs = new VirtualFileSystem();
    vfs.writeJson("package.json", {
      devDependencies: { "vite-plus": dependencyVersionMap["vite-plus"] },
    });
    const spec = `catalog:${name}`;
    vfs.writeJson("apps/web/package.json", {
      scripts: { build: "vite build" },
      devDependencies: { vite: spec },
    });
    vfs.writeFile(
      "pnpm-workspace.yaml",
      name
        ? `catalogs:\n  ${name}:\n    vite: ^8.0.0\n    typescript: ^6.0.0\n`
        : "catalog:\n  vite: ^8.0.0\n  typescript: ^6.0.0\n",
    );
    vfs.writeFile(
      "pnpm-workspace.yaml",
      `${vfs.readFile("pnpm-workspace.yaml")}overrides:\n  vite: npm:@voidzero-dev/vite-plus-core@0.1.0\n  custom-package: 1.0.0\n`,
    );
    const config = configWith({ packageManager: "pnpm" });
    processPnpmWorkspaceConfig(vfs, config);
    processPackageConfigs(vfs, config);
    const workspace = parse(vfs.readFile("pnpm-workspace.yaml") ?? "");
    const catalog = name ? workspace.catalogs[name] : workspace.catalog;
    expect(
      vfs.readJson<{ devDependencies: Record<string, string> }>("apps/web/package.json")!
        .devDependencies.vite,
    ).toBe(spec);
    expect(catalog.vite).toBe(workspace.overrides["vite@*"]);
    expect(catalog.typescript).toBe("^6.0.0");
    expect(workspace.overrides.vite).toBeUndefined();
    expect(workspace.overrides["custom-package"]).toBe("1.0.0");
  });

  it("preserves Bun's named catalog in a backend-only workspace", () => {
    const vfs = new VirtualFileSystem();
    vfs.writeJson("package.json", {
      workspaces: {
        packages: ["packages/*"],
        catalogs: { toolchain: { vite: "^8.0.0", typescript: "^6.0.0" } },
      },
      devDependencies: {
        "vite-plus": dependencyVersionMap["vite-plus"],
        vite: "catalog:toolchain",
      },
    });
    processPackageConfigs(vfs, configWith({ frontend: [] }));
    const root = vfs.readJson<{
      workspaces: { catalogs: Record<string, Record<string, string>> };
      devDependencies: Record<string, string>;
      overrides: Record<string, string>;
    }>("package.json")!;
    expect(root.devDependencies.vite).toBe("catalog:toolchain");
    expect(root.workspaces.catalogs.toolchain).toEqual({
      vite: root.overrides.vite,
      typescript: "^6.0.0",
    });
  });

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

    const prismaD1Patterns = getVitePlusIgnorePatterns(
      configWith({
        dbSetup: "d1",
        runtime: "workers",
        orm: "prisma",
      }),
    );

    expect(prismaD1Patterns).toContain("packages/db/local.db*");
    expect(prismaD1Patterns).not.toContain("packages/db/prisma/**/*.db*");
  });
});
