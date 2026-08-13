import type { ProjectConfig } from "@better-t-stack/types";

import type { AlchemyDeploymentPlan, DeployedWebFramework } from "./plan";

function hasExample(
  plan: AlchemyDeploymentPlan,
  example: ProjectConfig["examples"][number],
): boolean {
  return plan.config.examples.includes(example);
}

export function databaseBindingEntries(plan: AlchemyDeploymentPlan): string[] {
  const { config } = plan;

  if (config.dbSetup === "d1") return ["DB: db,"];
  if (plan.hasAlchemyManagedDatabase) return ["...databaseBindings,"];
  if (config.database === "mysql" && config.orm === "drizzle" && config.dbSetup === "planetscale") {
    return [
      'DATABASE_HOST: Config.string("DATABASE_HOST"),',
      'DATABASE_USERNAME: Config.string("DATABASE_USERNAME"),',
      'DATABASE_PASSWORD: Config.redacted("DATABASE_PASSWORD"),',
    ];
  }
  if (config.database !== "none") return ['DATABASE_URL: Config.redacted("DATABASE_URL"),'];
  return [];
}

function commonRuntimeEntries(plan: AlchemyDeploymentPlan, includeCorsOrigin = true): string[] {
  const { auth, dbSetup, payments } = plan.config;
  const entries = [...databaseBindingEntries(plan)];

  if (includeCorsOrigin) {
    entries.push('CORS_ORIGIN: Config.string("CORS_ORIGIN"),');
  }

  if (auth === "better-auth") {
    entries.push(
      'BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET"),',
      "BETTER_AUTH_URL: Cloudflare.Worker.URL,",
    );
  }
  if (hasExample(plan, "ai")) {
    entries.push('GOOGLE_GENERATIVE_AI_API_KEY: Config.redacted("GOOGLE_GENERATIVE_AI_API_KEY"),');
  }
  if (payments === "polar") {
    entries.push(
      'POLAR_ACCESS_TOKEN: Config.redacted("POLAR_ACCESS_TOKEN"),',
      'POLAR_SUCCESS_URL: Config.string("POLAR_SUCCESS_URL"),',
    );
  }
  if (dbSetup === "turso") {
    entries.push('DATABASE_AUTH_TOKEN: Config.redacted("DATABASE_AUTH_TOKEN"),');
  }

  return entries;
}

export function cloudflareServerEnvEntries(plan: AlchemyDeploymentPlan): string[] {
  const { api, auth, backend } = plan.config;
  const entries = commonRuntimeEntries(plan);

  if (auth === "clerk") {
    const insertAt = entries.findIndex(
      (entry) => entry.startsWith("GOOGLE_") || entry.startsWith("POLAR_"),
    );
    const clerkEntries = ['CLERK_SECRET_KEY: Config.redacted("CLERK_SECRET_KEY"),'];
    if (api !== "none" && ["self", "hono", "elysia"].includes(backend)) {
      clerkEntries.push('CLERK_PUBLISHABLE_KEY: Config.string("CLERK_PUBLISHABLE_KEY"),');
    }
    entries.splice(insertAt === -1 ? entries.length : insertAt, 0, ...clerkEntries);
  }

  return entries;
}

export function prismaServerEnvEntries(plan: AlchemyDeploymentPlan): string[] {
  const { api, auth, backend, dbSetup, payments } = plan.config;
  const entries = ["...resolvedDatabaseEnv,", 'CORS_ORIGIN: Config.string("CORS_ORIGIN"),'];

  if (auth === "better-auth") {
    entries.push(
      'BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET"),',
      'BETTER_AUTH_URL: Config.string("BETTER_AUTH_URL"),',
    );
  }
  if (auth === "clerk") {
    entries.push('CLERK_SECRET_KEY: Config.redacted("CLERK_SECRET_KEY"),');
    if (
      ["express", "fastify"].includes(backend) ||
      (api !== "none" && ["hono", "elysia"].includes(backend))
    ) {
      entries.push('CLERK_PUBLISHABLE_KEY: Config.string("CLERK_PUBLISHABLE_KEY"),');
    }
  }
  if (hasExample(plan, "ai")) {
    entries.push('GOOGLE_GENERATIVE_AI_API_KEY: Config.redacted("GOOGLE_GENERATIVE_AI_API_KEY"),');
  }
  if (payments === "polar") {
    entries.push(
      'POLAR_ACCESS_TOKEN: Config.redacted("POLAR_ACCESS_TOKEN"),',
      'POLAR_SUCCESS_URL: Config.string("POLAR_SUCCESS_URL"),',
    );
  }
  if (dbSetup === "turso") {
    entries.push('DATABASE_AUTH_TOKEN: Config.redacted("DATABASE_AUTH_TOKEN"),');
  }

  return entries;
}

