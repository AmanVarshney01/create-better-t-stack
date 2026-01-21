/**
 * Dependency Version Checker
 *
 * Core library for checking and updating dependency versions in add-deps.ts.
 * Used by both the CLI command and GitHub Action.
 */

import { dependencyVersionMap } from "./add-deps";

// Types
export type UpdateType = "major" | "minor" | "patch" | "none";

export type VersionInfo = {
  name: string;
  current: string;
  latest: string;
  updateType: UpdateType;
  ecosystem?: string;
};

export type CheckResult = {
  outdated: VersionInfo[];
  upToDate: VersionInfo[];
  errors: { name: string; error: string }[];
};

export type NpmPackageInfo = {
  name: string;
  "dist-tags": {
    latest: string;
    [tag: string]: string;
  };
  versions: Record<string, unknown>;
};

// Ecosystem groups for organizing related packages
export const ECOSYSTEM_GROUPS: Record<string, string[]> = {
  effect: [
    "effect",
    "@effect/schema",
    "@effect/platform",
    "@effect/platform-node",
    "@effect/platform-bun",
    "@effect/platform-browser",
    "@effect/sql",
    "@effect/sql-sqlite-node",
    "@effect/sql-sqlite-bun",
    "@effect/sql-pg",
    "@effect/sql-mysql2",
    "@effect/sql-libsql",
    "@effect/sql-drizzle",
    "@effect/cli",
    "@effect/vitest",
    "@effect/opentelemetry",
    "@effect/rpc",
    "@effect/rpc-http",
    "@effect/cluster",
    "@effect/workflow",
    "@effect/ai",
    "@effect/ai-openai",
    "@effect/ai-anthropic",
  ],
  tanstack: [
    "@tanstack/react-query",
    "@tanstack/react-query-devtools",
    "@tanstack/vue-query",
    "@tanstack/vue-query-devtools",
    "@tanstack/svelte-query",
    "@tanstack/svelte-query-devtools",
    "@tanstack/solid-query",
    "@tanstack/solid-query-devtools",
    "@tanstack/solid-router-devtools",
    "@tanstack/react-router-ssr-query",
    "@tanstack/store",
    "@tanstack/react-store",
  ],
  prisma: [
    "prisma",
    "@prisma/client",
    "@prisma/adapter-d1",
    "@prisma/adapter-neon",
    "@prisma/adapter-mariadb",
    "@prisma/adapter-libsql",
    "@prisma/adapter-better-sqlite3",
    "@prisma/adapter-pg",
    "@prisma/adapter-planetscale",
  ],
  drizzle: ["drizzle-orm", "drizzle-kit"],
  clerk: [
    "@clerk/nextjs",
    "@clerk/clerk-react",
    "@clerk/tanstack-react-start",
    "@clerk/clerk-expo",
  ],
  radix: [
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-slot",
    "@radix-ui/react-label",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-select",
    "@radix-ui/react-toast",
    "@radix-ui/react-popover",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
  ],
  opentelemetry: [
    "@opentelemetry/api",
    "@opentelemetry/sdk-node",
    "@opentelemetry/auto-instrumentations-node",
    "@opentelemetry/exporter-trace-otlp-http",
    "@opentelemetry/exporter-metrics-otlp-http",
    "@opentelemetry/resources",
    "@opentelemetry/semantic-conventions",
  ],
  testing: [
    "vitest",
    "@vitest/ui",
    "@vitest/coverage-v8",
    "playwright",
    "@playwright/test",
    "jest",
    "@types/jest",
    "ts-jest",
    "@jest/globals",
    "jest-environment-jsdom",
    "cypress",
  ],
  storybook: [
    "storybook",
    "@storybook/react-vite",
    "@storybook/vue3-vite",
    "@storybook/svelte-vite",
    "@storybook/nextjs",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/test",
  ],
  trpc: ["@trpc/server", "@trpc/client", "@trpc/tanstack-react-query"],
  orpc: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod", "@orpc/tanstack-query"],
  "ts-rest": ["@ts-rest/core", "@ts-rest/react-query", "@ts-rest/serverless", "@ts-rest/next"],
  angular: [
    "@angular/core",
    "@angular/common",
    "@angular/compiler",
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/router",
    "@angular/forms",
    "@angular/animations",
    "@angular-devkit/build-angular",
    "@angular/cli",
    "@angular/compiler-cli",
  ],
  nestjs: ["@nestjs/core", "@nestjs/common", "@nestjs/platform-express"],
  mikro: [
    "@mikro-orm/core",
    "@mikro-orm/sqlite",
    "@mikro-orm/postgresql",
    "@mikro-orm/mysql",
    "@mikro-orm/better-sqlite",
  ],
  mantine: ["@mantine/core", "@mantine/hooks"],
  ark: ["@ark-ui/react", "@ark-ui/vue", "@ark-ui/solid", "@ark-ui/svelte"],
  uppy: [
    "@uppy/core",
    "@uppy/dashboard",
    "@uppy/drag-drop",
    "@uppy/progress-bar",
    "@uppy/xhr-upload",
    "@uppy/tus",
    "@uppy/react",
    "@uppy/svelte",
    "@uppy/vue",
    "@uppy/angular",
  ],
  uploadthing: [
    "uploadthing",
    "@uploadthing/react",
    "@uploadthing/svelte",
    "@uploadthing/vue",
    "@uploadthing/solid",
    "@uploadthing/nuxt",
    "@uploadthing/expo",
  ],
  payload: [
    "payload",
    "@payloadcms/next",
    "@payloadcms/richtext-lexical",
    "@payloadcms/db-postgres",
    "@payloadcms/db-mongodb",
    "@payloadcms/db-sqlite",
    "@payloadcms/plugin-seo",
    "@payloadcms/storage-s3",
  ],
  redwood: [
    "@redwoodjs/core",
    "@redwoodjs/web",
    "@redwoodjs/api",
    "@redwoodjs/router",
    "@redwoodjs/forms",
    "@redwoodjs/graphql-server",
    "@redwoodjs/vite",
    "@redwoodjs/project-config",
  ],
  convex: [
    "convex",
    "@convex-dev/react-query",
    "@convex-dev/agent",
    "convex-svelte",
    "convex-nuxt",
    "convex-vue",
    "@convex-dev/better-auth",
  ],
  cloudflare: [
    "wrangler",
    "@cloudflare/vite-plugin",
    "@opennextjs/cloudflare",
    "nitro-cloudflare-dev",
    "@sveltejs/adapter-cloudflare",
    "@cloudflare/workers-types",
  ],
  liveblocks: ["@liveblocks/client", "@liveblocks/react", "@liveblocks/node"],
  temporal: [
    "@temporalio/client",
    "@temporalio/worker",
    "@temporalio/workflow",
    "@temporalio/activity",
  ],
};

