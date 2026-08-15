import { describe, expect, it } from "bun:test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { getFumadocsAddonContext, getFumadocsLinter } from "../src/helpers/addons/fumadocs-setup";
import { setupOxlint } from "../src/helpers/addons/oxlint-setup";
import { installDependencies } from "../src/helpers/core/install-dependencies";
import { getNeonProjectCreateArgs } from "../src/helpers/database-providers/neon-setup";
import { getPackageExecutionArgs } from "../src/utils/package-runner";
import { SMOKE_DIR } from "./setup";

describe("External Command Guards", () => {
  it("should split quoted args correctly", () => {
    const args = getPackageExecutionArgs(
      "bun",
      `neon-new@latest --yes --ref "sbA3tIe" --env "test db.env"`,
    );

    expect(args).toEqual([
      "bunx",
      "neon-new@latest",
      "--yes",
      "--ref",
      "sbA3tIe",
      "--env",
      "test db.env",
    ]);
  });

  it("should use the current Neon CLI package and preserve project names as one argument", () => {
    expect(getNeonProjectCreateArgs("bun", "test database", "aws-us-east-1")).toEqual([
      "bunx",
      "neon@latest",
      "projects",
      "create",
      "--name",
      "test database",
      "--region-id",
      "aws-us-east-1",
      "--output",
      "json",
    ]);
  });

  it("should skip dependency installation when test mode is enabled", async () => {
    const result = await installDependencies({
      projectDir: SMOKE_DIR,
      packageManager: "bun",
    });

    expect(result.isOk()).toBe(true);
  });

  it("should select the matching Fumadocs linter addon", () => {
    expect(getFumadocsLinter(["oxlint"])).toBe("oxlint");
    expect(getFumadocsLinter(["biome"])).toBe("biome");
    expect(getFumadocsLinter(["ultracite"])).toBe("biome");
    expect(getFumadocsLinter(["vite-plus"])).toBe("oxlint");
    expect(getFumadocsLinter(["vite-plus", "biome"])).toBe("biome");
    expect(getFumadocsLinter(["biome", "oxlint"])).toBe("oxlint");
    expect(getFumadocsLinter(["none"])).toBeUndefined();
  });

  it("should include persisted addons when selecting the Fumadocs linter during add", () => {
    expect(getFumadocsLinter(getFumadocsAddonContext(["fumadocs"], ["vite-plus"]))).toBe("oxlint");
    expect(getFumadocsLinter(getFumadocsAddonContext(["fumadocs"], ["biome"]))).toBe("biome");
  });

  it("should update package.json without running oxlint init in test mode", async () => {
    const projectDir = join(SMOKE_DIR, "oxlint-skip");
    await mkdir(projectDir, { recursive: true });

    const pkgJsonPath = join(projectDir, "package.json");
    await writeFile(
      pkgJsonPath,
      JSON.stringify(
        {
          name: "oxlint-skip",
          version: "0.0.0",
          scripts: {},
          devDependencies: {},
        },
        null,
        2,
      ),
    );

    const result = await setupOxlint(projectDir, "bun");
    expect(result.isOk()).toBe(true);

    const updated = await Bun.file(pkgJsonPath).json();

    expect(updated.scripts?.check).toBe("oxlint && oxfmt --write");
    expect(updated.devDependencies?.oxlint).toBe("^1.78.0");
    expect(updated.devDependencies?.oxfmt).toBe("^0.63.0");
  });
});
