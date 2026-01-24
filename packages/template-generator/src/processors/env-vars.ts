import type { ProjectConfig } from "@better-fullstack/types";

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
  featureFlags: ProjectConfig["featureFlags"],
  analytics: ProjectConfig["analytics"],
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

  // GrowthBook feature flags client-side
  if (featureFlags === "growthbook") {
    let apiHostName = "VITE_GROWTHBOOK_API_HOST";
    let clientKeyName = "VITE_GROWTHBOOK_CLIENT_KEY";

    if (hasNextJs) {
      apiHostName = "NEXT_PUBLIC_GROWTHBOOK_API_HOST";
      clientKeyName = "NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY";
    } else if (hasNuxt) {
      apiHostName = "NUXT_PUBLIC_GROWTHBOOK_API_HOST";
      clientKeyName = "NUXT_PUBLIC_GROWTHBOOK_CLIENT_KEY";
    } else if (hasSvelte) {
      apiHostName = "PUBLIC_GROWTHBOOK_API_HOST";
      clientKeyName = "PUBLIC_GROWTHBOOK_CLIENT_KEY";
    }

    vars.push(
      {
        key: apiHostName,
        value: "https://cdn.growthbook.io",
        condition: true,
        comment: "GrowthBook API host URL",
      },
      {
        key: clientKeyName,
        value: "",
        condition: true,
        comment: "GrowthBook SDK connection client key from dashboard",
      },
    );
  }

  // PostHog feature flags + analytics client-side
  if (featureFlags === "posthog") {
    let posthogKeyName = "VITE_POSTHOG_KEY";
    let posthogHostName = "VITE_POSTHOG_HOST";

    if (hasNextJs) {
      posthogKeyName = "NEXT_PUBLIC_POSTHOG_KEY";
      posthogHostName = "NEXT_PUBLIC_POSTHOG_HOST";
    } else if (hasNuxt) {
      posthogKeyName = "NUXT_PUBLIC_POSTHOG_KEY";
      posthogHostName = "NUXT_PUBLIC_POSTHOG_HOST";
    } else if (hasSvelte) {
      posthogKeyName = "PUBLIC_POSTHOG_KEY";
      posthogHostName = "PUBLIC_POSTHOG_HOST";
    }

    vars.push(
      {
        key: posthogKeyName,
        value: "",
        condition: true,
        comment: "PostHog project API key - get it at https://app.posthog.com/project/settings",
      },
      {
        key: posthogHostName,
        value: "https://us.i.posthog.com",
        condition: true,
        comment: "PostHog API host (use https://eu.i.posthog.com for EU region)",
      },
    );
  }

  // Plausible analytics client-side
  if (analytics === "plausible") {
    let plausibleDomainName = "VITE_PLAUSIBLE_DOMAIN";
    let plausibleApiHostName = "VITE_PLAUSIBLE_API_HOST";

    if (hasNextJs) {
      plausibleDomainName = "NEXT_PUBLIC_PLAUSIBLE_DOMAIN";
      plausibleApiHostName = "NEXT_PUBLIC_PLAUSIBLE_API_HOST";
    } else if (hasNuxt) {
      plausibleDomainName = "NUXT_PUBLIC_PLAUSIBLE_DOMAIN";
      plausibleApiHostName = "NUXT_PUBLIC_PLAUSIBLE_API_HOST";
    } else if (hasSvelte) {
      plausibleDomainName = "PUBLIC_PLAUSIBLE_DOMAIN";
      plausibleApiHostName = "PUBLIC_PLAUSIBLE_API_HOST";
    }

    vars.push(
      {
        key: plausibleDomainName,
        value: "",
        condition: true,
        comment: "Your website domain for Plausible (e.g., example.com)",
      },
      {
        key: plausibleApiHostName,
        value: "https://plausible.io",
        condition: true,
        comment: "Plausible API host (change if self-hosting)",
      },
    );
  }

  // Umami analytics client-side
  if (analytics === "umami") {
    let umamiWebsiteIdName = "VITE_UMAMI_WEBSITE_ID";
    let umamiScriptUrlName = "VITE_UMAMI_SCRIPT_URL";

    if (hasNextJs) {
      umamiWebsiteIdName = "NEXT_PUBLIC_UMAMI_WEBSITE_ID";
      umamiScriptUrlName = "NEXT_PUBLIC_UMAMI_SCRIPT_URL";
    } else if (hasNuxt) {
      umamiWebsiteIdName = "NUXT_PUBLIC_UMAMI_WEBSITE_ID";
      umamiScriptUrlName = "NUXT_PUBLIC_UMAMI_SCRIPT_URL";
    } else if (hasSvelte) {
      umamiWebsiteIdName = "PUBLIC_UMAMI_WEBSITE_ID";
      umamiScriptUrlName = "PUBLIC_UMAMI_SCRIPT_URL";
    }

    vars.push(
      {
        key: umamiWebsiteIdName,
        value: "",
        condition: true,
        comment: "Your Umami website ID (get it from your Umami dashboard)",
      },
      {
        key: umamiScriptUrlName,
        value: "https://cloud.umami.is/script.js",
        condition: true,
        comment: "Umami script URL (change if self-hosting)",
      },
    );
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
  featureFlags: ProjectConfig["featureFlags"],
  jobQueue: ProjectConfig["jobQueue"],
  caching: ProjectConfig["caching"],
  search: ProjectConfig["search"],
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
      case "edgedb":
        // EdgeDB uses its own connection mechanism via edgedb.toml or EDGEDB_DSN
        databaseUrl = "edgedb://localhost:5656/edgedb";
        break;
      case "redis":
        // Redis uses REDIS_URL for connection
        databaseUrl = "redis://localhost:6379";
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
      key: "NEXT_PUBLIC_STACK_PROJECT_ID",
      value: "",
      condition: auth === "stack-auth",
      comment: "Stack Auth Project ID - get it at https://app.stack-auth.com",
    },
    {
      key: "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY",
      value: "",
      condition: auth === "stack-auth",
      comment: "Stack Auth Publishable Client Key - get it at https://app.stack-auth.com",
    },
    {
      key: "STACK_SECRET_SERVER_KEY",
      value: "",
      condition: auth === "stack-auth",
      comment: "Stack Auth Secret Server Key - get it at https://app.stack-auth.com",
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      value: "",
      condition: auth === "supabase-auth",
      comment: "Supabase Project URL - get it at https://supabase.com/dashboard",
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: "",
      condition: auth === "supabase-auth",
      comment: "Supabase Anon/Public Key - get it at https://supabase.com/dashboard",
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      value: "",
      condition: auth === "supabase-auth",
      comment:
        "Supabase Service Role Key (server-side only) - get it at https://supabase.com/dashboard",
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
      key: "SENTRY_DSN",
      value: "",
      condition: observability === "sentry",
      comment: "Sentry DSN from your project settings",
    },
    {
      key: "SENTRY_ENVIRONMENT",
      value: "development",
      condition: observability === "sentry",
      comment: "Sentry environment (development, staging, production)",
    },
    {
      key: "SENTRY_TRACES_SAMPLE_RATE",
      value: "1.0",
      condition: observability === "sentry",
      comment: "Sentry traces sample rate 0.0-1.0 (reduce in production)",
    },
    {
      key: "SENTRY_PROFILES_SAMPLE_RATE",
      value: "0.1",
      condition: observability === "sentry",
      comment: "Sentry profiles sample rate 0.0-1.0",
    },
    {
      key: "METRICS_PORT",
      value: "9090",
      condition: observability === "grafana",
      comment: "Port for Prometheus metrics endpoint (scraped by Grafana)",
    },
    {
      key: "METRICS_PATH",
      value: "/metrics",
      condition: observability === "grafana",
      comment: "Path for Prometheus metrics endpoint",
    },
    {
      key: "METRICS_PREFIX",
      value: "",
      condition: observability === "grafana",
      comment: "Prefix for all metric names (optional, defaults to app name)",
    },
    {
      key: "GROWTHBOOK_API_HOST",
      value: "https://cdn.growthbook.io",
      condition: featureFlags === "growthbook",
      comment: "GrowthBook API host URL",
    },
    {
      key: "GROWTHBOOK_CLIENT_KEY",
      value: "",
      condition: featureFlags === "growthbook",
      comment: "GrowthBook SDK connection client key",
    },
    {
      key: "POSTHOG_API_KEY",
      value: "",
      condition: featureFlags === "posthog",
      comment: "PostHog project API key - get it at https://app.posthog.com/project/settings",
    },
    {
      key: "POSTHOG_HOST",
      value: "https://us.i.posthog.com",
      condition: featureFlags === "posthog",
      comment: "PostHog API host (use https://eu.i.posthog.com for EU region)",
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
    {
      key: "TRIGGER_SECRET_KEY",
      value: "",
      condition: jobQueue === "trigger-dev",
      comment: "Trigger.dev secret key (from dashboard.trigger.dev)",
    },
    {
      key: "TRIGGER_PROJECT_ID",
      value: "",
      condition: jobQueue === "trigger-dev",
      comment: "Trigger.dev project ID (e.g., proj_xxxxxxxxxxxx)",
    },
    {
      key: "INNGEST_EVENT_KEY",
      value: "",
      condition: jobQueue === "inngest",
      comment: "Inngest Event Key (from app.inngest.com)",
    },
    {
      key: "INNGEST_SIGNING_KEY",
      value: "",
      condition: jobQueue === "inngest",
      comment: "Inngest Signing Key for webhook verification",
    },
    {
      key: "TEMPORAL_ADDRESS",
      value: "localhost:7233",
      condition: jobQueue === "temporal",
      comment: "Temporal server address (default: localhost:7233)",
    },
    {
      key: "TEMPORAL_NAMESPACE",
      value: "default",
      condition: jobQueue === "temporal",
      comment: "Temporal namespace (default: 'default')",
    },
    {
      key: "TEMPORAL_TASK_QUEUE",
      value: "",
      condition: jobQueue === "temporal",
      comment: "Temporal task queue name (defaults to project name if not set)",
    },
    {
      key: "UPSTASH_REDIS_REST_URL",
      value: "",
      condition: caching === "upstash-redis",
      comment: "Upstash Redis REST URL - get it at https://console.upstash.com",
    },
    {
      key: "UPSTASH_REDIS_REST_TOKEN",
      value: "",
      condition: caching === "upstash-redis",
      comment: "Upstash Redis REST token - get it at https://console.upstash.com",
    },
    {
      key: "MEILISEARCH_HOST",
      value: "http://localhost:7700",
      condition: search === "meilisearch",
      comment: "Meilisearch host URL - default for local development",
    },
    {
      key: "MEILISEARCH_API_KEY",
      value: "",
      condition: search === "meilisearch",
      comment: "Meilisearch API key (master key for development, search key for production)",
    },
  ];
}

