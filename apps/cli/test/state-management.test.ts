import { describe, test } from "bun:test";

import { expectSuccess, runTRPCTest, createCustomConfig } from "./test-utils";

describe("State Management Options", () => {
  describe("Redux Toolkit with React frontends", () => {
    test("redux-toolkit with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "redux-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "redux-toolkit",
        }),
      );
      expectSuccess(result);
    });

    test("redux-toolkit with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "redux-react-router",
          frontend: ["react-router"],
          stateManagement: "redux-toolkit",
        }),
      );
      expectSuccess(result);
    });

    test("redux-toolkit with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "redux-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          stateManagement: "redux-toolkit",
        }),
      );
      expectSuccess(result);
    });

    test("redux-toolkit with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "redux-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          stateManagement: "redux-toolkit",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Other state management libraries", () => {
    test("zustand with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "zustand-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "zustand",
        }),
      );
      expectSuccess(result);
    });

    test("jotai with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "jotai-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "jotai",
        }),
      );
      expectSuccess(result);
    });

    test("nanostores with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "nanostores-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "nanostores",
        }),
      );
      expectSuccess(result);
    });

    test("mobx with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "mobx-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "mobx",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("MobX with React frontends", () => {
    test("mobx with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "mobx-react-router",
          frontend: ["react-router"],
          stateManagement: "mobx",
        }),
      );
      expectSuccess(result);
    });

    test("mobx with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "mobx-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          stateManagement: "mobx",
        }),
      );
      expectSuccess(result);
    });

    test("mobx with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "mobx-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          stateManagement: "mobx",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("State management with native apps", () => {
    test("redux-toolkit with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "redux-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          stateManagement: "redux-toolkit",
        }),
      );
      expectSuccess(result);
    });

    test("zustand with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "zustand-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          stateManagement: "zustand",
        }),
      );
      expectSuccess(result);
    });

    test("mobx with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "mobx-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          stateManagement: "mobx",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("XState with React frontends", () => {
    test("xstate with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "xstate-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "xstate",
        }),
      );
      expectSuccess(result);
    });

    test("xstate with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "xstate-react-router",
          frontend: ["react-router"],
          stateManagement: "xstate",
        }),
      );
      expectSuccess(result);
    });

    test("xstate with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "xstate-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          stateManagement: "xstate",
        }),
      );
      expectSuccess(result);
    });

    test("xstate with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "xstate-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          stateManagement: "xstate",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("XState with native apps", () => {
    test("xstate with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "xstate-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          stateManagement: "xstate",
        }),
      );
      expectSuccess(result);
    });

    test("xstate with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "xstate-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          stateManagement: "xstate",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Valtio with React frontends", () => {
    test("valtio with TanStack Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valtio-tanstack-router",
          frontend: ["tanstack-router"],
          stateManagement: "valtio",
        }),
      );
      expectSuccess(result);
    });

    test("valtio with React Router", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valtio-react-router",
          frontend: ["react-router"],
          stateManagement: "valtio",
        }),
      );
      expectSuccess(result);
    });

    test("valtio with Next.js", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valtio-nextjs",
          frontend: ["next"],
          backend: "self",
          runtime: "none",
          stateManagement: "valtio",
        }),
      );
      expectSuccess(result);
    });

    test("valtio with TanStack Start", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valtio-tanstack-start",
          frontend: ["tanstack-start"],
          backend: "self",
          runtime: "none",
          stateManagement: "valtio",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("Valtio with native apps", () => {
    test("valtio with native-bare", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valtio-native-bare",
          frontend: ["native-bare"],
          backend: "hono",
          stateManagement: "valtio",
        }),
      );
      expectSuccess(result);
    });

    test("valtio with native-uniwind", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "valtio-native-uniwind",
          frontend: ["native-uniwind"],
          backend: "hono",
          stateManagement: "valtio",
        }),
      );
      expectSuccess(result);
    });
  });

  describe("No state management", () => {
    test("none state management option", async () => {
      const result = await runTRPCTest(
        createCustomConfig({
          projectName: "no-state-mgmt",
          frontend: ["tanstack-router"],
          stateManagement: "none",
        }),
      );
      expectSuccess(result);
    });
  });
});
