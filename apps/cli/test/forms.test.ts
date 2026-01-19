import { describe, test } from "bun:test";

import { expectSuccess, runTRPCTest, createCustomConfig } from "./test-utils";

describe("Form Library Options", () => {
  describe("Formik with React frontends", () => {
    test("formik with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-tanstack-router",
          frontend: ["tanstack-router"],
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });

    test("formik with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-react-router",
          frontend: ["react-router"],
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });

    test("formik with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });

    test("formik with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Formik with different backends", () => {
    test("formik with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });

    test("formik with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });

    test("formik with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Formik with native apps", () => {
    test("formik with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });

    test("formik with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "formik-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          forms: "formik",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Other form libraries", () => {
    test("react-hook-form with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "rhf-tanstack-router",
          frontend: ["tanstack-router"],
          forms: "react-hook-form",
        }),
      );
      expectSuccess(result);
    });

    test("tanstack-form with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "tanstack-form-tanstack-router",
          frontend: ["tanstack-router"],
          forms: "tanstack-form",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Final Form with React frontends", () => {
    test("final-form with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-tanstack-router",
          frontend: ["tanstack-router"],
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-react-router",
          frontend: ["react-router"],
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Final Form with different backends", () => {
    test("final-form with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Final Form with native apps", () => {
    test("final-form with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });

    test("final-form with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "final-form-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          forms: "final-form",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Conform with React frontends", () => {
    test("conform with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-tanstack-router",
          frontend: ["tanstack-router"],
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-react-router",
          frontend: ["react-router"],
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Conform with different backends", () => {
    test("conform with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Conform with native apps", () => {
    test("conform with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });

    test("conform with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "conform-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          forms: "conform",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No form library", () => {
    test("none form library option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-forms",
          frontend: ["tanstack-router"],
          forms: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
