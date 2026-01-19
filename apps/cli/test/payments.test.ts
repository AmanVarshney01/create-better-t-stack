import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("Payments Options", () => {
  describe("Stripe with React frontends", () => {
    test("stripe with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-tanstack-router",
          frontend: ["tanstack-router"],
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-react-router",
          frontend: ["react-router"],
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Stripe with different backends", () => {
    test("stripe with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Stripe with non-React frontends", () => {
    test("stripe with Nuxt", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-nuxt",
          frontend: ["nuxt"],
          backend: "hono",
          api: "none",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-svelte",
          frontend: ["svelte"],
          backend: "hono",
          api: "none",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });

    test("stripe with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "stripe-solid",
          frontend: ["solid"],
          backend: "hono",
          api: "none",
          payments: "stripe",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Polar payments", () => {
    test("polar with TanStack Router and Better Auth", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "polar-tanstack-router",
          frontend: ["tanstack-router"],
          payments: "polar",
          auth: "better-auth",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Lemon Squeezy with React frontends", () => {
    test("lemon-squeezy with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-tanstack-router",
          frontend: ["tanstack-router"],
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-react-router",
          frontend: ["react-router"],
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Lemon Squeezy with different backends", () => {
    test("lemon-squeezy with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Lemon Squeezy with non-React frontends", () => {
    test("lemon-squeezy with Nuxt", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-nuxt",
          frontend: ["nuxt"],
          backend: "hono",
          api: "none",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with Svelte", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-svelte",
          frontend: ["svelte"],
          backend: "hono",
          api: "none",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });

    test("lemon-squeezy with Solid", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "lemonsqueezy-solid",
          frontend: ["solid"],
          backend: "hono",
          api: "none",
          payments: "lemon-squeezy",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No payments option", () => {
    test("none payments option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-payments",
          frontend: ["tanstack-router"],
          payments: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
