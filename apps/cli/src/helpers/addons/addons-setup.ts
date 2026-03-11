import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";
import pc from "picocolors";

import { desktopWebFrontends, type ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { cliConsola } from "../../utils/terminal-output";
import { setupFumadocs } from "./fumadocs-setup";
import { setupMcp } from "./mcp-setup";
import { setupOxlint } from "./oxlint-setup";
import { setupSkills } from "./skills-setup";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { setupTui } from "./tui-setup";
import { setupUltracite } from "./ultracite-setup";
import { setupWxt } from "./wxt-setup";

// Helper to run setup and handle Result
async function runSetup<T, E extends AddonSetupError | UserCancelledError>(
  setupFn: () => Promise<Result<T, E>>,
): Promise<void> {
  const result = await setupFn();
  if (result.isErr()) {
    // Re-throw user cancellation to propagate up
    if (UserCancelledError.is(result.error)) {
      throw result.error;
    }
    // Log other errors but don't fail the overall project creation
    cliConsola.error(pc.red(result.error.message));
  }
}

async function runAddonStep(addon: string, step: () => Promise<void>): Promise<void> {
  const result = await Result.tryPromise({
    try: async () => step(),
    catch: (e) =>
      new AddonSetupError({
        addon,
        message: `Failed to set up ${addon}: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (result.isErr()) {
    cliConsola.error(pc.red(result.error.message));
  }
}

export async function setupAddons(config: ProjectConfig) {
  const { addons, frontend, projectDir } = config;
  const hasWebFrontend = frontend.some((value) =>
    (desktopWebFrontends as readonly string[]).includes(value),
  );

  if (addons.includes("tauri") && hasWebFrontend) {
    await runSetup(() => setupTauri(config));
  }

  const hasUltracite = addons.includes("ultracite");
  const hasBiome = addons.includes("biome");
  const hasHusky = addons.includes("husky");
  const hasLefthook = addons.includes("lefthook");
  const hasOxlint = addons.includes("oxlint");

  if (hasUltracite) {
    const gitHooks: string[] = [];
    if (hasHusky) gitHooks.push("husky");
    if (hasLefthook) gitHooks.push("lefthook");
    await runSetup(() => setupUltracite(config, gitHooks));
  } else {
    if (hasBiome) {
      await runAddonStep("biome", () => setupBiome(projectDir));
    }

    if (hasOxlint) {
      await runSetup(() => setupOxlint(projectDir, config.packageManager));
    }

    if (hasHusky || hasLefthook) {
      let linter: "biome" | "oxlint" | undefined;
      if (hasOxlint) {
        linter = "oxlint";
      } else if (hasBiome) {
        linter = "biome";
      }
      if (hasHusky) {
        await runAddonStep("husky", () => setupHusky(projectDir, linter));
      }
      if (hasLefthook) {
        await runAddonStep("lefthook", () => setupLefthook(projectDir));
      }
    }
  }

  if (addons.includes("starlight")) {
    await runSetup(() => setupStarlight(config));
  }

  if (addons.includes("fumadocs")) {
    await runSetup(() => setupFumadocs(config));
  }

  if (addons.includes("opentui")) {
    await runSetup(() => setupTui(config));
  }

  if (addons.includes("wxt")) {
    await runSetup(() => setupWxt(config));
  }

  if (addons.includes("skills")) {
    await runSetup(() => setupSkills(config));
  }

  if (addons.includes("mcp")) {
    await runSetup(() => setupMcp(config));
  }
}

export async function setupBiome(projectDir: string) {
  await addPackageDependency({
    devDependencies: ["@biomejs/biome"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      check: "biome check --write .",
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

export async function setupHusky(projectDir: string, linter?: "biome" | "oxlint") {
  await addPackageDependency({
    devDependencies: ["husky", "lint-staged"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: "husky",
    };

    if (linter === "oxlint") {
      packageJson["lint-staged"] = {
        "*": ["oxlint", "oxfmt --write"],
      };
    } else if (linter === "biome") {
      packageJson["lint-staged"] = {
        "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": ["biome check --write ."],
      };
    } else {
      packageJson["lint-staged"] = {
        "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "",
      };
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

export async function setupLefthook(projectDir: string) {
  await addPackageDependency({
    devDependencies: ["lefthook"],
    projectDir,
  });
  // lefthook.yml is generated by template-generator from templates/addons/lefthook/
}
