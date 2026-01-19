import { describe, it } from "bun:test";

import type { CSSFramework, Frontend, UILibrary } from "../src/types";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("CSS Framework and UI Library Configurations", () => {
  describe("CSS Framework Options", () => {
    const cssFrameworks: CSSFramework[] = ["tailwind", "scss", "less", "postcss-only", "none"];

    for (const cssFramework of cssFrameworks) {
      it(`should work with ${cssFramework} CSS framework`, async () => {
        // Use radix-ui for non-tailwind frameworks since shadcn-ui requires tailwind
        const uiLibrary =
          cssFramework === "tailwind" ? "shadcn-ui" : cssFramework === "none" ? "none" : "radix-ui";

        const result = await runTRPCTest({
          projectName: `css-${cssFramework}`,
          cssFramework,
          uiLibrary: uiLibrary as UILibrary,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("UI Library + Frontend Compatibility", () => {
    // shadcn-ui only works with React frontends
    const shadcnCompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of shadcnCompatibleFrontends) {
      it(`should work with shadcn-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `shadcn-${frontend}`,
          uiLibrary: "shadcn-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // daisyui works with all web frontends
    const allWebFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "astro",
    ];

    for (const frontend of allWebFrontends) {
      it(`should work with daisyui + ${frontend}`, async () => {
        // Use orpc for non-React frontends
        const api = ["nuxt", "svelte", "solid"].includes(frontend) ? "orpc" : "trpc";

        const result = await runTRPCTest({
          projectName: `daisyui-${frontend}`,
          uiLibrary: "daisyui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: api as "trpc" | "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
          // Astro requires an integration selection
          ...(frontend === "astro" ? { astroIntegration: "react" } : {}),
        });

        expectSuccess(result);
      });
    }

    // radix-ui only works with React frontends
    const radixCompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of radixCompatibleFrontends) {
      it(`should work with radix-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `radix-${frontend}`,
          uiLibrary: "radix-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("UI Library + Frontend Incompatibility", () => {
    const shadcnIncompatibleFrontends: Frontend[] = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of shadcnIncompatibleFrontends) {
      it(`should fail with shadcn-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `shadcn-${frontend}-fail`,
          uiLibrary: "shadcn-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }

    const radixIncompatibleFrontends: Frontend[] = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of radixIncompatibleFrontends) {
      it(`should fail with radix-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `radix-${frontend}-fail`,
          uiLibrary: "radix-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }
  });

  describe("UI Library + CSS Framework Compatibility", () => {
    // shadcn-ui requires tailwind
    it("should fail with shadcn-ui + scss", async () => {
      const result = await runTRPCTest({
        projectName: "shadcn-scss-fail",
        uiLibrary: "shadcn-ui",
        cssFramework: "scss",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "not compatible");
    });

    // daisyui requires tailwind
    it("should fail with daisyui + scss", async () => {
      const result = await runTRPCTest({
        projectName: "daisyui-scss-fail",
        uiLibrary: "daisyui",
        cssFramework: "scss",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "not compatible");
    });

    // nextui requires tailwind
    it("should fail with nextui + less", async () => {
      const result = await runTRPCTest({
        projectName: "nextui-less-fail",
        uiLibrary: "nextui",
        cssFramework: "less",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "not compatible");
    });

    // radix-ui works with any CSS framework
    const nonTailwindCss: CSSFramework[] = ["scss", "less", "postcss-only", "none"];

    for (const cssFramework of nonTailwindCss) {
      it(`should work with radix-ui + ${cssFramework}`, async () => {
        const result = await runTRPCTest({
          projectName: `radix-css-${cssFramework}`,
          uiLibrary: "radix-ui",
          cssFramework,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // chakra-ui works with any CSS framework
    for (const cssFramework of nonTailwindCss) {
      it(`should work with chakra-ui + ${cssFramework}`, async () => {
        const result = await runTRPCTest({
          projectName: `chakra-css-${cssFramework}`,
          uiLibrary: "chakra-ui",
          cssFramework,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Default Values Behavior", () => {
    it("should default to tailwind + shadcn-ui for React frontends", async () => {
      const result = await runTRPCTest({
        projectName: "default-react-css-ui",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Native-only Projects", () => {
    const nativeFrontends: Frontend[] = ["native-bare", "native-uniwind", "native-unistyles"];

    for (const native of nativeFrontends) {
      it(`should work with ${native} (no UI library needed)`, async () => {
        const result = await runTRPCTest({
          projectName: `native-${native}`,
          frontend: [native],
          cssFramework: "none",
          uiLibrary: "none",
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Combined Web + Native Projects", () => {
    it("should work with web + native + tailwind + shadcn-ui", async () => {
      const result = await runTRPCTest({
        projectName: "web-native-combined",
        frontend: ["tanstack-router", "native-bare"],
        cssFramework: "tailwind",
        uiLibrary: "shadcn-ui",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with web + native + scss + radix-ui", async () => {
      const result = await runTRPCTest({
        projectName: "web-native-scss-radix",
        frontend: ["tanstack-router", "native-uniwind"],
        cssFramework: "scss",
        uiLibrary: "radix-ui",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Chakra UI and NextUI Specific Tests", () => {
    // Chakra UI and NextUI only work with React frontends
    const reactFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of reactFrontends) {
      it(`should work with chakra-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `chakra-${frontend}`,
          uiLibrary: "chakra-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });

      it(`should work with nextui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `nextui-${frontend}`,
          uiLibrary: "nextui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // chakra-ui and nextui should fail with non-React frontends
    const nonReactFrontends: Frontend[] = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of nonReactFrontends) {
      it(`should fail with chakra-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `chakra-${frontend}-fail`,
          uiLibrary: "chakra-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });

      it(`should fail with nextui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `nextui-${frontend}-fail`,
          uiLibrary: "nextui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }
  });

  describe("headless-ui Tests", () => {
    // headless-ui works with React and Vue (Nuxt)
    const headlessCompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
    ];

    for (const frontend of headlessCompatibleFrontends) {
      it(`should work with headless-ui + ${frontend}`, async () => {
        // Use orpc for nuxt
        const api = frontend === "nuxt" ? "orpc" : "trpc";

        const result = await runTRPCTest({
          projectName: `headless-${frontend}`,
          uiLibrary: "headless-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: api as "trpc" | "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // headless-ui doesn't work with svelte, solid, astro
    const headlessIncompatibleFrontends: Frontend[] = ["svelte", "solid", "astro"];

    for (const frontend of headlessIncompatibleFrontends) {
      it(`should fail with headless-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `headless-${frontend}-fail`,
          uiLibrary: "headless-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }
  });

  describe("park-ui Tests", () => {
    // park-ui works with React, Vue (Nuxt), and Solid
    const parkCompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "nuxt",
      "solid",
    ];

    for (const frontend of parkCompatibleFrontends) {
      it(`should work with park-ui + ${frontend}`, async () => {
        // Use orpc for non-React frontends
        const api = ["nuxt", "solid"].includes(frontend) ? "orpc" : "trpc";

        const result = await runTRPCTest({
          projectName: `park-${frontend}`,
          uiLibrary: "park-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: api as "trpc" | "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // park-ui doesn't work with svelte, astro
    const parkIncompatibleFrontends: Frontend[] = ["svelte", "astro"];

    for (const frontend of parkIncompatibleFrontends) {
      it(`should fail with park-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `park-${frontend}-fail`,
          uiLibrary: "park-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }

    // park-ui requires at least postcss-only (not none)
    it("should fail with park-ui + cssFramework none", async () => {
      const result = await runTRPCTest({
        projectName: "park-css-none-fail",
        uiLibrary: "park-ui",
        cssFramework: "none",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "trpc",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "not compatible");
    });
  });

  describe("Mantine Tests", () => {
    // Mantine works with React frontends
    const mantineCompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of mantineCompatibleFrontends) {
      it(`should work with mantine + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `mantine-${frontend}`,
          uiLibrary: "mantine",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // Mantine should fail with non-React frontends
    const mantineIncompatibleFrontends: Frontend[] = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of mantineIncompatibleFrontends) {
      it(`should fail with mantine + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `mantine-${frontend}-fail`,
          uiLibrary: "mantine",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }

    // Mantine works with any CSS framework (has its own styling)
    const allCssFrameworks: CSSFramework[] = ["tailwind", "scss", "less", "postcss-only", "none"];

    for (const cssFramework of allCssFrameworks) {
      it(`should work with mantine + ${cssFramework}`, async () => {
        const result = await runTRPCTest({
          projectName: `mantine-css-${cssFramework}`,
          uiLibrary: "mantine",
          cssFramework,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Base UI Tests", () => {
    // Base UI works with React frontends (from MUI team, Radix successor)
    const baseUICompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of baseUICompatibleFrontends) {
      it(`should work with base-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `baseui-${frontend}`,
          uiLibrary: "base-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // Base UI should fail with non-React frontends
    const baseUIIncompatibleFrontends: Frontend[] = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of baseUIIncompatibleFrontends) {
      it(`should fail with base-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `baseui-${frontend}-fail`,
          uiLibrary: "base-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }

    // Base UI is unstyled, works with any CSS framework
    const allCssFrameworks: CSSFramework[] = ["tailwind", "scss", "less", "postcss-only", "none"];

    for (const cssFramework of allCssFrameworks) {
      it(`should work with base-ui + ${cssFramework}`, async () => {
        const result = await runTRPCTest({
          projectName: `baseui-css-${cssFramework}`,
          uiLibrary: "base-ui",
          cssFramework,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Ark UI Tests", () => {
    // Ark UI works with React, Vue (Nuxt), Solid, and Svelte frontends
    const arkUIReactFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of arkUIReactFrontends) {
      it(`should work with ark-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `arkui-${frontend}`,
          uiLibrary: "ark-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // Ark UI works with Vue (Nuxt)
    it("should work with ark-ui + nuxt", async () => {
      const result = await runTRPCTest({
        projectName: "arkui-nuxt",
        uiLibrary: "ark-ui",
        cssFramework: "tailwind",
        frontend: ["nuxt"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "orpc",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    // Ark UI works with Solid
    it("should work with ark-ui + solid", async () => {
      const result = await runTRPCTest({
        projectName: "arkui-solid",
        uiLibrary: "ark-ui",
        cssFramework: "tailwind",
        frontend: ["solid"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "orpc",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    // Ark UI works with Svelte
    it("should work with ark-ui + svelte", async () => {
      const result = await runTRPCTest({
        projectName: "arkui-svelte",
        uiLibrary: "ark-ui",
        cssFramework: "tailwind",
        frontend: ["svelte"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        api: "orpc",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    // Ark UI should fail with incompatible frontends (Astro, Qwik, Angular)
    const arkUIIncompatibleFrontends: Frontend[] = ["astro", "qwik", "angular"];

    for (const frontend of arkUIIncompatibleFrontends) {
      it(`should fail with ark-ui + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `arkui-${frontend}-fail`,
          uiLibrary: "ark-ui",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }

    // Ark UI is unstyled, works with any CSS framework
    const allCssFrameworks: CSSFramework[] = ["tailwind", "scss", "less", "postcss-only", "none"];

    for (const cssFramework of allCssFrameworks) {
      it(`should work with ark-ui + ${cssFramework}`, async () => {
        const result = await runTRPCTest({
          projectName: `arkui-css-${cssFramework}`,
          uiLibrary: "ark-ui",
          cssFramework,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("React Aria Tests", () => {
    // React Aria works with React frontends (Adobe's accessible components)
    const reactAriaCompatibleFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of reactAriaCompatibleFrontends) {
      it(`should work with react-aria + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `reactaria-${frontend}`,
          uiLibrary: "react-aria",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    // React Aria should fail with non-React frontends
    const reactAriaIncompatibleFrontends: Frontend[] = ["nuxt", "svelte", "solid", "astro"];

    for (const frontend of reactAriaIncompatibleFrontends) {
      it(`should fail with react-aria + ${frontend}`, async () => {
        const result = await runTRPCTest({
          projectName: `reactaria-${frontend}-fail`,
          uiLibrary: "react-aria",
          cssFramework: "tailwind",
          frontend: [frontend],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "orpc",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        });

        expectError(result, "not compatible");
      });
    }

    // React Aria is unstyled, works with any CSS framework
    const allCssFrameworks: CSSFramework[] = ["tailwind", "scss", "less", "postcss-only", "none"];

    for (const cssFramework of allCssFrameworks) {
      it(`should work with react-aria + ${cssFramework}`, async () => {
        const result = await runTRPCTest({
          projectName: `reactaria-css-${cssFramework}`,
          uiLibrary: "react-aria",
          cssFramework,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          api: "trpc",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });
});