function buildCMSVars(cms: ProjectConfig["cms"]): EnvVariable[] {
  const vars: EnvVariable[] = [];

  if (cms === "payload") {
    vars.push({
      key: "PAYLOAD_SECRET",
      value: generateRandomString(
        32,
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      ),
      condition: true,
      comment: "Payload CMS secret - used for encryption",
    });
  }

  if (cms === "sanity") {
    vars.push(
      {
        key: "NEXT_PUBLIC_SANITY_PROJECT_ID",
        value: "your-project-id",
        condition: true,
        comment: "Sanity project ID - get from sanity.io/manage",
      },
      {
        key: "NEXT_PUBLIC_SANITY_DATASET",
        value: "production",
        condition: true,
        comment: "Sanity dataset name",
      },
      {
        key: "NEXT_PUBLIC_SANITY_API_VERSION",
        value: new Date().toISOString().split("T")[0],
        condition: true,
        comment: "Sanity API version (YYYY-MM-DD format)",
      },
      {
        key: "SANITY_API_READ_TOKEN",
        value: "",
        condition: true,
        comment: "Sanity API read token for server-side operations (optional)",
      },
    );
  }

  return vars;
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
      const clientVars = buildClientVars(
        frontend,
        backend,
        auth,
        payments,
        config.featureFlags,
        config.analytics,
      );
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
    config.featureFlags,
    config.jobQueue,
    config.caching,
    config.search,
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

  // --- CMS .env (Payload and Sanity require Next.js and add vars to web/.env) ---
  if ((config.cms === "payload" || config.cms === "sanity") && hasNextJs) {
    const webDir = "apps/web";
    if (vfs.directoryExists(webDir)) {
      const envPath = `${webDir}/.env`;
      const cmsVars = buildCMSVars(config.cms);
      writeEnvFile(vfs, envPath, cmsVars);
    }
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
