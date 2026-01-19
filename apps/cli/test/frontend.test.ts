import { describe, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Frontend Configurations", () => {
  describe("Single Frontend Options", () => {
    const singleFrontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
      "svelte",
      "solid",
      "astro",
      "qwik",
      "angular",
    ] satisfies ReadonlyArray<
      | "tanstack-router"
      | "react-router"
      | "tanstack-start"
      | "next"
      | "nuxt"
      | "native-bare"
      | "native-uniwind"
      | "native-unistyles"
      | "svelte"
      | "solid"
      | "astro"
      | "qwik"
      | "angular"
    >;

    for (const frontend of singleFrontends) {
      it(`should work with ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `${frontend}-app`,
          frontend: [frontend],
          install: false,
        };

        // Set compatible defaults based on frontend
        if (frontend === "astro") {
          // Astro with React integration supports tRPC
          config.astroIntegration = "react";
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "trpc";
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        } else if (frontend === "solid") {
          // Solid is not compatible with Convex backend
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "orpc"; // tRPC not supported with solid
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        } else if (frontend === "next") {
          // Next.js can use self backend (fullstack)
          config.backend = "self";
          config.runtime = "none";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "better-auth";
          config.api = "trpc";
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        } else if (["nuxt", "svelte"].includes(frontend)) {
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "orpc"; // tRPC not supported with nuxt/svelte
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        } else if (frontend === "qwik") {
          // Qwik has its own built-in server, using standalone mode
          config.backend = "none";
          config.runtime = "none";
          config.database = "none";
          config.orm = "none";
          config.auth = "none";
          config.api = "none";
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        } else if (frontend === "angular") {
          // Angular has its own built-in dev server, using standalone mode
          config.backend = "none";
          config.runtime = "none";
          config.database = "none";
          config.orm = "none";
          config.auth = "none";
          config.api = "none";
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        } else {
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "trpc";
          config.addons = ["none"];
          config.examples = ["none"];
          config.dbSetup = "none";
          config.webDeploy = "none";
          config.serverDeploy = "none";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Qwik Frontend", () => {
    it("should work with Qwik standalone (no backend)", async () => {
      const result = await runTRPCTest({
        projectName: "qwik-standalone",
        frontend: ["qwik"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail Qwik with tRPC API", async () => {
      const result = await runTRPCTest({
        projectName: "qwik-trpc-fail",
        frontend: ["qwik"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Backend 'none' validation catches this - Qwik requires backend=none which requires api=none
      expectError(result, "Backend 'none' requires '--api none'");
    });

    it("should fail Qwik with oRPC API", async () => {
      const result = await runTRPCTest({
        projectName: "qwik-orpc-fail",
        frontend: ["qwik"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Backend 'none' validation catches this - Qwik requires backend=none which requires api=none
      expectError(result, "Backend 'none' requires '--api none'");
    });
  });

  describe("Angular Frontend", () => {
    it("should work with Angular standalone (no backend)", async () => {
      const result = await runTRPCTest({
        projectName: "angular-standalone",
        frontend: ["angular"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail Angular with tRPC API", async () => {
      const result = await runTRPCTest({
        projectName: "angular-trpc-fail",
        frontend: ["angular"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Backend 'none' validation catches this - Angular requires backend=none which requires api=none
      expectError(result, "Backend 'none' requires '--api none'");
    });

    it("should fail Angular with oRPC API", async () => {
      const result = await runTRPCTest({
        projectName: "angular-orpc-fail",
        frontend: ["angular"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Backend 'none' validation catches this - Angular requires backend=none which requires api=none
      expectError(result, "Backend 'none' requires '--api none'");
    });

    it("should fail Angular with ts-rest API", async () => {
      const result = await runTRPCTest({
        projectName: "angular-ts-rest-fail",
        frontend: ["angular"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "ts-rest",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      // Backend 'none' validation catches this - Angular requires backend=none which requires api=none
      expectError(result, "Backend 'none' requires '--api none'");
    });
  });

  describe("Frontend Compatibility with API", () => {
    it("should work with React frontends + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "react-trpc",
        frontend: ["tanstack-router"],
        api: "trpc",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with Nuxt + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "nuxt-trpc-fail",
        frontend: ["nuxt"],
        api: "trpc",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'nuxt' frontend");
    });

    it("should fail with Svelte + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "svelte-trpc-fail",
        frontend: ["svelte"],
        api: "trpc",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'svelte' frontend");
    });

    it("should fail with Solid + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "solid-trpc-fail",
        frontend: ["solid"],
        api: "trpc",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "tRPC API is not supported with 'solid' frontend");
    });

    const frontends = ["nuxt", "svelte", "solid"] as const;
    for (const frontend of frontends) {
      it(`should work with ${frontend} + oRPC`, async () => {
        const result = await runTRPCTest({
          projectName: `${frontend}-orpc`,
          frontend: [frontend],
          api: "orpc",
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Frontend Compatibility with Backend", () => {
    it("should fail Solid + Convex", async () => {
      const result = await runTRPCTest({
        projectName: "solid-convex-fail",
        frontend: ["solid"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(
        result,
        "The following frontends are not compatible with '--backend convex': solid. Please choose a different frontend or backend.",
      );
    });

    it("should work with React frontends + Convex", async () => {
      const result = await runTRPCTest({
        projectName: "react-convex",
        frontend: ["tanstack-router"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Frontend Compatibility with Auth", () => {
    const incompatibleFrontends = ["nuxt", "svelte", "solid"] as const;
    for (const frontend of incompatibleFrontends) {
      it(`should fail incompatible ${frontend} with Clerk + Convex`, async () => {
        const result = await runTRPCTest({
          projectName: `${frontend}-clerk-convex-fail`,
          frontend: [frontend],
          backend: "convex",
          runtime: "none",
          database: "none",
          orm: "none",
          auth: "clerk",
          api: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "Clerk authentication is not compatible");
      });
    }

    const compatibleFrontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ] as const;
    for (const frontend of compatibleFrontends) {
      it(`should work with compatible ${frontend} + Clerk + Convex`, async () => {
        const result = await runTRPCTest({
          projectName: `${frontend}-clerk-convex`,
          frontend: [frontend],
          backend: "convex",
          runtime: "none",
          database: "none",
          orm: "none",
          auth: "clerk",
          api: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Multiple Frontend Constraints", () => {
    it("should fail with multiple web frontends", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-web-fail",
        frontend: ["tanstack-router", "react-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot select multiple web frameworks");
    });

    it("should fail with multiple native frontends", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-native-fail",
        frontend: ["native-bare", "native-unistyles"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot select multiple native frameworks");
    });

    it("should work with one web + one native frontend", async () => {
      const result = await runTRPCTest({
        projectName: "web-native-combo",
        frontend: ["tanstack-router", "native-bare"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Frontend with None Option", () => {
    it("should work with frontend none", async () => {
      const result = await runTRPCTest({
        projectName: "no-frontend",
        frontend: ["none"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with none + other frontends", async () => {
      const result = await runTRPCTest({
        projectName: "none-with-other-fail",
        frontend: ["none", "tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot combine 'none' with other frontend options");
    });
  });

  describe("Next.js with Self Backend", () => {
    it("should work with Next.js and self backend", async () => {
      const result = await runTRPCTest({
        projectName: "nextjs-self-backend",
        frontend: ["next"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with Next.js and traditional backend", async () => {
      const result = await runTRPCTest({
        projectName: "nextjs-traditional-backend",
        frontend: ["next"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Web Deploy Constraints", () => {
    it("should work with web frontend + web deploy", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy",
        frontend: ["tanstack-router"],
        webDeploy: "cloudflare",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with web deploy but no web frontend", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-no-frontend-fail",
        frontend: ["native-bare"],
        webDeploy: "cloudflare",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "'--web-deploy' requires a web frontend");
    });
  });
});
