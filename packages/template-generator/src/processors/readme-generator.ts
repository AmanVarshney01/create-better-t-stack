import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { getDbScriptSupport } from "../utils/db-scripts";

export function processReadme(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const content = generateReadmeContent(config);
  vfs.writeFile("README.md", content);
}

function generateReadmeContent(options: ProjectConfig): string {
  const {
    projectName,
    packageManager,
    database,
    auth,
    addons = [],
    orm = "drizzle",
    runtime = "bun",
    frontend = ["tanstack-router"],
    backend = "hono",
    api = "trpc",
    webDeploy,
    serverDeploy,
    dbSetup,
  } = options;

  const isConvex = backend === "convex";
  const hasReactRouter = frontend.includes("react-router");
  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasSvelte = frontend.includes("svelte");
  const hasAstro = frontend.includes("astro");
  const packageManagerRunCmd = `${packageManager} run`;
  const webPort = hasReactRouter || hasSvelte ? "5173" : hasAstro ? "4321" : "3001";

  const stackDescription = generateStackDescription(frontend, backend, api, isConvex);

  return `# ${projectName}

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack${
    stackDescription ? ` that combines ${stackDescription}` : ""
  }.

## Features

${generateFeaturesList(database, auth, addons, orm, runtime, frontend, backend, api)}

## Getting Started

First, install the dependencies:

\`\`\`bash
${packageManager} install
\`\`\`
${
  isConvex
    ? `
## Convex Setup

This project uses Convex as a backend. You'll need to set up Convex before running the app:

\`\`\`bash
${packageManagerRunCmd} dev:setup
\`\`\`

Follow the prompts to create a new Convex project and connect it to your application.

Copy environment variables from \`packages/backend/.env.local\` to \`apps/*/.env\`.
${
  auth === "clerk"
    ? `
### Clerk Authentication Setup

- Follow the guide: [Convex + Clerk](https://docs.convex.dev/auth/clerk)
- Set \`CLERK_JWT_ISSUER_DOMAIN\` in Convex Dashboard
- Set \`CLERK_PUBLISHABLE_KEY\` in \`apps/*/.env\``
    : ""
}`
    : generateDatabaseSetup(options, packageManagerRunCmd)
}

Then, run the development server:

\`\`\`bash
${packageManagerRunCmd} dev
\`\`\`

${generateRunningInstructions(frontend, backend, webPort, hasNative, isConvex)}
${
  addons.includes("pwa") && hasReactRouter
    ? "\n## PWA Support with React Router v7\n\nThere is a known compatibility issue between VitePWA and React Router v7.\nSee: https://github.com/vite-pwa/vite-plugin-pwa/issues/809\n"
    : ""
}
${generateDeploymentCommands(packageManagerRunCmd, webDeploy, serverDeploy)}
${generateGitHooksSection(packageManagerRunCmd, addons)}

## Project Structure

\`\`\`
${generateProjectStructure(options)}
\`\`\`

## Available Scripts

${generateScriptsList(packageManagerRunCmd, options, hasNative)}
`;
}

function generateStackDescription(
  frontend: ProjectConfig["frontend"],
  backend: ProjectConfig["backend"],
  api: ProjectConfig["api"],
  isConvex: boolean,
): string {
  const parts: string[] = [];

  const frontendMap: Record<string, string> = {
    "tanstack-router": "React, TanStack Router",
    "react-router": "React, React Router",
    next: "Next.js",
    "tanstack-start": "React, TanStack Start",
    svelte: "SvelteKit",
    nuxt: "Nuxt",
    solid: "SolidJS",
    astro: "Astro",
  };

  for (const fe of frontend) {
    if (frontendMap[fe]) {
      parts.push(frontendMap[fe]);
      break;
    }
  }

  if (backend !== "none") {
    parts.push((backend[0]?.toUpperCase() ?? "") + backend.slice(1));
  }

  if (!isConvex && api !== "none") {
    parts.push(api.toUpperCase());
  }

  return parts.length > 0 ? `${parts.join(", ")}, and more` : "";
}

function generateRunningInstructions(
  frontend: ProjectConfig["frontend"],
  backend: ProjectConfig["backend"],
  webPort: string,
  hasNative: boolean,
  isConvex: boolean,
): string {
  const instructions: string[] = [];
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");
  const isBackendSelf = backend === "self";

  if (hasFrontend) {
    const desc = isBackendSelf ? "fullstack application" : "web application";
    instructions.push(
      `Open [http://localhost:${webPort}](http://localhost:${webPort}) in your browser to see the ${desc}.`,
    );
  }

  if (hasNative) {
    instructions.push("Use the Expo Go app to run the mobile application.");
  }

  if (isConvex) {
    instructions.push("Your app will connect to the Convex cloud backend automatically.");
  } else if (backend !== "none" && !isBackendSelf) {
    instructions.push("The API is running at [http://localhost:3000](http://localhost:3000).");
  }

  return instructions.join("\n");
}

