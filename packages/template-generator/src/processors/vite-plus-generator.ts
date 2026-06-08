/**
 * Vite+ config generator
 * Generates the root vite.config.ts used by vp lint/fmt/staged commands.
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

const BASE_IGNORE_PATTERNS = ["node_modules/**", "**/node_modules/**"] as const;

const FRONTEND_IGNORE_PATTERNS = {
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
} as const satisfies Partial<Record<ProjectConfig["frontend"][number], readonly string[]>>;

const SERVER_BUILD_BACKENDS = ["hono", "express", "fastify", "elysia"] as const;
const STAGED_PATTERN = "*.{js,ts,jsx,tsx,vue,svelte,json,jsonc,css,md}";

export function processVitePlusConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("vite-plus")) return;

  vfs.writeFile("vite.config.ts", generateVitePlusConfig(config));
}

function formatStringArray(values: readonly string[], indent = 4): string {
  const spaces = " ".repeat(indent);
  return values.map((value) => `${spaces}${JSON.stringify(value)},`).join("\n");
}

export function getVitePlusIgnorePatterns(config: ProjectConfig): string[] {
  const patterns = new Set<string>(BASE_IGNORE_PATTERNS);

  for (const frontend of config.frontend) {
    const frontendPatterns = FRONTEND_IGNORE_PATTERNS[frontend];
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

  if (config.orm === "prisma") {
    patterns.add("packages/db/prisma/generated/**");
    patterns.add("apps/server/prisma/generated/**");
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

export function generateVitePlusConfig(config: ProjectConfig): string {
  const ignorePatterns = formatStringArray(getVitePlusIgnorePatterns(config), 6);

  return `import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: [
${ignorePatterns}
    ],
    options: {
      typeAware: false,
      typeCheck: false,
    },
  },
  fmt: {
    ignorePatterns: [
${ignorePatterns}
    ],
    singleQuote: false,
    semi: true,
    sortPackageJson: true,
  },
  staged: {
    ${JSON.stringify(STAGED_PATTERN)}: "vp check --fix",
  },
});
`;
}
