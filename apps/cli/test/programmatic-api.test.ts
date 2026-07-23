import { describe, expect, it } from "bun:test";
import { join } from "node:path";

import { add, CLIError, create, createVirtual } from "../src/index";
import { SMOKE_DIR } from "./setup";

describe("programmatic API input validation", () => {
  it("returns a typed error when create receives an invalid input shape", async () => {
    const result = await create("invalid-runtime", {
      runtime: "deno",
      dryRun: true,
    } as never);

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected create() to reject an invalid runtime");
    }

    expect(CLIError.is(result.error)).toBe(true);
    expect(result.error.message).toContain("Invalid create input");
    expect(result.error.message).toContain("runtime");
  });

  it("returns a generator validation error for an invalid virtual input shape", async () => {
    const result = await createVirtual({
      runtime: "deno",
    } as never);

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected createVirtual() to reject an invalid runtime");
    }

    expect(result.error.phase).toBe("validation");
    expect(result.error.message).toContain("Invalid virtual create input");
    expect(result.error.message).toContain("runtime");
  });

  it("returns a structured failure instead of throwing for an invalid add input shape", async () => {
    const projectDir = join(SMOKE_DIR, "programmatic-add-invalid-input");
    const createResult = await create(projectDir, {
      yes: true,
      git: false,
      install: false,
      directoryConflict: "overwrite",
      disableAnalytics: true,
    });
    if (createResult.isErr()) {
      throw createResult.error;
    }

    const result = await add({
      projectDir,
      addons: "oxlint",
    } as never);

    expect(result.success).toBe(false);
    expect(result.addedAddons).toEqual([]);
    expect(result.error).toContain("Invalid add input");
    expect(result.error).toContain("addons");
  });
});
