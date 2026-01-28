import { consola } from "consola";
import pc from "picocolors";

import type {
  Backend,
  Database,
  DatabaseSetup,
  Ecosystem,
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
    ecosystem,
  } = config;

  // Handle Rust projects with different instructions
  if (ecosystem === "rust") {
    displayRustInstructions(config);
    return;
  }

  // Handle Go projects with different instructions
  if (ecosystem === "go") {
    displayGoInstructions(config);
    return;
  }

  // Handle Python projects with different instructions
  if (ecosystem === "python") {
    displayPythonInstructions(config);
    return;
  }

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
    config.payments === "polar" && config.auth === "better-auth"
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
    "Like Better Fullstack?",
  )} Please consider giving us a star\n   on GitHub:\n`;
  output += pc.cyan("https://github.com/Marve10s/Better-Fullstack");

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

function displayRustInstructions(config: ProjectConfig & { depsInstalled: boolean }) {
  const { relativePath, rustWebFramework, rustFrontend, rustOrm, rustApi, rustCli } = config;

  const cdCmd = `cd ${relativePath}`;

  let output = `${pc.bold("Next steps")}\n${pc.cyan("1.")} ${cdCmd}\n`;
  let stepCounter = 2;

  // Rust projects use cargo, not npm/pnpm/bun
  output += `${pc.cyan(`${stepCounter++}.`)} cargo build\n`;
  output += `${pc.cyan(`${stepCounter++}.`)} cargo run\n`;

  output += `\n${pc.bold("Your Rust project includes:")}\n`;

  if (rustWebFramework && rustWebFramework !== "none") {
    const frameworkNames: Record<string, string> = {
      actix: "Actix Web",
      axum: "Axum",
      rocket: "Rocket",
    };
    output += `${pc.cyan("•")} Web Framework: ${frameworkNames[rustWebFramework] || rustWebFramework}\n`;
  }

  if (rustFrontend && rustFrontend !== "none") {
    const frontendNames: Record<string, string> = {
      leptos: "Leptos",
      dioxus: "Dioxus",
      yew: "Yew",
    };
    output += `${pc.cyan("•")} Frontend: ${frontendNames[rustFrontend] || rustFrontend}\n`;
  }

  if (rustOrm && rustOrm !== "none") {
    const ormNames: Record<string, string> = {
      diesel: "Diesel",
      sqlx: "SQLx",
      "sea-orm": "SeaORM",
    };
    output += `${pc.cyan("•")} Database: ${ormNames[rustOrm] || rustOrm}\n`;
  }

  if (rustApi && rustApi !== "none") {
    const apiNames: Record<string, string> = {
      "async-graphql": "async-graphql",
      juniper: "Juniper",
    };
    output += `${pc.cyan("•")} API: ${apiNames[rustApi] || rustApi}\n`;
  }

  if (rustCli && rustCli !== "none") {
    const cliNames: Record<string, string> = {
      clap: "Clap",
      ratatui: "Ratatui",
    };
    output += `${pc.cyan("•")} CLI: ${cliNames[rustCli] || rustCli}\n`;
  }

  output += `\n${pc.bold("Common Cargo commands:")}\n`;
  output += `${pc.cyan("•")} Build: cargo build\n`;
  output += `${pc.cyan("•")} Run: cargo run\n`;
  output += `${pc.cyan("•")} Test: cargo test\n`;
  output += `${pc.cyan("•")} Check: cargo check\n`;
  output += `${pc.cyan("•")} Format: cargo fmt\n`;
  output += `${pc.cyan("•")} Lint: cargo clippy\n`;

  output += `\n${pc.bold(
    "Like Better Fullstack?",
  )} Please consider giving us a star\n   on GitHub:\n`;
  output += pc.cyan("https://github.com/Marve10s/Better-Fullstack");

  consola.box(output);
}

function displayGoInstructions(config: ProjectConfig & { depsInstalled: boolean }) {
  const { relativePath, depsInstalled, goWebFramework, goOrm, goApi, goCli, goLogging } = config;

  const cdCmd = `cd ${relativePath}`;

  let output = `${pc.bold("Next steps")}\n${pc.cyan("1.")} ${cdCmd}\n`;
  let stepCounter = 2;

  if (!depsInstalled) {
    output += `${pc.cyan(`${stepCounter++}.`)} go mod tidy\n`;
  }

  output += `${pc.cyan(`${stepCounter++}.`)} go run cmd/server/main.go\n`;

  output += `\n${pc.bold("Your Go project includes:")}\n`;

  if (goWebFramework && goWebFramework !== "none") {
    const frameworkNames: Record<string, string> = {
      gin: "Gin",
      echo: "Echo",
    };
    output += `${pc.cyan("•")} Web Framework: ${frameworkNames[goWebFramework] || goWebFramework}\n`;
  }

  if (goOrm && goOrm !== "none") {
    const ormNames: Record<string, string> = {
      gorm: "GORM",
      sqlc: "sqlc",
    };
    output += `${pc.cyan("•")} Database: ${ormNames[goOrm] || goOrm}\n`;
  }

  if (goApi && goApi !== "none") {
    const apiNames: Record<string, string> = {
      "grpc-go": "gRPC-Go",
    };
    output += `${pc.cyan("•")} API: ${apiNames[goApi] || goApi}\n`;
  }

  if (goCli && goCli !== "none") {
    const cliNames: Record<string, string> = {
      cobra: "Cobra",
      bubbletea: "Bubble Tea",
    };
    output += `${pc.cyan("•")} CLI: ${cliNames[goCli] || goCli}\n`;
  }

  if (goLogging && goLogging !== "none") {
    const loggingNames: Record<string, string> = {
      zap: "Zap",
    };
    output += `${pc.cyan("•")} Logging: ${loggingNames[goLogging] || goLogging}\n`;
  }

  output += `\n${pc.bold("Common Go commands:")}\n`;
  output += `${pc.cyan("•")} Build: go build ./...\n`;
  output += `${pc.cyan("•")} Run: go run cmd/server/main.go\n`;
  output += `${pc.cyan("•")} Test: go test ./...\n`;
  output += `${pc.cyan("•")} Tidy: go mod tidy\n`;
  output += `${pc.cyan("•")} Format: go fmt ./...\n`;
  output += `${pc.cyan("•")} Lint: golangci-lint run\n`;

  output += `\n${pc.bold("Your project will be available at:")}\n`;
  output += `${pc.cyan("•")} API: http://localhost:8080\n`;

  if (goApi === "grpc-go") {
    output += `${pc.cyan("•")} gRPC: localhost:50051\n`;
  }

  output += `\n${pc.bold(
    "Like Better Fullstack?",
  )} Please consider giving us a star\n   on GitHub:\n`;
  output += pc.cyan("https://github.com/Marve10s/Better-Fullstack");

  consola.box(output);
}

