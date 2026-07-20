import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { getAvailableAuthProviders } from "../src/prompts/auth";
import { validateConfigCompatibility } from "../src/validation";
import { collectFiles } from "./setup";
import { expectError, runTRPCTest } from "./test-utils";

describe("Descope auth provider option", () => {
  it("is offered for compatible frontends on a non-Convex backend", () => {
    for (const frontend of ["next", "react-router", "tanstack-router"] as const) {
      expect(getAvailableAuthProviders("hono", [frontend])).toContain("descope");
    }
  });

  it("is offered for the Convex backend with all supported frontends", () => {
    for (const frontend of ["next", "react-router", "tanstack-router"] as const) {
      expect(getAvailableAuthProviders("convex", [frontend])).toContain("descope");
    }
  });

  it("is not offered for unsupported frontends", () => {
    for (const frontend of ["svelte", "nuxt", "solid", "astro", "tanstack-start"] as const) {
      expect(getAvailableAuthProviders("hono", [frontend])).not.toContain("descope");
    }
  });

  it("appears exactly once alongside a single None entry", () => {
    // Guards against the provider falling through to the default "None" label.
    const providers = getAvailableAuthProviders("hono", ["next"]);
    expect(providers.filter((p) => p === "descope")).toHaveLength(1);
    expect(providers.filter((p) => p === "none")).toHaveLength(1);
  });
});

const standardBackends = [
  { backend: "hono", runtime: "bun" },
  { backend: "hono", runtime: "node" },
  { backend: "express", runtime: "node" },
  { backend: "fastify", runtime: "node" },
  { backend: "elysia", runtime: "bun" },
] as const;

// Descope currently supports Next.js, React Router, and TanStack Router.
const webFrontends = ["next", "react-router", "tanstack-router"] as const;
const apiOptions = ["trpc", "orpc", "none"] as const;

function webSdkFor(frontend: string) {
  return frontend === "next" ? "@descope/nextjs-sdk" : "@descope/react-sdk";
}

function webEnvVarFor(frontend: string) {
  return frontend === "next" ? "NEXT_PUBLIC_DESCOPE_PROJECT_ID" : "VITE_DESCOPE_PROJECT_ID";
}

