import { expect, describe, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { expectError, expectSuccess, runCreateTest } from "./test-utils";

describe("Example Configurations", () => {
  describe("Todo Example", () => {
    it("should work with todo example + database + backend", async () => {
      const result = await runCreateTest({
        projectName: "todo-with-db",
        examples: ["todo"],
      });

      expectSuccess(result);
    });

    it("should work with todo example + convex backend", async () => {
      const result = await runCreateTest({
        projectName: "todo-convex",
        examples: ["todo"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
      });

      expectSuccess(result);
    });

    it("should work with todo example + no backend", async () => {
      const result = await runCreateTest({
        projectName: "todo-no-backend",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
      });

      expectSuccess(result);
    });

    it("should fail with todo example + backend + no database", async () => {
      const result = await runCreateTest({
        projectName: "todo-backend-no-db-fail",
        examples: ["todo"],
        database: "none",
        orm: "none",
      });

      expectError(result, "The 'todo' example requires a database");
    });
  });

  describe("AI Example", () => {
    it("should work with AI example + React frontend", async () => {
      const result = await runCreateTest({
        projectName: "ai-react",
        examples: ["ai"],
      });

      expectSuccess(result);
    });

    it("should work with AI example + Next.js", async () => {
      const result = await runCreateTest({
        projectName: "ai-next",
        examples: ["ai"],
        backend: "self",
        runtime: "none",
        auth: "better-auth",
        frontend: ["next"],
      });

      expectSuccess(result);
    });

    it("should work with AI example + Nuxt", async () => {
      const result = await runCreateTest({
        projectName: "ai-nuxt",
        examples: ["ai"],
        api: "orpc", // tRPC not supported with Nuxt
        frontend: ["nuxt"],
      });

      expectSuccess(result);
      const projectDir = result.result?.projectDirectory;
      if (!projectDir) throw new Error("Expected generated project directory");
      const aiPage = await readFile(join(projectDir, "apps/web/app/pages/ai.vue"), "utf-8");
      expect(aiPage).toContain('@reload="() => regenerate()"');
    });

    it("should work with AI example + Svelte", async () => {
      const result = await runCreateTest({
        projectName: "ai-svelte",
        examples: ["ai"],
        api: "orpc", // tRPC not supported with Svelte
        frontend: ["svelte"],
      });

      expectSuccess(result);
    });

    it("should fail with AI example + Solid frontend", async () => {
      const result = await runCreateTest({
        projectName: "ai-solid-fail",
        examples: ["ai"],
        api: "orpc",
        frontend: ["solid"],
      });

      expectError(result, "The 'ai' example is not compatible with the Solid frontend");
    });

    it("should fail with AI example + Astro frontend", async () => {
      const result = await runCreateTest({
        projectName: "ai-astro-fail",
        examples: ["ai"],
        api: "orpc",
        frontend: ["astro"],
      });

      expectError(result, "The 'ai' example is not compatible with the Astro frontend");
    });

    it("should fail with AI example + no backend", async () => {
      const result = await runCreateTest({
        projectName: "ai-no-backend-fail",
        examples: ["ai"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
      });

      expectError(result, "The 'ai' example requires a backend");
    });

    it("should work with AI example + Convex + React frontend", async () => {
      const result = await runCreateTest({
        projectName: "ai-convex-react",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
      });

      expectSuccess(result);
    });

    it("should work with AI example + Convex + Next.js", async () => {
      const result = await runCreateTest({
        projectName: "ai-convex-next",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "better-auth",
        api: "none",
        frontend: ["next"],
      });

      expectSuccess(result);
    });

    it("should fail with AI example + Convex + Svelte", async () => {
      const result = await runCreateTest({
        projectName: "ai-convex-svelte-fail",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["svelte"],
      });

      expectError(
        result,
        "The 'ai' example with Convex backend only supports React-based frontends (Next.js, TanStack Router, TanStack Start, React Router). Svelte and Nuxt are not supported with Convex AI.",
      );
    });

    it("should fail with AI example + Convex + Nuxt", async () => {
      const result = await runCreateTest({
        projectName: "ai-convex-nuxt-fail",
        examples: ["ai"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["nuxt"],
      });

      expectError(
        result,
        "The 'ai' example with Convex backend only supports React-based frontends (Next.js, TanStack Router, TanStack Start, React Router). Svelte and Nuxt are not supported with Convex AI.",
      );
    });

    it("should fail with Convex + Solid (blocked at backend level)", async () => {
      const result = await runCreateTest({
        projectName: "convex-solid-fail",
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["solid"],
      });

      expectError(
        result,
        "The following frontends are not compatible with '--backend convex': solid",
      );
    });
  });

  describe("Multiple Examples", () => {
    it("should work with both todo and AI examples", async () => {
      const result = await runCreateTest({
        projectName: "todo-ai-combo",
        examples: ["todo", "ai"],
      });

      expectSuccess(result);
    });

    it("should fail with both examples if one is incompatible", async () => {
      const result = await runCreateTest({
        projectName: "todo-ai-solid-fail",
        examples: ["todo", "ai"],
        api: "orpc",
        frontend: ["solid"],
      });

      expectError(result, "The 'ai' example is not compatible with the Solid frontend");
    });
  });

  describe("Examples with None Option", () => {
    it("should work with examples none", async () => {
      const result = await runCreateTest({
        projectName: "no-examples",
      });

      expectSuccess(result);
    });

    it("should fail with none + other examples", async () => {
      const result = await runCreateTest({
        projectName: "none-with-examples-fail",
        examples: ["none", "todo"],
      });

      expectError(result, "Cannot combine 'none' with other examples");
    });
  });

  describe("Examples with API None", () => {
    it("should fail with examples when API is none (non-convex backend)", async () => {
      const result = await runCreateTest({
        projectName: "examples-api-none-fail",
        examples: ["todo"],
        api: "none",
      });

      expectError(result, "Cannot use '--examples todo' when '--api' is set to 'none'");
    });

    it("should work with examples when API is none (convex backend)", async () => {
      const result = await runCreateTest({
        projectName: "examples-api-none-convex",
        examples: ["todo"],
        backend: "convex",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "clerk",
        api: "none",
      });

      expectSuccess(result);
    });
  });
});
