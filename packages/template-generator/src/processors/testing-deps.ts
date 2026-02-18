import type { ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";
import { getWebPackagePath, getServerPackagePath } from "../utils/project-paths";

// React-based frontends that can use @testing-library/react
const REACT_FRONTENDS = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "native-bare",
  "native-uniwind",
  "native-unistyles",
  "redwood",
  "astro", // Only when astroIntegration is "react"
] as const;

// Vue-based frontends that can use @testing-library/vue
const VUE_FRONTENDS = ["nuxt"] as const;

// Svelte frontends that can use @testing-library/svelte
const SVELTE_FRONTENDS = ["svelte"] as const;

/**
 * Process testing framework dependencies.
 *
 * Adds the appropriate testing framework dependencies based on the selected option:
 * - vitest: Fast unit test framework (default) with Testing Library support
 * - jest: Classic testing framework with Testing Library support
 * - playwright: E2E testing
 * - vitest-playwright: Both unit and E2E testing
 * - cypress: E2E testing with time travel debugging
 *
 * Testing Library is automatically included for compatible frontends (React, Vue, Svelte)
 * when using unit test frameworks (vitest, jest, vitest-playwright).
 */
export function processTestingDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { testing, frontend, astroIntegration } = config;

  // Skip if not selected or "none"
  if (!testing || testing === "none") return;

  const webPath = getWebPackagePath(frontend);
  const serverPath = getServerPackagePath(frontend);
  const packages = {
    server: vfs.exists(serverPath),
    web: vfs.exists(webPath),
    api: vfs.exists("packages/api/package.json"),
  };

  // Get base testing framework dependencies
  const { devDeps: baseDeps } = getTestingDeps(testing);

  // Get Testing Library dependencies based on frontend
  const testingLibraryDeps = getTestingLibraryDeps(testing, frontend, astroIntegration);

  // Server package gets base testing deps only (no UI testing)
  if (packages.server && baseDeps.length > 0) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      devDependencies: baseDeps,
    });
  }

  // Web package gets both base testing deps and Testing Library deps
  if (packages.web) {
    const webDeps = [...baseDeps, ...testingLibraryDeps];
    if (webDeps.length > 0) {
      addPackageDependency({
        vfs,
        packagePath: webPath,
        devDependencies: webDeps,
      });
    }
  }

  // API package gets base testing deps only (no UI testing)
  if (packages.api && baseDeps.length > 0) {
    addPackageDependency({
      vfs,
      packagePath: "packages/api/package.json",
      devDependencies: baseDeps,
    });
  }
}

/**
 * Get base testing framework dependencies
 */
function getTestingDeps(testing: ProjectConfig["testing"]): {
  devDeps: AvailableDependencies[];
} {
  const devDeps: AvailableDependencies[] = [];

  switch (testing) {
    case "vitest":
      devDeps.push("vitest", "@vitest/ui", "@vitest/coverage-v8", "jsdom");
      break;
    case "jest":
      devDeps.push("jest", "@types/jest", "ts-jest", "@jest/globals", "jest-environment-jsdom");
      break;
    case "playwright":
      devDeps.push("@playwright/test", "playwright");
      break;
    case "vitest-playwright":
      devDeps.push(
        "vitest",
        "@vitest/ui",
        "@vitest/coverage-v8",
        "jsdom",
        "@playwright/test",
        "playwright",
      );
      break;
    case "cypress":
      devDeps.push("cypress");
      break;
  }

  return { devDeps };
}

/**
 * Get Testing Library dependencies based on frontend framework
 * Testing Library is added for unit test frameworks (vitest, jest, vitest-playwright)
 * but not for pure E2E frameworks (playwright-only, cypress)
 */
function getTestingLibraryDeps(
  testing: ProjectConfig["testing"],
  frontend: ProjectConfig["frontend"],
  astroIntegration?: ProjectConfig["astroIntegration"],
): AvailableDependencies[] {
  // Only add Testing Library for unit test frameworks
  if (!testing || !["vitest", "jest", "vitest-playwright"].includes(testing)) {
    return [];
  }

  const deps: AvailableDependencies[] = [];

  // Core Testing Library packages (always included for compatible frontends)
  const addCoreDeps = () => {
    deps.push("@testing-library/dom", "@testing-library/user-event");

    // Add jest-dom matchers for both Jest and Vitest (works with both)
    if (testing === "jest") {
      deps.push("@testing-library/jest-dom");
    } else if (testing === "vitest" || testing === "vitest-playwright") {
      deps.push("@testing-library/jest-dom");
    }
  };

  // Check frontend type and add appropriate framework-specific library
  if (isReactFrontend(frontend, astroIntegration)) {
    addCoreDeps();
    deps.push("@testing-library/react");
  } else if (isVueFrontend(frontend)) {
    addCoreDeps();
    deps.push("@testing-library/vue");
  } else if (isSvelteFrontend(frontend, astroIntegration)) {
    addCoreDeps();
    deps.push("@testing-library/svelte");
  }

  return deps;
}

/**
 * Check if any frontend in the array is React-based
 */
function isReactFrontend(
  frontend: ProjectConfig["frontend"],
  astroIntegration?: ProjectConfig["astroIntegration"],
): boolean {
  if (!frontend || frontend.length === 0) return false;

  // Check each frontend in the array
  return frontend.some((f) => {
    // Astro with React integration
    if (f === "astro" && astroIntegration === "react") {
      return true;
    }

    // Skip Astro with non-React integration
    if (f === "astro") {
      return false;
    }

    return (REACT_FRONTENDS as readonly string[]).includes(f);
  });
}

/**
 * Check if any frontend in the array is Vue-based
 */
function isVueFrontend(frontend: ProjectConfig["frontend"]): boolean {
  if (!frontend || frontend.length === 0) return false;
  return frontend.some((f) => (VUE_FRONTENDS as readonly string[]).includes(f));
}

/**
 * Check if any frontend in the array is Svelte-based
 */
function isSvelteFrontend(
  frontend: ProjectConfig["frontend"],
  astroIntegration?: ProjectConfig["astroIntegration"],
): boolean {
  if (!frontend || frontend.length === 0) return false;

  return frontend.some((f) => {
    // Astro with Svelte integration
    if (f === "astro" && astroIntegration === "svelte") {
      return true;
    }

    return (SVELTE_FRONTENDS as readonly string[]).includes(f);
  });
}
