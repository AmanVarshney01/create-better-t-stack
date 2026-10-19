import type { CreateInput } from "../../src";

export type PackageManager = NonNullable<CreateInput["packageManager"]>;

/**
 * Checks beyond install, typecheck and build that a sample opts into by name.
 * Checks that follow from the stack itself (PWA, Solid, Axiom, Prisma hosting,
 * Clerk on TanStack Start, oRPC types) run for every sample whose config needs them.
 */
export type SampleCheck =
  /** Run `auth:generate` and keep the generated Better Auth schema in the build. */
  | "auth-generate"
  /** Boot TanStack Start and exercise sign-up, sessions and protected routes. */
  | "start-auth-runtime"
  /** Boot Nuxt and check server-rendered sessions and private oRPC calls. */
  | "nuxt-auth-runtime"
  /** Boot the built Astro site and check its pages and assets. */
  | "astro-website"
  /** Boot the built Solid app and check rendering and RPC calls. */
  | "solid-runtime"
  /** Boot the Solid dev server and check it serves the app. */
  | "solid-dev-runtime"
  /** Typecheck the scaffold as generated, without the oRPC inference fixtures. */
  | "scaffold-types-only";

type BuildSample = {
  name: string;
  packageManagers?: readonly PackageManager[];
  checks?: readonly SampleCheck[];
  config: Omit<CreateInput, "packageManager" | "projectName">;
};

export type SelectedBuildSample = {
  name: string;
  packageManager: PackageManager;
  checks: readonly SampleCheck[];
  config: Omit<CreateInput, "projectName">;
};

const baseConfig = {
  git: false,
  install: false,
  dbSetup: "none",
  webDeploy: "none",
  serverDeploy: "none",
  directoryConflict: "overwrite",
  disableAnalytics: true,
} satisfies Partial<CreateInput>;

