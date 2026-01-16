import { consola } from "consola";
import pc from "picocolors";

import type {
  Backend,
  Database,
  DatabaseSetup,
  Frontend,
  ORM,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  WebDeploy,
} from "../../types";

import { getDockerStatus } from "../../utils/docker-utils";
export async function displayPostInstallInstructions(
  config: ProjectConfig & { depsInstalled: boolean },
) {
  const {
    api,
    database,
    relativePath,
    packageManager,
    depsInstalled,
    orm,
    addons,
    runtime,
    frontend,
    backend,
    dbSetup,
    webDeploy,
    serverDeploy,
  } = config;

  const isConvex = backend === "convex";
  const isBackendSelf = backend === "self";
  const runCmd =
    packageManager === "npm" ? "npm run" : packageManager === "pnpm" ? "pnpm run" : "bun run";
  const cdCmd = `cd ${relativePath}`;
  const hasHusky = addons?.includes("husky");
  const hasLefthook = addons?.includes("lefthook");
  const hasGitHooksOrLinting =
    addons?.includes("husky") ||
    addons?.includes("biome") ||
    addons?.includes("lefthook") ||
    addons?.includes("oxlint");

  const databaseInstructions =
    !isConvex && database !== "none"
      ? await getDatabaseInstructions(
          database,
          orm,
          runCmd,
          runtime,
          dbSetup,
          serverDeploy,
          backend,
        )
      : "";

  const tauriInstructions = addons?.includes("tauri") ? getTauriInstructions(runCmd) : "";
  const huskyInstructions = hasHusky ? getHuskyInstructions(runCmd) : "";
  const lefthookInstructions = hasLefthook ? getLefthookInstructions(packageManager) : "";
  const lintingInstructions = hasGitHooksOrLinting ? getLintingInstructions(runCmd) : "";
  const nativeInstructions =
    (frontend?.includes("native-bare") ||
      frontend?.includes("native-uniwind") ||
      frontend?.includes("native-unistyles")) &&
    backend !== "none"
      ? getNativeInstructions(isConvex, isBackendSelf, frontend || [], runCmd)
      : "";
  const pwaInstructions =
    addons?.includes("pwa") && frontend?.includes("react-router") ? getPwaInstructions() : "";
  const starlightInstructions = addons?.includes("starlight")
    ? getStarlightInstructions(runCmd)
    : "";
  const clerkInstructions = isConvex && config.auth === "clerk" ? getClerkInstructions() : "";
  const polarInstructions =
    config.payments === "polar" && (config.auth === "better-auth" || config.auth === "clerk")
      ? getPolarInstructions(backend)
      : "";
  const alchemyDeployInstructions = getAlchemyDeployInstructions(
    runCmd,
    webDeploy,
    serverDeploy,
    backend,
  );

  const hasWeb = frontend?.some((f) =>
    [
      "tanstack-router",
      "react-router",
      "next",
      "tanstack-start",
      "nuxt",
      "svelte",
      "solid",
    ].includes(f),
  );
  const hasNative =
    frontend?.includes("native-bare") ||
    frontend?.includes("native-uniwind") ||
    frontend?.includes("native-unistyles");

  const bunWebNativeWarning =
    packageManager === "bun" && hasNative && hasWeb ? getBunWebNativeWarning() : "";
  const noOrmWarning = !isConvex && database !== "none" && orm === "none" ? getNoOrmWarning() : "";

  const hasReactRouter = frontend?.includes("react-router");
  const hasSvelte = frontend?.includes("svelte");
  const webPort = hasReactRouter || hasSvelte ? "5173" : "3001";

  let output = `${pc.bold("Next steps")}\n${pc.cyan("1.")} ${cdCmd}\n`;
  let stepCounter = 2;

  if (!depsInstalled) {
    output += `${pc.cyan(`${stepCounter++}.`)} ${packageManager} install\n`;
  }

  if (database === "sqlite" && dbSetup !== "d1") {
    output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} db:local\n${pc.dim(
      "   (optional - starts local SQLite database)",
    )}\n`;
  }

  if (isConvex) {
    output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev:setup\n${pc.dim(
      "   (this will guide you through Convex project setup)",
    )}\n`;

    output += `${pc.cyan(`${stepCounter++}.`)} Copy environment variables from\n${pc.white(
      "   packages/backend/.env.local",
    )} to ${pc.white("apps/*/.env")}\n`;
    output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n\n`;
  } else if (isBackendSelf) {
    output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n`;
  } else {
    if (runtime !== "workers") {
      output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n`;
    }

    if (runtime === "workers") {
      if (dbSetup === "d1") {
        output += `${pc.yellow(
          "IMPORTANT:",
        )} Complete D1 database setup first\n   (see Database commands below)\n`;
      }
      output += `${pc.cyan(`${stepCounter++}.`)} ${runCmd} dev\n`;
    }
  }

  const hasStandaloneBackend = backend !== "none";
  const hasAnyService =
    hasWeb || hasStandaloneBackend || addons?.includes("starlight") || addons?.includes("fumadocs");

  if (hasAnyService) {
    output += `${pc.bold("Your project will be available at:")}\n`;

    if (hasWeb) {
      output += `${pc.cyan("•")} Frontend: http://localhost:${webPort}\n`;
    } else if (!hasNative && !addons?.includes("starlight")) {
      output += `${pc.yellow(
        "NOTE:",
      )} You are creating a backend-only app\n   (no frontend selected)\n`;
    }

    if (!isConvex && !isBackendSelf && hasStandaloneBackend) {
      output += `${pc.cyan("•")} Backend API: http://localhost:3000\n`;

      if (api === "orpc") {
        output += `${pc.cyan("•")} OpenAPI (Scalar UI): http://localhost:3000/api-reference\n`;
      }
    }

    if (isBackendSelf && api === "orpc") {
      output += `${pc.cyan("•")} OpenAPI (Scalar UI): http://localhost:${webPort}/api/rpc/api-reference\n`;
    }

    if (addons?.includes("starlight")) {
      output += `${pc.cyan("•")} Docs: http://localhost:4321\n`;
    }

    if (addons?.includes("fumadocs")) {
      output += `${pc.cyan("•")} Fumadocs: http://localhost:4000\n`;
    }
  }

  if (nativeInstructions) output += `\n${nativeInstructions.trim()}\n`;
  if (databaseInstructions) output += `\n${databaseInstructions.trim()}\n`;
  if (tauriInstructions) output += `\n${tauriInstructions.trim()}\n`;
  if (huskyInstructions) output += `\n${huskyInstructions.trim()}\n`;
  if (lefthookInstructions) output += `\n${lefthookInstructions.trim()}\n`;
  if (lintingInstructions) output += `\n${lintingInstructions.trim()}\n`;
  if (pwaInstructions) output += `\n${pwaInstructions.trim()}\n`;
  if (alchemyDeployInstructions) output += `\n${alchemyDeployInstructions.trim()}\n`;
  if (starlightInstructions) output += `\n${starlightInstructions.trim()}\n`;
  if (clerkInstructions) output += `\n${clerkInstructions.trim()}\n`;
  if (polarInstructions) output += `\n${polarInstructions.trim()}\n`;

  if (noOrmWarning) output += `\n${noOrmWarning.trim()}\n`;
  if (bunWebNativeWarning) output += `\n${bunWebNativeWarning.trim()}\n`;

  output += `\n${pc.bold(
    "Like Better-T-Stack?",
  )} Please consider giving us a star\n   on GitHub:\n`;
  output += pc.cyan("https://github.com/AmanVarshney01/create-better-t-stack");

  consola.box(output);
}

