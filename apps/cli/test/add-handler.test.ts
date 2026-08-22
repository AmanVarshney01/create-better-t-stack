import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { add } from "../src/index";
import { SMOKE_DIR } from "./setup";

describe("add()", () => {
  it("scaffolds a workspace package through the Add Path", async () => {
    const projectDir = join(SMOKE_DIR, "workspace-package-project");
    await rm(projectDir, { recursive: true, force: true });
    await mkdir(join(projectDir, "packages", "config"), { recursive: true });
    await writeFile(
      join(projectDir, "bts.jsonc"),
      JSON.stringify({
        version: "0.0.0-test",
        createdAt: new Date(0).toISOString(),
        database: "none",
        orm: "none",
        backend: "none",
        runtime: "bun",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        auth: "none",
        payments: "none",
        packageManager: "bun",
        dbSetup: "none",
        api: "none",
        webDeploy: "none",
        serverDeploy: "none",
      }),
    );
    await writeFile(
      join(projectDir, "packages", "config", "package.json"),
      JSON.stringify({ name: "@acme/config", private: true }),
    );

    const previewResult = await add({
      projectDir,
      package: "shared",
      install: false,
      dryRun: true,
    });

    expect(previewResult).toMatchObject({
      success: true,
      dryRun: true,
      addedPackage: "shared",
      plannedFileCount: 3,
    });
    expect(existsSync(join(projectDir, "packages", "shared"))).toBe(false);

    const result = await add({ projectDir, package: "shared", install: false });

    expect(result).toMatchObject({
      success: true,
      addedAddons: [],
      addedPackage: "shared",
      plannedFileCount: 3,
    });
    expect(
      JSON.parse(await readFile(join(projectDir, "packages", "shared", "package.json"), "utf8")),
    ).toEqual({
      name: "@acme/shared",
      version: "0.0.0",
      private: true,
      type: "module",
      exports: { ".": "./src/index.ts" },
      scripts: { "check-types": "tsc --noEmit" },
    });
    expect(
      JSON.parse(await readFile(join(projectDir, "packages", "shared", "tsconfig.json"), "utf8")),
    ).toEqual({
      extends: "@acme/config/tsconfig.base.json",
      include: ["src/**/*.ts"],
    });
    const indexPath = join(projectDir, "packages", "shared", "src", "index.ts");
    expect(await readFile(indexPath, "utf8")).toBe("export {};\n");

    await writeFile(indexPath, "export const existing = true;\n");
    const duplicateResult = await add({ projectDir, package: "shared", install: false });

    expect(duplicateResult.success).toBe(false);
    expect(duplicateResult.error).toContain("Workspace package already exists");
    expect(await readFile(indexPath, "utf8")).toBe("export const existing = true;\n");
  });

  it("returns an error in silent mode instead of exiting when the project config is missing", async () => {
    const projectDir = join(SMOKE_DIR, "missing-bts-config");
    await mkdir(projectDir, { recursive: true });

    const result = await add({
      projectDir,
      addons: ["biome"],
      install: false,
    });

    expect(result).toBeDefined();
    expect(result?.success).toBe(false);
    expect(result?.error).toContain("No Better-T-Stack project found");
  });

  it("revalidates deployment constraints when adding an addon", async () => {
    const projectDir = join(SMOKE_DIR, "add-prisma-next-tauri");
    await rm(projectDir, { recursive: true, force: true });
    await mkdir(projectDir, { recursive: true });
    await writeFile(
      join(projectDir, "bts.jsonc"),
      JSON.stringify({
        version: "0.0.0-test",
        createdAt: new Date(0).toISOString(),
        database: "none",
        orm: "none",
        backend: "none",
        runtime: "none",
        frontend: ["next"],
        addons: ["none"],
        examples: ["none"],
        auth: "none",
        payments: "none",
        packageManager: "bun",
        dbSetup: "none",
        api: "none",
        webDeploy: "prisma",
        serverDeploy: "none",
      }),
    );

    const result = await add({
      projectDir,
      addons: ["tauri"],
      install: false,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Prisma Compute requires an executable server artifact");
  });
});