// Cache for npm registry responses
const versionCache = new Map<string, { latest: string; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Parse a version string, removing any leading ^, ~, or other specifiers
 */
export function parseVersion(versionSpec: string): {
  major: number;
  minor: number;
  patch: number;
  raw: string;
} {
  const raw = versionSpec.replace(/^[\^~>=<]+/, "").split(" ")[0] ?? "";
  const parts = raw.split(".");
  return {
    major: parseInt(parts[0] || "0", 10),
    minor: parseInt(parts[1] || "0", 10),
    patch: parseInt(parts[2] || "0", 10),
    raw,
  };
}

/**
 * Determine the type of update between two versions
 */
export function getUpdateType(current: string, latest: string): UpdateType {
  const curr = parseVersion(current);
  const lat = parseVersion(latest);

  if (curr.raw === lat.raw) return "none";
  if (lat.major > curr.major) return "major";
  if (lat.minor > curr.minor) return "minor";
  if (lat.patch > curr.patch) return "patch";
  return "none";
}

/**
 * Fetch the latest version of a package from npm registry
 */
export async function fetchLatestVersion(
  packageName: string,
  options: { skipPrerelease?: boolean } = {},
): Promise<string> {
  const { skipPrerelease = true } = options;

  // Check cache
  const cached = versionCache.get(packageName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.latest;
  }

  const encodedName = encodeURIComponent(packageName).replace("%40", "@");
  const url = `https://registry.npmjs.org/${encodedName}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Package ${packageName} not found (${response.status})`);
  }

  const data = (await response.json()) as NpmPackageInfo;

  let latest = data["dist-tags"]?.latest;

  // If the latest is a prerelease and we want to skip prereleases,
  // find the highest stable version
  if (skipPrerelease && latest && /-(alpha|beta|rc|next|canary)/.test(latest)) {
    const versions = Object.keys(data.versions || {})
      .filter((v) => !/-(alpha|beta|rc|next|canary)/.test(v))
      .sort((a, b) => {
        const pa = parseVersion(a);
        const pb = parseVersion(b);
        if (pa.major !== pb.major) return pb.major - pa.major;
        if (pa.minor !== pb.minor) return pb.minor - pa.minor;
        return pb.patch - pa.patch;
      });
    if (versions.length > 0 && versions[0]) {
      latest = versions[0];
    }
  }

  if (!latest) {
    throw new Error(`No versions found for ${packageName}`);
  }

  // Update cache
  versionCache.set(packageName, { latest, timestamp: Date.now() });

  return latest;
}

/**
 * Check if a specific version exists on npm
 */