function getNativeInstructions(
  isConvex: boolean,
  isBackendSelf: boolean,
  frontend: Frontend[],
  runCmd: string,
) {
  const envVar = isConvex ? "EXPO_PUBLIC_CONVEX_URL" : "EXPO_PUBLIC_SERVER_URL";
  const exampleUrl = isConvex
    ? "https://<YOUR_CONVEX_URL>"
    : isBackendSelf
      ? "http://<YOUR_LOCAL_IP>:3001"
      : "http://<YOUR_LOCAL_IP>:3000";
  const envFileName = ".env";
  const ipNote = isConvex
    ? "your Convex deployment URL (find after running 'dev:setup')"
    : "your local IP address";

  let instructions = `${pc.yellow(
    "NOTE:",
  )} For Expo connectivity issues, update\n   apps/native/${envFileName} with ${ipNote}:\n   ${`${envVar}=${exampleUrl}`}\n`;

  if (isConvex) {
    instructions += `\n${pc.yellow(
      "IMPORTANT:",
    )} When using local development with Convex and native apps,\n   ensure you use your local IP address instead of localhost or 127.0.0.1\n   for proper connectivity.\n`;
  }

  if (frontend.includes("native-unistyles")) {
    instructions += `\n${pc.yellow(
      "NOTE:",
    )} Unistyles requires a development build.\n   cd apps/native and run ${runCmd} android or ${runCmd} ios\n`;
  }

  return instructions;
}