function generateProjectStructure(config: ProjectConfig): string {
  const { projectName, frontend, backend, addons, api, auth, database, orm } = config;
  const isConvex = backend === "convex";
  const structure: string[] = [`${projectName}/`, "├── apps/"];
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");
  const isBackendSelf = backend === "self";
  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasDbPackage = !isConvex && database !== "none" && orm !== "none";

  if (hasFrontend) {
    const frontendTypes: Record<string, string> = {
      "tanstack-router": "React + TanStack Router",
      "react-router": "React + React Router",
      next: "Next.js",
      "tanstack-start": "React + TanStack Start",
      svelte: "SvelteKit",
      nuxt: "Nuxt",
      solid: "SolidJS",
      astro: "Astro",
    };
    const frontendType = frontend.find((f) => frontendTypes[f])
      ? frontendTypes[frontend.find((f) => frontendTypes[f]) || ""]
      : "";

    const prefix = isBackendSelf ? "└──" : "├──";
    const desc = isBackendSelf ? "Fullstack application" : "Frontend application";
    structure.push(`│   ${prefix} web/         # ${desc} (${frontendType})`);
  }

  if (hasNative) {
    structure.push("│   ├── native/      # Mobile application (React Native, Expo)");
  }

  if (addons.includes("starlight")) {
    structure.push("│   ├── docs/        # Documentation site (Astro Starlight)");
  }

  if (!isBackendSelf && backend !== "none" && !isConvex) {
    const backendName = (backend[0]?.toUpperCase() ?? "") + backend.slice(1);
    const apiName = api !== "none" ? api.toUpperCase() : "";
    const desc = apiName ? `${backendName}, ${apiName}` : backendName;
    structure.push(`│   └── server/      # Backend API (${desc})`);
  }

  if (isConvex || backend !== "none") {
    structure.push("├── packages/");

    if (isConvex) {
      structure.push("│   ├── backend/     # Convex backend functions and schema");
      if (auth === "clerk") {
        structure.push(
          "│   │   ├── convex/    # Convex functions and schema",
          "│   │   └── .env.local # Convex environment variables",
        );
      }
    }

    if (!isConvex) {
      if (api !== "none") {
        structure.push("│   ├── api/         # API layer / business logic");
      }
      if (auth !== "none") {
        structure.push("│   ├── auth/        # Authentication configuration & logic");
      }
      if (hasDbPackage) {
        structure.push("│   └── db/          # Database schema & queries");
      }
    }
  }

  return structure.join("\n");
}