function displayPythonInstructions(config: ProjectConfig & { depsInstalled: boolean }) {
  const {
    relativePath,
    depsInstalled,
    pythonWebFramework,
    pythonOrm,
    pythonValidation,
    pythonAi,
    pythonTaskQueue,
    pythonQuality,
  } = config;

  const cdCmd = `cd ${relativePath}`;

  // Determine run command based on framework
  let runCommand = "uv run uvicorn app.main:app --reload";
  if (pythonWebFramework === "django") {
    runCommand = "uv run python manage.py runserver";
  }

  let output = `${pc.bold("Next steps")}\n${pc.cyan("1.")} ${cdCmd}\n`;
  let stepCounter = 2;

  if (!depsInstalled) {
    output += `${pc.cyan(`${stepCounter++}.`)} uv sync\n`;
  }

  output += `${pc.cyan(`${stepCounter++}.`)} ${runCommand}\n`;

  output += `\n${pc.bold("Your Python project includes:")}\n`;

  if (pythonWebFramework && pythonWebFramework !== "none") {
    const frameworkNames: Record<string, string> = {
      fastapi: "FastAPI",
      django: "Django",
    };
    output += `${pc.cyan("•")} Web Framework: ${frameworkNames[pythonWebFramework] || pythonWebFramework}\n`;
  }

  if (pythonOrm && pythonOrm !== "none") {
    const ormNames: Record<string, string> = {
      sqlalchemy: "SQLAlchemy",
      sqlmodel: "SQLModel",
    };
    output += `${pc.cyan("•")} ORM: ${ormNames[pythonOrm] || pythonOrm}\n`;
  }

  if (pythonValidation && pythonValidation !== "none") {
    const validationNames: Record<string, string> = {
      pydantic: "Pydantic",
    };
    output += `${pc.cyan("•")} Validation: ${validationNames[pythonValidation] || pythonValidation}\n`;
  }

  if (pythonAi && pythonAi.length > 0 && !pythonAi.includes("none")) {
    const aiNames: Record<string, string> = {
      langchain: "LangChain",
      langgraph: "LangGraph",
      llamaindex: "LlamaIndex",
      "openai-sdk": "OpenAI SDK",
      "anthropic-sdk": "Anthropic SDK",
      crewai: "CrewAI",
    };
    const aiList = pythonAi
      .filter((ai) => ai !== "none")
      .map((ai) => aiNames[ai] || ai)
      .join(", ");
    output += `${pc.cyan("•")} AI: ${aiList}\n`;
  }

  if (pythonTaskQueue && pythonTaskQueue !== "none") {
    const taskQueueNames: Record<string, string> = {
      celery: "Celery",
    };
    output += `${pc.cyan("•")} Task Queue: ${taskQueueNames[pythonTaskQueue] || pythonTaskQueue}\n`;
  }

  if (pythonQuality && pythonQuality !== "none") {
    const qualityNames: Record<string, string> = {
      ruff: "Ruff",
    };
    output += `${pc.cyan("•")} Code Quality: ${qualityNames[pythonQuality] || pythonQuality}\n`;
  }

  output += `\n${pc.bold("Common Python commands:")}\n`;
  output += `${pc.cyan("•")} Install: uv sync\n`;
  output += `${pc.cyan("•")} Run: ${runCommand}\n`;
  output += `${pc.cyan("•")} Test: uv run pytest\n`;
  output += `${pc.cyan("•")} Format: uv run ruff format .\n`;
  output += `${pc.cyan("•")} Lint: uv run ruff check .\n`;

  output += `\n${pc.bold("Your project will be available at:")}\n`;
  output += `${pc.cyan("•")} API: http://localhost:8000\n`;

  output += `\n${pc.bold(
    "Like Better Fullstack?",
  )} Please consider giving us a star\n   on GitHub:\n`;
  output += pc.cyan("https://github.com/Marve10s/Better-Fullstack");

  consola.box(output);
}