describe("Descope matrix", () => {
  it("should generate every supported Descope combination", async () => {
    const combos = [
      ...standardBackends.flatMap((pair) =>
        webFrontends.flatMap((frontend) =>
          apiOptions.map((api) => ({
            backend: pair.backend,
            runtime: pair.runtime,
            frontend,
            api,
          })),
        ),
      ),
      // Fullstack (self) backend only supports Next.js among Descope frontends.
      ...apiOptions.map((api) => ({
        backend: "self",
        runtime: "none",
        frontend: "next",
        api,
      })),
    ];

    const failures: string[] = [];

    for (const [index, combo] of combos.entries()) {
      const label = `${combo.backend}/${combo.runtime}/${combo.frontend}/${combo.api}`;
      const hasApi = combo.api !== "none";
      const config = {
        projectName: `descope-matrix-${index}`,
        frontend: [combo.frontend],
        backend: combo.backend,
        runtime: combo.runtime,
        database: hasApi ? "sqlite" : "none",
        orm: hasApi ? "drizzle" : "none",
        auth: "descope" as const,
        api: combo.api,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
        git: false,
        packageManager: "bun" as const,
        payments: "none" as const,
      };

      const validation = validateConfigCompatibility(config);
      if (validation.isErr()) {
        failures.push(`${label}: unexpected validation error: ${validation.error.message}`);
        continue;
      }

      const result = await createVirtual(config);
      if (result.isErr()) {
        failures.push(`${label}: generation failed: ${result.error.message}`);
        continue;
      }

      const files = collectFiles(result.value.root, result.value.root.path);

      // Correct SDK dependency for the chosen frontend.
      const webPackage = files.get("apps/web/package.json");
      if (!webPackage?.includes(webSdkFor(combo.frontend))) {
        failures.push(`${label}: web package.json missing ${webSdkFor(combo.frontend)}`);
      }

      // Client-side token helper is always generated.
      const authHelper = files.get("apps/web/src/utils/descope-auth.ts");
      if (!authHelper?.includes("getDescopeAuthToken")) {
        failures.push(`${label}: missing getDescopeAuthToken helper`);
      }

      // Web env exposes the public project id.
      const webEnv = files.get("packages/env/src/web.ts");
      if (!webEnv?.includes(webEnvVarFor(combo.frontend))) {
        failures.push(`${label}: web env missing ${webEnvVarFor(combo.frontend)}`);
      }

      // Server-side validation is wired into the API context when an API is present.
      if (hasApi) {
        const context = files.get("packages/api/src/context.ts");
        if (!context?.includes("validateDescopeSession")) {
          failures.push(`${label}: context.ts missing validateDescopeSession`);
        }
        if (!context?.includes("@descope/node-sdk")) {
          failures.push(`${label}: context.ts missing @descope/node-sdk import`);
        }
      }

      // Server env carries the project id (self backend keeps it in the web app env).
      const serverEnvPath =
        combo.backend === "self" ? "packages/env/src/web.ts" : "packages/env/src/server.ts";
      if (!files.get(serverEnvPath)?.includes("DESCOPE_PROJECT_ID")) {
        failures.push(`${label}: ${serverEnvPath} missing DESCOPE_PROJECT_ID`);
      }
      // API contexts import DESCOPE_PROJECT_ID from env/server, so server.ts
      // must carry it whenever an API is present (incl. the self backend).
      if (hasApi && !files.get("packages/env/src/server.ts")?.includes("DESCOPE_PROJECT_ID")) {
        failures.push(`${label}: server.ts missing DESCOPE_PROJECT_ID`);
      }

      if (combo.frontend === "next") {
        const signIn = files.get("apps/web/src/app/sign-in/page.tsx");
        if (!signIn?.includes('flowId="sign-up-or-in"')) {
          failures.push(`${label}: missing Next.js sign-in page with Descope flow`);
        }

        const proxy = files.get("apps/web/src/proxy.ts");
        if (!proxy?.includes("authMiddleware")) {
          failures.push(`${label}: missing Descope authMiddleware in proxy.ts`);
        }
        if (!proxy?.includes("publicRoutes")) {
          failures.push(`${label}: proxy.ts missing publicRoutes configuration`);
        }

        const layout = files.get("apps/web/src/app/layout.tsx");
        if (!layout?.includes("AuthProvider")) {
          failures.push(`${label}: layout.tsx missing Descope AuthProvider`);
        }
      }

      if (combo.frontend === "react-router") {
        const dashboard = files.get("apps/web/src/routes/dashboard.tsx");
        if (!dashboard?.includes("@descope/react-sdk")) {
          failures.push(`${label}: react-router dashboard missing @descope/react-sdk`);
        }
      }

      if (combo.frontend === "tanstack-router") {
        const authRoute = files.get("apps/web/src/routes/_auth/route.tsx");
        if (!authRoute?.includes('flowId="sign-up-or-in"')) {
          failures.push(`${label}: tanstack-router _auth route missing Descope flow`);
        }
        const main = files.get("apps/web/src/main.tsx");
        if (!main?.includes("AuthProvider")) {
          failures.push(`${label}: main.tsx missing Descope AuthProvider`);
        }
      }
    }

    expect(combos).toHaveLength(48);
    expect(failures).toEqual([]);
  }, 30_000);

  const convexFrontends = ["next", "react-router", "tanstack-router"] as const;
  for (const frontend of convexFrontends) {
    it(`should generate Descope with the Convex backend on ${frontend}`, async () => {
      const config = {
        projectName: `descope-convex-${frontend}`,
        frontend: [frontend],
        backend: "convex" as const,
        runtime: "none" as const,
        database: "none" as const,
        orm: "none" as const,
        auth: "descope" as const,
        api: "none" as const,
        addons: ["none" as const],
        examples: ["none" as const],
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
        git: false,
        packageManager: "bun" as const,
        payments: "none" as const,
      };

      expect(validateConfigCompatibility(config).isOk()).toBe(true);

      const result = await createVirtual(config);
      expect(result.isOk()).toBe(true);
      if (result.isErr()) return;

      const files = collectFiles(result.value.root, result.value.root.path);

      // Convex backend trusts Descope as an AWS API Gateway compliant JWT issuer.
      const authConfig = files.get("packages/backend/convex/auth.config.ts");
      expect(authConfig).toContain("https://api.descope.com/");
      expect(authConfig).toContain("DESCOPE_PROJECT_ID");

      // Private Convex query gating on the authenticated identity.
      expect(files.get("packages/backend/convex/privateData.ts")).toContain("getUserIdentity");

      // Descope → Convex auth bridge hook, using the right SDK per frontend.
      const authBridge = files.get("apps/web/src/utils/convex-descope-auth.ts");
      expect(authBridge).toContain("useAuthFromDescope");
      expect(authBridge).toContain(
        frontend === "next" ? "@descope/nextjs-sdk/client" : "@descope/react-sdk",
      );

      // The Convex client is wired to the Descope auth bridge.
      const wiringFile =
        frontend === "next"
          ? "apps/web/src/components/providers.tsx"
          : frontend === "tanstack-router"
            ? "apps/web/src/main.tsx"
            : "apps/web/src/root.tsx";
      const wiring = files.get(wiringFile);
      expect(wiring).toContain("ConvexProviderWithAuth");
      expect(wiring).toContain("useAuthFromDescope");

      // Descope AuthProvider wraps the app (layout.tsx for Next.js, the wiring
      // file itself for the Vite frameworks).
      const authProviderFile =
        frontend === "next" ? files.get("apps/web/src/app/layout.tsx") : wiring;
      expect(authProviderFile).toContain("AuthProvider");

      // Web app depends on the correct Descope SDK and public project id env var
      // (reusing the shared per-frontend helpers so this can't diverge).
      expect(files.get("apps/web/package.json")).toContain(webSdkFor(frontend));
      const webEnv = files.get("packages/env/src/web.ts");
      expect(webEnv).toContain(webEnvVarFor(frontend));
      if (frontend !== "next") {
        // Vite SPA (Descope forces ssr:false) evaluates env client-side where
        // `process` is undefined, so the skipValidation check must be guarded.
        expect(webEnv).toContain('typeof process !== "undefined"');
      }

      // Dashboard reads the private Convex query.
      const dashboardPath =
        frontend === "next"
          ? "apps/web/src/app/dashboard/page.tsx"
          : frontend === "tanstack-router"
            ? "apps/web/src/routes/_auth/dashboard.tsx"
            : "apps/web/src/routes/dashboard.tsx";
      expect(files.get(dashboardPath)).toContain("api.privateData.get");
    }, 30_000);
  }

  it("should reject Descope + Convex with an unsupported frontend (tanstack-start)", async () => {
    const result = await runTRPCTest({
      projectName: "descope-convex-fail",
      auth: "descope",
      backend: "convex",
      runtime: "none",
      database: "none",
      orm: "none",
      api: "none",
      frontend: ["tanstack-start"],
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      expectError: true,
    });

    expectError(result, "Descope authentication is not compatible");
  });

  const unsupportedFrontends = ["svelte", "nuxt", "solid", "astro", "tanstack-start"] as const;
  for (const frontend of unsupportedFrontends) {
    it(`should reject Descope with ${frontend}`, async () => {
      const result = await runTRPCTest({
        projectName: `descope-${frontend}-fail`,
        auth: "descope",
        backend: "hono",
        runtime: "bun",
        database: "none",
        orm: "none",
        api: "none",
        frontend: [frontend],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Descope authentication is not compatible");
    });
  }
});
