import { describe, it, expect } from "bun:test";

import type { Backend, Frontend, FileUpload } from "../src/types";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("File Upload Configurations", () => {
  describe("UploadThing File Upload", () => {
    it("should work with uploadthing + hono backend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-hono",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that UploadThing server SDK was added to packages/server
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.uploadthing).toBeDefined();
      }

      // Check that UploadThing React SDK was added to apps/web
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/react"]).toBeDefined();
      }
    });

    it("should work with uploadthing + express backend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-express",
        fileUpload: "uploadthing",
        backend: "express",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with uploadthing + fastify backend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-fastify",
        fileUpload: "uploadthing",
        backend: "fastify",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with uploadthing + elysia backend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-elysia",
        fileUpload: "uploadthing",
        backend: "elysia",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with uploadthing + next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-next",
        fileUpload: "uploadthing",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // For fullstack frameworks, both server and client SDK should be in web package
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.uploadthing).toBeDefined();
        expect(pkgJson.dependencies?.["@uploadthing/react"]).toBeDefined();
      }
    });

    it("should work with uploadthing + tanstack-start fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-tanstack-start",
        fileUpload: "uploadthing",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-start"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // For fullstack frameworks, both server and client SDK should be in web package
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.uploadthing).toBeDefined();
        expect(pkgJson.dependencies?.["@uploadthing/react"]).toBeDefined();
      }
    });

    const compatibleBackends: Backend[] = ["hono", "express", "fastify", "elysia"];

    for (const backend of compatibleBackends) {
      it(`should work with uploadthing + ${backend}`, async () => {
        const result = await runTRPCTest({
          projectName: `uploadthing-${backend}`,
          fileUpload: "uploadthing",
          backend,
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          api: "trpc",
          auth: "better-auth",
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("FilePond File Upload", () => {
    it("should work with filepond + tanstack-router (React)", async () => {
      const result = await runTRPCTest({
        projectName: "filepond-tanstack-router",
        fileUpload: "filepond",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that FilePond and react-filepond were added to apps/web
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.filepond).toBeDefined();
        expect(pkgJson.dependencies?.["react-filepond"]).toBeDefined();
        expect(pkgJson.dependencies?.["filepond-plugin-image-preview"]).toBeDefined();
        expect(pkgJson.dependencies?.["filepond-plugin-file-validate-type"]).toBeDefined();
        expect(pkgJson.dependencies?.["filepond-plugin-file-validate-size"]).toBeDefined();
      }
    });

    it("should work with filepond + next.js fullstack", async () => {
      const result = await runTRPCTest({
        projectName: "filepond-next",
        fileUpload: "filepond",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // FilePond is client-side only, should be in web package
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.filepond).toBeDefined();
        expect(pkgJson.dependencies?.["react-filepond"]).toBeDefined();
      }
    });

    it("should work with filepond + svelte frontend", async () => {
      const result = await runTRPCTest({
        projectName: "filepond-svelte",
        fileUpload: "filepond",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        auth: "better-auth",
        frontend: ["svelte"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that svelte-filepond was added
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.filepond).toBeDefined();
        expect(pkgJson.dependencies?.["svelte-filepond"]).toBeDefined();
      }
    });

    it("should work with filepond + nuxt frontend", async () => {
      const result = await runTRPCTest({
        projectName: "filepond-nuxt",
        fileUpload: "filepond",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        auth: "better-auth",
        frontend: ["nuxt"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that vue-filepond was added
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.filepond).toBeDefined();
        expect(pkgJson.dependencies?.["vue-filepond"]).toBeDefined();
      }
    });

    it("should work with filepond + solid frontend (vanilla JS)", async () => {
      const result = await runTRPCTest({
        projectName: "filepond-solid",
        fileUpload: "filepond",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        auth: "better-auth",
        frontend: ["solid"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Solid uses vanilla FilePond (no official adapter)
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.filepond).toBeDefined();
        expect(pkgJson.dependencies?.["filepond-plugin-image-preview"]).toBeDefined();
      }
    });

    it("should not add server SDK for filepond (client-side only)", async () => {
      const result = await runTRPCTest({
        projectName: "filepond-no-server-sdk",
        fileUpload: "filepond",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // FilePond should NOT be in server package (it's client-side only)
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.filepond).toBeUndefined();
        expect(pkgJson.dependencies?.["react-filepond"]).toBeUndefined();
      }
    });
  });

  describe("No File Upload", () => {
    it("should work with fileUpload: none", async () => {
      const result = await runTRPCTest({
        projectName: "no-file-upload",
        fileUpload: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Verify no uploadthing dependencies when fileUpload is none
      const serverPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "packages")
        ?.children?.find((c: any) => c.name === "server")
        ?.children?.find((c: any) => c.name === "package.json");

      if (serverPackageJson?.content) {
        const pkgJson = JSON.parse(serverPackageJson.content);
        expect(pkgJson.dependencies?.uploadthing).toBeUndefined();
      }

      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/react"]).toBeUndefined();
      }
    });
  });

  describe("File Upload with Different Frontends", () => {
    const reactFrontends: Frontend[] = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
    ];

    for (const frontend of reactFrontends) {
      it(`should work with uploadthing + ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `uploadthing-${frontend}`,
          fileUpload: "uploadthing",
          database: "sqlite",
          orm: "drizzle",
          auth: "better-auth",
          frontend: [frontend],
          addons: ["turborepo"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        // Handle fullstack vs separate backend
        if (frontend === "next" || frontend === "tanstack-start") {
          config.backend = "self";
          config.runtime = "none";
          config.api = "trpc";
        } else {
          config.backend = "hono";
          config.runtime = "bun";
          config.api = "trpc";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }

    it("should work with uploadthing + svelte frontend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-svelte",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        auth: "better-auth",
        frontend: ["svelte"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that @uploadthing/svelte was added
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/svelte"]).toBeDefined();
      }
    });

    it("should work with uploadthing + nuxt frontend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-nuxt",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        auth: "better-auth",
        frontend: ["nuxt"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that @uploadthing/nuxt was added
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/nuxt"]).toBeDefined();
      }
    });

    it("should work with uploadthing + solid frontend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-solid",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        auth: "better-auth",
        frontend: ["solid"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that @uploadthing/solid was added
      const webPackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web")
        ?.children?.find((c: any) => c.name === "package.json");

      if (webPackageJson?.content) {
        const pkgJson = JSON.parse(webPackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/solid"]).toBeDefined();
      }
    });
  });

  describe("File Upload Not Available with Convex", () => {
    it("should skip file upload with convex backend (fileUpload defaults to none)", async () => {
      const result = await runTRPCTest({
        projectName: "fileupload-convex",
        fileUpload: "none", // File upload is not supported with Convex (backend handles storage)
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("File Upload Environment Variables", () => {
    it("should add UPLOADTHING_TOKEN to .env when fileUpload is uploadthing", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-env-vars",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that env variables were added
      const serverDir = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "server");

      const envFile = serverDir?.children?.find((c: any) => c.name === ".env");

      if (envFile?.content) {
        expect(envFile.content).toContain("UPLOADTHING_TOKEN");
      }
    });

    it("should add UPLOADTHING_TOKEN to web .env for fullstack frameworks", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-next-env-vars",
        fileUpload: "uploadthing",
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that env variables were added to web app
      const webDir = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "web");

      const envFile = webDir?.children?.find((c: any) => c.name === ".env");

      if (envFile?.content) {
        expect(envFile.content).toContain("UPLOADTHING_TOKEN");
      }
    });
  });

  describe("All File Upload Options", () => {
    const fileUploadOptions: FileUpload[] = ["uploadthing", "filepond", "none"];

    for (const fileUpload of fileUploadOptions) {
      it(`should work with fileUpload: ${fileUpload}`, async () => {
        const result = await runTRPCTest({
          projectName: `fileupload-${fileUpload}`,
          fileUpload,
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          api: "trpc",
          auth: "better-auth",
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("File Upload with Native Apps", () => {
    it("should add @uploadthing/expo for native-bare frontend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-native-bare",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["native-bare"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that @uploadthing/expo was added to native app
      const nativePackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "native")
        ?.children?.find((c: any) => c.name === "package.json");

      if (nativePackageJson?.content) {
        const pkgJson = JSON.parse(nativePackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/expo"]).toBeDefined();
      }
    });

    it("should add @uploadthing/expo for native-uniwind frontend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-native-uniwind",
        fileUpload: "uploadthing",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["native-uniwind"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);

      // Check that @uploadthing/expo was added to native app
      const nativePackageJson = result.result?.tree?.root?.children
        ?.find((c: any) => c.name === "apps")
        ?.children?.find((c: any) => c.name === "native")
        ?.children?.find((c: any) => c.name === "package.json");

      if (nativePackageJson?.content) {
        const pkgJson = JSON.parse(nativePackageJson.content);
        expect(pkgJson.dependencies?.["@uploadthing/expo"]).toBeDefined();
      }
    });
  });

  describe("File Upload with NestJS", () => {
    it("should work with uploadthing + nestjs backend", async () => {
      const result = await runTRPCTest({
        projectName: "uploadthing-nestjs",
        fileUpload: "uploadthing",
        backend: "nestjs",
        runtime: "node",
        database: "sqlite",
        orm: "drizzle",
        api: "trpc",
        auth: "better-auth",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
