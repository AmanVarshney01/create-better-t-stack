import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

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
    >;

    for (const frontend of singleFrontends) {
      it(`should work with ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `${frontend}-app`,
          frontend: [frontend],
          install: false,
        };

        // Set compatible defaults based on frontend
        if (frontend === "solid") {
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
        } else if (frontend === "astro") {
          // Astro uses oRPC, not Convex compatible
          config.backend = "hono";
          config.runtime = "bun";
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "orpc"; // tRPC not supported with astro
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

  describe("Frontend Compatibility with API", () => {
    it("should keep React Router on the app's Vite version", async () => {
      const result = await runTRPCTest({
        projectName: "react-router-vite",
        frontend: ["react-router"],
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

      const packageJson = await fs.readJson(path.join(result.projectDir!, "apps/web/package.json"));
      expect(packageJson.devDependencies.vite).toBe("^8.1.5");
      expect(packageJson.devDependencies["react-router-devtools"]).toBeUndefined();
    });

    for (const frontend of ["tanstack-router", "react-router", "tanstack-start", "next"] as const) {
      it(`should use cn in the ${frontend} shared UI package`, async () => {
        const result = await runTRPCTest({
          projectName: `cn-${frontend}`,
          frontend: [frontend],
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

        const uiPackageJson = await fs.readJson(
          path.join(result.projectDir!, "packages/ui/package.json"),
        );
        const uiUtils = await fs.readFile(
          path.join(result.projectDir!, "packages/ui/src/lib/utils.ts"),
          "utf8",
        );

        expect(uiPackageJson.dependencies.cn).toBe("^0.2.4");
        expect(uiPackageJson.dependencies.clsx).toBeUndefined();
        expect(uiPackageJson.dependencies["tailwind-merge"]).toBeUndefined();
        expect(uiUtils.trim()).toBe('export { cn } from "cn";');
      });
    }

    it("should generate the Solid 2 project structure", async () => {
      const result = await runTRPCTest({
        projectName: "solid-v2",
        frontend: ["solid"],
        api: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const webDir = path.join(result.projectDir, "apps/web");
      const packageJson = await fs.readJson(path.join(webDir, "package.json"));
      const rootPackageJson = await fs.readJson(path.join(result.projectDir, "package.json"));
      const envPackageJson = await fs.readJson(
        path.join(result.projectDir, "packages/env/package.json"),
      );
      const webEnv = await fs.readFile(
        path.join(result.projectDir, "packages/env/src/web.ts"),
        "utf8",
      );
      const appFile = await fs.readFile(path.join(webDir, "src/App.tsx"), "utf8");
      const tsconfig = await fs.readJson(path.join(webDir, "tsconfig.json"));
      const viteConfig = await fs.readFile(path.join(webDir, "vite.config.ts"), "utf8");

      expect(packageJson.dependencies).toMatchObject({
        "@solidjs/meta": "^1.0.0-next.2",
        "@solidjs/router": "^2.0.0-next.16",
        "@solidjs/web": "^2.0.0-rc.0",
        "solid-js": "^2.0.0-rc.0",
      });
      expect(packageJson.devDependencies).toMatchObject({
        "@solidjs/vite-plugin": "^3.0.0-next.28",
        "filesystem-routing": "0.2.1",
        nitro: "^3.0.260610-beta",
      });
      expect(packageJson.dependencies["@solidjs/start"]).toBeUndefined();
      expect(packageJson.dependencies["@tanstack/solid-router"]).toBeUndefined();
      expect(packageJson.devDependencies["@tanstack/solid-router-devtools"]).toBeUndefined();
      expect(packageJson.devDependencies["@tanstack/router-plugin"]).toBeUndefined();
      expect(packageJson.devDependencies["vite-plugin-solid"]).toBeUndefined();
      expect(packageJson.engines.node).toBe(">=24");
      expect(packageJson.scripts["check-types"]).toBe("tsc --noEmit");
      expect(tsconfig.exclude).toContain("dist");
      expect(rootPackageJson.scripts["dev:web"]).toBeDefined();
      expect(envPackageJson.exports["./web"]).toBe("./src/web.ts");
      expect(webEnv).not.toContain("SKIP_ENV_VALIDATION");
      expect(appFile).toContain('import { Router } from "~/router";');
      expect(viteConfig).toContain("solid({");
      expect(viteConfig).toContain('start: { middleware: "./src/middleware.ts" }');
      expect(viteConfig).toContain("fileRoutes({ httpMethods: true })");
      expect(viteConfig).toContain("nitro({ serverEntry: false })");

      for (const file of [
        "src/App.tsx",
        "src/Document.tsx",
        "src/middleware.ts",
        "src/router.ts",
        "src/routes/index.tsx",
      ]) {
        expect(await fs.pathExists(path.join(webDir, file))).toBe(true);
      }

      for (const legacyFile of [
        "index.html",
        "src/main.tsx",
        "src/entry-client.tsx",
        "src/entry-server.tsx",
        "src/routes/__root.tsx",
      ]) {
        expect(await fs.pathExists(path.join(webDir, legacyFile))).toBe(false);
      }
    });

    it("should generate the current Nuxt dependency baseline", async () => {
      const result = await runTRPCTest({
        projectName: "nuxt-dependency-baseline",
        frontend: ["nuxt"],
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

      const packageJson = await fs.readJson(path.join(result.projectDir!, "apps/web/package.json"));
      expect(packageJson.dependencies).toMatchObject({
        "@nuxt/ui": "^4.10.0",
        nuxt: "^4.5.1",
        vue: "^3.5.40",
        "vue-router": "^5.2.0",
      });
      expect(packageJson.devDependencies["vue-tsc"]).toBe("^3.3.8");
      expect(packageJson.scripts["check-types"]).toBe("nuxt typecheck");
    });

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

    it("should fail with Astro + tRPC", async () => {
      const result = await runTRPCTest({
        projectName: "astro-trpc-fail",
        frontend: ["astro"],
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

      expectError(result, "tRPC API is not supported with 'astro' frontend");
    });

    const frontends = ["nuxt", "svelte", "solid", "astro"] as const;
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
    it("should work with the Solid 2 self backend", async () => {
      const result = await runTRPCTest({
        projectName: "solid-self",
        frontend: ["solid"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

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

    it("should fail Astro + Convex", async () => {
      const result = await runTRPCTest({
        projectName: "astro-convex-fail",
        frontend: ["astro"],
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
        "The following frontends are not compatible with '--backend convex': astro. Please choose a different frontend or backend.",
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
    const incompatibleFrontends = ["nuxt", "svelte", "solid", "astro"] as const;
    for (const frontend of incompatibleFrontends) {
      it(`should fail incompatible ${frontend} with Clerk`, async () => {
        const result = await runTRPCTest({
          projectName: `${frontend}-clerk-fail`,
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "clerk",
          api: "orpc",
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
      it(`should work with compatible ${frontend} + Clerk`, async () => {
        const result = await runTRPCTest({
          projectName: `${frontend}-clerk`,
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "clerk",
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

    it("should derive native app identifiers from the project name", async () => {
      const result = await runTRPCTest({
        projectName: "my-app_1",
        frontend: ["native-bare"],
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

      const appJson = await fs.readJson(path.join(result.projectDir!, "apps/native/app.json"));
      expect(appJson.expo.ios.bundleIdentifier).toBe("com.anonymous.my-app-1");
      expect(appJson.expo.android.package).toBe("com.anonymous.myapp_1");
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

  describe("Native Bare Layout", () => {
    it("should keep drawer content aligned under the native header", async () => {
      const result = await runTRPCTest({
        projectName: "native-bare-layout",
        frontend: ["native-bare"],
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
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const nativeIndexFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/app/(drawer)/index.tsx"),
        "utf8",
      );
      const containerFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/components/container.tsx"),
        "utf8",
      );

      expect(nativeIndexFile).toContain('contentInsetAdjustmentBehavior="never"');
      expect(nativeIndexFile).toContain("<Host style={styles.titleHost}>");
      expect(nativeIndexFile).toContain('textAlign: "center"');
      expect(nativeIndexFile).toContain("height: 34");
      expect(containerFile).toContain('edges={["left", "right", "bottom"]}');
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
  });

  describe("Nuxt with Self Backend", () => {
    it("should work with Nuxt and self backend", async () => {
      const result = await runTRPCTest({
        projectName: "nuxt-self-backend",
        frontend: ["nuxt"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
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

  describe("Astro with Self Backend", () => {
    it("should work with Astro and self backend", async () => {
      const result = await runTRPCTest({
        projectName: "astro-self-backend",
        frontend: ["astro"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
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
