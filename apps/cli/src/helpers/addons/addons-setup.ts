import { log } from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { Frontend, ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";
import { setupFumadocs } from "./fumadocs-setup";
import { setupOxlint } from "./oxlint-setup";
import { setupRuler } from "./ruler-setup";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { setupTui } from "./tui-setup";
import { setupUltracite } from "./ultracite-setup";
import { addPwaToViteConfig } from "./vite-pwa-setup";
import { setupWxt } from "./wxt-setup";

export async function setupAddons(config: ProjectConfig, isAddCommand = false) {
  const { addons, frontend, projectDir, packageManager } = config;
  const hasReactWebFrontend =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("next");
  const hasNuxtFrontend = frontend.includes("nuxt");
  const hasSvelteFrontend = frontend.includes("svelte");
  const hasSolidFrontend = frontend.includes("solid");
  const hasNextFrontend = frontend.includes("next");

  if (addons.includes("turborepo")) {
    await addPackageDependency({
      devDependencies: ["turbo"],
      projectDir,
    });

    if (isAddCommand) {
      log.info(`${pc.yellow("Update your package.json scripts:")}

${pc.dim("Replace:")} ${pc.yellow('"pnpm -r dev"')} ${pc.dim("→")} ${pc.green('"turbo dev"')}
${pc.dim("Replace:")} ${pc.yellow('"pnpm --filter web dev"')} ${pc.dim(
        "→",
      )} ${pc.green('"turbo -F web dev"')}

${pc.cyan("Docs:")} ${pc.underline("https://turborepo.com/docs")}
		`);
    }
  }

  if (addons.includes("pwa") && (hasReactWebFrontend || hasSolidFrontend)) {
    await setupPwa(projectDir, frontend);
  }
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
    const gitHooks = [];
    if (hasHusky) gitHooks.push("husky");
    if (hasLefthook) gitHooks.push("lefthook");
    await setupUltracite(config, gitHooks.join(","));
  } else {
    if (hasBiome) {
      await setupBiome(projectDir);
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
        await setupLefthook(projectDir);
      }
    }
  }

  if (hasOxlint) {
    await setupOxlint(projectDir, packageManager);
  }
  if (addons.includes("starlight")) {
    await setupStarlight(config);
  }

  if (addons.includes("ruler")) {
    await setupRuler(config);
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

export async function setupLefthook(projectDir: string) {
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
}

async function setupPwa(projectDir: string, frontends: Frontend[]) {
  const isCompatibleFrontend = frontends.some((f) =>
    ["react-router", "tanstack-router", "solid"].includes(f),
  );
  if (!isCompatibleFrontend) return;

  const clientPackageDir = getWebAppDir(projectDir, frontends);

  if (!(await fs.pathExists(clientPackageDir))) {
    return;
  }

  await addPackageDependency({
    dependencies: ["vite-plugin-pwa"],
    devDependencies: ["@vite-pwa/assets-generator"],
    projectDir: clientPackageDir,
  });

  const clientPackageJsonPath = path.join(clientPackageDir, "package.json");
  if (await fs.pathExists(clientPackageJsonPath)) {
    const packageJson = await fs.readJson(clientPackageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      "generate-pwa-assets": "pwa-assets-generator",
    };

    await fs.writeJson(clientPackageJsonPath, packageJson, { spaces: 2 });
  }

  const viteConfigTs = path.join(clientPackageDir, "vite.config.ts");

  if (await fs.pathExists(viteConfigTs)) {
    await addPwaToViteConfig(viteConfigTs, path.basename(projectDir));
  }
}