export function selfCloudflareWebEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { api, auth } = plan.config;
  const entries: string[] = [];

  if (framework === "next") entries.push("IMAGES: Cloudflare.Images.Images(),");
  if (framework === "astro") {
    entries.push(
      'SESSION: Cloudflare.KV.Namespace("session"),',
      "IMAGES: Cloudflare.Images.Images(),",
    );
  }

  entries.push(...commonRuntimeEntries(plan, false));

  if (auth === "clerk" && ["next", "solid", "tanstack-start"].includes(framework)) {
    const insertAt = entries.findIndex(
      (entry) => entry.startsWith("GOOGLE_") || entry.startsWith("POLAR_"),
    );
    const clerkEntries = ['CLERK_SECRET_KEY: Config.redacted("CLERK_SECRET_KEY"),'];
    if (api !== "none") {
      clerkEntries.push('CLERK_PUBLISHABLE_KEY: Config.string("CLERK_PUBLISHABLE_KEY"),');
    }
    clerkEntries.push(
      framework === "next"
        ? 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Config.string("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),'
        : 'VITE_CLERK_PUBLISHABLE_KEY: Config.string("VITE_CLERK_PUBLISHABLE_KEY"),',
    );
    entries.splice(insertAt === -1 ? entries.length : insertAt, 0, ...clerkEntries);
  }

  return entries;
}

function prismaPublicEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { auth, backend } = plan.config;
  const deployedUrl = plan.server.target === "none" ? undefined : "deployedServer.url";
  const entries: string[] = [];

  if (framework === "next") {
    if (backend === "convex") {
      entries.push('NEXT_PUBLIC_CONVEX_URL: Config.string("NEXT_PUBLIC_CONVEX_URL"),');
      if (auth === "better-auth") {
        entries.push('NEXT_PUBLIC_CONVEX_SITE_URL: Config.string("NEXT_PUBLIC_CONVEX_SITE_URL"),');
      }
    } else if (backend !== "self") {
      entries.push(
        `NEXT_PUBLIC_SERVER_URL: ${deployedUrl ?? 'Config.string("NEXT_PUBLIC_SERVER_URL")'},`,
      );
    }
    if (auth === "clerk") {
      entries.push(
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Config.string("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),',
      );
    }
    return entries;
  }

  if (framework === "nuxt") {
    if (backend === "convex") {
      entries.push('NUXT_PUBLIC_CONVEX_URL: Config.string("NUXT_PUBLIC_CONVEX_URL"),');
      if (auth === "better-auth") {
        entries.push('NUXT_PUBLIC_CONVEX_SITE_URL: Config.string("NUXT_PUBLIC_CONVEX_SITE_URL"),');
      }
    } else if (backend !== "self") {
      entries.push(
        `NUXT_PUBLIC_SERVER_URL: ${deployedUrl ?? 'Config.string("NUXT_PUBLIC_SERVER_URL")'},`,
      );
    }
    return entries;
  }

  if (framework === "astro") {
    if (backend !== "self") {
      entries.push(`PUBLIC_SERVER_URL: ${deployedUrl ?? 'Config.string("PUBLIC_SERVER_URL")'},`);
    }
    return entries;
  }

  if (backend === "convex") {
    entries.push('VITE_CONVEX_URL: Config.string("VITE_CONVEX_URL"),');
    if (auth === "better-auth") {
      entries.push('VITE_CONVEX_SITE_URL: Config.string("VITE_CONVEX_SITE_URL"),');
    }
  } else if (backend !== "self") {
    entries.push(`VITE_SERVER_URL: ${deployedUrl ?? 'Config.string("VITE_SERVER_URL")'},`);
  }
  if (auth === "clerk") {
    entries.push('VITE_CLERK_PUBLISHABLE_KEY: Config.string("VITE_CLERK_PUBLISHABLE_KEY"),');
  }
  return entries;
}

