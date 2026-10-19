import { describe, expect, test } from "bun:test";
import { join, relative } from "node:path";

import fs from "fs-extra";
import { parse } from "jsonc-parser";
import yaml from "yaml";

import { add, create } from "../src/index";
import { SMOKE_DIR } from "./setup";

async function createProject(name: string) {
  const projectDir = join(SMOKE_DIR, name);
  const result = await create(projectDir, { yes: true, install: false, git: false });
  if (result.isErr()) throw result.error;
  return projectDir;
}

async function snapshot(projectDir: string) {
  const entries = await fs.readdir(projectDir, { recursive: true, withFileTypes: true });
  return Object.fromEntries(
    await Promise.all(
      entries.map(async (entry) => {
        const file = join(entry.parentPath, entry.name);
        return [relative(projectDir, file), entry.isFile() ? await fs.readFile(file) : null];
      }),
    ),
  );
}

describe("adding to an existing project", () => {
  for (const packageManager of ["npm", "pnpm"] as const) {
    test(`preserves ${packageManager} user build denials and workspace settings`, async () => {
      const projectDir = join(SMOKE_DIR, `${packageManager}-add-preservation`);
      const result = await create(projectDir, {
        yes: true,
        install: false,
        git: false,
        packageManager,
      });
      if (result.isErr()) throw result.error;
      const file = join(
        projectDir,
        packageManager === "npm" ? "package.json" : "pnpm-workspace.yaml",
      );
      const original =
        packageManager === "npm"
          ? await fs.readJson(file)
          : yaml.parse(await fs.readFile(file, "utf8"));
      if (packageManager === "npm") original.allowScripts = { sharp: false };
      else {
        original.packages.push("tools/*");
        original.allowBuilds = { ...original.allowBuilds, sharp: false };
        original.overrides = { "custom-package": "1.0.0" };
      }
      await fs.writeFile(
        file,
        packageManager === "npm" ? JSON.stringify(original) : yaml.stringify(original),
      );
      const added = await add({ projectDir, addons: ["biome"], install: false });
      expect(added.success).toBe(true);
      expect(added.addedAddons).toContain("biome");
      const updated =
        packageManager === "npm"
          ? await fs.readJson(file)
          : yaml.parse(await fs.readFile(file, "utf8"));
      expect(packageManager === "npm" ? updated.allowScripts : updated.allowBuilds).toMatchObject({
        esbuild: true,
        sharp: false,
      });
      if (packageManager === "pnpm") {
        expect(updated.packages).toEqual(original.packages);
        expect(updated.overrides).toEqual(original.overrides);
        expect(updated.catalog).toEqual(original.catalog);
      }
    });
  }

  test("preserves JSONC comments and migrates legacy options when saving addons", async () => {
    const projectDir = await createProject("add-legacy-config");
    const file = join(projectDir, "bts.jsonc");
    const config = parse(await fs.readFile(file, "utf8"));
    config.addonOptions = {
      skills: {
        scope: "project",
        agents: ["claude-code"],
        selections: [{ source: "yusukebe/hono-skill", skills: ["hono"] }],
      },
    };
    await fs.writeFile(file, `// keep my project settings\n${JSON.stringify(config, null, 2)}`);
    const added = await add({ projectDir, addons: ["biome"], install: false });
    expect(added.success).toBe(true);
    const content = await fs.readFile(file, "utf8");
    expect(content).toContain("// keep my project settings");
    expect(parse(content)).toMatchObject({
      database: config.database,
      auth: config.auth,
      addons: expect.arrayContaining(["biome"]),
      addonOptions: {
        skills: {
          scope: "project",
          agents: ["claude-code"],
          selections: [{ source: "honojs/skills", skills: ["hono"] }],
        },
      },
    });
  });

  for (const content of ['{"addons": ["biome"]', '{"addons":"biome"}']) {
    test(`rejects corrupt project config ${content} without writing files`, async () => {
      const projectDir = await createProject(`add-corrupt-${content.length}`);
      await fs.writeFile(join(projectDir, "bts.jsonc"), content);
      const before = await snapshot(projectDir);
      const result = await add({ projectDir, addons: ["biome"], install: false });
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(await snapshot(projectDir)).toEqual(before);
    });
  }

  test("rejects duplicate and concurrent package creation without clobbering files", async () => {
    const projectDir = await createProject("add-package-collision");
    expect((await add({ projectDir, package: "shared", install: false })).success).toBe(true);
    const source = join(projectDir, "packages/shared/src/index.ts");
    await fs.writeFile(source, "export const keepMe = true;\n");
    const duplicate = await add({ projectDir, package: "shared", install: false });
    expect(duplicate.success).toBe(false);
    expect(duplicate.error).toContain("Workspace package already exists");
    expect(await fs.readFile(source, "utf8")).toBe("export const keepMe = true;\n");
    const concurrent = await Promise.all([
      add({ projectDir, package: "concurrent", install: false }),
      add({ projectDir, package: "concurrent", install: false }),
    ]);
    expect(concurrent.filter((result) => result.success)).toHaveLength(1);
    expect(concurrent.find((result) => !result.success)?.error).toContain(
      "Workspace package already exists",
    );
    expect(await fs.pathExists(join(projectDir, "packages/concurrent/src/index.ts"))).toBe(true);
  });

  test("rejects path-like workspace names without escaping the project", async () => {
    const projectDir = await createProject("add-package-path");
    const before = await snapshot(projectDir);
    for (const name of ["../escaped", "nested/package", "@scope/name"]) {
      const result = await add({ projectDir, package: name, install: false });
      expect(result.success).toBe(false);
      expect(result.error).toContain("package");
    }
    expect(await snapshot(projectDir)).toEqual(before);
    expect(await fs.pathExists(join(SMOKE_DIR, "escaped"))).toBe(false);
  });

  test("revalidates deployment constraints before adding a desktop addon", async () => {
    const projectDir = join(SMOKE_DIR, "add-prisma-desktop");
    const result = await create(projectDir, {
      frontend: ["next"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      auth: "none",
      api: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "prisma",
      serverDeploy: "none",
      packageManager: "bun",
      install: false,
      git: false,
    });
    if (result.isErr()) throw result.error;
    const before = await snapshot(projectDir);
    const added = await add({ projectDir, addons: ["tauri"], install: false });
    expect(added.success).toBe(false);
    expect(added.error).toContain("Prisma Compute requires an executable server artifact");
    expect(await snapshot(projectDir)).toEqual(before);
  });
});