export async function checkVersionExists(
  packageName: string,
  versionSpec: string,
): Promise<boolean> {
  try {
    const cleanVersion = parseVersion(versionSpec).raw;
    const encodedName = encodeURIComponent(packageName).replace("%40", "@");
    const url = `https://registry.npmjs.org/${encodedName}`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return false;

    const data = (await response.json()) as NpmPackageInfo;
    const versions = Object.keys(data.versions || {});

    // For caret versions, check if any version satisfies the range
    if (versionSpec.startsWith("^")) {
      const { major, minor, patch } = parseVersion(versionSpec);

      return versions.some((v) => {
        const parsed = parseVersion(v);
        if (major === 0) {
          // For ^0.Y.Z, only minor must match, patch can be >= specified
          return parsed.major === 0 && parsed.minor === minor && parsed.patch >= patch;
        } else {
          // For ^X.Y.Z (X > 0), major must match, rest can be >=
          return (
            parsed.major === major &&
            (parsed.minor > minor || (parsed.minor === minor && parsed.patch >= patch))
          );
        }
      });
    }

    return versions.includes(cleanVersion);
  } catch {
    return false;
  }
}

/**
 * Get the ecosystem group for a package
 */
export function getEcosystem(packageName: string): string | undefined {
  for (const [ecosystem, packages] of Object.entries(ECOSYSTEM_GROUPS)) {
    if (packages.includes(packageName)) {
      return ecosystem;
    }
    // Check for glob patterns like @effect/*
    for (const pattern of packages) {
      if (pattern.endsWith("/*")) {
        const prefix = pattern.slice(0, -2);
        if (packageName.startsWith(prefix + "/")) {
          return ecosystem;
        }
      }
    }
  }
  return undefined;
}

/**
 * Group packages by their ecosystem
 */
export function groupByEcosystem(packages: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  const other: string[] = [];

  for (const pkg of packages) {
    const ecosystem = getEcosystem(pkg);
    if (ecosystem) {
      if (!grouped[ecosystem]) grouped[ecosystem] = [];
      grouped[ecosystem]!.push(pkg);
    } else {
      other.push(pkg);
    }
  }

  // Add other group if not empty
  if (other.length > 0) {
    grouped.other = other;
  }

  return grouped;
}

/**
 * Check all versions in the dependency map
 */
