/**
 * Vite+ config generator
 * Generates the root vite.config.ts used by vp lint/fmt/staged commands.
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { getStackGeneratedIgnorePatterns } from "../utils/generated-ignore-patterns";

const BASE_IGNORE_PATTERNS = ["node_modules/**", "**/node_modules/**"] as const;
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

  for (const pattern of getStackGeneratedIgnorePatterns(config)) {
    patterns.add(pattern);
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
