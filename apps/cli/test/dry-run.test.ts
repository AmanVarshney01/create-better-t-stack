import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { create } from "../src/index";
import { SMOKE_DIR } from "./setup";

describe("Dry run", () => {
  it("does not create project directory on dry run", async () => {
    const projectPath = path.join(SMOKE_DIR, "dry-run-no-write");
    await fs.remove(projectPath);

    const result = await create(projectPath, {
      yes: true,
      dryRun: true,
      disableAnalytics: true,
      directoryConflict: "overwrite",
    });

    expect(result.isOk()).toBe(true);
    expect(await fs.pathExists(projectPath)).toBe(false);
  });

  it("does not clear existing directory with overwrite strategy on dry run", async () => {
    const projectPath = path.join(SMOKE_DIR, "dry-run-overwrite-protected");
    const sentinelPath = path.join(projectPath, "do-not-delete.txt");

    await fs.ensureDir(projectPath);
    await fs.writeFile(sentinelPath, "keep-me", "utf8");

    const result = await create(projectPath, {
      yes: true,
      dryRun: true,
      disableAnalytics: true,
      directoryConflict: "overwrite",
    });

    expect(result.isOk()).toBe(true);
    expect(await fs.pathExists(sentinelPath)).toBe(true);
    expect(await fs.readFile(sentinelPath, "utf8")).toBe("keep-me");
  });
});