function generateFeaturesList(
  database: ProjectConfig["database"],
  auth: ProjectConfig["auth"],
  addons: ProjectConfig["addons"],
  orm: ProjectConfig["orm"],
  runtime: ProjectConfig["runtime"],
  frontend: ProjectConfig["frontend"],
  backend: ProjectConfig["backend"],
  api: ProjectConfig["api"],
): string {
  const isConvex = backend === "convex";
  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");

  const features = ["- **TypeScript** - For type safety and improved developer experience"];

  const frontendFeatures: Record<string, string> = {
    "tanstack-router": "- **TanStack Router** - File-based routing with full type safety",
    "react-router": "- **React Router** - Declarative routing for React",
    next: "- **Next.js** - Full-stack React framework",
    "tanstack-start": "- **TanStack Start** - SSR framework with TanStack Router",
    svelte: "- **SvelteKit** - Web framework for building Svelte apps",
    nuxt: "- **Nuxt** - The Intuitive Vue Framework",
    solid: "- **SolidJS** - Simple and performant reactivity",
    astro: "- **Astro** - The web framework for content-driven websites",
  };

  for (const fe of frontend) {
    if (frontendFeatures[fe]) {
      features.push(frontendFeatures[fe]);
      break;
    }
  }

  if (hasNative) {
    features.push(
      "- **React Native** - Build mobile apps using React",
      "- **Expo** - Tools for React Native development",
    );
  }

  if (hasFrontend) {
    features.push(
      "- **TailwindCSS** - Utility-first CSS for rapid UI development",
      "- **shadcn/ui** - Reusable UI components",
    );
  }

  const backendFeatures: Record<string, string> = {
    convex: "- **Convex** - Reactive backend-as-a-service platform",
    hono: "- **Hono** - Lightweight, performant server framework",
    express: "- **Express** - Fast, unopinionated web framework",
    fastify: "- **Fastify** - Fast, low-overhead web framework",
    elysia: "- **Elysia** - Type-safe, high-performance framework",
  };

  if (backendFeatures[backend]) {
    features.push(backendFeatures[backend]);
  }

  if (!isConvex && api === "trpc") {
    features.push("- **tRPC** - End-to-end type-safe APIs");
  } else if (!isConvex && api === "orpc") {
    features.push("- **oRPC** - End-to-end type-safe APIs with OpenAPI integration");
  }

  if (!isConvex && backend !== "none" && runtime !== "none") {
    const runtimeName = runtime === "bun" ? "Bun" : runtime === "node" ? "Node.js" : runtime;
    features.push(`- **${runtimeName}** - Runtime environment`);
  }

  if (database !== "none" && !isConvex) {
    const ormNames: Record<string, string> = {
      drizzle: "Drizzle",
      prisma: "Prisma",
      mongoose: "Mongoose",
    };
    const dbNames: Record<string, string> = {
      sqlite: "SQLite/Turso",
      postgres: "PostgreSQL",
      mysql: "MySQL",
      mongodb: "MongoDB",
    };
    features.push(
      `- **${ormNames[orm] || "ORM"}** - TypeScript-first ORM`,
      `- **${dbNames[database] || "Database"}** - Database engine`,
    );
  }

  if (auth !== "none") {
    const authLabel = auth === "clerk" ? "Clerk" : "Better-Auth";
    features.push(`- **Authentication** - ${authLabel}`);
  }

  const addonFeatures: Record<string, string> = {
    pwa: "- **PWA** - Progressive Web App support",
    tauri: "- **Tauri** - Build native desktop applications",
    biome: "- **Biome** - Linting and formatting",
    oxlint: "- **Oxlint** - Oxlint + Oxfmt (linting & formatting)",
    husky: "- **Husky** - Git hooks for code quality",
    starlight: "- **Starlight** - Documentation site with Astro",
    turborepo: "- **Turborepo** - Optimized monorepo build system",
  };

  for (const addon of addons) {
    if (addonFeatures[addon]) {
      features.push(addonFeatures[addon]);
    }
  }

  return features.join("\n");
}

function generateDatabaseSetup(config: ProjectConfig, packageManagerRunCmd: string): string {
  const { database, orm, dbSetup, backend } = config;
  if (database === "none") return "";

  const isBackendSelf = backend === "self";
  const envPath = isBackendSelf ? "apps/web/.env" : "apps/server/.env";
  const ormLabels: Record<ProjectConfig["orm"], string> = {
    drizzle: "Drizzle ORM",
    prisma: "Prisma",
    mongoose: "Mongoose",
    none: "ORM",
  };
  const ormDesc = orm === "none" ? "" : ` with ${ormLabels[orm] || orm}`;
  const dbSupport = getDbScriptSupport(config);

  let setup = "## Database Setup\n\n";

  const dbDescriptions: Record<string, string> = {
    sqlite: `This project uses SQLite${ormDesc}.

1. Start the local SQLite database (optional):
${
  dbSetup === "d1"
    ? "D1 local development and migrations are handled automatically by Alchemy during dev and deploy."
    : `\`\`\`bash
${packageManagerRunCmd} db:local
\`\`\``
}

2. Update your \`.env\` file in the \`${isBackendSelf ? "apps/web" : "apps/server"}\` directory with the appropriate connection details if needed.`,

    postgres: `This project uses PostgreSQL${ormDesc}.

1. Make sure you have a PostgreSQL database set up.
2. Update your \`${envPath}\` file with your PostgreSQL connection details.`,

    mysql: `This project uses MySQL${ormDesc}.

1. Make sure you have a MySQL database set up.
2. Update your \`${envPath}\` file with your MySQL connection details.`,

    mongodb: `This project uses MongoDB ${ormDesc.replace(" with ", "with ")}.

1. Make sure you have MongoDB set up.
2. Update your \`${envPath}\` file with your MongoDB connection URI.`,
  };

  setup += dbDescriptions[database] || "";

  if (dbSupport.hasDbPush) {
    setup += `

3. Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\`
`;
  }

  return setup;
}

