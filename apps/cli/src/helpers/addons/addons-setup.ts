import { log } from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { Frontend, ProjectConfig } from "../../types";
// NOTE: Dependencies are now handled by template-generator's addons-deps.ts processor
// This file only contains CLI-specific operations (external CLI calls, logs, etc.)

import { setupFumadocs } from "./fumadocs-setup";
import { setupOxlint } from "./oxlint-setup";
import { setupRuler } from "./ruler-setup";
import { setupStarlight } from "./starlight-setup";
import { setupTauri } from "./tauri-setup";
import { setupTui } from "./tui-setup";
import { setupUltracite } from "./ultracite-setup";
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

  // Turborepo - deps handled by template-generator, just log for add command
  if (addons.includes("turborepo") && isAddCommand) {
    log.info(`${pc.yellow("Update your package.json scripts:")}

${pc.dim("Replace:")} ${pc.yellow('"pnpm -r dev"')} ${pc.dim("→")} ${pc.green('"turbo dev"')}
${pc.dim("Replace:")} ${pc.yellow('"pnpm --filter web dev"')} ${pc.dim("→")} ${pc.green('"turbo -F web dev"')}

${pc.cyan("Docs:")} ${pc.underline("https://turborepo.com/docs")}
		`);
  }

  // Tauri - external CLI init
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

  // Ultracite - external CLI init
  const hasUltracite = addons.includes("ultracite");
  const hasHusky = addons.includes("husky");
  const hasOxlint = addons.includes("oxlint");

  if (hasUltracite) {
    await setupUltracite(config, hasHusky);
  }

  // Oxlint - external CLI init
  if (hasOxlint) {
    await setupOxlint(projectDir, packageManager);
  }

  // Starlight - external CLI init
  if (addons.includes("starlight")) {
    await setupStarlight(config);
  }

  // Ruler - external CLI init
  if (addons.includes("ruler")) {
    await setupRuler(config);
  }

  // Fumadocs - external CLI init
  if (addons.includes("fumadocs")) {
    await setupFumadocs(config);
  }

  // OpenTUI - external CLI init
  if (addons.includes("opentui")) {
    await setupTui(config);
  }

  // WXT - external CLI init
  if (addons.includes("wxt")) {
    await setupWxt(config);
  }
}
