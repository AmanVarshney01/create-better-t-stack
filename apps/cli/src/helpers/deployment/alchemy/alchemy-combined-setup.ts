import fs from "fs-extra";
import path from "node:path";

import type { PackageManager, ProjectConfig } from "../../../types";

import { setupAlchemyServerDeploy } from "../server-deploy-setup";
import { setupNextAlchemyDeploy } from "./alchemy-next-setup";
import { setupNuxtAlchemyDeploy } from "./alchemy-nuxt-setup";
import { setupReactRouterAlchemyDeploy } from "./alchemy-react-router-setup";
import { setupSolidAlchemyDeploy } from "./alchemy-solid-setup";
import { setupSvelteAlchemyDeploy } from "./alchemy-svelte-setup";
import { setupTanStackRouterAlchemyDeploy } from "./alchemy-tanstack-router-setup";
import { setupTanStackStartAlchemyDeploy } from "./alchemy-tanstack-start-setup";

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
  // Setup infra scripts and rename dev scripts
  await setupInfraScripts(projectDir, packageManager, config);

  const serverDir = path.join(projectDir, "apps/server");
  if (await fs.pathExists(serverDir)) {
    await setupAlchemyServerDeploy(serverDir, projectDir);
  }

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

    // Add deploy/destroy scripts that run from packages/infra
    const filter = getInfraFilter(packageManager, hasTurborepo, infraWorkspace);

    pkg.scripts = {
      ...pkg.scripts,
      deploy: filter("deploy"),
      destroy: filter("destroy"),
    };
    await fs.writeJson(rootPkgPath, pkg, { spaces: 2 });
  }

  // Rename dev script from apps that are deployed via cloudflare (infra handles them)
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
