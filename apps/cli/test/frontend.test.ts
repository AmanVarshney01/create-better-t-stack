import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { expectError, expectSuccess, runCreateTest, type TestConfig } from "./test-utils";

describe("Frontend Configurations", () => {
  describe("Single Frontend Options", () => {
    for (const frontend of [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "astro",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ] as const) {
      it(`generates a consistent workspace for ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `${frontend}-app`,
          frontend: [frontend],
          api: ["nuxt", "svelte", "solid", "astro"].includes(frontend) ? "orpc" : "trpc",
        };
        if (frontend === "next") {
          config.backend = "self";
          config.runtime = "none";
          config.auth = "better-auth";
        }
        expectSuccess(await runCreateTest(config));
      });
    }
  });

  describe("Frontend Compatibility with API", () => {
    it("should work with React frontends + tRPC", async () => {
      const result = await runCreateTest({
        projectName: "react-trpc",
      });

      expectSuccess(result);
    });

    it("should fail with Nuxt + tRPC", async () => {
      const result = await runCreateTest({
        projectName: "nuxt-trpc-fail",
        frontend: ["nuxt"],
      });

      expectError(result, "tRPC API is not supported with 'nuxt' frontend");
    });

    it("should fail with Svelte + tRPC", async () => {
      const result = await runCreateTest({
        projectName: "svelte-trpc-fail",
        frontend: ["svelte"],
      });

      expectError(result, "tRPC API is not supported with 'svelte' frontend");
    });

    it("should fail with Solid + tRPC", async () => {
      const result = await runCreateTest({
        projectName: "solid-trpc-fail",
        frontend: ["solid"],
      });

      expectError(result, "tRPC API is not supported with 'solid' frontend");
    });

    it("should fail with Astro + tRPC", async () => {
      const result = await runCreateTest({
        projectName: "astro-trpc-fail",
        frontend: ["astro"],
      });

      expectError(result, "tRPC API is not supported with 'astro' frontend");
    });

    const frontends = ["nuxt", "svelte", "solid", "astro"] as const;
    for (const frontend of frontends) {
      it(`should work with ${frontend} + oRPC`, async () => {
        const result = await runCreateTest({
          projectName: `${frontend}-orpc`,
          frontend: [frontend],
          api: "orpc",
        });

        expectSuccess(result);
      });
    }
  });

  describe("Frontend Compatibility with Backend", () => {
    it("should work with the Solid 2 self backend", async () => {
      const result = await runCreateTest({
        projectName: "solid-self",
        frontend: ["solid"],
        backend: "self",
        runtime: "none",
        auth: "better-auth",
        api: "orpc",
        addons: ["turborepo"],
        examples: ["todo"],
      });

      expectSuccess(result);
    });

    it("should fail Solid + Convex", async () => {
      const result = await runCreateTest({
        projectName: "solid-convex-fail",
        frontend: ["solid"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
      });

      expectError(
        result,
        "The following frontends are not compatible with '--backend convex': solid. Please choose a different frontend or backend.",
      );
    });

    it("should fail Astro + Convex", async () => {
      const result = await runCreateTest({
        projectName: "astro-convex-fail",
        frontend: ["astro"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
      });

      expectError(
        result,
        "The following frontends are not compatible with '--backend convex': astro. Please choose a different frontend or backend.",
      );
    });

    it("should work with React frontends + Convex", async () => {
      const result = await runCreateTest({
        projectName: "react-convex",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
      });

      expectSuccess(result);
    });
  });

  describe("Frontend Compatibility with Auth", () => {
    const incompatibleFrontends = ["nuxt", "svelte", "solid", "astro"] as const;
    for (const frontend of incompatibleFrontends) {
      it(`should fail incompatible ${frontend} with Clerk`, async () => {
        const result = await runCreateTest({
          projectName: `${frontend}-clerk-fail`,
          frontend: [frontend],
          auth: "clerk",
          api: "orpc",
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
      it(`should work with compatible ${frontend} + Clerk`, async () => {
        const result = await runCreateTest({
          projectName: `${frontend}-clerk`,
          frontend: [frontend],
          auth: "clerk",
        });

        expectSuccess(result);
      });
    }
  });

  describe("Multiple Frontend Constraints", () => {
    it("should fail with multiple web frontends", async () => {
      const result = await runCreateTest({
        projectName: "multiple-web-fail",
        frontend: ["tanstack-router", "react-router"],
      });

      expectError(result, "Cannot select multiple web frameworks");
    });

    it("should fail with multiple native frontends", async () => {
      const result = await runCreateTest({
        projectName: "multiple-native-fail",
        frontend: ["native-bare", "native-unistyles"],
      });

      expectError(result, "Cannot select multiple native frameworks");
    });

    it("should derive native app identifiers from the project name", async () => {
      const result = await runCreateTest({
        projectName: "my-app_1",
        frontend: ["native-bare"],
      });

      expectSuccess(result);

      const appJson = await fs.readJson(path.join(result.projectDir!, "apps/native/app.json"));
      expect(appJson.expo.ios.bundleIdentifier).toBe("com.anonymous.my-app-1");
      expect(appJson.expo.android.package).toBe("com.anonymous.myapp_1");
    });

    it("should work with one web + one native frontend", async () => {
      const result = await runCreateTest({
        projectName: "web-native-combo",
        frontend: ["tanstack-router", "native-bare"],
      });

      expectSuccess(result);
    });
  });
  describe("Frontend with None Option", () => {
    it("should work with frontend none", async () => {
      const result = await runCreateTest({
        projectName: "no-frontend",
        frontend: ["none"],
      });

      expectSuccess(result);
    });

    it("should fail with none + other frontends", async () => {
      const result = await runCreateTest({
        projectName: "none-with-other-fail",
        frontend: ["none", "tanstack-router"],
      });

      expectError(result, "Cannot combine 'none' with other frontend options");
    });
  });

  describe("Next.js with Self Backend", () => {
    it("should work with Next.js and self backend", async () => {
      const result = await runCreateTest({
        projectName: "nextjs-self-backend",
        frontend: ["next"],
        backend: "self",
        runtime: "none",
        auth: "better-auth",
      });

      expectSuccess(result);
    });
  });

  describe("Nuxt with Self Backend", () => {
    it("should work with Nuxt and self backend", async () => {
      const result = await runCreateTest({
        projectName: "nuxt-self-backend",
        frontend: ["nuxt"],
        backend: "self",
        runtime: "none",
        auth: "better-auth",
        api: "orpc",
      });

      expectSuccess(result);
    });
  });

  describe("Astro with Self Backend", () => {
    it("should work with Astro and self backend", async () => {
      const result = await runCreateTest({
        projectName: "astro-self-backend",
        frontend: ["astro"],
        backend: "self",
        runtime: "none",
        auth: "better-auth",
        api: "orpc",
      });

      expectSuccess(result);
    });
  });

  describe("Web Deploy Constraints", () => {
    it("should work with web frontend + web deploy", async () => {
      const result = await runCreateTest({
        projectName: "web-deploy",
        webDeploy: "cloudflare",
      });

      expectSuccess(result);
    });

    it("should fail with web deploy but no web frontend", async () => {
      const result = await runCreateTest({
        projectName: "web-deploy-no-frontend-fail",
        frontend: ["native-bare"],
        webDeploy: "cloudflare",
      });

      expectError(result, "'--web-deploy' requires a web frontend");
    });
  });
});