export function prismaWebEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { api, auth, dbSetup, payments } = plan.config;
  const entries: string[] = [];

  if (plan.web.target !== "none" && plan.web.topology === "self") {
    entries.push("...resolvedDatabaseEnv,");
    if (auth === "better-auth") {
      entries.push(
        'BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET"),',
        'BETTER_AUTH_URL: Config.string("BETTER_AUTH_URL"),',
      );
    }
    if (auth === "clerk") {
      entries.push('CLERK_SECRET_KEY: Config.redacted("CLERK_SECRET_KEY"),');
      if (api !== "none") {
        entries.push('CLERK_PUBLISHABLE_KEY: Config.string("CLERK_PUBLISHABLE_KEY"),');
      }
    }
    if (hasExample(plan, "ai")) {
      entries.push(
        'GOOGLE_GENERATIVE_AI_API_KEY: Config.redacted("GOOGLE_GENERATIVE_AI_API_KEY"),',
      );
    }
    if (payments === "polar") {
      entries.push(
        'POLAR_ACCESS_TOKEN: Config.redacted("POLAR_ACCESS_TOKEN"),',
        'POLAR_SUCCESS_URL: Config.string("POLAR_SUCCESS_URL"),',
      );
    }
    if (dbSetup === "turso") {
      entries.push('DATABASE_AUTH_TOKEN: Config.redacted("DATABASE_AUTH_TOKEN"),');
    }
  }

  entries.push(...prismaPublicEnvEntries(plan, framework));
  return entries;
}

export function splitCloudflareWebEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { auth, backend } = plan.config;
  const serverValue = plan.server.target === "none" ? undefined : "serverWorker.url.as<string>()";
  const entries: string[] = [];

  if (framework === "next") entries.push("IMAGES: Cloudflare.Images.Images(),");
  if (framework === "astro") {
    entries.push(
      'SESSION: Cloudflare.KV.Namespace("session"),',
      "IMAGES: Cloudflare.Images.Images(),",
      `PUBLIC_SERVER_URL: ${serverValue ?? 'Config.string("PUBLIC_SERVER_URL")'},`,
    );
    return entries;
  }

  const prefix =
    framework === "next"
      ? "NEXT_PUBLIC"
      : framework === "nuxt"
        ? "NUXT_PUBLIC"
        : framework === "svelte"
          ? "PUBLIC"
          : "VITE";
  if (backend === "convex") {
    entries.push(`${prefix}_CONVEX_URL: Config.string("${prefix}_CONVEX_URL"),`);
    if (auth === "better-auth") {
      entries.push(`${prefix}_CONVEX_SITE_URL: Config.string("${prefix}_CONVEX_SITE_URL"),`);
    }
  } else {
    entries.push(
      `${prefix}_SERVER_URL: ${serverValue ?? `Config.string("${prefix}_SERVER_URL")`},`,
    );
  }

  if (auth === "clerk" && ["next", "tanstack-start", "react-router"].includes(framework)) {
    entries.push('CLERK_SECRET_KEY: Config.redacted("CLERK_SECRET_KEY"),');
    entries.push(
      framework === "next"
        ? 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Config.string("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),'
        : 'VITE_CLERK_PUBLISHABLE_KEY: Config.string("VITE_CLERK_PUBLISHABLE_KEY"),',
    );
  }

  return entries;
}
