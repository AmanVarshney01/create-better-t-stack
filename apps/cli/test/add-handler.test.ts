import { describe, expect, it } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { add } from "../src/index";
import { SMOKE_DIR } from "./setup";

describe("add()", () => {
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