function generateScriptsList(
  packageManagerRunCmd: string,
  config: ProjectConfig,
  hasNative: boolean,
): string {
  const { database, addons, backend, dbSetup } = config;
  const isConvex = backend === "convex";
  const isBackendSelf = backend === "self";
  const dbSupport = getDbScriptSupport(config);

  let scripts = `- \`${packageManagerRunCmd} dev\`: Start all applications in development mode
- \`${packageManagerRunCmd} build\`: Build all applications`;

  if (!isBackendSelf) {
    scripts += `\n- \`${packageManagerRunCmd} dev:web\`: Start only the web application`;
  }

  if (isConvex) {
    scripts += `\n- \`${packageManagerRunCmd} dev:setup\`: Setup and configure your Convex project`;
  } else if (backend !== "none" && !isBackendSelf) {
    scripts += `\n- \`${packageManagerRunCmd} dev:server\`: Start only the server`;
  }

  scripts += `\n- \`${packageManagerRunCmd} check-types\`: Check TypeScript types across all apps`;

  if (hasNative) {
    scripts += `\n- \`${packageManagerRunCmd} dev:native\`: Start the React Native/Expo development server`;
  }

  if (dbSupport.hasDbScripts) {
    scripts += `\n- \`${packageManagerRunCmd} db:push\`: Push schema changes to database`;
    if (dbSupport.hasDbGenerate) {
      scripts += `\n- \`${packageManagerRunCmd} db:generate\`: Generate database client/types`;
    }
    if (dbSupport.hasDbMigrate) {
      scripts += `\n- \`${packageManagerRunCmd} db:migrate\`: Run database migrations`;
    }
    if (dbSupport.hasDbStudio) {
      scripts += `\n- \`${packageManagerRunCmd} db:studio\`: Open database studio UI`;
    }
  }

  if (database === "sqlite" && dbSetup !== "d1" && dbSupport.hasDbScripts) {
    scripts += `\n- \`${packageManagerRunCmd} db:local\`: Start the local SQLite database`;
  }

  if (addons.includes("biome")) {
    scripts += `\n- \`${packageManagerRunCmd} check\`: Run Biome formatting and linting`;
  }

  if (addons.includes("oxlint")) {
    scripts += `\n- \`${packageManagerRunCmd} check\`: Run Oxlint and Oxfmt`;
  }

  if (addons.includes("pwa")) {
    scripts += `\n- \`cd apps/web && ${packageManagerRunCmd} generate-pwa-assets\`: Generate PWA assets`;
  }

  if (addons.includes("tauri")) {
    scripts += `\n- \`cd apps/web && ${packageManagerRunCmd} desktop:dev\`: Start Tauri desktop app in development
- \`cd apps/web && ${packageManagerRunCmd} desktop:build\`: Build Tauri desktop app`;
  }

  if (addons.includes("starlight")) {
    scripts += `\n- \`cd apps/docs && ${packageManagerRunCmd} dev\`: Start documentation site
- \`cd apps/docs && ${packageManagerRunCmd} build\`: Build documentation site`;
  }

  return scripts;
}

function generateDeploymentCommands(
  packageManagerRunCmd: string,
  webDeploy: ProjectConfig["webDeploy"],
  serverDeploy: ProjectConfig["serverDeploy"],
): string {
  if (webDeploy !== "cloudflare" && serverDeploy !== "cloudflare") {
    return "";
  }

  const lines: string[] = ["## Deployment (Cloudflare via Alchemy)"];

  if (webDeploy === "cloudflare" && serverDeploy !== "cloudflare") {
    lines.push(
      `- Dev: cd apps/web && ${packageManagerRunCmd} alchemy dev`,
      `- Deploy: cd apps/web && ${packageManagerRunCmd} deploy`,
      `- Destroy: cd apps/web && ${packageManagerRunCmd} destroy`,
    );
  }

  if (serverDeploy === "cloudflare" && webDeploy !== "cloudflare") {
    lines.push(
      `- Dev: cd apps/server && ${packageManagerRunCmd} dev`,
      `- Deploy: cd apps/server && ${packageManagerRunCmd} deploy`,
      `- Destroy: cd apps/server && ${packageManagerRunCmd} destroy`,
    );
  }

  if (webDeploy === "cloudflare" && serverDeploy === "cloudflare") {
    lines.push(
      `- Dev: ${packageManagerRunCmd} dev`,
      `- Deploy: ${packageManagerRunCmd} deploy`,
      `- Destroy: ${packageManagerRunCmd} destroy`,
    );
  }

  lines.push(
    "",
    "For more details, see the guide on [Deploying to Cloudflare with Alchemy](https://www.better-t-stack.dev/docs/guides/cloudflare-alchemy).",
  );

  return `${lines.join("\n")}\n`;
}

function generateGitHooksSection(
  packageManagerRunCmd: string,
  addons: ProjectConfig["addons"],
): string {
  const hasHusky = addons.includes("husky");
  const hasLinting = addons.includes("biome") || addons.includes("oxlint");

  if (!hasHusky && !hasLinting) {
    return "";
  }

  const lines: string[] = ["## Git Hooks and Formatting", ""];

  if (hasHusky) {
    lines.push(`- Initialize hooks: \`${packageManagerRunCmd} prepare\``);
  }

  if (hasLinting) {
    lines.push(`- Format and lint fix: \`${packageManagerRunCmd} check\``);
  }

  return `${lines.join("\n")}\n\n`;
}