function getHuskyInstructions(runCmd: string) {
  return `${pc.bold("Git hooks with Husky:")}\n${pc.cyan(
    "•",
  )} Initialize hooks: ${`${runCmd} prepare`}\n`;
}

function getLintingInstructions(runCmd: string) {
  return `${pc.bold("Linting and formatting:")}\n${pc.cyan(
    "•",
  )} Format and lint fix: ${`${runCmd} check`}\n`;
}

function getLefthookInstructions(packageManager: string) {
  const cmd = packageManager === "npm" ? "npx" : packageManager;
  return `${pc.bold("Git hooks with Lefthook:")}\n${pc.cyan(
    "•",
  )} Install hooks: ${cmd} lefthook install\n`;
}

async function getDatabaseInstructions(
  database: Database,
  orm: ORM,
  runCmd: string,
  _runtime: Runtime,
  dbSetup: DatabaseSetup,
  serverDeploy: ServerDeploy,
  _backend: Backend,
) {
  const instructions: string[] = [];

  if (dbSetup === "docker") {
    const dockerStatus = await getDockerStatus(database);

    if (dockerStatus.message) {
      instructions.push(dockerStatus.message);
      instructions.push("");
    }
  }

  if (dbSetup === "d1" && serverDeploy === "cloudflare") {
    if (orm === "drizzle") {
      instructions.push(`${pc.cyan("•")} Generate migrations: ${`${runCmd} db:generate`}`);
    } else if (orm === "prisma") {
      instructions.push(`${pc.cyan("•")} Generate Prisma client: ${`${runCmd} db:generate`}`);
      instructions.push(`${pc.cyan("•")} Apply migrations: ${`${runCmd} db:migrate`}`);
    }
  }

  if (dbSetup === "planetscale") {
    if (database === "mysql" && orm === "drizzle") {
      instructions.push(
        `${pc.yellow("NOTE:")} Enable foreign key constraints in PlanetScale database settings`,
      );
    }
    if (database === "mysql" && orm === "prisma") {
      instructions.push(
        `${pc.yellow(
          "NOTE:",
        )} How to handle Prisma migrations with PlanetScale:\n   https://github.com/prisma/prisma/issues/7292`,
      );
    }
  }

  if (dbSetup === "turso" && orm === "prisma") {
    instructions.push(
      `${pc.yellow(
        "NOTE:",
      )} Follow Turso's Prisma guide for migrations via the Turso CLI:\n   https://docs.turso.tech/sdk/ts/orm/prisma`,
    );
  }

  if (orm === "prisma") {
    if (database === "mongodb" && dbSetup === "docker") {
      instructions.push(
        `${pc.yellow("WARNING:")} Prisma + MongoDB + Docker combination\n   may not work.`,
      );
    }
    if (dbSetup === "docker") {
      instructions.push(`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`);
    }
    if (!(dbSetup === "d1" && serverDeploy === "cloudflare")) {
      instructions.push(`${pc.cyan("•")} Generate Prisma Client: ${`${runCmd} db:generate`}`);
      instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
    }
    if (!(dbSetup === "d1" && serverDeploy === "cloudflare")) {
      instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
    }
  } else if (orm === "drizzle") {
    if (dbSetup === "docker") {
      instructions.push(`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`);
    }
    if (dbSetup !== "d1") {
      instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
    }
    if (!(dbSetup === "d1" && serverDeploy === "cloudflare")) {
      instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
    }
  } else if (orm === "mongoose") {
    if (dbSetup === "docker") {
      instructions.push(`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`);
    }
  } else if (orm === "none") {
    instructions.push(`${pc.yellow("NOTE:")} Manual database schema setup\n   required.`);
  }

  return instructions.length ? `${pc.bold("Database commands:")}\n${instructions.join("\n")}` : "";
}

function getTauriInstructions(runCmd: string) {
  return `\n${pc.bold("Desktop app with Tauri:")}\n${pc.cyan(
    "•",
  )} Start desktop app: ${`cd apps/web && ${runCmd} desktop:dev`}\n${pc.cyan(
    "•",
  )} Build desktop app: ${`cd apps/web && ${runCmd} desktop:build`}\n${pc.yellow(
    "NOTE:",
  )} Tauri requires Rust and platform-specific dependencies.\n   See: ${"https://v2.tauri.app/start/prerequisites/"}`;
}

