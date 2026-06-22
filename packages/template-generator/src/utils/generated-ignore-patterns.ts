import type { ProjectConfig } from "@better-t-stack/types";

const FRONTEND_GENERATED_PATTERNS = {
  "tanstack-router": ["apps/web/dist/**", "apps/web/.tanstack/**", "apps/web/src/routeTree.gen.ts"],
  "react-router": ["apps/web/build/**", "apps/web/.react-router/**"],
  "tanstack-start": [
    "apps/web/dist/**",
    "apps/web/.vinxi/**",
    "apps/web/.tanstack/**",
    "apps/web/src/routeTree.gen.ts",
  ],
  next: ["apps/web/.next/**", "apps/web/out/**"],
  nuxt: ["apps/web/.nuxt/**", "apps/web/.output/**", "apps/web/.data/**", "apps/web/.nitro/**"],
  svelte: ["apps/web/.svelte-kit/**", "apps/web/build/**", "apps/web/.output/**"],
  solid: ["apps/web/dist/**", "apps/web/.tanstack/**", "apps/web/src/routeTree.gen.ts"],
  astro: ["apps/web/dist/**", "apps/web/.astro/**"],
  "native-bare": ["apps/native/.expo/**", "apps/native/dist/**", "apps/native/web-build/**"],
  "native-uniwind": ["apps/native/.expo/**", "apps/native/dist/**", "apps/native/web-build/**"],
  "native-unistyles": [
    "apps/native/.expo/**",
    "apps/native/dist/**",
    "apps/native/web-build/**",
    "apps/native/ios/**",
    "apps/native/android/**",
  ],
  none: [],
} as const satisfies Partial<Record<ProjectConfig["frontend"][number], readonly string[]>>;

const SERVER_BUILD_BACKENDS = ["hono", "express", "fastify", "elysia"] as const;

export function getStackGeneratedIgnorePatterns(config: ProjectConfig): string[] {
  const patterns = new Set<string>();

  for (const frontend of config.frontend) {
    const frontendPatterns = FRONTEND_GENERATED_PATTERNS[frontend];
    if (!frontendPatterns) continue;
    for (const pattern of frontendPatterns) {
      patterns.add(pattern);
    }
  }

  if ((SERVER_BUILD_BACKENDS as readonly string[]).includes(config.backend)) {
    patterns.add("apps/server/dist/**");
  }

  if (config.database !== "none" && config.orm !== "none") {
    patterns.add("packages/db/dist/**");
  }

  if (config.database === "sqlite" && config.dbSetup !== "d1" && config.orm !== "none") {
    patterns.add("packages/db/local.db*");
  }

  if (config.orm === "prisma") {
    patterns.add("packages/db/prisma/generated/**");

    if (config.database === "sqlite" && config.dbSetup === "turso") {
      patterns.add("packages/db/prisma/**/*.db*");
    }
  }

  if (config.backend === "convex") {
    patterns.add("packages/backend/convex/_generated/**");
  }

  const hasCloudflare =
    config.runtime === "workers" ||
    config.dbSetup === "d1" ||
    config.webDeploy === "cloudflare" ||
    config.serverDeploy === "cloudflare";

  if (hasCloudflare) {
    patterns.add(".alchemy/**");
    patterns.add(".wrangler/**");
    patterns.add("**/.wrangler/**");

    if (config.frontend.includes("next")) {
      patterns.add("apps/web/.open-next/**");
    }
  }

  return [...patterns];
}
