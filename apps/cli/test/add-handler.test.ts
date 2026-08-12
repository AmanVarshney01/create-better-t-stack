import { describe, expect, it } from "bun:test";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { add } from "../src/index";
import { SMOKE_DIR } from "./setup";

describe("add()", () => {
  it("returns an error in silent mode instead of exiting when the project config is missing", async () => {
    const projectDir = join(SMOKE_DIR, "missing-bts-config");
    await mkdir(projectDir, { recursive: true });

    const result = await add({
      projectDir,
      addons: ["biome"],
      install: false,
    });

    expect(result).toBeDefined();
    expect(result?.success).toBe(false);
    expect(result?.error).toContain("No Better-T-Stack project found");
  });

  it("revalidates deployment constraints when adding an addon", async () => {
    const cases = [
      {
        name: "cloudflare-next-sentry",
        existingAddons: ["none"],
        addon: "sentry",
        webDeploy: "cloudflare",
        frontend: ["next"],
        expected: "current OpenNext release cannot trace Next.js 16 instrumentation output",
      },
    ] as const;

    for (const testCase of cases) {
      const projectDir = join(SMOKE_DIR, `add-${testCase.name}`);
      await rm(projectDir, { recursive: true, force: true });
      await mkdir(projectDir, { recursive: true });
      await writeFile(
        join(projectDir, "bts.jsonc"),
        JSON.stringify({
          version: "0.0.0-test",
          createdAt: new Date(0).toISOString(),
          database: "none",
          orm: "none",
          backend: "none",
          runtime: "none",
          frontend: testCase.frontend,
          addons: testCase.existingAddons,
          examples: ["none"],
          auth: "none",
          payments: "none",
          packageManager: "bun",
          dbSetup: "none",
          api: "none",
          webDeploy: testCase.webDeploy,
          serverDeploy: "none",
        }),
      );

      const result = await add({
        projectDir,
        addons: [testCase.addon],
        install: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain(testCase.expected);
    }
  });

  it("preserves existing web and server source when adding Sentry", async () => {
    const projectDir = join(SMOKE_DIR, "add-sentry-existing-source");
    const hooksPath = join(projectDir, "apps/web/src/hooks.server.ts");
    const serverPath = join(projectDir, "apps/server/src/index.ts");
    await rm(projectDir, { recursive: true, force: true });
    await mkdir(join(projectDir, "apps/web/src"), { recursive: true });
    await mkdir(join(projectDir, "apps/server/src"), { recursive: true });
    await writeFile(
      join(projectDir, "bts.jsonc"),
      JSON.stringify({
        version: "0.0.0-test",
        createdAt: new Date(0).toISOString(),
        database: "none",
        orm: "none",
        backend: "hono",
        runtime: "bun",
        frontend: ["svelte"],
        addons: ["none"],
        examples: ["none"],
        auth: "none",
        payments: "none",
        packageManager: "bun",
        dbSetup: "none",
        api: "orpc",
        webDeploy: "none",
        serverDeploy: "none",
      }),
    );
    await writeFile(
      hooksPath,
      `import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.sourceMarker = "keep-web-hook";
  return resolve(event);
};
`,
    );
    await writeFile(
      serverPath,
      `import { Hono } from "hono";

const app = new Hono();
app.get("/source-marker", (c) => c.text("keep-server-route"));

export default app;
`,
    );

    const result = await add({
      projectDir,
      addons: ["sentry"],
      install: false,
    });

    expect(result.success).toBe(true);
    const hooks = await readFile(hooksPath, "utf8");
    const server = await readFile(serverPath, "utf8");
    expect(hooks).toContain('event.locals.sourceMarker = "keep-web-hook"');
    expect(hooks).toContain("const appHandle: Handle = async");
    expect(hooks).toContain("export const handle = sequence(sentryHandle, appHandle)");
    expect(server).toContain('app.get("/source-marker"');
    expect(server).toContain("app.use(sentry(app");
  });
});
