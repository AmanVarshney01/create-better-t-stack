import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processReadme(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const content =
    config.ecosystem === "rust" ? generateRustReadmeContent(config) : generateReadmeContent(config);
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
  const packageManagerRunCmd = `${packageManager} run`;
  const webPort = hasReactRouter || hasSvelte ? "5173" : "3001";

  const stackDescription = generateStackDescription(frontend, backend, api, isConvex);

  return `# ${projectName}

This project was created with [Better Fullstack](https://github.com/Marve10s/Better-Fullstack), a modern TypeScript stack${
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
    : generateDatabaseSetup(database, packageManagerRunCmd, orm, dbSetup, backend)
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
${generateProjectStructure(projectName, frontend, backend, addons, isConvex, api, auth)}
\`\`\`

## Available Scripts

${generateScriptsList(packageManagerRunCmd, database, orm, hasNative, addons, backend, dbSetup)}
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

function generateProjectStructure(
  projectName: string,
  frontend: ProjectConfig["frontend"],
  backend: ProjectConfig["backend"],
  addons: ProjectConfig["addons"],
  isConvex: boolean,
  api: ProjectConfig["api"],
  auth: ProjectConfig["auth"],
): string {
  const structure: string[] = [`${projectName}/`, "├── apps/"];
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");
  const isBackendSelf = backend === "self";
  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );

  if (hasFrontend) {
    const frontendTypes: Record<string, string> = {
      "tanstack-router": "React + TanStack Router",
      "react-router": "React + React Router",
      next: "Next.js",
      "tanstack-start": "React + TanStack Start",
      svelte: "SvelteKit",
      nuxt: "Nuxt",
      solid: "SolidJS",
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
      structure.push("│   ├── api/         # API layer / business logic");
      if (auth !== "none") {
        structure.push("│   ├── auth/        # Authentication configuration & logic");
      }
      if (api !== "none" || auth !== "none") {
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

function generateDatabaseSetup(
  database: ProjectConfig["database"],
  packageManagerRunCmd: string,
  orm: ProjectConfig["orm"],
  dbSetup: ProjectConfig["dbSetup"],
  backend: ProjectConfig["backend"],
): string {
  if (database === "none") return "";

  const isBackendSelf = backend === "self";
  const envPath = isBackendSelf ? "apps/web/.env" : "apps/server/.env";
  const ormDesc =
    orm === "drizzle" ? " with Drizzle ORM" : orm === "prisma" ? " with Prisma" : ` with ${orm}`;

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

  setup += `

3. Apply the schema to your database:
\`\`\`bash
${packageManagerRunCmd} db:push
\`\`\`
`;

  return setup;
}

