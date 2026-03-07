import { describe, expect, it } from "bun:test";
import { mkdir } from "node:fs/promises";
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
});
