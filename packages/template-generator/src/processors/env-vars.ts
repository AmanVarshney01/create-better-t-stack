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
  payments: ProjectConfig["payments"],
): EnvVariable[] {
  const hasNextJs = frontend.includes("next");
  const hasReactRouter = frontend.includes("react-router");
  const hasTanStackRouter = frontend.includes("tanstack-router");
  const hasTanStackStart = frontend.includes("tanstack-start");
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");

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

  // Stripe publishable key for client-side
  if (payments === "stripe") {
    let stripeKeyName = "VITE_STRIPE_PUBLISHABLE_KEY";
    if (hasNextJs) stripeKeyName = "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY";
    else if (hasNuxt) stripeKeyName = "NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY";
    else if (hasSvelte) stripeKeyName = "PUBLIC_STRIPE_PUBLISHABLE_KEY";

    vars.push({
      key: stripeKeyName,
      value: "",
      condition: true,
      comment: "Stripe publishable key - get it at https://dashboard.stripe.com/apikeys",
    });
  }

  // Paddle client token for client-side
  if (payments === "paddle") {
    let paddleTokenName = "VITE_PADDLE_CLIENT_TOKEN";
    if (hasNextJs) paddleTokenName = "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN";
    else if (hasNuxt) paddleTokenName = "NUXT_PUBLIC_PADDLE_CLIENT_TOKEN";
    else if (hasSvelte) paddleTokenName = "PUBLIC_PADDLE_CLIENT_TOKEN";

    vars.push(
      {
        key: paddleTokenName,
        value: "",
        condition: true,
        comment: "Paddle client-side token - get it at Paddle > Developer Tools > Authentication",
      },
      {
        key: hasNextJs
          ? "NEXT_PUBLIC_PADDLE_ENVIRONMENT"
          : hasNuxt
            ? "NUXT_PUBLIC_PADDLE_ENVIRONMENT"
            : hasSvelte
              ? "PUBLIC_PADDLE_ENVIRONMENT"
              : "VITE_PADDLE_ENVIRONMENT",
        value: "sandbox",
        condition: true,
        comment: "Paddle environment - use 'sandbox' for testing, 'production' for live",
      },
    );
  }

  // Dodo Payments environment for client-side
  if (payments === "dodo") {
    vars.push({
      key: hasNextJs
        ? "NEXT_PUBLIC_DODO_ENVIRONMENT"
        : hasNuxt
          ? "NUXT_PUBLIC_DODO_ENVIRONMENT"
          : hasSvelte
            ? "PUBLIC_DODO_ENVIRONMENT"
            : "VITE_DODO_ENVIRONMENT",
      value: "test_mode",
      condition: true,
      comment:
        "Dodo Payments environment - use 'test_mode' for testing, 'live_mode' for production",
    });
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

  if (auth === "better-auth") {
    if (hasNative) {
      vars.push({
        key: "EXPO_PUBLIC_CONVEX_SITE_URL",
        value: "",
        condition: true,
        comment: "Same as CONVEX_URL but ends in .site",
      });
    }

    if (hasWeb) {
      vars.push(
        {
          key: hasNextJs ? "NEXT_PUBLIC_CONVEX_SITE_URL" : "VITE_CONVEX_SITE_URL",
          value: "",
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

  return vars;
}

function buildConvexCommentBlocks(
  frontend: string[],
  auth: ProjectConfig["auth"],
  examples: ProjectConfig["examples"],
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
  email: ProjectConfig["email"],
  examples: ProjectConfig["examples"],
  fileUpload: ProjectConfig["fileUpload"],
  logging: ProjectConfig["logging"],
  observability: ProjectConfig["observability"],
  jobQueue: ProjectConfig["jobQueue"],
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
      condition: auth === "better-auth",
    },
    {
      key: "BETTER_AUTH_URL",
      value: backend === "self" ? "http://localhost:3001" : "http://localhost:3000",
      condition: auth === "better-auth",
    },
    {
      key: "AUTH_SECRET",
      value: generateAuthSecret(),
      condition: auth === "nextauth",
      comment: "NextAuth.js secret - generate with: openssl rand -base64 32",
    },
    {
      key: "AUTH_TRUST_HOST",
      value: "true",
      condition: auth === "nextauth",
      comment: "Trust the host header for NextAuth",
    },
    {
      key: "AUTH_GITHUB_ID",
      value: "",
      condition: auth === "nextauth",
      comment: "GitHub OAuth App Client ID (optional)",
    },
    {
      key: "AUTH_GITHUB_SECRET",
      value: "",
      condition: auth === "nextauth",
      comment: "GitHub OAuth App Client Secret (optional)",
    },
    {
      key: "AUTH_GOOGLE_ID",
      value: "",
      condition: auth === "nextauth",
      comment: "Google OAuth Client ID (optional)",
    },
    {
      key: "AUTH_GOOGLE_SECRET",
      value: "",
      condition: auth === "nextauth",
      comment: "Google OAuth Client Secret (optional)",
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
      key: "STRIPE_SECRET_KEY",
      value: "",
      condition: payments === "stripe",
      comment: "Stripe secret key - get it at https://dashboard.stripe.com/apikeys",
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      value: "",
      condition: payments === "stripe",
      comment: "Stripe webhook signing secret - get it when creating a webhook endpoint",
    },
    {
      key: "LEMONSQUEEZY_API_KEY",
      value: "",
      condition: payments === "lemon-squeezy",
      comment: "Lemon Squeezy API key - get it at Settings > API in your dashboard",
    },
    {
      key: "LEMONSQUEEZY_STORE_ID",
      value: "",
      condition: payments === "lemon-squeezy",
      comment: "Lemon Squeezy Store ID - found in your store settings",
    },
    {
      key: "LEMONSQUEEZY_WEBHOOK_SECRET",
      value: "",
      condition: payments === "lemon-squeezy",
      comment: "Lemon Squeezy webhook signing secret - get it when creating a webhook",
    },
    {
      key: "PADDLE_API_KEY",
      value: "",
      condition: payments === "paddle",
      comment: "Paddle API key - get it at Paddle > Developer Tools > Authentication",
    },
    {
      key: "PADDLE_WEBHOOK_SECRET",
      value: "",
      condition: payments === "paddle",
      comment: "Paddle webhook secret key - get it when creating a notification destination",
    },
    {
      key: "PADDLE_ENVIRONMENT",
      value: "sandbox",
      condition: payments === "paddle",
      comment: "Paddle environment - use 'sandbox' for testing, 'production' for live",
    },
    {
      key: "DODO_PAYMENTS_API_KEY",
      value: "",
      condition: payments === "dodo",
      comment: "Dodo Payments API key - get it at https://dashboard.dodopayments.com",
    },
    {
      key: "DODO_PAYMENTS_WEBHOOK_SECRET",
      value: "",
      condition: payments === "dodo",
      comment: "Dodo Payments webhook secret - get it when creating a webhook endpoint",
    },
    {
      key: "DODO_PAYMENTS_ENVIRONMENT",
      value: "test_mode",
      condition: payments === "dodo",
      comment:
        "Dodo Payments environment - use 'test_mode' for testing, 'live_mode' for production",
    },
    {
      key: "RESEND_API_KEY",
      value: "",
      condition: email === "resend",
      comment: "Resend API key - get it at https://resend.com",
    },
    {
      key: "RESEND_FROM_EMAIL",
      value: "onboarding@resend.dev",
      condition: email === "resend",
      comment: "Email address to send from (must be verified in Resend)",
    },
    {
      key: "SMTP_HOST",
      value: "smtp.ethereal.email",
      condition: email === "nodemailer",
      comment: "SMTP server host - use smtp.ethereal.email for testing",
    },
    {
      key: "SMTP_PORT",
      value: "587",
      condition: email === "nodemailer",
      comment: "SMTP server port (587 for TLS, 465 for SSL)",
    },
    {
      key: "SMTP_SECURE",
      value: "false",
      condition: email === "nodemailer",
      comment: "Use SSL/TLS (true for port 465, false for 587)",
    },
    {
      key: "SMTP_USER",
      value: "",
      condition: email === "nodemailer",
      comment: "SMTP username/email",
    },
    {
      key: "SMTP_PASS",
      value: "",
      condition: email === "nodemailer",
      comment: "SMTP password or app-specific password",
    },
    {
      key: "SMTP_FROM_EMAIL",
      value: "noreply@example.com",
      condition: email === "nodemailer",
      comment: "Default from email address",
    },
    {
      key: "POSTMARK_SERVER_TOKEN",
      value: "",
      condition: email === "postmark",
      comment: "Postmark Server API Token - get it at https://postmarkapp.com",
    },
    {
      key: "POSTMARK_FROM_EMAIL",
      value: "noreply@example.com",
      condition: email === "postmark",
      comment: "Email address to send from (must have verified sender signature in Postmark)",
    },
    {
      key: "SENDGRID_API_KEY",
      value: "",
      condition: email === "sendgrid",
      comment:
        "SendGrid API key - get it at https://sendgrid.com/docs/ui/account-and-settings/api-keys/",
    },
    {
      key: "SENDGRID_FROM_EMAIL",
      value: "noreply@example.com",
      condition: email === "sendgrid",
      comment: "Email address to send from (must be verified in SendGrid)",
    },
    {
      key: "AWS_REGION",
      value: "us-east-1",
      condition: email === "aws-ses",
      comment: "AWS region for SES (e.g., us-east-1, eu-west-1)",
    },
    {
      key: "AWS_ACCESS_KEY_ID",
      value: "",
      condition: email === "aws-ses",
      comment: "AWS access key ID - get it at https://console.aws.amazon.com/iam",
    },
    {
      key: "AWS_SECRET_ACCESS_KEY",
      value: "",
      condition: email === "aws-ses",
      comment: "AWS secret access key",
    },
    {
      key: "AWS_SES_FROM_EMAIL",
      value: "noreply@example.com",
      condition: email === "aws-ses",
      comment: "Email address to send from (must be verified in AWS SES)",
    },
    {
      key: "MAILGUN_API_KEY",
      value: "",
      condition: email === "mailgun",
      comment: "Mailgun API key - get it at https://app.mailgun.com/app/account/security/api_keys",
    },
    {
      key: "MAILGUN_DOMAIN",
      value: "",
      condition: email === "mailgun",
      comment: "Mailgun sending domain (e.g., mg.yourdomain.com)",
    },
    {
      key: "MAILGUN_FROM_EMAIL",
      value: "noreply@example.com",
      condition: email === "mailgun",
      comment: "Email address to send from (must be authorized in Mailgun)",
    },
    {
      key: "PLUNK_API_KEY",
      value: "",
      condition: email === "plunk",
      comment: "Plunk secret API key - get it at https://app.useplunk.com",
    },
    {
      key: "PLUNK_FROM_EMAIL",
      value: "noreply@example.com",
      condition: email === "plunk",
      comment: "Email address to send from",
    },
    {
      key: "UPLOADTHING_TOKEN",
      value: "",
      condition: fileUpload === "uploadthing",
      comment: "UploadThing token - get it at https://uploadthing.com/dashboard",
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
    {
      key: "LOG_LEVEL",
      value: "info",
      condition: logging === "pino",
      comment: "Pino log level - trace, debug, info, warn, error, or fatal",
    },
    {
      key: "OTEL_SERVICE_NAME",
      value: "",
      condition: observability === "opentelemetry",
      comment: "OpenTelemetry service name (defaults to project name if not set)",
    },
    {
      key: "OTEL_EXPORTER_OTLP_ENDPOINT",
      value: "http://localhost:4318",
      condition: observability === "opentelemetry",
      comment: "OTLP exporter endpoint (Jaeger, OTEL Collector, Tempo, etc.)",
    },
    {
      key: "REDIS_HOST",
      value: "localhost",
      condition: jobQueue === "bullmq",
      comment: "Redis host for BullMQ job queue",
    },
    {
      key: "REDIS_PORT",
      value: "6379",
      condition: jobQueue === "bullmq",
      comment: "Redis port for BullMQ job queue",
    },
    {
      key: "REDIS_PASSWORD",
      value: "",
      condition: jobQueue === "bullmq",
      comment: "Redis password (optional, leave empty for local development)",
    },
  ];
}

export function processEnvVariables(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const {
    backend,
    frontend,
    database,
    auth,
    email,
    examples,
    dbSetup,
    webDeploy,
    serverDeploy,
    runtime,
    payments,
    fileUpload,
    logging,
    observability,
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
      const clientVars = buildClientVars(frontend, backend, auth, payments);
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
      const commentBlocks = buildConvexCommentBlocks(frontend, auth, examples);
      if (commentBlocks) {
        let currentContent = "";
        if (vfs.exists(envLocalPath)) {
          currentContent = vfs.readFile(envLocalPath) || "";
        }
        vfs.writeFile(envLocalPath, commentBlocks + currentContent);
      }

      // Then add variables
      const convexBackendVars = buildConvexBackendVars(frontend, auth, examples);
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
    email,
    examples,
    fileUpload,
    logging,
    observability,
    config.jobQueue,
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
