import { box, log } from "@clack/prompts";
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
import { cliLog } from "../../utils/terminal-output";

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
  const hasVitePlus = addons?.includes("vite-plus");
  const hasVitePlusNativeHooks = hasVitePlus && !hasHusky && !hasLefthook;
  const hasGitHooksOrLinting =
    addons?.includes("husky") ||
    addons?.includes("biome") ||
    addons?.includes("lefthook") ||
    addons?.includes("oxlint") ||
    hasVitePlus;

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
  const vitePlusNativeHooksInstructions = hasVitePlusNativeHooks
    ? getVitePlusNativeHooksInstructions(runCmd)
    : "";
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
  const hasSvelte = frontend?.includes("svelte");
  const hasAstro = frontend?.includes("astro");
  // TanStack Router/Start, Next, Nuxt and Solid all dev on 3001; only React Router and SvelteKit use Vite's default 5173.
  const webPort = hasReactRouter || hasSvelte ? "5173" : hasAstro ? "4321" : "3001";

  const betterAuthConvexInstructions =
    isConvex && config.auth === "better-auth"
      ? getBetterAuthConvexInstructions(hasWeb ?? false, webPort, packageManager, runCmd)
      : "";
  const polarInstructions =
    config.payments === "polar" && config.auth === "better-auth"
      ? getPolarInstructions(backend, packageManager)
      : "";

  const bunWebNativeWarning =
    packageManager === "bun" && hasNative && hasWeb ? getBunWebNativeWarning() : "";
  const noOrmWarning = !isConvex && database !== "none" && orm === "none" ? getNoOrmWarning() : "";

  let output = `${pc.cyan("1.")} ${cdCmd}\n`;
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
    const localServices: Array<{ label: string; url: string }> = [];
    let localDevelopmentNote = "";

    if (hasWeb) {
      localServices.push({ label: "Frontend", url: `http://localhost:${webPort}` });
    } else if (!hasNative && !addons?.includes("starlight")) {
      localDevelopmentNote = "Backend-only app — no frontend selected";
    }

    if (!isConvex && !isBackendSelf && hasStandaloneBackend) {
      localServices.push({ label: "API", url: "http://localhost:3000" });

      if (api === "orpc") {
        localServices.push({
          label: "API reference",
          url: "http://localhost:3000/api-reference",
        });
      }
    }

    if (isBackendSelf && api === "orpc") {
      const rpcPath =
        frontend?.includes("next") || frontend?.includes("tanstack-start") ? "/api/rpc" : "/rpc";
      localServices.push({
        label: "API reference",
        url: `http://localhost:${webPort}${rpcPath}/api-reference`,
      });
    }

    if (addons?.includes("starlight")) {
      localServices.push({ label: "Docs", url: "http://localhost:4321" });
    }

    if (addons?.includes("fumadocs")) {
      localServices.push({ label: "Fumadocs", url: "http://localhost:4000" });
    }

    output += `\n${pc.bold("Local development")}\n`;
    if (localDevelopmentNote) {
      output += `${pc.dim(localDevelopmentNote)}\n`;
    }

    if (localServices.length > 0) {
      const labelWidth = Math.max(...localServices.map(({ label }) => label.length));
      for (const { label, url } of localServices) {
        output += `${pc.dim(label.padEnd(labelWidth))}  ${pc.cyan(url)}\n`;
      }
    }
  }

  if (nativeInstructions) output += `\n${nativeInstructions.trim()}\n`;
  if (databaseInstructions) output += `\n${databaseInstructions.trim()}\n`;
  if (tauriInstructions) output += `\n${tauriInstructions.trim()}\n`;
  if (electrobunInstructions) output += `\n${electrobunInstructions.trim()}\n`;
  if (huskyInstructions) output += `\n${huskyInstructions.trim()}\n`;
  if (lefthookInstructions) output += `\n${lefthookInstructions.trim()}\n`;
  if (vitePlusNativeHooksInstructions) output += `\n${vitePlusNativeHooksInstructions.trim()}\n`;
  if (lintingInstructions) output += `\n${lintingInstructions.trim()}\n`;
  if (pwaInstructions) output += `\n${pwaInstructions.trim()}\n`;
  if (starlightInstructions) output += `\n${starlightInstructions.trim()}\n`;
  if (clerkInstructions) output += `\n${clerkInstructions.trim()}\n`;
  if (betterAuthConvexInstructions) output += `\n${betterAuthConvexInstructions.trim()}\n`;
  if (polarInstructions) output += `\n${polarInstructions.trim()}\n`;
  // Deploy steps come last so env sync happens after auth/payment keys exist
  if (alchemyDeployInstructions) output += `\n${alchemyDeployInstructions.trim()}\n`;

  if (noOrmWarning) output += `\n${noOrmWarning.trim()}\n`;
  if (bunWebNativeWarning) output += `\n${bunWebNativeWarning.trim()}\n`;

  const sponsorsResult = await fetchSponsorsQuietly();
  const specialSponsorsSection = sponsorsResult.isOk()
    ? formatPostInstallSpecialSponsorsSection(sponsorsResult.value)
    : "";

  log.message([], { spacing: 1 });
  box(output.trimEnd(), pc.bold("Next steps"), {
    contentPadding: 2,
    formatBorder: pc.dim,
    rounded: true,
    width: "auto",
  });

  if (specialSponsorsSection) {
    cliLog.message(specialSponsorsSection);
  }

  cliLog.message(
    `${pc.bold("Like Better T Stack?")} ${pc.dim("Star the project on GitHub")}\n${pc.cyan(
      "https://github.com/AmanVarshney01/create-better-t-stack",
    )}`,
  );
}

