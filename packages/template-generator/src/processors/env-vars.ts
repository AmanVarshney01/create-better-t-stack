import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export interface EnvVariable {
  key: string;
  value: string | null | undefined;
  condition: boolean;
  comment?: string;
}

function generateRandomString(length: number, charset: string) {
  let result = "";
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    const values = new Uint8Array(length);
    globalThis.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      const value = values[i];
      if (value !== undefined) {
        result += charset[value % charset.length];
      }
    }
    return result;
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }
}

function generateAuthSecret() {
  return generateRandomString(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
}

function getClientServerVar(frontend: string[], backend: ProjectConfig["backend"]) {
  const hasNextJs = frontend.includes("next");
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");
  const hasTanstackStart = frontend.includes("tanstack-start");

  // For fullstack self, no base URL is needed (same-origin)
  if (backend === "self") {
    return { key: "", value: "", write: false } as const;
  }

  let key = "VITE_SERVER_URL";
  if (hasNextJs) key = "NEXT_PUBLIC_SERVER_URL";
  else if (hasNuxt) key = "NUXT_PUBLIC_SERVER_URL";
  else if (hasSvelte) key = "PUBLIC_SERVER_URL";
  else if (hasTanstackStart) key = "VITE_SERVER_URL";

  return { key, value: "http://localhost:3000", write: true } as const;
}

function getConvexVar(frontend: string[]) {
  const hasNextJs = frontend.includes("next");
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");
  const hasTanstackStart = frontend.includes("tanstack-start");
  if (hasNextJs) return "NEXT_PUBLIC_CONVEX_URL";
  if (hasNuxt) return "NUXT_PUBLIC_CONVEX_URL";
  if (hasSvelte) return "PUBLIC_CONVEX_URL";
  if (hasTanstackStart) return "VITE_CONVEX_URL";
  return "VITE_CONVEX_URL";
}

function addEnvVariablesToContent(currentContent: string, variables: EnvVariable[]): string {
  let envContent = currentContent || "";
  let contentToAdd = "";

  for (const { key, value, condition, comment } of variables) {
    if (condition) {
      const regex = new RegExp(`^${key}=.*$`, "m");
      const valueToWrite = value ?? "";

      if (regex.test(envContent)) {
        const existingMatch = envContent.match(regex);
        if (existingMatch && existingMatch[0] !== `${key}=${valueToWrite}`) {
          envContent = envContent.replace(regex, `${key}=${valueToWrite}`);
        }
      } else {
        if (comment) {
          contentToAdd += `# ${comment}\n`;
        }
        contentToAdd += `${key}=${valueToWrite}\n`;
      }
    }
  }

  if (contentToAdd) {
    if (envContent.length > 0 && !envContent.endsWith("\n")) {
      envContent += "\n";
    }
    envContent += contentToAdd;
  }

  return envContent.trimEnd();
}

function writeEnvFile(vfs: VirtualFileSystem, envPath: string, variables: EnvVariable[]): void {
  let currentContent = "";
  if (vfs.exists(envPath)) {
    currentContent = vfs.readFile(envPath) || "";
  }
  const newContent = addEnvVariablesToContent(currentContent, variables);
  vfs.writeFile(envPath, newContent);
}

function buildClientVars(
  frontend: string[],
  backend: ProjectConfig["backend"],
  auth: ProjectConfig["auth"],
): EnvVariable[] {
  const hasNextJs = frontend.includes("next");
  const hasReactRouter = frontend.includes("react-router");
  const hasTanStackRouter = frontend.includes("tanstack-router");
  const hasTanStackStart = frontend.includes("tanstack-start");

  const baseVar = getClientServerVar(frontend, backend);
  const envVarName = backend === "convex" ? getConvexVar(frontend) : baseVar.key;
  const serverUrl = backend === "convex" ? "https://<YOUR_CONVEX_URL>" : baseVar.value;

  const vars: EnvVariable[] = [
    {
      key: envVarName,
      value: serverUrl,
      condition: backend === "convex" ? true : baseVar.write,
    },
  ];

  if (backend === "convex" && auth === "clerk") {
    if (hasNextJs) {
      vars.push(
        {
          key: "NEXT_PUBLIC_CLERK_FRONTEND_API_URL",
          value: "",
          condition: true,
        },
        {
          key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
          value: "",
          condition: true,
        },
        {
          key: "CLERK_SECRET_KEY",
          value: "",
          condition: true,
        },
      );
    } else if (hasReactRouter || hasTanStackRouter || hasTanStackStart) {
      vars.push({
        key: "VITE_CLERK_PUBLISHABLE_KEY",
        value: "",
        condition: true,
      });
      if (hasTanStackStart) {
        vars.push({
          key: "CLERK_SECRET_KEY",
          value: "",
          condition: true,
        });
      }
    }
  }

  if (backend === "convex" && auth === "better-auth") {
    if (hasNextJs) {
      vars.push({
        key: "NEXT_PUBLIC_CONVEX_SITE_URL",
        value: "https://<YOUR_CONVEX_URL>",
        condition: true,
      });
    } else if (hasReactRouter || hasTanStackRouter || hasTanStackStart) {
      vars.push({
        key: "VITE_CONVEX_SITE_URL",
        value: "https://<YOUR_CONVEX_URL>",
        condition: true,
      });
    }
  }

  return vars;
}

function buildNativeVars(
  frontend: string[],
  backend: ProjectConfig["backend"],
  auth: ProjectConfig["auth"],
): EnvVariable[] {
  let envVarName = "EXPO_PUBLIC_SERVER_URL";
  let serverUrl = "http://localhost:3000";

  if (backend === "self") {
    // Both TanStack Start and Next.js use port 3001 for fullstack
    serverUrl = "http://localhost:3001";
  }

  if (backend === "convex") {
    envVarName = "EXPO_PUBLIC_CONVEX_URL";
    serverUrl = "https://<YOUR_CONVEX_URL>";
  }

  const vars: EnvVariable[] = [
    {
      key: envVarName,
      value: serverUrl,
      condition: true,
    },
  ];

  if (backend === "convex" && auth === "clerk") {
    vars.push({
      key: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
      value: "",
      condition: true,
    });
  }

  if (backend === "convex" && auth === "better-auth") {
    vars.push({
      key: "EXPO_PUBLIC_CONVEX_SITE_URL",
      value: "https://<YOUR_CONVEX_URL>",
      condition: true,
    });
  }

  return vars;
}

function buildConvexBackendVars(
  frontend: string[],
  auth: ProjectConfig["auth"],
  examples: ProjectConfig["examples"],
  payments: ProjectConfig["payments"],
  backend: ProjectConfig["backend"],
): EnvVariable[] {
  const hasNextJs = frontend.includes("next");
  const hasNative =
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles");
  const hasWeb =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("tanstack-start") ||
    hasNextJs ||
    frontend.includes("nuxt") ||
    frontend.includes("solid") ||
    frontend.includes("svelte");

  const vars: EnvVariable[] = [];

  if (examples?.includes("ai")) {
    vars.push({
      key: "GOOGLE_GENERATIVE_AI_API_KEY",
      value: "",
      condition: true,
      comment: "Google AI API key for AI agent",
    });
  }

  // Polar environment variables for Convex
  if (payments === "polar") {
    vars.push(
      {
        key: "POLAR_ACCESS_TOKEN",
        value: "",
        condition: true,
        comment: "Polar access token (create in Polar dashboard → Settings → API)",
      },
      {
        key: "POLAR_SUCCESS_URL",
        value: "http://localhost:3001/success?checkout_id={CHECKOUT_ID}",
        condition: true,
        comment: "URL to redirect after successful checkout",
      },
      {
        key: "POLAR_SERVER",
        value: "sandbox",
        condition: true,
        comment: "Polar server: 'sandbox' or 'production'",
      },
    );
  }

  if (auth === "better-auth") {
    if (hasNative) {
      vars.push({
        key: "EXPO_PUBLIC_CONVEX_SITE_URL",
        value: "https://<YOUR_CONVEX_URL>",
        condition: true,
        comment: "Same as CONVEX_URL but ends in .site",
      });
    }

    if (hasWeb) {
      vars.push(
        {
          key: hasNextJs ? "NEXT_PUBLIC_CONVEX_SITE_URL" : "VITE_CONVEX_SITE_URL",
          value: "https://<YOUR_CONVEX_URL>",
          condition: true,
          comment: "Same as CONVEX_URL but ends in .site",
        },
        {
          key: "SITE_URL",
          value: "http://localhost:3001",
          condition: true,
          comment: "Web app URL for authentication",
        },
      );
    }
  }

  // Convex deployment info - automatically set by `npx convex dev`
  if (backend === "convex") {
    vars.push({
      key: "CONVEX_URL",
      value: "",
      condition: true,
      comment: "Convex deployment URL (set automatically by convex dev)",
    });
  }

  return vars;
}

function buildConvexCommentBlocks(
  frontend: string[],
  auth: ProjectConfig["auth"],
  examples: ProjectConfig["examples"],
  payments: ProjectConfig["payments"],
): string {
  const hasWeb =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("tanstack-start") ||
    frontend.includes("next") ||
    frontend.includes("nuxt") ||
    frontend.includes("solid") ||
    frontend.includes("svelte");

  let commentBlocks = "";

  if (examples?.includes("ai")) {
    commentBlocks += `# Set Google AI API key for AI agent
# npx convex env set GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

`;
  }

  if (auth === "better-auth") {
    commentBlocks += `# Set Convex environment variables
# npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
${hasWeb ? "# npx convex env set SITE_URL http://localhost:3001\n" : ""}`;
  }

  if (payments === "polar") {
    commentBlocks += `# Set Polar webhook secret after creating webhook in Polar Dashboard
# npx convex env set POLAR_WEBHOOK_SECRET=<webhook_secret>
`;
  }

  return commentBlocks;
}

function buildServerVars(
  backend: ProjectConfig["backend"],
  frontend: string[],
  auth: ProjectConfig["auth"],
  database: ProjectConfig["database"],
  dbSetup: ProjectConfig["dbSetup"],
  runtime: ProjectConfig["runtime"],
  webDeploy: ProjectConfig["webDeploy"],
  serverDeploy: ProjectConfig["serverDeploy"],
  payments: ProjectConfig["payments"],
  examples: ProjectConfig["examples"],
): EnvVariable[] {
  const hasReactRouter = frontend.includes("react-router");
  const hasSvelte = frontend.includes("svelte");

  let corsOrigin = "http://localhost:3001";
  if (backend === "self") {
    corsOrigin = "http://localhost:3001";
  } else if (hasReactRouter || hasSvelte) {
    corsOrigin = "http://localhost:5173";
  }

  let databaseUrl: string | null = null;
  if (database !== "none" && dbSetup === "none") {
    switch (database) {
      case "postgres":
        databaseUrl = "postgresql://postgres:password@localhost:5432/postgres";
        break;
      case "mysql":
        databaseUrl = "mysql://root:password@localhost:3306/mydb";
        break;
      case "mongodb":
        databaseUrl = "mongodb://localhost:27017/mydatabase";
        break;
      case "sqlite":
        if (runtime === "workers" || webDeploy === "cloudflare" || serverDeploy === "cloudflare") {
          databaseUrl = "http://127.0.0.1:8080";
        } else {
          databaseUrl = "file:../../local.db";
        }
        break;
    }
  }

  return [
    {
      key: "BETTER_AUTH_SECRET",
      value: generateAuthSecret(),
      condition: !!auth,
    },
    {
      key: "BETTER_AUTH_URL",
      value: backend === "self" ? "http://localhost:3001" : "http://localhost:3000",
      condition: !!auth,
    },
    {
      key: "POLAR_ACCESS_TOKEN",
      value: "",
      condition: payments === "polar",
    },
    {
      key: "POLAR_SUCCESS_URL",
      value: `${corsOrigin}/success?checkout_id={CHECKOUT_ID}`,
      condition: payments === "polar",
    },
    {
      key: "CORS_ORIGIN",
      value: corsOrigin,
      condition: true,
    },
    {
      key: "GOOGLE_GENERATIVE_AI_API_KEY",
      value: "",
      condition: examples?.includes("ai") || false,
    },
    {
      key: "DATABASE_URL",
      value: databaseUrl,
      condition: database !== "none" && dbSetup === "none",
    },
  ];
}

export function processEnvVariables(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const {
    backend,
    frontend,
    database,
    auth,
    examples,
    dbSetup,
    webDeploy,
    serverDeploy,
    runtime,
    payments,
  } = config;

  const hasReactRouter = frontend.includes("react-router");
  const hasTanStackRouter = frontend.includes("tanstack-router");
  const hasTanStackStart = frontend.includes("tanstack-start");
  const hasNextJs = frontend.includes("next");
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");
  const hasSolid = frontend.includes("solid");
  const hasWebFrontend =
    hasReactRouter ||
    hasTanStackRouter ||
    hasTanStackStart ||
    hasNextJs ||
    hasNuxt ||
    hasSolid ||
    hasSvelte;

  // --- Client App .env ---
  if (hasWebFrontend) {
    const clientDir = "apps/web";
    if (vfs.directoryExists(clientDir)) {
      const envPath = `${clientDir}/.env`;
      const clientVars = buildClientVars(frontend, backend, auth);
      writeEnvFile(vfs, envPath, clientVars);
    }
  }

  // --- Native App .env ---
  if (
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles")
  ) {
    const nativeDir = "apps/native";
    if (vfs.directoryExists(nativeDir)) {
      const envPath = `${nativeDir}/.env`;
      const nativeVars = buildNativeVars(frontend, backend, auth);
      writeEnvFile(vfs, envPath, nativeVars);
    }
  }

  // --- Convex Backend .env.local ---
  if (backend === "convex") {
    const convexBackendDir = "packages/backend";
    if (vfs.directoryExists(convexBackendDir)) {
      const envLocalPath = `${convexBackendDir}/.env.local`;

      // Write comment blocks first
      const commentBlocks = buildConvexCommentBlocks(frontend, auth, examples, payments);
      if (commentBlocks) {
        let currentContent = "";
        if (vfs.exists(envLocalPath)) {
          currentContent = vfs.readFile(envLocalPath) || "";
        }
        vfs.writeFile(envLocalPath, commentBlocks + currentContent);
      }

      // Then add variables
      const convexBackendVars = buildConvexBackendVars(frontend, auth, examples, payments, backend);
      if (convexBackendVars.length > 0) {
        let existingContent = "";
        if (vfs.exists(envLocalPath)) {
          existingContent = vfs.readFile(envLocalPath) || "";
        }
        const contentWithVars = addEnvVariablesToContent(existingContent, convexBackendVars);
        vfs.writeFile(envLocalPath, contentWithVars);
      }
    }
    return;
  }

  // --- Server App .env ---
  const serverVars = buildServerVars(
    backend,
    frontend,
    auth,
    database,
    dbSetup,
    runtime,
    webDeploy,
    serverDeploy,
    payments,
    examples,
  );

  if (backend === "self") {
    const webDir = "apps/web";
    if (vfs.directoryExists(webDir)) {
      const envPath = `${webDir}/.env`;
      writeEnvFile(vfs, envPath, serverVars);
    }
  } else if (vfs.directoryExists("apps/server")) {
    const envPath = "apps/server/.env";
    writeEnvFile(vfs, envPath, serverVars);
  }

  // --- Alchemy Infra .env ---
  const isUnifiedAlchemy = webDeploy === "cloudflare" && serverDeploy === "cloudflare";
  const isIndividualAlchemy = webDeploy === "cloudflare" || serverDeploy === "cloudflare";

  if (isUnifiedAlchemy || isIndividualAlchemy) {
    const infraDir = "packages/infra";
    if (vfs.directoryExists(infraDir)) {
      const envPath = `${infraDir}/.env`;
      const infraAlchemyVars: EnvVariable[] = [
        {
          key: "ALCHEMY_PASSWORD",
          value: "please-change-this",
          condition: true,
        },
      ];
      writeEnvFile(vfs, envPath, infraAlchemyVars);
    }
  }
}
