import { describe, test, expect } from "bun:test";

// Critical packages and their versions from add-deps.ts
// These are the ones most likely to cause install failures
// NOTE: Update these when updating add-deps.ts to ensure tests catch version drift
const criticalDependencies: Record<string, string> = {
  // Effect ecosystem (updated 2026-01-21)
  effect: "^3.19.14",
  "@effect/schema": "^0.75.5",
  "@effect/platform": "^0.94.1",
  "@effect/platform-node": "^0.104.0",
  "@effect/platform-bun": "^0.87.0",
  "@effect/platform-browser": "^0.74.0",
  "@effect/sql": "^0.49.0",

  // TanStack - versions can drift
  "@tanstack/react-router-devtools": "^1.154.3",
  "@tanstack/react-query": "^5.90.12",
  "@tanstack/store": "^0.8.0",
  "@tanstack/react-store": "^0.8.0",

  // Core tools
  daisyui: "^5.0.0",
  "better-auth": "^1.4.9",
  "drizzle-orm": "^0.45.1",
  prisma: "^7.1.0",
  hono: "^4.8.2",
  elysia: "^1.4.21",
};

// Cache for npm registry responses
const versionCache = new Map<string, boolean>();

/**
 * Check if a specific version of a package exists on npm
 * For caret versions (^X.Y.Z), the specified version must exist AND
 * there must be a version that satisfies the range.
 */
async function checkVersionExists(packageName: string, versionSpec: string): Promise<boolean> {
  const cacheKey = `${packageName}@${versionSpec}`;
  if (versionCache.has(cacheKey)) {
    return versionCache.get(cacheKey)!;
  }

  try {
    // Clean the version spec (remove ^, ~, etc.)
    const cleanVersion = versionSpec.replace(/^[\^~>=<]+/, "").split(" ")[0];

    // Fetch package info from npm registry
    const response = await fetch(`https://registry.npmjs.org/${packageName}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.warn(`Package ${packageName} not found on npm`);
      versionCache.set(cacheKey, false);
      return false;
    }

    const data = await response.json();
    const versions = Object.keys(data.versions || {});

    // For caret versions (^X.Y.Z), we need to check:
    // 1. If the base version X.Y.Z exists OR there's a higher version in the same major
    // The issue is when we specify ^0.75.8 but only 0.75.5 exists
    if (versionSpec.startsWith("^")) {
      const [major, minor, patch] = cleanVersion.split(".").map(Number);

      // Check if there's any version that satisfies ^X.Y.Z
      // For ^0.Y.Z (major = 0), npm allows changes to minor
      // For ^X.Y.Z (major > 0), npm allows changes to minor and patch
      const hasCompatibleVersion = versions.some((v) => {
        const parts = v.split(".");
        if (parts.length < 3) return false;
        const [vMajor, vMinor, vPatch] = parts.map(Number);

        if (major === 0) {
          // For ^0.Y.Z, only minor must match, patch can be >= specified
          return vMajor === 0 && vMinor === minor && vPatch >= patch;
        } else {
          // For ^X.Y.Z (X > 0), major must match, rest can be >=
          return vMajor === major && (vMinor > minor || (vMinor === minor && vPatch >= patch));
        }
      });

      versionCache.set(cacheKey, hasCompatibleVersion);
      return hasCompatibleVersion;
    }

    // For exact versions, check if it exists
    const exists = versions.includes(cleanVersion);
    versionCache.set(cacheKey, exists);
    return exists;
  } catch (error) {
    console.error(`Error checking ${packageName}@${versionSpec}:`, error);
    versionCache.set(cacheKey, false);
    return false;
  }
}

describe("Dependency Version Validation", () => {
  describe("Critical packages have valid versions", () => {
    for (const [pkgName, version] of Object.entries(criticalDependencies)) {
      test(`${pkgName}@${version} exists on npm`, async () => {
        const exists = await checkVersionExists(pkgName, version);
        if (!exists) {
          console.error(`\n❌ Package ${pkgName}@${version} does not exist on npm!`);
          console.error(
            `   Check https://www.npmjs.com/package/${pkgName} for available versions\n`,
          );
        }
        expect(exists).toBe(true);
      });
    }
  });
});
