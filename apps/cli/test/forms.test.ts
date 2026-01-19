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