function generateScriptsList(
  packageManagerRunCmd: string,
  database: ProjectConfig["database"],
  orm: ProjectConfig["orm"],
  hasNative: boolean,
  addons: ProjectConfig["addons"],
  backend: ProjectConfig["backend"],
  dbSetup: ProjectConfig["dbSetup"],
): string {
  const isConvex = backend === "convex";
  const isBackendSelf = backend === "self";

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

  if (database !== "none" && !isConvex) {
    scripts += `\n- \`${packageManagerRunCmd} db:push\`: Push schema changes to database
- \`${packageManagerRunCmd} db:studio\`: Open database studio UI`;

    if (database === "sqlite" && dbSetup !== "d1") {
      scripts += `\n- \`${packageManagerRunCmd} db:local\`: Start the local SQLite database`;
    }
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

function generateRustReadmeContent(config: ProjectConfig): string {
  const { projectName, rustWebFramework, rustFrontend, rustOrm, rustApi, rustCli, rustLibraries } =
    config;

  const features: string[] = ["- **Rust** - Memory-safe, high-performance systems programming"];

  // Web framework
  if (rustWebFramework === "axum") {
    features.push("- **Axum** - Ergonomic and modular web framework by Tokio team");
  } else if (rustWebFramework === "actix-web") {
    features.push("- **Actix-web** - Powerful, pragmatic, and extremely fast web framework");
  }

  // Frontend
  if (rustFrontend === "leptos") {
    features.push("- **Leptos** - Fine-grained reactive framework with SSR support");
    features.push("- **WebAssembly** - High-performance frontend compiled from Rust");
  } else if (rustFrontend === "dioxus") {
    features.push("- **Dioxus** - React-like GUI library for web, desktop, and mobile");
    features.push("- **WebAssembly** - High-performance frontend compiled from Rust");
  }

  // ORM
  if (rustOrm === "sea-orm") {
    features.push("- **SeaORM** - Async & dynamic ORM with ActiveRecord pattern");
  } else if (rustOrm === "sqlx") {
    features.push("- **SQLx** - Async SQL toolkit with compile-time checked queries");
  }

  // API
  if (rustApi === "tonic") {
    features.push("- **Tonic** - Production-ready gRPC implementation");
  } else if (rustApi === "async-graphql") {
    features.push("- **async-graphql** - High-performance GraphQL server");
  }

  // CLI
  if (rustCli === "clap") {
    features.push("- **Clap** - CLI argument parser with derive macros");
  } else if (rustCli === "ratatui") {
    features.push("- **Ratatui** - Terminal user interface library");
  }

  // Libraries
  const libs = Array.isArray(rustLibraries) ? rustLibraries : [];
  if (libs.includes("validator")) {
    features.push("- **Validator** - Derive-based validation");
  }
  if (libs.includes("jsonwebtoken")) {
    features.push("- **jsonwebtoken** - JWT encoding/decoding");
  }
  if (libs.includes("argon2")) {
    features.push("- **Argon2** - Secure password hashing");
  }
  if (libs.includes("tokio-test")) {
    features.push("- **Tokio Test** - Async testing utilities");
  }

  // Project structure
  const structure: string[] = [`${projectName}/`, "├── Cargo.toml            # Workspace manifest"];

  if (rustFrontend === "leptos") {
    structure.push(
      "├── crates/",
      "│   ├── server/           # Backend API server",
      "│   │   ├── Cargo.toml",
      "│   │   └── src/main.rs",
      "│   └── client/           # Leptos WASM frontend",
      "│       ├── Cargo.toml",
      "│       ├── Trunk.toml    # Trunk build config",
      "│       ├── index.html",
      "│       ├── src/lib.rs",
      "│       └── style/main.css",
    );
  } else if (rustFrontend === "dioxus") {
    structure.push(
      "├── crates/",
      "│   ├── server/           # Backend API server",
      "│   │   ├── Cargo.toml",
      "│   │   └── src/main.rs",
      "│   └── dioxus-client/    # Dioxus WASM frontend",
      "│       ├── Cargo.toml",
      "│       ├── Dioxus.toml   # Dioxus CLI config",
      "│       ├── src/main.rs",
      "│       └── assets/main.css",
    );
  } else {
    structure.push(
      "├── crates/",
      "│   └── server/           # Backend API server",
      "│       ├── Cargo.toml",
      "│       └── src/main.rs",
    );
  }

  structure.push(
    "├── rust-toolchain.toml   # Rust version config",
    "├── .env.example          # Environment variables",
    "└── .gitignore",
  );

  // Scripts
  let scripts = `- \`cargo build\`: Build all crates
- \`cargo run --bin server\`: Run the server
- \`cargo test\`: Run all tests
- \`cargo clippy\`: Run linter
- \`cargo fmt\`: Format code`;

  if (rustFrontend === "leptos") {
    scripts += `
- \`cd crates/client && trunk serve\`: Start Leptos dev server
- \`cd crates/client && trunk build --release\`: Build Leptos for production`;
  } else if (rustFrontend === "dioxus") {
    scripts += `
- \`cd crates/dioxus-client && dx serve\`: Start Dioxus dev server
- \`cd crates/dioxus-client && dx build --release\`: Build Dioxus for production`;
  }

  return `# ${projectName}

This project was created with [Better Fullstack](https://github.com/Marve10s/Better-Fullstack), a high-performance Rust stack.

## Features

${features.join("\n")}

## Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
${rustFrontend === "leptos" ? "- [Trunk](https://trunkrs.dev/) (`cargo install trunk`)\n- [wasm32-unknown-unknown target](https://rustwasm.github.io/docs/book/) (`rustup target add wasm32-unknown-unknown`)" : ""}${rustFrontend === "dioxus" ? "- [Dioxus CLI](https://dioxuslabs.com/learn/0.6/getting_started) (`cargo install dioxus-cli`)\n- [wasm32-unknown-unknown target](https://rustwasm.github.io/docs/book/) (`rustup target add wasm32-unknown-unknown`)" : ""}

## Getting Started

First, copy the environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Then, build and run the server:

\`\`\`bash
cargo run --bin server
\`\`\`

${rustWebFramework !== "none" ? "The API server will be running at [http://localhost:3000](http://localhost:3000)." : ""}

${
  rustFrontend === "leptos"
    ? `### Running the Frontend

In a separate terminal, start the Leptos frontend:

\`\`\`bash
cd crates/client
trunk serve
\`\`\`

The frontend will be available at [http://localhost:8080](http://localhost:8080).
`
    : ""
}${
    rustFrontend === "dioxus"
      ? `### Running the Frontend

In a separate terminal, start the Dioxus frontend:

\`\`\`bash
cd crates/dioxus-client
dx serve
\`\`\`

The frontend will be available at [http://localhost:8080](http://localhost:8080).
`
      : ""
  }
## Project Structure

\`\`\`
${structure.join("\n")}
\`\`\`

## Available Commands

${scripts}
`;
}
