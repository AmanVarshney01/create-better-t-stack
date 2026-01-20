import { describe, test } from "bun:test";

import { createCustomConfig, expectSuccess, runTRPCTest } from "./test-utils";

describe("Real-time/WebSocket Options", () => {
  describe("Socket.IO with React frontends", () => {
    test("socket-io with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-tanstack-router",
          frontend: ["tanstack-router"],
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-react-router",
          frontend: ["react-router"],
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Socket.IO with different backends", () => {
    test("socket-io with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Socket.IO with native apps", () => {
    test("socket-io with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });

    test("socket-io with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "socketio-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          realtime: "socket-io",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("PartyKit with React frontends", () => {
    test("partykit with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "partykit-tanstack-router",
          frontend: ["tanstack-router"],
          realtime: "partykit",
        }),
      );
      expectSuccess(result);
    });

    test("partykit with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "partykit-react-router",
          frontend: ["react-router"],
          realtime: "partykit",
        }),
      );
      expectSuccess(result);
    });

    test("partykit with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "partykit-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          realtime: "partykit",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("PartyKit with different backends", () => {
    test("partykit with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "partykit-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          realtime: "partykit",
        }),
      );
      expectSuccess(result);
    });

    test("partykit with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "partykit-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          realtime: "partykit",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No real-time option", () => {
    test("none realtime option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-realtime",
          frontend: ["tanstack-router"],
          realtime: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
