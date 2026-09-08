import { describe, expect, it, spyOn } from "bun:test";
import * as fsPromises from "node:fs/promises";
import { join } from "node:path";

import fs from "fs-extra";

import { add } from "../src/index";
import { readBtsConfig, updateBtsConfig } from "../src/utils/bts-config";
import { expectSuccess, runCreateTest } from "./test-utils";

describe("persisted project configuration", () => {
  it("preserves comments and user fields while saving addon changes", async () => {
    const result = await runCreateTest({ projectName: "config-preservation" });
    expectSuccess(result);
    const configPath = join(result.projectDir, "bts.jsonc");
    const original = await fs.readFile(configPath, "utf8");
    await fs.writeFile(configPath, `// my project\n${original}`);
    const before = await readBtsConfig(result.projectDir);
    if (!before) throw new Error("Expected a valid generated config");

    const updated = await updateBtsConfig(result.projectDir, { addons: ["biome"] });
    expect(updated.isOk()).toBe(true);
    expect(await readBtsConfig(result.projectDir)).toEqual({ ...before, addons: ["biome"] });
    expect(await fs.readFile(configPath, "utf8")).toContain("// my project");
  });

  for (const name of ["malformed", "invalid-shape"]) {
    it(`rejects ${name} configuration without changing it`, async () => {
      const result = await runCreateTest({ projectName: `config-${name}` });
      expectSuccess(result);
      const before = await readBtsConfig(result.projectDir);
      if (!before) throw new Error("Expected a valid generated config");
      const content =
        name === "malformed"
          ? '{"addons": ["biome"]'
          : JSON.stringify({ ...before, addons: "biome" });
      const configPath = join(result.projectDir, "bts.jsonc");
      await fs.writeFile(configPath, content);
      expect(await readBtsConfig(result.projectDir)).toBeNull();
      expect((await updateBtsConfig(result.projectDir, { webDeploy: "none" })).isErr()).toBe(true);
      expect(await fs.readFile(configPath, "utf8")).toBe(content);
    });
  }

  it("reports a persistence failure through add instead of claiming success", async () => {
    const result = await runCreateTest({ projectName: "config-write-failure" });
    expectSuccess(result);
    const configPath = join(result.projectDir, "bts.jsonc");
    const before = await fs.readFile(configPath, "utf8");
    const writeFile = fsPromises.writeFile;
    const writeMock = spyOn(fsPromises, "writeFile").mockImplementation((...args) => {
      if (args[0] === configPath) return Promise.reject(new Error("Disk is full"));
      return writeFile(...args);
    });
    try {
      const added = await add({ projectDir: result.projectDir, addons: ["biome"], install: false });
      expect(added.success).toBe(false);
      expect(added.error).toContain("Failed to update bts.jsonc");
      expect(added.error).toContain("Disk is full");
      expect(await fs.readFile(configPath, "utf8")).toBe(before);
    } finally {
      writeMock.mockRestore();
    }
  });
});
