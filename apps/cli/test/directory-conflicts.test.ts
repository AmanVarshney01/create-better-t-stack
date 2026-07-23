import { beforeEach, describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { create } from "../src/index";
import { SMOKE_DIR } from "./setup";

const TEST_ROOT = path.join(SMOKE_DIR, "directory-conflicts");

describe("Directory conflicts", () => {
  beforeEach(async () => {
    await fs.remove(TEST_ROOT);
    await fs.ensureDir(TEST_ROOT);
  });

  it("returns an actionable error when the project path is an existing file", async () => {
    const projectPath = path.join(TEST_ROOT, "existing-file");
    await fs.writeFile(projectPath, "keep-me", "utf8");

    const result = await create(projectPath, {
      yes: true,
      dryRun: true,
      directoryConflict: "error",
    });

    expect(result.isErr()).toBe(true);
    expect(result.error?.message).toContain("exists and is not a directory");
    expect(result.error?.message).not.toContain("ENOTDIR");
    expect(await fs.readFile(projectPath, "utf8")).toBe("keep-me");
  });

  it("rejects overwrite when the project path is a directory symlink", async () => {
    const targetPath = path.join(TEST_ROOT, "symlink-target");
    const projectPath = path.join(TEST_ROOT, "symlink-project");
    const sentinelPath = path.join(targetPath, "keep-me.txt");
    await fs.ensureDir(targetPath);
    await fs.writeFile(sentinelPath, "keep-me", "utf8");
    await fs.symlink(targetPath, projectPath, "dir");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "overwrite",
    });

    expect(result.isErr()).toBe(true);
    expect(result.error?.message).toContain("symbolic link");
    expect(await fs.readFile(sentinelPath, "utf8")).toBe("keep-me");
    expect(await fs.pathExists(path.join(targetPath, "package.json"))).toBe(false);
  });

  it("increments past existing files without modifying them", async () => {
    const projectPath = path.join(TEST_ROOT, "increment-file");
    const firstIncrementPath = `${projectPath}-1`;
    const expectedProjectPath = `${projectPath}-2`;
    await fs.writeFile(projectPath, "original", "utf8");
    await fs.writeFile(firstIncrementPath, "first-increment", "utf8");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "increment",
    });

    expect(result.isOk()).toBe(true);
    expect(result.value?.projectDirectory).toBe(expectedProjectPath);
    expect(await fs.readFile(projectPath, "utf8")).toBe("original");
    expect(await fs.readFile(firstIncrementPath, "utf8")).toBe("first-increment");
    expect(await fs.pathExists(path.join(expectedProjectPath, "package.json"))).toBe(true);
  });

  it("rejects a project path with a symbolic-link parent", async () => {
    const targetParent = path.join(TEST_ROOT, "parent-target");
    const linkedParent = path.join(TEST_ROOT, "linked-parent");
    const projectPath = path.join(linkedParent, "project");
    await fs.ensureDir(targetParent);
    await fs.symlink(targetParent, linkedParent, "dir");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "overwrite",
    });

    expect(result.isErr()).toBe(true);
    expect(result.error?.message).toContain("symbolic link");
    expect(await fs.pathExists(path.join(targetParent, "project"))).toBe(false);
  });

  it("rejects merge when a generated path would pass through a nested symbolic link", async () => {
    const projectPath = path.join(TEST_ROOT, "nested-symlink-project");
    const outsidePath = path.join(TEST_ROOT, "nested-symlink-target");
    await fs.ensureDir(projectPath);
    await fs.ensureDir(outsidePath);
    await fs.symlink(outsidePath, path.join(projectPath, "apps"), "dir");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "merge",
    });

    expect(result.isErr()).toBe(true);
    expect(result.error?.message).toContain("symbolic link");
    expect(await fs.pathExists(path.join(outsidePath, "web"))).toBe(false);
    expect(await fs.pathExists(path.join(outsidePath, "server"))).toBe(false);
  });

  it("overwrites a non-empty directory only when explicitly requested", async () => {
    const projectPath = path.join(TEST_ROOT, "overwrite-project");
    const sentinelPath = path.join(projectPath, "remove-me.txt");
    await fs.ensureDir(projectPath);
    await fs.writeFile(sentinelPath, "remove-me", "utf8");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "overwrite",
    });

    expect(result.isOk()).toBe(true);
    expect(await fs.pathExists(sentinelPath)).toBe(false);
    expect(await fs.pathExists(path.join(projectPath, "package.json"))).toBe(true);
  });

  it("merges into a non-empty directory while preserving unrelated files", async () => {
    const projectPath = path.join(TEST_ROOT, "merge-project");
    const sentinelPath = path.join(projectPath, "keep-me.txt");
    await fs.ensureDir(projectPath);
    await fs.writeFile(sentinelPath, "keep-me", "utf8");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "merge",
    });

    expect(result.isOk()).toBe(true);
    expect(await fs.readFile(sentinelPath, "utf8")).toBe("keep-me");
    expect(await fs.pathExists(path.join(projectPath, "package.json"))).toBe(true);
  });

  it("increments past occupied directories", async () => {
    const projectPath = path.join(TEST_ROOT, "increment-project");
    const firstIncrementPath = `${projectPath}-1`;
    const expectedProjectPath = `${projectPath}-2`;
    await fs.ensureDir(projectPath);
    await fs.ensureDir(firstIncrementPath);
    await fs.writeFile(path.join(projectPath, "keep-me.txt"), "original", "utf8");
    await fs.writeFile(path.join(firstIncrementPath, "keep-me.txt"), "first", "utf8");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "increment",
    });

    expect(result.isOk()).toBe(true);
    expect(result.value?.projectDirectory).toBe(expectedProjectPath);
    expect(await fs.readFile(path.join(projectPath, "keep-me.txt"), "utf8")).toBe("original");
    expect(await fs.readFile(path.join(firstIncrementPath, "keep-me.txt"), "utf8")).toBe("first");
  });

  it("returns a conflict error without modifying a non-empty directory", async () => {
    const projectPath = path.join(TEST_ROOT, "error-project");
    const sentinelPath = path.join(projectPath, "keep-me.txt");
    await fs.ensureDir(projectPath);
    await fs.writeFile(sentinelPath, "keep-me", "utf8");

    const result = await create(projectPath, {
      yes: true,
      install: false,
      git: false,
      directoryConflict: "error",
    });

    expect(result.isErr()).toBe(true);
    expect(result.error?.message).toContain("already exists and is not empty");
    expect(await fs.readFile(sentinelPath, "utf8")).toBe("keep-me");
    expect(await fs.pathExists(path.join(projectPath, "package.json"))).toBe(false);
  });
});
