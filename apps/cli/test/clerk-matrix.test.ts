import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { validateConfigCompatibility } from "../src/validation";
import { collectFiles } from "./setup";

const standardBackends = [
  { backend: "hono", runtime: "bun" },
  { backend: "hono", runtime: "node" },
  { backend: "hono", runtime: "workers" },
  { backend: "express", runtime: "bun" },
  { backend: "express", runtime: "node" },
  { backend: "fastify", runtime: "bun" },
  { backend: "fastify", runtime: "node" },
  { backend: "elysia", runtime: "bun" },
] as const;

const standardWeb = [
  undefined,
  "next",
  "react-router",
  "tanstack-router",
  "tanstack-start",
] as const;
const selfWeb = ["next", "tanstack-start"] as const;
const nativeOptions = [undefined, "native-bare", "native-uniwind", "native-unistyles"] as const;
const apiOptions = ["trpc", "orpc", "none"] as const;

function buildFrontendCombos(
  webOptions: readonly (typeof standardWeb)[number][],
  { requireWeb = false }: { requireWeb?: boolean } = {},
) {
  const combos: string[][] = [];

  for (const web of webOptions) {
    for (const native of nativeOptions) {
      const frontend = [web, native].filter(Boolean) as string[];
      if (frontend.length === 0) continue;
      if (requireWeb && !web) continue;
      combos.push(frontend);
    }
  }

  return combos;
}

function expectedContextImport(backend: string) {
  if (backend === "express") return "@clerk/express";
  if (backend === "fastify") return "@clerk/fastify";
  return "@clerk/backend";
}

function usesBackendClerkClient(backend: string, api: string) {
  return api !== "none" && (backend === "self" || backend === "hono" || backend === "elysia");
}

function needsServerClerkPublishableKey(backend: string, api: string) {
  return (
    backend === "express" ||
    backend === "fastify" ||
    (api !== "none" && (backend === "self" || backend === "hono" || backend === "elysia"))
  );
}

