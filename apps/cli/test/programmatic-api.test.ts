import { describe, expect, it } from "bun:test";
import { join } from "node:path";

import fs from "fs-extra";

import {
  add,
  CLIError,
  create,
  createVirtual,
  DirectoryConflictError,
  ValidationError,
} from "../src/index";
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

  it("rejects an invalid configuration after resolving omitted defaults", async () => {
    const result = await create("invalid-defaulted-orm", {
      database: "mongodb",
      dryRun: true,
      git: false,
      install: false,
      disableAnalytics: true,
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected create() to reject MongoDB with the default Drizzle ORM");
    }

    expect(CLIError.is(result.error)).toBe(true);
    expect(result.error.message).toContain("Drizzle ORM does not support MongoDB");
    expect(ValidationError.is(result.error.cause)).toBe(true);
  });

  it("rejects incompatible overrides after applying a template", async () => {
    const result = await create("invalid-template-orm", {
      template: "mern",
      orm: "drizzle",
      dryRun: true,
      git: false,
      install: false,
      disableAnalytics: true,
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected create() to reject a Drizzle override for the MERN template");
    }

    expect(CLIError.is(result.error)).toBe(true);
    expect(result.error.message).toContain("Drizzle ORM does not support MongoDB");
    expect(ValidationError.is(result.error.cause)).toBe(true);
  });

  it("does not modify an overwrite target when the resolved configuration is invalid", async () => {
    const projectDir = join(SMOKE_DIR, "invalid-resolved-config-overwrite");
    const sentinelPath = join(projectDir, "keep-me.txt");
    await fs.ensureDir(projectDir);
    await fs.writeFile(sentinelPath, "keep-me", "utf8");

    const result = await create(projectDir, {
      database: "mongodb",
      git: false,
      install: false,
      disableAnalytics: true,
      directoryConflict: "overwrite",
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected create() to reject MongoDB with the default Drizzle ORM");
    }

    expect(result.error.message).toContain("Drizzle ORM does not support MongoDB");
    expect(await fs.readFile(sentinelPath, "utf8")).toBe("keep-me");
    expect(await fs.pathExists(join(projectDir, "package.json"))).toBe(false);
  });

  it("does not create a target directory when the resolved configuration is invalid", async () => {
    const projectDir = join(SMOKE_DIR, "invalid-resolved-config-new-directory");
    await fs.remove(projectDir);

    const result = await create(projectDir, {
      database: "mongodb",
      git: false,
      install: false,
      disableAnalytics: true,
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected create() to reject MongoDB with the default Drizzle ORM");
    }

    expect(CLIError.is(result.error)).toBe(true);
    expect(result.error.message).toContain("Drizzle ORM does not support MongoDB");
    expect(ValidationError.is(result.error.cause)).toBe(true);
    expect(await fs.pathExists(projectDir)).toBe(false);
  });

  it("preserves typed directory conflict errors", async () => {
    const projectDir = join(SMOKE_DIR, "programmatic-directory-conflict");
    await fs.ensureDir(projectDir);
    await fs.writeFile(join(projectDir, "keep-me.txt"), "keep-me", "utf8");

    const result = await create(projectDir, {
      yes: true,
      git: false,
      install: false,
      disableAnalytics: true,
      directoryConflict: "error",
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected create() to return a directory conflict");
    }

    expect(DirectoryConflictError.is(result.error)).toBe(true);
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

  it("rejects unsupported database modes through create without writing files", async () => {
    const projectDir = join(SMOKE_DIR, "invalid-planetscale-auto");
    await fs.remove(projectDir);

    const result = await create(projectDir, {
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "planetscale",
      dbSetupOptions: { mode: "auto" },
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      webDeploy: "none",
      serverDeploy: "prisma",
      git: false,
      install: false,
      disableAnalytics: true,
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) throw new Error("Expected create() to reject PlanetScale automatic setup");
    expect(CLIError.is(result.error)).toBe(true);
    expect(ValidationError.is(result.error.cause)).toBe(true);
    expect(result.error.message).toContain("PlanetScale does not support automatic database setup");
    expect(await fs.pathExists(projectDir)).toBe(false);
  });

  it("rejects unsupported database modes through createVirtual", async () => {
    const result = await createVirtual({
      projectName: "invalid-planetscale-auto-virtual",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "planetscale",
      dbSetupOptions: { mode: "auto" },
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      webDeploy: "none",
      serverDeploy: "prisma",
      git: false,
      packageManager: "bun",
    });

    expect(result.isErr()).toBe(true);
    if (result.isOk()) throw new Error("Expected createVirtual() to reject PlanetScale auto setup");
    expect(result.error.phase).toBe("validation");
    expect(result.error.message).toContain("PlanetScale does not support automatic database setup");
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