export async function checkAllVersions(options: {
  versionMap?: Record<string, string>;
  filter?: string[];
  ecosystem?: string;
  concurrency?: number;
  onProgress?: (checked: number, total: number, current: string) => void;
  delayMs?: number;
}): Promise<CheckResult> {
  const {
    versionMap = dependencyVersionMap,
    filter,
    ecosystem,
    concurrency = 5,
    onProgress,
    delayMs = 100,
  } = options;

  let packages = Object.keys(versionMap);

  // Filter by specific packages
  if (filter && filter.length > 0) {
    packages = packages.filter((p) => filter.includes(p));
  }

  // Filter by ecosystem
  if (ecosystem) {
    const ecosystemPackages = ECOSYSTEM_GROUPS[ecosystem];
    if (ecosystemPackages) {
      packages = packages.filter((p) => {
        if (ecosystemPackages.includes(p)) return true;
        // Check glob patterns
        for (const pattern of ecosystemPackages) {
          if (pattern.endsWith("/*")) {
            const prefix = pattern.slice(0, -2);
            if (p.startsWith(prefix + "/")) return true;
          }
        }
        return false;
      });
    }
  }

  const result: CheckResult = {
    outdated: [],
    upToDate: [],
    errors: [],
  };

  const total = packages.length;
  let checked = 0;

  // Process in batches for rate limiting
  for (let i = 0; i < packages.length; i += concurrency) {
    const batch = packages.slice(i, i + concurrency);

    const batchResults = await Promise.allSettled(
      batch.map(async (pkg) => {
        const current = versionMap[pkg as keyof typeof versionMap];
        try {
          const latest = await fetchLatestVersion(pkg);
          const updateType = getUpdateType(current, latest);
          const ecosystem = getEcosystem(pkg);

          return {
            name: pkg,
            current,
            latest: `^${latest}`,
            updateType,
            ecosystem,
          };
        } catch (error) {
          throw { name: pkg, error: String(error) };
        }
      }),
    );

    for (const settled of batchResults) {
      if (settled.status === "fulfilled") {
        const info = settled.value as VersionInfo;
        if (info.updateType === "none") {
          result.upToDate.push(info);
        } else {
          result.outdated.push(info);
        }
      } else {
        const err = settled.reason as { name: string; error: string };
        result.errors.push(err);
      }
      checked++;
      onProgress?.(checked, total, batch[0] ?? "");
    }

    // Rate limiting delay between batches
    if (i + concurrency < packages.length && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Sort outdated by update type (major > minor > patch)
  const typeOrder: Record<UpdateType, number> = {
    major: 0,
    minor: 1,
    patch: 2,
    none: 3,
  };
  result.outdated.sort((a, b) => typeOrder[a.updateType] - typeOrder[b.updateType]);

  return result;
}

/**
 * Generate a markdown report of the check results
 */
export function generateMarkdownReport(result: CheckResult): string {
  const lines: string[] = [];

  lines.push("# Dependency Version Check Report\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);

  // Summary
  lines.push("## Summary\n");
  lines.push(`- **Outdated**: ${result.outdated.length}`);
  lines.push(`- **Up to date**: ${result.upToDate.length}`);
  lines.push(`- **Errors**: ${result.errors.length}\n`);

  // Outdated packages
  if (result.outdated.length > 0) {
    lines.push("## Outdated Packages\n");

    // Group by update type
    const byType: Record<UpdateType, VersionInfo[]> = {
      major: [],
      minor: [],
      patch: [],
      none: [],
    };
    for (const info of result.outdated) {
      byType[info.updateType].push(info);
    }

    if (byType.major.length > 0) {
      lines.push("### Major Updates (Breaking Changes Possible)\n");
      lines.push("| Package | Current | Latest | Ecosystem |");
      lines.push("|---------|---------|--------|-----------|");
      for (const info of byType.major) {
        lines.push(
          `| ${info.name} | ${info.current} | ${info.latest} | ${info.ecosystem || "-"} |`,
        );
      }
      lines.push("");
    }

    if (byType.minor.length > 0) {
      lines.push("### Minor Updates\n");
      lines.push("| Package | Current | Latest | Ecosystem |");
      lines.push("|---------|---------|--------|-----------|");
      for (const info of byType.minor) {
        lines.push(
          `| ${info.name} | ${info.current} | ${info.latest} | ${info.ecosystem || "-"} |`,
        );
      }
      lines.push("");
    }

    if (byType.patch.length > 0) {
      lines.push("### Patch Updates\n");
      lines.push("| Package | Current | Latest | Ecosystem |");
      lines.push("|---------|---------|--------|-----------|");
      for (const info of byType.patch) {
        lines.push(
          `| ${info.name} | ${info.current} | ${info.latest} | ${info.ecosystem || "-"} |`,
        );
      }
      lines.push("");
    }
  }

  // Errors
  if (result.errors.length > 0) {
    lines.push("## Errors\n");
    lines.push("| Package | Error |");
    lines.push("|---------|-------|");
    for (const err of result.errors) {
      lines.push(`| ${err.name} | ${err.error} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate a CLI-friendly table report
 */
export function generateCliReport(result: CheckResult): string {
  const lines: string[] = [];

  if (result.outdated.length === 0 && result.errors.length === 0) {
    lines.push("All dependencies are up to date!");
    return lines.join("\n");
  }

  if (result.outdated.length > 0) {
    // Group by update type
    const byType: Record<UpdateType, VersionInfo[]> = {
      major: [],
      minor: [],
      patch: [],
      none: [],
    };
    for (const info of result.outdated) {
      byType[info.updateType].push(info);
    }

    const formatRow = (info: VersionInfo) => {
      const label =
        info.updateType === "major"
          ? "[MAJOR]"
          : info.updateType === "minor"
            ? "[MINOR]"
            : "[PATCH]";
      return `  ${label.padEnd(8)} ${info.name.padEnd(45)} ${info.current.padEnd(15)} -> ${info.latest}`;
    };

    if (byType.major.length > 0) {
      lines.push("\nMajor Updates (Breaking Changes Possible):");
      for (const info of byType.major) {
        lines.push(formatRow(info));
      }
    }

    if (byType.minor.length > 0) {
      lines.push("\nMinor Updates:");
      for (const info of byType.minor) {
        lines.push(formatRow(info));
      }
    }

    if (byType.patch.length > 0) {
      lines.push("\nPatch Updates:");
      for (const info of byType.patch) {
        lines.push(formatRow(info));
      }
    }
  }

  if (result.errors.length > 0) {
    lines.push("\nErrors:");
    for (const err of result.errors) {
      lines.push(`  ${err.name}: ${err.error}`);
    }
  }

  lines.push(
    `\nSummary: ${result.outdated.length} outdated, ${result.upToDate.length} up to date, ${result.errors.length} errors`,
  );

  return lines.join("\n");
}

/**
 * Generate updated code for add-deps.ts with new versions
 */
export function generateUpdatedVersionMap(
  updates: VersionInfo[],
  currentMap: Record<string, string>,
): Record<string, string> {
  const newMap = { ...currentMap };
  for (const update of updates) {
    if (update.updateType !== "none") {
      newMap[update.name] = update.latest;
    }
  }
  return newMap;
}

/**
 * Get the current dependency version map
 */
export function getDependencyVersionMap(): Record<string, string> {
  return { ...dependencyVersionMap };
}

/**
 * List all available ecosystems
 */
export function listEcosystems(): string[] {
  return Object.keys(ECOSYSTEM_GROUPS);
}
