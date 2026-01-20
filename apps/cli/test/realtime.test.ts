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

  describe("Ably with React frontends", () => {
    test("ably with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-tanstack-router",
          frontend: ["tanstack-router"],
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-react-router",
          frontend: ["react-router"],
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Ably with different backends", () => {
    test("ably with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Ably with native apps", () => {
    test("ably with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });

    test("ably with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "ably-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          realtime: "ably",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Pusher with React frontends", () => {
    test("pusher with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-tanstack-router",
          frontend: ["tanstack-router"],
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-react-router",
          frontend: ["react-router"],
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with Next.js fullstack", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Pusher with different backends", () => {
    test("pusher with Hono backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-hono",
          frontend: ["tanstack-router"],
          backend: "hono",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with Express backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-express",
          frontend: ["tanstack-router"],
          backend: "express",
          runtime: "node",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with Fastify backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-fastify",
          frontend: ["tanstack-router"],
          backend: "fastify",
          runtime: "node",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with Elysia backend", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-elysia",
          frontend: ["tanstack-router"],
          backend: "elysia",
          runtime: "bun",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Pusher with native apps", () => {
    test("pusher with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          realtime: "pusher",
        }),
      );
      expectSuccess(result);
    });

    test("pusher with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "pusher-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          realtime: "pusher",
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