function getNativeInstructions(
  isConvex: boolean,
  isBackendSelf: boolean,
  frontend: Frontend[],
  runCmd: string,
) {
  const envVar = isConvex ? "EXPO_PUBLIC_CONVEX_URL" : "EXPO_PUBLIC_SERVER_URL";
  const selfBackendPort = frontend.includes("svelte")
    ? "5173"
    : frontend.includes("astro")
      ? "4321"
      : "3001";
  const exampleUrl = isConvex
    ? "https://example.convex.cloud"
    : isBackendSelf
      ? `http://<YOUR_LOCAL_IP>:${selfBackendPort}`
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
  )} Run checks: ${`${runCmd} check`}\n`;
}

function getLefthookInstructions(packageManager: string) {
  const cmd = packageManager === "npm" ? "npx" : packageManager;
  return `${pc.bold("Git hooks with Lefthook:")}\n${pc.cyan(
    "•",
  )} Install hooks: ${cmd} lefthook install\n`;
}

function getVitePlusNativeHooksInstructions(runCmd: string) {
  return `${pc.bold("Vite+ native Git hooks:")}\n${pc.cyan(
    "•",
  )} Optional hook setup: ${`${runCmd} hooks:setup`}\n${pc.dim(
    "   (runs vp config; hooks install into .vite-hooks and use vp staged)",
  )}\n`;
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
  const notes: string[] = [];
  const commands: Array<{ label: string; command: string }> = [];
  const isD1Alchemy =
    dbSetup === "d1" &&
    (serverDeploy === "cloudflare" || (backend === "self" && webDeploy === "cloudflare"));

  if (dbSetup === "docker") {
    const dockerStatus = await getDockerStatus(database);

    if (dockerStatus.message) {
      notes.push(dockerStatus.message);
    }
  }

  if (isD1Alchemy) {
    if (orm === "drizzle") {
      commands.push({ label: "Generate migrations", command: `${runCmd} db:generate` });
    } else if (orm === "prisma") {
      commands.push({ label: "Generate client", command: `${runCmd} db:generate` });
      commands.push({ label: "Apply migrations", command: `${runCmd} db:migrate` });
    }
  }

  if (dbSetup === "planetscale") {
    if (database === "mysql" && orm === "drizzle") {
      notes.push(
        `${pc.yellow("NOTE:")} Enable foreign key constraints in PlanetScale database settings`,
      );
    }
    if (database === "mysql" && orm === "prisma") {
      notes.push(
        `${pc.yellow(
          "NOTE:",
        )} How to handle Prisma migrations with PlanetScale:\n   https://github.com/prisma/prisma/issues/7292`,
      );
    }
  }

  if (dbSetup === "turso" && orm === "prisma") {
    notes.push(
      `${pc.yellow(
        "NOTE:",
      )} Follow Turso's Prisma guide for migrations via the Turso CLI:\n   https://docs.turso.tech/sdk/ts/orm/prisma`,
    );
  }

  if (orm === "prisma") {
    if (database === "mongodb" && dbSetup === "docker") {
      notes.push(
        `${pc.yellow("WARNING:")} Prisma + MongoDB + Docker combination\n   may not work.`,
      );
    }
    if (dbSetup === "docker") {
      commands.push({ label: "Start database", command: `${runCmd} db:start` });
    }
    if (!isD1Alchemy) {
      commands.push({ label: "Generate client", command: `${runCmd} db:generate` });
      commands.push({ label: "Apply schema", command: `${runCmd} db:push` });
    }
    if (!isD1Alchemy) {
      commands.push({ label: "Open studio", command: `${runCmd} db:studio` });
    }
  } else if (orm === "drizzle") {
    if (dbSetup === "docker") {
      commands.push({ label: "Start database", command: `${runCmd} db:start` });
    }
    if (!isD1Alchemy) {
      commands.push({ label: "Apply schema", command: `${runCmd} db:push` });
    }
    if (!isD1Alchemy) {
      commands.push({ label: "Open studio", command: `${runCmd} db:studio` });
    }
  } else if (orm === "mongoose") {
    if (dbSetup === "docker") {
      commands.push({ label: "Start database", command: `${runCmd} db:start` });
    }
  } else if (orm === "none") {
    notes.push(`${pc.yellow("NOTE:")} Manual database schema setup required.`);
  }

  if (notes.length === 0 && commands.length === 0) {
    return "";
  }

  const sections = [pc.bold("Database")];
  if (notes.length > 0) {
    sections.push(notes.join("\n"));
  }
  if (commands.length > 0) {
    const labelWidth = Math.max(...commands.map(({ label }) => label.length));
    const commandRows = commands.map(
      ({ label, command }) => `${pc.dim(label.padEnd(labelWidth))}  ${pc.cyan(command)}`,
    );
    sections.push(commandRows.join("\n"));
  }

  return sections.join("\n");
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
  )} Electrobun wraps your web frontend in a desktop shell.\n   See: ${"https://framework.blackboard.sh/electrobun/"}${
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

function getBetterAuthConvexInstructions(
  hasWeb: boolean,
  webPort: string,
  packageManager: string,
  runCmd: string,
) {
  const cmd = packageManager === "npm" ? "npx" : packageManager;
  return (
    `${pc.bold("Better Auth + Convex Setup:")}\n` +
    `${pc.cyan("•")} Configure the Convex deployment before setting env vars:\n` +
    `${pc.white(`   ${runCmd} dev:setup`)}\n` +
    `${pc.cyan("•")} Set environment variables from ${pc.white("packages/backend")}:\n` +
    `${pc.white("   cd packages/backend")}\n` +
    `${pc.white(`   ${cmd} convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)`)}\n` +
    (hasWeb ? `${pc.white(`   ${cmd} convex env set SITE_URL http://localhost:${webPort}`)}\n` : "")
  );
}

function getPolarInstructions(backend: Backend, packageManager: string) {
  if (backend === "convex") {
    const cmd = packageManager === "npm" ? "npx" : packageManager;
    return (
      `${pc.bold("Polar Payments Setup:")}\n` +
      `${pc.cyan("•")} Create a Polar organization token, webhook secret, and product in ${pc.underline("https://sandbox.polar.sh/")}\n` +
      `${pc.cyan("•")} Set the Convex env vars from ${pc.white("packages/backend")}:\n` +
      `${pc.white("   cd packages/backend")}\n` +
      `${pc.white(`   ${cmd} convex env set POLAR_ORGANIZATION_TOKEN your_polar_token`)}\n` +
      `${pc.white(`   ${cmd} convex env set POLAR_WEBHOOK_SECRET your_polar_webhook_secret`)}\n` +
      `${pc.white(`   Optional: ${cmd} convex env set POLAR_SERVER production`)}\n` +
      `${pc.cyan("•")} Configure a Polar webhook to ${pc.white("https://<your-convex-site-url>/polar/events")}`
    );
  }

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

  if (webDeploy === "cloudflare" && serverDeploy !== "cloudflare" && !isBackendSelf) {
    const cfDeploy = serverDeploy === "vercel" ? "deploy:web" : "deploy";
    instructions.push(
      `${pc.bold("Deploy web with Cloudflare (Alchemy):")}\n${pc.cyan("•")} Dev: ${`${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`${runCmd} ${cfDeploy}`}\n${pc.cyan("•")} Destroy: ${`${runCmd} destroy`}`,
    );
  } else if (serverDeploy === "cloudflare" && webDeploy !== "cloudflare" && !isBackendSelf) {
    const cfDeploy = webDeploy === "vercel" ? "deploy:server" : "deploy";
    instructions.push(
      `${pc.bold("Deploy server with Cloudflare (Alchemy):")}\n${pc.cyan("•")} Dev: ${`${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`${runCmd} ${cfDeploy}`}\n${pc.cyan("•")} Destroy: ${`${runCmd} destroy`}`,
    );
  } else if (webDeploy === "cloudflare" && (serverDeploy === "cloudflare" || isBackendSelf)) {
    instructions.push(
      `${pc.bold("Deploy with Cloudflare (Alchemy):")}\n${pc.cyan("•")} Dev: ${`${runCmd} dev`}\n${pc.cyan("•")} Deploy: ${`${runCmd} deploy`}\n${pc.cyan("•")} Destroy: ${`${runCmd} destroy`}`,
    );
  }

  if (webDeploy === "docker" || serverDeploy === "docker") {
    const dockerTargets =
      webDeploy === "docker" && serverDeploy === "docker"
        ? "web + server"
        : webDeploy === "docker"
          ? "web"
          : "server";
    instructions.push(
      `${pc.bold(`Deploy ${dockerTargets} with Docker Compose:`)}\n${pc.cyan("•")} Start: ${`${runCmd} docker:up`}\n${pc.cyan("•")} Logs: ${`${runCmd} docker:logs`}\n${pc.cyan("•")} Stop: ${`${runCmd} docker:down`}\n${pc.cyan("•")} Config: docker-compose.yml`,
    );
  }

  if (webDeploy === "vercel" || serverDeploy === "vercel") {
    const mixedWithCloudflare = webDeploy === "cloudflare" || serverDeploy === "cloudflare";
    const vercelSetupScript = "deploy:setup";
    const vercelEnvScript = "env:production";
    const vercelDeployScript = mixedWithCloudflare
      ? webDeploy === "vercel"
        ? "deploy:web:prod"
        : "deploy:server:prod"
      : "deploy:prod";
    const vercelTargets =
      webDeploy === "vercel" && (serverDeploy === "vercel" || isBackendSelf)
        ? "web + server"
        : webDeploy === "vercel"
          ? "web"
          : "server";
    instructions.push(
      `${pc.bold(`Deploy ${vercelTargets} with Vercel Services:`)}\n${pc.cyan("•")} Link project: ${`${runCmd} ${vercelSetupScript}`}\n${pc.cyan("•")} Sync env (before first deploy): ${`${runCmd} ${vercelEnvScript}`}\n${pc.cyan("•")} Deploy: ${`${runCmd} ${vercelDeployScript}`}\n${pc.cyan("•")} Guide: https://www.better-t-stack.dev/docs/guides/vercel`,
    );
  }

  return instructions.length ? `\n${instructions.join("\n")}` : "";
}