const buildSamples: BuildSample[] = [
  {
    name: "react-router-server-auth-polar-types",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["react-router"],
      backend: "hono",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: [],
      examples: [],
      webDeploy: "docker",
      serverDeploy: "docker",
    },
  },
  {
    name: "svelte-server-auth-polar-types",
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["svelte"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: [],
      examples: [],
    },
  },
  ...(["native-bare", "native-uniwind", "native-unistyles"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-polar-types`,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "hono",
          runtime: "node",
          database: "sqlite",
          orm: "drizzle",
          api: "orpc",
          auth: "better-auth",
          payments: "polar",
          addons: [],
          examples: ["todo"],
        },
      }) satisfies BuildSample,
  ),
  ...(["react-router", "nuxt", "svelte"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-polar-types`,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "hono",
          runtime: "node",
          database: "sqlite",
          orm: "drizzle",
          api: "orpc",
          auth: "better-auth",
          payments: "polar",
          addons: [],
          examples: ["todo"],
        },
      }) satisfies BuildSample,
  ),
  {
    name: "next-self-orpc-prisma-polar",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["none"],
      examples: ["todo"],
    },
  },
  {
    name: "expo-orpc-auth-todo",
    config: {
      ...baseConfig,
      frontend: ["native-bare"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["none"],
      examples: ["todo"],
    },
  },
  {
    name: "tanstack-start-self-auth-todo",
    checks: ["auth-generate", "start-auth-runtime"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["none"],
      examples: ["todo"],
      webDeploy: "docker",
    },
  },
  {
    name: "tanstack-start-axiom-pnpm",
    packageManagers: ["pnpm"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "self",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["axiom"],
      examples: [],
    },
  },
  ...(["nuxt", "tanstack-start"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-axiom`,
        packageManagers: ["bun"] as const,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "self",
          runtime: "none",
          database: "none",
          orm: "none",
          api: "none",
          auth: "none",
          payments: "none",
          addons: ["axiom", "vite-plus"],
          examples: [],
          webDeploy: "docker",
        },
      }) satisfies BuildSample,
  ),
  ...(["tanstack-router", "react-router", "next"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-pwa`,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "none",
          runtime: "none",
          database: "none",
          orm: "none",
          api: "none",
          auth: "none",
          payments: "none",
          addons: ["pwa"],
          examples: [],
        },
      }) satisfies BuildSample,
  ),
  ...(["astro"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-frontend-only`,
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "none",
          runtime: "none",
          database: "none",
          orm: "none",
          api: "none",
          auth: "none",
          payments: "none",
          addons: ["none"],
          examples: [],
        },
      }) satisfies BuildSample,
  ),
  ...(["svelte", "nuxt", "next", "native-bare", "native-uniwind", "native-unistyles"] as const).map(
    (frontend) =>
      ({
        name: `${frontend}-auth-todo-ai`,
        checks: frontend === "nuxt" ? ["nuxt-auth-runtime"] : [],
        config: {
          ...baseConfig,
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          api: frontend === "next" ? "trpc" : "orpc",
          auth: "better-auth",
          payments: "none",
          addons: ["turborepo"],
          examples: ["todo", "ai"],
        },
      }) satisfies BuildSample,
  ),
  {
    name: "react-convex-ai",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["ai"],
    },
  },

  {
    name: "hono-trpc-drizzle-todo",
    packageManagers: ["bun", "npm", "pnpm"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "next-self-prisma",
    checks: ["auth-generate"],
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      api: "trpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "tanstack-start-prisma-compute-artifact",
    checks: ["scaffold-types-only"],
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "self",
      runtime: "none",
      database: "none",
      orm: "none",
      webDeploy: "prisma",
      auth: "none",
      api: "orpc",
      payments: "none",
      addons: [],
      examples: [],
    },
  },
  {
    name: "astro-prisma-compute-artifact",
    checks: ["scaffold-types-only", "astro-website"],
    packageManagers: ["bun"],
    config: {
      ...baseConfig,
      frontend: ["astro"],
      backend: "self",
      runtime: "none",
      database: "none",
      orm: "none",
      webDeploy: "prisma",
      auth: "none",
      api: "orpc",
      payments: "none",
      addons: [],
      examples: [],
    },
  },
  ...(["trpc", "orpc"] as const).map(
    (api) =>
      ({
        name: `next-hono-${api}-auth`,
        config: {
          ...baseConfig,
          frontend: ["next"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          api,
          auth: "better-auth",
          payments: "none",
          addons: [],
          examples: ["todo"],
          webDeploy: api === "trpc" ? "docker" : "none",
          serverDeploy: api === "trpc" ? "docker" : "none",
        },
      }) satisfies BuildSample,
  ),
  {
    name: "nuxt-orpc",
    config: {
      ...baseConfig,
      frontend: ["nuxt"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "solid-v2-frontend-only",
    packageManagers: ["bun", "npm", "pnpm"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
    },
  },
  {
    name: "solid-v2-hono-bun-auth-todo",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "solid-v2-express-node-mongoose",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "express",
      runtime: "node",
      database: "mongodb",
      orm: "mongoose",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "solid-v2-fastify-node-prisma-polar",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "fastify",
      runtime: "node",
      database: "postgres",
      orm: "prisma",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "solid-v2-elysia-bun",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "elysia",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "solid-v2-hono-workers-cloudflare",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "solid-v2-self-orpc-no-auth",
    checks: ["solid-runtime", "solid-dev-runtime"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "solid-v2-self-orpc-auth-todo",
    checks: ["solid-runtime"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "solid-v2-self-cloudflare",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: ["todo"],
      dbSetup: "d1",
      webDeploy: "cloudflare",
    },
  },
  {
    name: "solid-v2-self-docker-pnpm",
    packageManagers: ["pnpm"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "prisma",
      api: "orpc",
      auth: "better-auth",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      webDeploy: "docker",
    },
  },
  {
    name: "solid-v2-self-vercel-npm",
    packageManagers: ["npm"],
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "drizzle",
      api: "orpc",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: [],
      webDeploy: "vercel",
    },
  },
  {
    name: "solid-v2-prisma-web",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
      webDeploy: "prisma",
    },
  },
  {
    name: "solid-v2-pwa",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["pwa"],
      examples: [],
    },
  },
  {
    name: "solid-v2-vite-plus",
    config: {
      ...baseConfig,
      frontend: ["solid"],
      backend: "hono",
      runtime: "bun",
      database: "none",
      orm: "none",
      api: "orpc",
      auth: "none",
      payments: "none",
      addons: ["vite-plus"],
      examples: [],
    },
  },
  {
    name: "convex-clerk-react",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "prisma-react-router-web",
    packageManagers: ["bun", "npm"],
    config: {
      ...baseConfig,
      frontend: ["react-router"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
      webDeploy: "prisma",
    },
  },
  {
    name: "prisma-sveltekit-web",
    packageManagers: ["pnpm"],
    config: {
      ...baseConfig,
      frontend: ["svelte"],
      backend: "none",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: [],
      webDeploy: "prisma",
    },
  },
  {
    name: "react-router-clerk-fastify",
    config: {
      ...baseConfig,
      frontend: ["react-router"],
      backend: "fastify",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "next-clerk-self",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "self",
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      api: "orpc",
      auth: "clerk",
      payments: "none",
      addons: [],
      examples: [],
    },
  },
  {
    name: "next-clerk-convex",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "clerk",
      payments: "none",
      addons: [],
      examples: [],
    },
  },
  {
    name: "tanstack-start-clerk-hono",
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "tanstack-start-convex-clerk",
    config: {
      ...baseConfig,
      frontend: ["tanstack-start"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "clerk",
      payments: "none",
      addons: [],
      examples: [],
    },
  },
  {
    name: "expo-clerk-express",
    config: {
      ...baseConfig,
      frontend: ["native-uniwind"],
      backend: "express",
      runtime: "node",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
    },
  },
  {
    name: "expo-convex-better-auth-polar",
    config: {
      ...baseConfig,
      frontend: ["native-bare"],
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      auth: "better-auth",
      payments: "polar",
      addons: ["turborepo"],
      examples: ["todo"],
    },
  },
  {
    name: "workers-clerk-hono",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "clerk",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "workers-d1",
    config: {
      ...baseConfig,
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo"],
      examples: [],
      dbSetup: "d1",
      serverDeploy: "cloudflare",
    },
  },
  {
    name: "mcp-addon-next",
    config: {
      ...baseConfig,
      frontend: ["next"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      api: "trpc",
      auth: "none",
      payments: "none",
      addons: ["turborepo", "mcp"],
      examples: [],
    },
  },
];

function expandBuildSample(sample: BuildSample): SelectedBuildSample[] {
  const packageManagers = sample.packageManagers ?? ["bun"];
  return packageManagers.map((packageManager) => ({
    name: packageManagers.length > 1 ? `${sample.name}-${packageManager}` : sample.name,
    packageManager,
    checks: sample.checks ?? [],
    config: {
      ...sample.config,
      packageManager,
    },
  }));
}

export function getSelectedBuildSamples() {
  const sampleFilter = process.env.BTS_BUILD_SAMPLE_FILTER;
  const samples = buildSamples.flatMap(expandBuildSample);
  let selected = sampleFilter
    ? samples.filter((sample) => sample.name.includes(sampleFilter))
    : samples;
  if (selected.length === 0) {
    throw new Error(`No generated build samples matched BTS_BUILD_SAMPLE_FILTER=${sampleFilter}`);
  }
  const shard = process.env.BTS_BUILD_SAMPLE_SHARD;
  if (shard) {
    const match = /^(\d+)\/(\d+)$/.exec(shard);
    const index = Number(match?.[1]);
    const total = Number(match?.[2]);
    if (!match || index < 1 || index > total || total > samples.length) {
      throw new Error(`Invalid BTS_BUILD_SAMPLE_SHARD=${shard}; expected 1/N through N/N`);
    }
    selected = selected.filter((_, position) => position % total === index - 1);
  }
  return selected;
}
