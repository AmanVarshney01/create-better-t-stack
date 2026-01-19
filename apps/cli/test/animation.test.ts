import { describe, test } from "bun:test";

import { expectSuccess, runTRPCTest } from "./test-utils";

describe("Animation", () => {
  describe("Framer Motion", () => {
    test("framer-motion with TanStack Router", async () => {
      const result = await runTRPCTest({
        projectName: "animation-framer-tanstack",
        frontend: ["tanstack-router"],
        animation: "framer-motion",
      });
      expectSuccess(result);
    });

    test("framer-motion with React Router", async () => {
      const result = await runTRPCTest({
        projectName: "animation-framer-react-router",
        frontend: ["react-router"],
        animation: "framer-motion",
      });
      expectSuccess(result);
    });

    test("framer-motion with Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "animation-framer-next",
        frontend: ["next"],
        backend: "self",
        runtime: "none",
        animation: "framer-motion",
      });
      expectSuccess(result);
    });

    test("framer-motion with TanStack Start", async () => {
      const result = await runTRPCTest({
        projectName: "animation-framer-tanstack-start",
        frontend: ["tanstack-start"],
        backend: "self",
        runtime: "none",
        animation: "framer-motion",
      });
      expectSuccess(result);
    });

    test("framer-motion with React Native (native-bare)", async () => {
      const result = await runTRPCTest({
        projectName: "animation-framer-native-bare",
        frontend: ["native-bare"],
        backend: "hono",
        animation: "framer-motion",
      });
      expectSuccess(result);
    });

    test("framer-motion with React Native (native-uniwind)", async () => {
      const result = await runTRPCTest({
        projectName: "animation-framer-native-uniwind",
        frontend: ["native-uniwind"],
        backend: "hono",
        animation: "framer-motion",
      });
      expectSuccess(result);
    });
  });

  describe("No Animation", () => {
    test("no animation with TanStack Router", async () => {
      const result = await runTRPCTest({
        projectName: "animation-none-tanstack",
        frontend: ["tanstack-router"],
        animation: "none",
      });
      expectSuccess(result);
    });
  });
});
