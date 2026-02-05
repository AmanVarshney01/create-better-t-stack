import { describe, expect, it } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { AvailableDependencies } from "../src/constants";
import { addPackageDependency } from "../src/utils/add-package-deps";
import { runWithContextAsync } from "../src/utils/context";

describe("addPackageDependency", () => {
  it("suppresses dependency warnings in silent mode", async () => {
    const projectDir = await mkdtemp(join(tmpdir(), "bts-deps-"));
    await writeFile(join(projectDir, "package.json"), JSON.stringify({}));

    const originalWarn = console.warn;
    const warnCalls: unknown[][] = [];
    console.warn = (...args) => {
      warnCalls.push(args);
    };

    try {
      await runWithContextAsync({ silent: true }, async () => {
        await addPackageDependency({
          dependencies: ["missing-dep" as AvailableDependencies],
          projectDir,
        });
      });
    } finally {
      console.warn = originalWarn;
    }

    expect(warnCalls.length).toBe(0);
  });
});
