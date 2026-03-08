import { describe, expect, it } from "bun:test";

import { buildTauriInitArgs } from "../src/helpers/addons/tauri-setup";

describe("Tauri setup", () => {
  it("builds init args with frontend-specific dev urls and static output paths", () => {
    const cases = [
      {
        frontend: ["tanstack-start"],
        expectedDist: "../dist/client",
        expectedUrl: "http://localhost:3001",
        expectedBuildCommand: "bun run build",
      },
      {
        frontend: ["next"],
        expectedDist: "../out",
        expectedUrl: "http://localhost:3001",
        expectedBuildCommand: "bun run build",
      },
      {
        frontend: ["nuxt"],
        expectedDist: "../.output/public",
        expectedUrl: "http://localhost:3001",
        expectedBuildCommand: "bun run generate",
      },
      {
        frontend: ["astro"],
        expectedDist: "../dist",
        expectedUrl: "http://localhost:4321",
        expectedBuildCommand: "bun run build",
      },
      {
        frontend: ["react-router"],
        expectedDist: "../build/client",
        expectedUrl: "http://localhost:5173",
        expectedBuildCommand: "bun run build",
      },
      {
        frontend: ["solid"],
        expectedDist: "../dist",
        expectedUrl: "http://localhost:3001",
        expectedBuildCommand: "bun run build",
      },
    ] as const;

    for (const testCase of cases) {
      const args = buildTauriInitArgs({
        packageManager: "bun",
        frontend: [...testCase.frontend],
        projectDir: "/tmp/my app",
      });

      expect(args).toContain("@tauri-apps/cli@latest");
      expect(args).toContain("--app-name");
      expect(args).toContain("my app");
      expect(args).toContain("--frontend-dist");
      expect(args).toContain(testCase.expectedDist);
      expect(args).toContain("--dev-url");
      expect(args).toContain(testCase.expectedUrl);
      expect(args).toContain("--before-dev-command");
      expect(args).toContain("bun run dev");
      expect(args).toContain("--before-build-command");
      expect(args).toContain(testCase.expectedBuildCommand);
      expect(args.some((arg) => arg.startsWith("--app-name="))).toBe(false);
      expect(args.some((arg) => arg.startsWith("--before-dev-command="))).toBe(false);
      expect(args.some((arg) => arg.startsWith("--before-build-command="))).toBe(false);
    }
  });
});
