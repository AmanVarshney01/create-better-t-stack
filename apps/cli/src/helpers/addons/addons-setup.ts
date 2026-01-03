import fs from "fs-extra";
import path from "node:path";

import type { Frontend, ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";
import { setupFumadocs } from "./fumadocs-setup";
import { setupOxlint } from "./oxlint-setup";
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
  const hasOxlint = addons.includes("oxlint");

  if (!hasUltracite) {
    if (hasBiome) {
      await setupBiome(projectDir);
    }

    if (hasOxlint) {
      await setupOxlint(projectDir, config.packageManager);
    }

    if (hasHusky) {
      let linter: "biome" | "oxlint" | undefined;
      if (hasOxlint) {
        linter = "oxlint";
      } else if (hasBiome) {
        linter = "biome";
      }
      await setupHusky(projectDir, linter);
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

  if (hasUltracite) {
    await setupUltracite(config, hasHusky);
  }
}

function getWebAppDir(projectDir: string, frontends: Frontend[]) {
  if (
    frontends.some((f) =>
      ["react-router", "tanstack-router", "nuxt", "svelte", "solid"].includes(f),
    )
  ) {
    return path.join(projectDir, "apps/web");
  }
  return path.join(projectDir, "apps/web");
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