function getPwaInstructions() {
  return `\n${pc.bold("PWA with React Router v7:")}\n${pc.yellow(
    "NOTE:",
  )} There is a known compatibility issue between VitePWA\n   and React Router v7. See:\n   https://github.com/vite-pwa/vite-plugin-pwa/issues/809`;
}

function getStarlightInstructions(runCmd: string) {
  return `\n${pc.bold("Documentation with Starlight:")}\n${pc.cyan(
    "•",
  )} Start docs site: ${`cd apps/docs && ${runCmd} dev`}\n${pc.cyan(
    "•",
  )} Build docs site: ${`cd apps/docs && ${runCmd} build`}`;
}

function getNoOrmWarning() {
  return `\n${pc.yellow(
    "WARNING:",
  )} Database selected without an ORM. Features requiring\n   database access (e.g., examples, auth) need manual setup.`;
}

function getBunWebNativeWarning() {
  return `\n${pc.yellow(
    "WARNING:",
  )} 'bun' might cause issues with web + native apps in a monorepo.\n   Use 'pnpm' if problems arise.`;
}

function getClerkInstructions() {
  return `${pc.bold("Clerk Authentication Setup:")}\n${pc.cyan("•")} Follow the guide: ${pc.underline("https://docs.convex.dev/auth/clerk")}\n${pc.cyan("•")} Set CLERK_JWT_ISSUER_DOMAIN in Convex Dashboard\n${pc.cyan("•")} Set CLERK_PUBLISHABLE_KEY in apps/*/.env`;
}

function getPolarInstructions(backend: Backend) {
  if (backend === "convex") {
    return (
      `${pc.bold("Polar Payments Setup:")}\n` +
      `${pc.cyan("•")} Get OAT from ${pc.underline("https://sandbox.polar.sh/dashboard/<YOUR_ORG_SLUG>/settings")}\n` +
      `${pc.cyan("•")} Set token: ${pc.white("npx convex env set POLAR_ACCESS_TOKEN <your_OAT>")}\n` +
      `${pc.cyan("•")} Set server: ${pc.white("npx convex env set POLAR_SERVER sandbox")}\n` +
      `${pc.cyan("•")} Run ${pc.white("npx convex dev")} (creates /polar/events endpoint)\n` +
      `${pc.cyan("•")} Create webhook in Polar Dashboard → Settings → Webhooks:\n` +
      `${pc.white("   - URL: https://<YOUR_CONVEX_URL>/polar/events")}\n` +
      `${pc.white("   - Secret: npx convex env set POLAR_WEBHOOK_SECRET <secret>")}`
    );
  }

  const envPath = backend === "self" ? "apps/web/.env" : "apps/server/.env";
  return `${pc.bold("Polar Payments Setup:")}\n${pc.cyan("•")} Get Organization Access Token (OAT) from ${pc.underline("https://sandbox.polar.sh/dashboard/<YOUR_ORG_SLUG>/settings")} (Settings → Organization → Access Tokens)\n${pc.cyan("•")} Set POLAR_ACCESS_TOKEN in ${envPath}`;
}

function getAlchemyDeployInstructions(
  runCmd: string,
  webDeploy: WebDeploy,
  serverDeploy: ServerDeploy,
  backend: Backend,
) {
  const instructions: string[] = [];
  const isBackendSelf = backend === "self";

  if (webDeploy === "cloudflare" && serverDeploy !== "cloudflare") {
    instructions.push(
      `${pc.bold("Deploy web with Alchemy:")}\n${pc.cyan("•")} Dev: ${`cd apps/web && ${runCmd} alchemy dev`}\n${pc.cyan("•")} Deploy: ${`cd apps/web && ${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`cd apps/web && ${runCmd} destroy`}`,
    );
  } else if (serverDeploy === "cloudflare" && webDeploy !== "cloudflare" && !isBackendSelf) {
    instructions.push(
      `${pc.bold("Deploy server with Alchemy:")}\n${pc.cyan("•")} Dev: ${`cd apps/server && ${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`cd apps/server && ${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`cd apps/server && ${runCmd} destroy`}`,
    );
  } else if (webDeploy === "cloudflare" && (serverDeploy === "cloudflare" || isBackendSelf)) {
    instructions.push(
      `${pc.bold("Deploy with Alchemy:")}\n${pc.cyan("•")} Dev: ${`${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`${runCmd} destroy`}`,
    );
  }

  return instructions.length ? `\n${instructions.join("\n")}` : "";
}