describe("Clerk matrix", () => {
  it("should generate every supported Clerk combination", { timeout: 30_000 }, async () => {
    const standardFrontendCombos = buildFrontendCombos(standardWeb);
    const selfFrontendCombos = buildFrontendCombos(selfWeb, { requireWeb: true });

    const combos = [
      ...standardBackends.flatMap((pair) =>
        standardFrontendCombos.flatMap((frontend) =>
          apiOptions.map((api) => ({
            backend: pair.backend,
            runtime: pair.runtime,
            frontend,
            api,
          })),
        ),
      ),
      ...selfFrontendCombos.flatMap((frontend) =>
        apiOptions.map((api) => ({
          backend: "self",
          runtime: "none",
          frontend,
          api,
        })),
      ),
      ...standardFrontendCombos.map((frontend) => ({
        backend: "convex",
        runtime: "none",
        frontend,
        api: "none",
      })),
    ];

    const failures: string[] = [];

    for (const [index, combo] of combos.entries()) {
      const config = {
        projectName: `clerk-matrix-${index}`,
        frontend: combo.frontend,
        backend: combo.backend,
        runtime: combo.runtime,
        database: combo.backend === "convex" || combo.api === "none" ? "none" : "sqlite",
        orm: combo.backend === "convex" || combo.api === "none" ? "none" : "drizzle",
        auth: "clerk" as const,
        api: combo.api,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: combo.runtime === "workers" ? ("cloudflare" as const) : ("none" as const),
        install: false,
        git: false,
        packageManager: "bun" as const,
        payments: "none" as const,
      };

      const validation = validateConfigCompatibility(config);
      if (validation.isErr()) {
        failures.push(
          `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: ${validation.error.message}`,
        );
        continue;
      }

      const result = await createVirtual(config);
      if (result.isErr()) {
        failures.push(
          `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: ${result.error.message}`,
        );
        continue;
      }

      const files = collectFiles(result.value.root, result.value.root.path);

      if (combo.backend !== "convex" && combo.runtime !== "workers") {
        const serverEnv = files.get("packages/env/src/server.ts");
        if (!serverEnv?.includes("CLERK_SECRET_KEY")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing CLERK_SECRET_KEY in packages/env/src/server.ts`,
          );
        }

        if (
          needsServerClerkPublishableKey(combo.backend, combo.api) &&
          !serverEnv?.includes("CLERK_PUBLISHABLE_KEY")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing CLERK_PUBLISHABLE_KEY in packages/env/src/server.ts`,
          );
        }
      }

      if (combo.backend !== "convex" && combo.api !== "none") {
        const contextFile = files.get("packages/api/src/context.ts");
        const expectedImport = expectedContextImport(combo.backend);

        if (!contextFile?.includes(expectedImport)) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing ${expectedImport} in packages/api/src/context.ts`,
          );
        }

        if (!contextFile?.includes("type ClerkContextAuth")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing ClerkContextAuth in packages/api/src/context.ts`,
          );
        }

        if (!contextFile?.includes("type ClerkRequestContext")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing ClerkRequestContext in packages/api/src/context.ts`,
          );
        }

        if (
          usesBackendClerkClient(combo.backend, combo.api) &&
          !contextFile?.includes("publishableKey: env.CLERK_PUBLISHABLE_KEY")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing publishableKey in packages/api/src/context.ts`,
          );
        }

        if (
          usesBackendClerkClient(combo.backend, combo.api) &&
          !contextFile?.includes("authorizedParties: [env.CORS_ORIGIN]")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing authorizedParties in packages/api/src/context.ts`,
          );
        }
      }

      if (needsServerClerkPublishableKey(combo.backend, combo.api)) {
        const appEnvPath = combo.backend === "self" ? "apps/web/.env" : "apps/server/.env";
        const appEnvFile = files.get(appEnvPath);

        if (!appEnvFile?.includes("CLERK_PUBLISHABLE_KEY=")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing CLERK_PUBLISHABLE_KEY in ${appEnvPath}`,
          );
        }
      }

      if (combo.frontend.includes("next")) {
        const dashboard = files.get("apps/web/src/app/dashboard/page.tsx");
        if (!dashboard) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing Next dashboard page`,
          );
        } else if (dashboard.includes("SignedIn") || dashboard.includes("SignedOut")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: Next dashboard still uses SignedIn/SignedOut`,
          );
        } else if (
          combo.backend !== "convex" &&
          combo.api !== "none" &&
          !dashboard.includes("privateData.queryOptions()")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: Next dashboard is missing protected privateData query`,
          );
        }

        if (combo.backend !== "convex") {
          const proxyFile = files.get("apps/web/src/proxy.ts");
          if (!proxyFile) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing Next proxy file`,
            );
          } else if (
            proxyFile.includes('/env/server"') ||
            proxyFile.includes("env.CLERK_SECRET_KEY")
          ) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: Next proxy still imports shared server env`,
            );
          }
        }
      }

      if (combo.frontend.includes("react-router")) {
        const dashboard = files.get("apps/web/src/routes/dashboard.tsx");
        if (!dashboard) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing React Router dashboard route`,
          );
        } else if (dashboard.includes("SignedIn") || dashboard.includes("SignedOut")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: React Router dashboard still uses SignedIn/SignedOut`,
          );
        } else if (
          combo.backend !== "convex" &&
          combo.api !== "none" &&
          !dashboard.includes("privateData.queryOptions()")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: React Router dashboard is missing protected privateData query`,
          );
        }
      }

      if (combo.frontend.includes("tanstack-router")) {
        const dashboard = files.get("apps/web/src/routes/dashboard.tsx");
        if (!dashboard) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing TanStack Router dashboard route`,
          );
        } else if (dashboard.includes("SignedIn") || dashboard.includes("SignedOut")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: TanStack Router dashboard still uses SignedIn/SignedOut`,
          );
        } else if (
          combo.backend !== "convex" &&
          combo.api !== "none" &&
          !dashboard.includes("privateData.queryOptions()")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: TanStack Router dashboard is missing protected privateData query`,
          );
        }
      }

      if (combo.frontend.includes("tanstack-start")) {
        const dashboard = files.get("apps/web/src/routes/dashboard.tsx");
        if (!dashboard) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing TanStack Start dashboard route`,
          );
        } else if (dashboard.includes("SignedIn") || dashboard.includes("SignedOut")) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: TanStack Start dashboard still uses SignedIn/SignedOut`,
          );
        } else if (
          combo.backend !== "convex" &&
          combo.api !== "none" &&
          !dashboard.includes("privateData.queryOptions()")
        ) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: TanStack Start dashboard is missing protected privateData query`,
          );
        }

        if (combo.backend !== "convex") {
          const startFile = files.get("apps/web/src/start.ts");
          if (!startFile) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing TanStack Start entry file`,
            );
          } else if (
            startFile.includes('/env/server"') ||
            startFile.includes("env.CLERK_SECRET_KEY")
          ) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: TanStack Start entry still imports shared server env`,
            );
          }
        }
      }

      const nativeFrontend = combo.frontend.find((entry) => entry.startsWith("native-"));
      if (nativeFrontend) {
        const nativePackage = files.get("apps/native/package.json");
        const nativeSignIn = files.get("apps/native/app/(auth)/sign-in.tsx");
        const nativeSignUp = files.get("apps/native/app/(auth)/sign-up.tsx");

        if (!nativePackage?.includes('"@clerk/expo": "^3.1.3"')) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: native package is missing @clerk/expo ^3.1.3`,
          );
        }

        if (!nativeSignIn) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing native sign-in screen`,
          );
        } else {
          if (nativeSignIn.includes("setActive") || nativeSignIn.includes("signIn.create")) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: native sign-in still uses the legacy Clerk Expo API`,
            );
          }

          if (
            !nativeSignIn.includes("const { signIn, errors, fetchStatus } = useSignIn()") ||
            !nativeSignIn.includes("await signIn.password") ||
            !nativeSignIn.includes("await signIn.finalize")
          ) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: native sign-in is missing the current Clerk Expo flow`,
            );
          }
        }

        if (!nativeSignUp) {
          failures.push(
            `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: missing native sign-up screen`,
          );
        } else {
          if (
            nativeSignUp.includes("setActive") ||
            nativeSignUp.includes("prepareEmailAddressVerification") ||
            nativeSignUp.includes("attemptEmailAddressVerification")
          ) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: native sign-up still uses the legacy Clerk Expo API`,
            );
          }

          if (
            !nativeSignUp.includes("const { signUp, errors, fetchStatus } = useSignUp()") ||
            !nativeSignUp.includes("await signUp.password") ||
            !nativeSignUp.includes("await signUp.verifications.sendEmailCode()") ||
            !nativeSignUp.includes("await signUp.verifications.verifyEmailCode") ||
            !nativeSignUp.includes("await signUp.finalize") ||
            !nativeSignUp.includes('nativeID="clerk-captcha"')
          ) {
            failures.push(
              `${combo.backend}/${combo.runtime}/${combo.frontend.join("+")}/${combo.api}: native sign-up is missing the current Clerk Expo flow`,
            );
          }
        }
      }
    }

    expect(combos).toHaveLength(499);
    expect(failures).toEqual([]);
  });
});
