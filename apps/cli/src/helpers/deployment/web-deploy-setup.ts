/**
 * Web deploy setup - CLI-only operations
 * NOTE: Dependencies are handled by template-generator's deploy-deps.ts processor
 * This file only handles external CLI calls and config modifications for "add deploy" command
 */

import type { ProjectConfig } from "../../types";

import { setupCombinedAlchemyDeploy, setupInfraScripts } from "./alchemy/alchemy-combined-setup";
import { setupNextAlchemyDeploy } from "./alchemy/alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "./alchemy/alchemy-nuxt-setup";
import { setupSvelteAlchemyDeploy } from "./alchemy/alchemy-svelte-setup";
import { setupTanStackStartAlchemyDeploy } from "./alchemy/alchemy-tanstack-start-setup";
import {
  setupReactRouterAlchemyDeploy,
  setupSolidAlchemyDeploy,
  setupTanStackRouterAlchemyDeploy,
} from "./alchemy/alchemy-vite-setup";

export async function setupWebDeploy(config: ProjectConfig) {
  const { webDeploy, serverDeploy, frontend, projectDir } = config;
  const { packageManager } = config;

  if (webDeploy === "none") return;
  if (webDeploy !== "cloudflare") return;

  // Dependencies are handled by template-generator's deploy-deps.ts
  // This only handles config modifications and infra scripts for "add deploy" command

  if (webDeploy === "cloudflare" && serverDeploy === "cloudflare") {
    await setupCombinedAlchemyDeploy(projectDir, packageManager, config);
    return;
  }

  await setupInfraScripts(projectDir, packageManager, config);

  const isNext = frontend.includes("next");
  const isNuxt = frontend.includes("nuxt");
  const isSvelte = frontend.includes("svelte");
  const isTanstackRouter = frontend.includes("tanstack-router");
  const isTanstackStart = frontend.includes("tanstack-start");
  const isReactRouter = frontend.includes("react-router");
  const isSolid = frontend.includes("solid");

  // These functions now only modify config files (no addPackageDependency)
  if (isNext) {
    await setupNextAlchemyDeploy(projectDir, packageManager);
  } else if (isNuxt) {
    await setupNuxtAlchemyDeploy(projectDir, packageManager);
  } else if (isSvelte) {
    await setupSvelteAlchemyDeploy(projectDir, packageManager);
  } else if (isTanstackStart) {
    await setupTanStackStartAlchemyDeploy(projectDir, packageManager);
  } else if (isTanstackRouter) {
    await setupTanStackRouterAlchemyDeploy(projectDir, packageManager);
  } else if (isReactRouter) {
    await setupReactRouterAlchemyDeploy(projectDir, packageManager);
  } else if (isSolid) {
    await setupSolidAlchemyDeploy(projectDir, packageManager);
  }
}
