import fs from "fs-extra";
import path from "node:path";

import type { PackageManager, ProjectConfig } from "../../../types";

import { setupNextAlchemyDeploy } from "./alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "./alchemy-nuxt-setup";
import { setupSvelteAlchemyDeploy } from "./alchemy-svelte-setup";
import { setupTanStackStartAlchemyDeploy } from "./alchemy-tanstack-start-setup";
import {
  setupReactRouterAlchemyDeploy,
  setupSolidAlchemyDeploy,
  setupTanStackRouterAlchemyDeploy,
} from "./alchemy-vite-setup";

function getInfraFilter(
  packageManager: PackageManager,
  hasTurborepo: boolean,
  infraWorkspace: string,
): (script: string) => string {
  if (hasTurborepo) {
    return (script) => `turbo -F ${infraWorkspace} ${script}`;
  }

  switch (packageManager) {
    case "pnpm":
      return (script) => `pnpm --filter ${infraWorkspace} ${script}`;
    case "npm":
      return (script) => `npm run ${script} --workspace ${infraWorkspace}`;
    case "bun":
      return (script) => `bun run --filter ${infraWorkspace} ${script}`;
  }
}

export async function setupCombinedAlchemyDeploy(
  projectDir: string,
  packageManager: PackageManager,
  config: ProjectConfig,
) {
  await setupInfraScripts(projectDir, packageManager, config);

  // Server deploy dependencies are handled by template-generator's deploy-deps.ts
  // No additional CLI operations needed for server

  const frontend = config.frontend;
  const isNext = frontend.includes("next");
  const isNuxt = frontend.includes("nuxt");
  const isSvelte = frontend.includes("svelte");
  const isTanstackRouter = frontend.includes("tanstack-router");
  const isTanstackStart = frontend.includes("tanstack-start");
  const isReactRouter = frontend.includes("react-router");
  const isSolid = frontend.includes("solid");

  if (isNext) {
    await setupNextAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  } else if (isNuxt) {
    await setupNuxtAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  } else if (isSvelte) {
    await setupSvelteAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  } else if (isTanstackStart) {
    await setupTanStackStartAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  } else if (isTanstackRouter) {
    await setupTanStackRouterAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  } else if (isReactRouter) {
    await setupReactRouterAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  } else if (isSolid) {
    await setupSolidAlchemyDeploy(projectDir, packageManager, {
      skipAppScripts: true,
    });
  }
}

export async function setupInfraScripts(
  projectDir: string,
  packageManager: PackageManager,
  config: ProjectConfig,
) {
  const projectName = config.projectName;
  const hasTurborepo = config.addons.includes("turborepo");
  const infraWorkspace = `@${projectName}/infra`;

  const rootPkgPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(rootPkgPath)) {
    const pkg = await fs.readJson(rootPkgPath);

    const filter = getInfraFilter(packageManager, hasTurborepo, infraWorkspace);

    pkg.scripts = {
      ...pkg.scripts,
      deploy: filter("deploy"),
      destroy: filter("destroy"),
    };
    await fs.writeJson(rootPkgPath, pkg, { spaces: 2 });
  }

  if (config.serverDeploy === "cloudflare") {
    const serverPkgPath = path.join(projectDir, "apps/server/package.json");
    if (await fs.pathExists(serverPkgPath)) {
      const serverPkg = await fs.readJson(serverPkgPath);
      if (serverPkg.scripts?.dev) {
        serverPkg.scripts["dev:bare"] = serverPkg.scripts.dev;
        delete serverPkg.scripts.dev;
        await fs.writeJson(serverPkgPath, serverPkg, { spaces: 2 });
      }
    }
  }

  if (config.webDeploy === "cloudflare") {
    const webPkgPath = path.join(projectDir, "apps/web/package.json");
    if (await fs.pathExists(webPkgPath)) {
      const webPkg = await fs.readJson(webPkgPath);
      if (webPkg.scripts?.dev) {
        webPkg.scripts["dev:bare"] = webPkg.scripts.dev;
        delete webPkg.scripts.dev;
        await fs.writeJson(webPkgPath, webPkg, { spaces: 2 });
      }
    }
  }
}
