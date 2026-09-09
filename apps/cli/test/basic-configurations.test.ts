import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { expectError, expectSuccess, PACKAGE_MANAGERS, runCreateTest } from "./test-utils";

describe("Basic Configurations", () => {
  describe("Default Configuration", () => {
    it("should create project with --yes flag (default config)", async () => {
      const result = await runCreateTest({
        projectName: "default-app",
        yes: true,
        install: false,
      });

      expectSuccess(result);
      expect(result.result?.projectConfig.projectName).toBe("default-app");
    });

    it("should create project with explicit default values", async () => {
      const result = await runCreateTest({
        projectName: "explicit-defaults",
        database: "sqlite",
        orm: "drizzle",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
        auth: "better-auth",
        api: "trpc",
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false, // Skip installation for faster tests
      });

      expectSuccess(result);
      expect(result.result?.projectConfig.projectName).toBe("explicit-defaults");
    });

    it("should create Next.js fullstack project with self backend", async () => {
      const result = await runCreateTest({
        projectName: "nextjs-fullstack-defaults",
        database: "sqlite",
        orm: "drizzle",
        backend: "self",
        runtime: "none",
        frontend: ["next"],
        auth: "better-auth",
        api: "trpc",
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false, // Skip installation for faster tests
      });

      expectSuccess(result);
      expect(result.result?.projectConfig.projectName).toBe("nextjs-fullstack-defaults");
      expect(result.result?.projectConfig.backend).toBe("self");
      expect(result.result?.projectConfig.runtime).toBe("none");
      expect(result.result?.projectConfig.frontend).toEqual(["next"]);
    });
  });

  describe("Package Managers", () => {
    for (const packageManager of PACKAGE_MANAGERS) {
      it(`should work with ${packageManager}`, async () => {
        const result = await runCreateTest({
          projectName: `${packageManager}-app`,
          packageManager,
          yes: true,
          install: false,
        });

        expectSuccess(result);
        expect(result.result?.projectConfig.packageManager).toBe(packageManager);

        const config = await readFile(join(result.projectDir!, "bts.jsonc"), "utf8");
        const expectedAddCommand =
          packageManager === "npm"
            ? "npx create-better-t-stack@latest add"
            : packageManager === "pnpm"
              ? "pnpm dlx create-better-t-stack@latest add"
              : "bunx create-better-t-stack@latest add";

        expect(config).toContain("Keep this file to use the `add` command.");
        expect(config).toContain(`Add addons: ${expectedAddCommand}`);
        expect(config).not.toContain("This file is safe to delete");
      });
    }
  });
  describe("YOLO Mode", () => {
    it("should bypass validations with --yolo flag", async () => {
      // This would normally fail validation but should pass with yolo
      const result = await runCreateTest({
        projectName: "yolo-app",
        yolo: true,
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        api: "trpc",
        database: "mongodb",
        orm: "drizzle", // Incompatible combination
        auth: "better-auth",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      expect(result.result?.projectConfig.projectName).toBe("yolo-app");
    });
  });

  describe("Error Handling", () => {
    it("should fail with invalid project name", async () => {
      const result = await runCreateTest({
        projectName: "<invalid>",
      });

      expectError(result, "Invalid project name");
    });

    it("should fail when combining --yes with configuration flags", async () => {
      const result = await runCreateTest({
        projectName: "yes-with-flags",
        yes: true, // Explicitly set yes flag
        database: "postgres",
        orm: "drizzle",
        backend: "hono",
        runtime: "bun",
        frontend: ["tanstack-router"],
        auth: "better-auth",
        api: "trpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
      });

      expectError(result, "Cannot combine --yes with core stack configuration flags");
    });
  });
});
