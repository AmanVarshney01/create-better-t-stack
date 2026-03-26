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
import { desktopWebFrontends } from "../../types";
import { getDockerStatus } from "../../utils/docker-utils";
import {
  fetchSponsorsQuietly,
  formatPostInstallSpecialSponsorsSection,
} from "../../utils/sponsors";
import { cliConsola } from "../../utils/terminal-output";

function getDesktopStaticBuildNote(frontend: Frontend[]): string {
  const staticBuildFrontends = new Map<Frontend, string>([
    ["tanstack-start", "TanStack Start"],
    ["next", "Next.js"],
    ["nuxt", "Nuxt"],
    ["svelte", "SvelteKit"],
    ["astro", "Astro"],
  ]);

  const staticBuildFrontend = frontend.find((value) => staticBuildFrontends.has(value));
  if (!staticBuildFrontend) {
    return "";
  }

  return `${pc.yellow(
    "NOTE:",
  )} Desktop builds package static web assets.\n   ${staticBuildFrontends.get(
    staticBuildFrontend,
  )} needs a static/export web build before desktop packaging will work.`;
}

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
          webDeploy,
          serverDeploy,
          backend,
        )
      : "";

  const tauriInstructions = addons?.includes("tauri") ? getTauriInstructions(runCmd, frontend) : "";
  const electrobunInstructions = addons?.includes("electrobun")
    ? getElectrobunInstructions(runCmd, frontend)
    : "";
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
  const clerkInstructions =
    config.auth === "clerk" ? getClerkInstructions(frontend || [], backend, api) : "";
  const polarInstructions =
    config.payments === "polar" && config.auth === "better-auth"
      ? getPolarInstructions(backend)
      : "";
  const alchemyDeployInstructions = getAlchemyDeployInstructions(
    runCmd,
    webDeploy,
    serverDeploy,
    backend,
  );

  const hasWeb = frontend?.some((f) => (desktopWebFrontends as readonly string[]).includes(f));
  const hasNative =
    frontend?.includes("native-bare") ||
    frontend?.includes("native-uniwind") ||
    frontend?.includes("native-unistyles");

  const hasReactRouter = frontend?.includes("react-router");
  const hasTanStackRouter = frontend?.includes("tanstack-router");
  const hasSvelte = frontend?.includes("svelte");
  const hasAstro = frontend?.includes("astro");
  const webPort =
    hasReactRouter || hasTanStackRouter || hasSvelte ? "5173" : hasAstro ? "4321" : "3001";

  const betterAuthConvexInstructions =
    isConvex && config.auth === "better-auth"
      ? getBetterAuthConvexInstructions(hasWeb ?? false, webPort, packageManager)
      : "";

  const bunWebNativeWarning =
    packageManager === "bun" && hasNative && hasWeb ? getBunWebNativeWarning() : "";
  const noOrmWarning = !isConvex && database !== "none" && orm === "none" ? getNoOrmWarning() : "";

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
  if (electrobunInstructions) output += `\n${electrobunInstructions.trim()}\n`;
  if (huskyInstructions) output += `\n${huskyInstructions.trim()}\n`;
  if (lefthookInstructions) output += `\n${lefthookInstructions.trim()}\n`;
  if (lintingInstructions) output += `\n${lintingInstructions.trim()}\n`;
  if (pwaInstructions) output += `\n${pwaInstructions.trim()}\n`;
  if (alchemyDeployInstructions) output += `\n${alchemyDeployInstructions.trim()}\n`;
  if (starlightInstructions) output += `\n${starlightInstructions.trim()}\n`;
  if (clerkInstructions) output += `\n${clerkInstructions.trim()}\n`;
  if (betterAuthConvexInstructions) output += `\n${betterAuthConvexInstructions.trim()}\n`;
  if (polarInstructions) output += `\n${polarInstructions.trim()}\n`;

  if (noOrmWarning) output += `\n${noOrmWarning.trim()}\n`;
  if (bunWebNativeWarning) output += `\n${bunWebNativeWarning.trim()}\n`;

  const sponsorsResult = await fetchSponsorsQuietly();
  const specialSponsorsSection = sponsorsResult.isOk()
    ? formatPostInstallSpecialSponsorsSection(sponsorsResult.value)
    : "";

  if (specialSponsorsSection) {
    output += `\n${specialSponsorsSection.trim()}\n`;
  }

  output += `\n${pc.bold(
    "Like Better-T-Stack?",
  )} Please consider giving us a star\n   on GitHub:\n`;
  output += pc.cyan("https://github.com/AmanVarshney01/create-better-t-stack");

  cliConsola.box(output);
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
  webDeploy: WebDeploy,
  serverDeploy: ServerDeploy,
  backend: Backend,
) {
  const instructions: string[] = [];
  const isD1Alchemy =
    dbSetup === "d1" &&
    (serverDeploy === "cloudflare" || (backend === "self" && webDeploy === "cloudflare"));

  if (dbSetup === "docker") {
    const dockerStatus = await getDockerStatus(database);

    if (dockerStatus.message) {
      instructions.push(dockerStatus.message);
      instructions.push("");
    }
  }

  if (isD1Alchemy) {
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
    if (!isD1Alchemy) {
      instructions.push(`${pc.cyan("•")} Generate Prisma Client: ${`${runCmd} db:generate`}`);
      instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
    }
    if (!isD1Alchemy) {
      instructions.push(`${pc.cyan("•")} Database UI: ${`${runCmd} db:studio`}`);
    }
  } else if (orm === "drizzle") {
    if (dbSetup === "docker") {
      instructions.push(`${pc.cyan("•")} Start docker container: ${`${runCmd} db:start`}`);
    }
    if (!isD1Alchemy) {
      instructions.push(`${pc.cyan("•")} Apply schema: ${`${runCmd} db:push`}`);
    }
    if (!isD1Alchemy) {
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

function getTauriInstructions(runCmd: string, frontend: Frontend[]) {
  const staticBuildNote = getDesktopStaticBuildNote(frontend);

  return `\n${pc.bold("Desktop app with Tauri:")}\n${pc.cyan(
    "•",
  )} Start desktop app: ${`cd apps/web && ${runCmd} desktop:dev`}\n${pc.cyan(
    "•",
  )} Build desktop app: ${`cd apps/web && ${runCmd} desktop:build`}\n${pc.yellow(
    "NOTE:",
  )} Tauri requires Rust and platform-specific dependencies.\n   See: ${"https://v2.tauri.app/start/prerequisites/"}${
    staticBuildNote ? `\n${staticBuildNote}` : ""
  }`;
}

function getElectrobunInstructions(runCmd: string, frontend: Frontend[]) {
  const staticBuildNote = getDesktopStaticBuildNote(frontend);

  return `\n${pc.bold("Desktop app with Electrobun:")}\n${pc.cyan(
    "•",
  )} Start desktop app with HMR: ${`${runCmd} dev:desktop`}\n${pc.cyan(
    "•",
  )} Build stable desktop app (DMG/App): ${`${runCmd} build:desktop`}\n${pc.cyan(
    "•",
  )} Build canary desktop app: ${`${runCmd} build:desktop:canary`}\n${pc.yellow(
    "NOTE:",
  )} Electrobun wraps your web frontend in a desktop shell.\n   See: ${"https://blackboard.sh/electrobun/docs/"}${
    staticBuildNote ? `\n${staticBuildNote}` : ""
  }`;
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

function getClerkQuickstartUrl(frontend: Frontend[]) {
  if (frontend.includes("next")) return "https://clerk.com/docs/nextjs/getting-started/quickstart";
  if (frontend.includes("react-router")) {
    return "https://clerk.com/docs/react-router/getting-started/quickstart";
  }
  if (frontend.includes("tanstack-start")) {
    return "https://clerk.com/docs/tanstack-react-start/getting-started/quickstart";
  }
  if (frontend.includes("tanstack-router")) {
    return "https://clerk.com/docs/react/getting-started/quickstart";
  }
  if (
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles")
  ) {
    return "https://clerk.com/docs/expo/getting-started/quickstart";
  }

  return "https://clerk.com/docs";
}

function getClerkInstructionLines(
  frontend: Frontend[],
  backend: Backend,
  api: ProjectConfig["api"],
) {
  const lines: string[] = [];

  if (frontend.includes("next")) {
    lines.push("Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in apps/web/.env");
  }

  if (
    frontend.some((value) => ["react-router", "tanstack-router", "tanstack-start"].includes(value))
  ) {
    lines.push("Set VITE_CLERK_PUBLISHABLE_KEY in apps/web/.env");
  }

  if (
    frontend.some((value) => ["native-bare", "native-uniwind", "native-unistyles"].includes(value))
  ) {
    lines.push("Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in apps/native/.env");
  }

  if (backend === "convex") {
    return [
      "Set CLERK_JWT_ISSUER_DOMAIN in Convex Dashboard",
      ...lines,
      ...(frontend.some((value) => ["next", "react-router", "tanstack-start"].includes(value))
        ? ["Set CLERK_SECRET_KEY in apps/web/.env for Clerk server middleware"]
        : []),
    ];
  }

  const hasClerkServerFrontend = frontend.some((value) =>
    ["next", "react-router", "tanstack-start"].includes(value),
  );
  const serverEnvPath = backend === "self" ? "apps/web/.env" : "apps/server/.env";
  const needsServerSideClerkAuth = backend !== "none";
  const needsClerkBackendPublishableKey = ["express", "fastify"].includes(backend);
  const needsClerkRequestVerification =
    api !== "none" && ["self", "hono", "elysia"].includes(backend);

  if (hasClerkServerFrontend && backend === "self") {
    lines.push(
      "Set CLERK_SECRET_KEY in apps/web/.env for Clerk server middleware and server-side Clerk auth",
    );
  } else {
    if (hasClerkServerFrontend) {
      lines.push("Set CLERK_SECRET_KEY in apps/web/.env for Clerk server middleware");
    }

    if (needsServerSideClerkAuth) {
      lines.push(`Set CLERK_SECRET_KEY in ${serverEnvPath} for server-side Clerk auth`);
    }
  }

  if (needsClerkRequestVerification) {
    lines.push(
      `Set CLERK_PUBLISHABLE_KEY in ${serverEnvPath} for server-side Clerk request verification`,
    );
  }

  if (needsClerkBackendPublishableKey) {
    lines.push(`Set CLERK_PUBLISHABLE_KEY in ${serverEnvPath} for Clerk backend middleware`);
  }

  return lines;
}

function getClerkInstructions(frontend: Frontend[], backend: Backend, api: ProjectConfig["api"]) {
  const lines = [
    `${pc.bold("Clerk Authentication Setup:")}`,
    `${pc.cyan("•")} Follow the guide: ${pc.underline(getClerkQuickstartUrl(frontend))}`,
    ...getClerkInstructionLines(frontend, backend, api).map((line) => `${pc.cyan("•")} ${line}`),
  ];

  return lines.join("\n");
}

function getBetterAuthConvexInstructions(hasWeb: boolean, webPort: string, packageManager: string) {
  const cmd = packageManager === "npm" ? "npx" : packageManager;
  return (
    `${pc.bold("Better Auth + Convex Setup:")}\n` +
    `${pc.cyan("•")} Set environment variables from ${pc.white("packages/backend")}:\n` +
    `${pc.white("   cd packages/backend")}\n` +
    `${pc.white(`   ${cmd} convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)`)}\n` +
    (hasWeb ? `${pc.white(`   ${cmd} convex env set SITE_URL http://localhost:${webPort}`)}\n` : "")
  );
}

function getPolarInstructions(backend: Backend) {
  const envPath = backend === "self" ? "apps/web/.env" : "apps/server/.env";
  return `${pc.bold("Polar Payments Setup:")}\n${pc.cyan("•")} Get access token & product ID from ${pc.underline("https://sandbox.polar.sh/")}\n${pc.cyan("•")} Set POLAR_ACCESS_TOKEN in ${envPath}`;
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
      `${pc.bold("Deploy web with Cloudflare (Alchemy):")}\n${pc.cyan("•")} Dev: ${`cd apps/web && ${runCmd} alchemy dev`}\n${pc.cyan("•")} Deploy: ${`cd apps/web && ${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`cd apps/web && ${runCmd} destroy`}`,
    );
  } else if (serverDeploy === "cloudflare" && webDeploy !== "cloudflare" && !isBackendSelf) {
    instructions.push(
      `${pc.bold("Deploy server with Cloudflare (Alchemy):")}\n${pc.cyan("•")} Dev: ${`cd apps/server && ${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`cd apps/server && ${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`cd apps/server && ${runCmd} destroy`}`,
    );
  } else if (webDeploy === "cloudflare" && (serverDeploy === "cloudflare" || isBackendSelf)) {
    instructions.push(
      `${pc.bold("Deploy with Cloudflare (Alchemy):")}\n${pc.cyan("•")} Dev: ${`${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`${runCmd} destroy`}`,
    );
  }

  return instructions.length ? `\n${instructions.join("\n")}` : "";
}
