import { describe, expect, it } from "bun:test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { add } from "../src";
import { expectSuccess, runTRPCTest } from "./test-utils";

async function createProjectForAdd(projectName: string) {
  const created = await runTRPCTest({
    projectName,
    addons: ["none"],
    git: false,
    install: false,
  });

  expectSuccess(created);
  const projectDir = created.result?.projectDirectory;
  if (!projectDir) throw new Error("Expected generated project directory");
  return projectDir;
}

describe("Nix flake addon", () => {
  it("generates an envrc and a Bun development shell", async () => {
    const result = await runTRPCTest({
      projectName: "nix-flake-bun",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      api: "trpc",
      addons: ["nix-flake"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      packageManager: "bun",
      git: false,
      install: false,
    });

    expectSuccess(result);
    const projectDir = result.result?.projectDirectory;
    if (!projectDir) throw new Error("Expected generated project directory");

    const envrc = await readFile(path.join(projectDir, ".envrc"), "utf8");
    const flake = await readFile(path.join(projectDir, "flake.nix"), "utf8");
    const lock = JSON.parse(await readFile(path.join(projectDir, "flake.lock"), "utf8"));
    const gitignore = await readFile(path.join(projectDir, ".gitignore"), "utf8");

    expect(envrc).toBe("use flake .\n");
    expect(flake).toContain('inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05"');
    expect(lock.nodes.nixpkgs.original.ref).toBe("nixos-26.05");
    expect(lock.nodes.nixpkgs.locked.rev).toHaveLength(40);
    expect(gitignore).toContain(".direnv/");
    expect(flake).toContain("bun");
    expect(flake).toContain("sqlite");
    expect(flake).not.toContain("nodejs_24");
    expect(flake).not.toContain("{{");
  });

  it("includes package manager, database, Docker, and Tauri tooling", async () => {
    const result = await runTRPCTest({
      projectName: "nix-flake-full",
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "node",
      database: "postgres",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      api: "trpc",
      addons: ["nix-flake", "tauri"],
      examples: ["none"],
      dbSetup: "docker",
      webDeploy: "none",
      serverDeploy: "none",
      packageManager: "pnpm",
      git: false,
      install: false,
    });

    expectSuccess(result);
    const projectDir = result.result?.projectDirectory;
    if (!projectDir) throw new Error("Expected generated project directory");

    const flake = await readFile(path.join(projectDir, "flake.nix"), "utf8");
    for (const pkg of [
      "nodejs_24",
      "pnpm",
      "postgresql",
      "docker-client",
      "docker-compose",
      "cargo",
      "webkitgtk_4_1",
    ]) {
      expect(flake).toContain(pkg);
    }
  });

  for (const testCase of [
    {
      description: "a partial",
      projectName: "partial",
      initialGitignore: ".direnv/\n",
      expectedGitignore: ".direnv/\n\n# Nix\nresult\nresult-*\n",
    },
    {
      description: "an empty",
      projectName: "empty",
      initialGitignore: "",
      expectedGitignore: "# Nix\n.direnv/\nresult\nresult-*\n",
    },
  ]) {
    it(`can be added to a project with ${testCase.description} gitignore`, async () => {
      const projectDir = await createProjectForAdd(`nix-flake-add-${testCase.projectName}`);
      await writeFile(path.join(projectDir, ".gitignore"), testCase.initialGitignore);

      const result = await add({
        projectDir,
        addons: ["nix-flake"],
        packageManager: "bun",
        install: false,
      });

      expect(result?.success).toBe(true);
      expect(await readFile(path.join(projectDir, ".envrc"), "utf8")).toBe("use flake .\n");
      expect(await readFile(path.join(projectDir, "flake.lock"), "utf8")).toContain("nixos-26.05");
      expect(await readFile(path.join(projectDir, ".gitignore"), "utf8")).toBe(
        testCase.expectedGitignore,
      );
    });
  }
});
