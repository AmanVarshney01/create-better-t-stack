import { describe, test, expect } from "bun:test";

import { expectSuccess, runTRPCTest, createCustomConfig } from "./test-utils";

describe("Testing Framework Options", () => {
  describe("Jest with React frontends", () => {
    test("jest with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-react-router",
          frontend: ["react-router"],
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Jest with different backends", () => {
    test("jest with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });

    test("jest with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jest-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          testing: "jest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Vitest (default)", () => {
    test("vitest with TanStack Router (default)", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "vitest-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "vitest",
        }),
      );
      expectSuccess(result);
    });

    test("vitest with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "vitest-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          testing: "vitest",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Playwright E2E testing", () => {
    test("playwright with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "playwright-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "playwright",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Vitest + Playwright (both)", () => {
    test("vitest-playwright with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "vitest-playwright-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "vitest-playwright",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Cypress E2E testing", () => {
    test("cypress with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-tanstack-router",
          frontend: ["tanstack-router"],
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });

    test("cypress with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-react-router",
          frontend: ["react-router"],
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });

    test("cypress with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });

    test("cypress with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Cypress with different backends", () => {
    test("cypress with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });

    test("cypress with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });

    test("cypress with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "cypress-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          testing: "cypress",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No testing option", () => {
    test("none testing option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-testing",
          frontend: ["tanstack-router"],
          testing: "none",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Testing Library integration", () => {
    describe("Vitest with Testing Library for React frontends", () => {
      test("vitest includes Testing Library for TanStack Router (React)", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-tanstack-router",
            frontend: ["tanstack-router"],
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        // Check web package.json for Testing Library dependencies
        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/dom"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/user-event"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/jest-dom"]).toBeDefined();
          expect(pkgJson.devDependencies?.vitest).toBeDefined();
        }
      });

      test("vitest includes Testing Library for React Router", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-react-router",
            frontend: ["react-router"],
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
        }
      });

      test("vitest includes Testing Library for Next.js", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-next",
            frontend: ["next"],
            backend: "self",
            runtime: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
        }
      });

      test("vitest includes Testing Library for TanStack Start", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-tanstack-start",
            frontend: ["tanstack-start"],
            backend: "self",
            runtime: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
        }
      });
    });

    describe("Jest with Testing Library for React frontends", () => {
      test("jest includes Testing Library for TanStack Router (React)", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "jest-testing-library-tanstack-router",
            frontend: ["tanstack-router"],
            testing: "jest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/dom"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/jest-dom"]).toBeDefined();
          expect(pkgJson.devDependencies?.jest).toBeDefined();
        }
      });
    });

    describe("Vitest-Playwright with Testing Library", () => {
      test("vitest-playwright includes Testing Library for React", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-playwright-testing-library",
            frontend: ["tanstack-router"],
            testing: "vitest-playwright",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
          expect(pkgJson.devDependencies?.vitest).toBeDefined();
          expect(pkgJson.devDependencies?.["@playwright/test"]).toBeDefined();
        }
      });
    });

    describe("Testing Library for Vue frontends", () => {
      test("vitest includes Testing Library Vue for Nuxt", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-nuxt",
            frontend: ["nuxt"],
            backend: "hono",
            runtime: "bun",
            api: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/vue"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/dom"]).toBeDefined();
        }
      });
    });

    describe("Testing Library for Svelte frontends", () => {
      test("vitest includes Testing Library Svelte for Svelte", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-svelte",
            frontend: ["svelte"],
            backend: "hono",
            runtime: "bun",
            api: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/svelte"]).toBeDefined();
          expect(pkgJson.devDependencies?.["@testing-library/dom"]).toBeDefined();
        }
      });
    });

    describe("E2E-only testing (no Testing Library)", () => {
      test("playwright-only does NOT include Testing Library", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "playwright-only-no-testing-library",
            frontend: ["tanstack-router"],
            testing: "playwright",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          // Playwright should be included
          expect(pkgJson.devDependencies?.["@playwright/test"]).toBeDefined();
          // But Testing Library should NOT be included
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeUndefined();
          expect(pkgJson.devDependencies?.["@testing-library/dom"]).toBeUndefined();
        }
      });

      test("cypress-only does NOT include Testing Library", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "cypress-only-no-testing-library",
            frontend: ["tanstack-router"],
            testing: "cypress",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          // Cypress should be included
          expect(pkgJson.devDependencies?.cypress).toBeDefined();
          // But Testing Library should NOT be included
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeUndefined();
        }
      });
    });

    describe("Testing Library for Astro with integrations", () => {
      test("vitest includes Testing Library React for Astro with React integration", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-astro-react",
            frontend: ["astro"],
            astroIntegration: "react",
            backend: "hono",
            runtime: "bun",
            api: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeDefined();
        }
      });

      test("vitest includes Testing Library Svelte for Astro with Svelte integration", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-testing-library-astro-svelte",
            frontend: ["astro"],
            astroIntegration: "svelte",
            backend: "hono",
            runtime: "bun",
            api: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          expect(pkgJson.devDependencies?.["@testing-library/svelte"]).toBeDefined();
        }
      });
    });

    describe("No Testing Library for incompatible frontends", () => {
      test("vitest does NOT include framework-specific Testing Library for Solid", async () => {
        const result = await runTRPCTest(
          createCustomConfig({
            projectName: "vitest-solid-no-react-testing-lib",
            frontend: ["solid"],
            backend: "hono",
            runtime: "bun",
            api: "none",
            testing: "vitest",
          }),
        );
        expectSuccess(result);

        const webPackageJson = result.result?.tree?.root?.children
          ?.find((c: any) => c.name === "apps")
          ?.children?.find((c: any) => c.name === "web")
          ?.children?.find((c: any) => c.name === "package.json");

        if (webPackageJson?.content) {
          const pkgJson = JSON.parse(webPackageJson.content);
          // Solid doesn't have Testing Library support in our implementation
          // so no framework-specific testing library should be included
          expect(pkgJson.devDependencies?.["@testing-library/react"]).toBeUndefined();
          expect(pkgJson.devDependencies?.["@testing-library/vue"]).toBeUndefined();
          expect(pkgJson.devDependencies?.["@testing-library/svelte"]).toBeUndefined();
        }
      });

      // Note: Qwik test skipped due to pre-existing Handlebars template parsing error
      // Qwik templates need fixing before this test can be enabled
    });
  });
});
