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
