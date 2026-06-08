/**
 * Vite+ config generator
 * Generates the root vite.config.ts used by vp lint/fmt/staged commands.
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

const IGNORE_PATTERNS = [
  "dist/**",
  "build/**",
  ".next/**",
  ".nuxt/**",
  ".output/**",
  ".vinxi/**",
  ".tanstack/**",
  ".vercel/**",
  ".wrangler/**",
  "apps/web/src/routeTree.gen.ts",
  "node_modules/**",
] as const;

const STAGED_PATTERN = "*.{js,ts,jsx,tsx,vue,svelte,json,jsonc,css,md}";

export function processVitePlusConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.addons.includes("vite-plus")) return;

  vfs.writeFile("vite.config.ts", generateVitePlusConfig());
}

function formatStringArray(values: readonly string[], indent = 4): string {
  const spaces = " ".repeat(indent);
  return values.map((value) => `${spaces}${JSON.stringify(value)},`).join("\n");
}

export function generateVitePlusConfig(): string {
  const ignorePatterns = formatStringArray(IGNORE_PATTERNS, 6);

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
