import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { create } from "../src/index";
import {
  extractAndValidateProjectName,
  validateProjectName,
} from "../src/utils/project-name-validation";

const SMOKE_DIR_PATH = path.join(import.meta.dir, "..", ".smoke");

describe("Project name validation hardening", () => {
  it("rejects control characters", () => {
    const result = validateProjectName("bad\nname");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("control characters");
    }
  });

  it("rejects query-like characters in project input", () => {
    const result = extractAndValidateProjectName("my-app?fields=id,name");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("Invalid project name");
    }
  });

  it("allows percent characters in filesystem paths", () => {
    const result = extractAndValidateProjectName("my-app%23docs");

    expect(result.isOk()).toBe(true);
  });

  it("allows hash characters in filesystem paths", () => {
    const result = extractAndValidateProjectName("my-app#docs");

    expect(result.isOk()).toBe(true);
  });

  it("fails invalid names before creating the project directory", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "invalid?name");
    await fs.remove(projectPath);

    const result = await create(projectPath, {
      yes: true,
      install: false,
      disableAnalytics: true,
      directoryConflict: "overwrite",
    });

    expect(result.isErr()).toBe(true);
    expect(await fs.pathExists(projectPath)).toBe(false);
  });
});
