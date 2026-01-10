import fs from "fs-extra";
import path from "node:path";

import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";
import { setupFumadocs } from "./fumadocs-setup";
import { setupOxlint } from "./oxlint-setup";
import { setupRuler } from "./ruler-setup";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { setupTui } from "./tui-setup";
import { setupUltracite } from "./ultracite-setup";
import { setupWxt } from "./wxt-setup";

export async function setupAddons(config: ProjectConfig) {
  const { addons, frontend, projectDir } = config;
  const hasReactWebFrontend =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("next");
  const hasNuxtFrontend = frontend.includes("nuxt");
  const hasSvelteFrontend = frontend.includes("svelte");
  const hasSolidFrontend = frontend.includes("solid");
  const hasNextFrontend = frontend.includes("next");

  if (
    addons.includes("tauri") &&
    (hasReactWebFrontend ||
      hasNuxtFrontend ||
      hasSvelteFrontend ||
      hasSolidFrontend ||
      hasNextFrontend)
  ) {
    await setupTauri(config);
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
    await setupUltracite(config, gitHooks);
  } else {
    if (hasBiome) {
      await setupBiome(projectDir);
    }

    if (hasOxlint) {
      await setupOxlint(projectDir, config.packageManager);
    }

    if (hasHusky || hasLefthook) {
      let linter: "biome" | "oxlint" | undefined;
      if (hasOxlint) {
        linter = "oxlint";
      } else if (hasBiome) {
        linter = "biome";
      }
      if (hasHusky) {
        await setupHusky(projectDir, linter);
      }
      if (hasLefthook) {
        await setupLefthook(projectDir, linter);
      }
    }
  }

  if (addons.includes("starlight")) {
    await setupStarlight(config);
  }

  if (addons.includes("fumadocs")) {
    await setupFumadocs(config);
  }

  if (addons.includes("opentui")) {
    await setupTui(config);
  }

  if (addons.includes("wxt")) {
    await setupWxt(config);
  }

  if (addons.includes("ruler")) {
    await setupRuler(config);
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

    // Check if lefthook is also present and update prepare script accordingly
    const currentPrepare = packageJson.scripts?.prepare;
    const prepareScript = currentPrepare?.includes("lefthook install")
      ? `${currentPrepare} && husky`
      : "husky";

    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: prepareScript,
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

export async function setupLefthook(projectDir: string, linter?: "biome" | "oxlint") {
  await addPackageDependency({
    devDependencies: ["lefthook"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    // Check if husky is also present and update prepare script accordingly
    const currentPrepare = packageJson.scripts?.prepare;
    const prepareScript = currentPrepare?.includes("husky")
      ? `lefthook install && ${currentPrepare}`
      : "lefthook install";

    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: prepareScript,
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  const lefthookConfig = generateLefthookConfig(linter);
  const lefthookPath = path.join(projectDir, "lefthook.yml");
  await fs.writeFile(lefthookPath, lefthookConfig);
}

function generateLefthookConfig(linter?: "biome" | "oxlint"): string {
  let jobs = "";

  if (linter === "biome") {
    jobs = `  - name: biome
    glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
    run: biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
    stage_fixed: true`;
  } else if (linter === "oxlint") {
    jobs = `  - name: oxlint
    run: oxlint --fix .
    stage_fixed: true
  - name: oxfmt
    glob: "*.{js,ts,cjs,mjs,jsx,tsx}"
    run: oxfmt --write {staged_files}
    stage_fixed: true`;
  } else {
    jobs = `  # Add your pre-commit jobs here
  # - name: lint
  #   run: npm run lint`;
  }

  return `# Lefthook configuration
# https://github.com/evilmartians/lefthook

pre-commit:
  parallel: true
  jobs:
${jobs}
`;
}
