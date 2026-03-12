import { afterAll, describe, expect, it } from "bun:test";
import { execa } from "execa";
import { existsSync } from "node:fs";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { expectSuccess, runTRPCTest } from "./test-utils";

const NATIVE_BUN = resolve(homedir(), ".bun", "bin", "bun");
const BUN_EXECUTABLE = process.env.BFS_TEST_BUN_BIN || (existsSync(NATIVE_BUN) ? NATIVE_BUN : "bun");
const EXTERNAL_TEMP_BASE = process.platform === "linux" ? "/tmp" : tmpdir();
const TEMP_ROOTS: string[] = [];

async function makeTempRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(join(EXTERNAL_TEMP_BASE, prefix));
  TEMP_ROOTS.push(root);
  return root;
}

async function copyProjectOutsideWorkspace(projectDir: string, label: string): Promise<string> {
  const root = await makeTempRoot(`bfs-react-vite-${label}-`);
  const targetDir = join(root, "app");
  await cp(projectDir, targetDir, { recursive: true });
  return targetDir;
}

async function installAndBuildProject(
  projectDir: string,
  extraWebCommand?: readonly string[],
): Promise<void> {
  await execa(BUN_EXECUTABLE, ["install"], {
    cwd: projectDir,
    env: {
      ...process.env,
      CI: "true",
    },
  });

  await execa(BUN_EXECUTABLE, ["run", "--filter", "web", "build"], {
    cwd: projectDir,
    env: {
      ...process.env,
      CI: "true",
    },
  });

  if (extraWebCommand) {
    await execa(BUN_EXECUTABLE, extraWebCommand, {
      cwd: projectDir,
      env: {
        ...process.env,
        CI: "true",
      },
    });
  }
}

afterAll(async () => {
  await Promise.all(TEMP_ROOTS.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("React + Vite", () => {
  it("scaffolds a routed SPA shell by default", async () => {
    const result = await runTRPCTest({
      projectName: "react-vite-routed-spa",
      frontend: ["react-vite"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      api: "trpc",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
    });

    expectSuccess(result);
    expect(result.projectDir).toBeDefined();

    const projectDir = result.projectDir!;
    const pkgJson = JSON.parse(await readFile(join(projectDir, "apps/web/package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
    };
    const main = await readFile(join(projectDir, "apps/web/src/main.tsx"), "utf8");
    const router = await readFile(join(projectDir, "apps/web/src/router.tsx"), "utf8");
    const appShell = await readFile(join(projectDir, "apps/web/src/app-shell.tsx"), "utf8");
    const home = await readFile(join(projectDir, "apps/web/src/routes/home.tsx"), "utf8");

    expect(pkgJson.dependencies?.["react-router"]).toBeDefined();
    expect(main).toContain("RouterProvider");
    expect(router).toContain("createBrowserRouter");
    expect(appShell).toContain("<Outlet />");
    expect(home).toContain("API Status");
  });

  const buildMatrix = [
    {
      name: "base tRPC",
      projectName: "react-vite-trpc-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "none" as const,
        api: "trpc" as const,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "oRPC",
      projectName: "react-vite-orpc-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "none" as const,
        api: "orpc" as const,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "better-auth",
      projectName: "react-vite-better-auth-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "better-auth" as const,
        api: "trpc" as const,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "stripe",
      projectName: "react-vite-stripe-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "none" as const,
        api: "trpc" as const,
        payments: "stripe" as const,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "polar + better-auth",
      projectName: "react-vite-polar-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "better-auth" as const,
        api: "trpc" as const,
        payments: "polar" as const,
        addons: ["none"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "AI example",
      projectName: "react-vite-ai-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "none" as const,
        api: "trpc" as const,
        addons: ["none"] as const,
        examples: ["ai"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "PWA",
      projectName: "react-vite-pwa-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "none" as const,
        api: "trpc" as const,
        addons: ["pwa"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
    },
    {
      name: "Storybook",
      projectName: "react-vite-storybook-build",
      config: {
        frontend: ["react-vite"] as const,
        backend: "hono" as const,
        runtime: "bun" as const,
        database: "sqlite" as const,
        orm: "drizzle" as const,
        auth: "none" as const,
        api: "trpc" as const,
        addons: ["storybook"] as const,
        examples: ["none"] as const,
        dbSetup: "none" as const,
        webDeploy: "none" as const,
        serverDeploy: "none" as const,
        install: false,
      },
      extraWebCommand: ["run", "--filter", "web", "build-storybook"] as const,
    },
  ] as const;

  for (const entry of buildMatrix) {
    it(
      `installs and builds outside the monorepo for ${entry.name}`,
      async () => {
        const result = await runTRPCTest({
          projectName: entry.projectName,
          ...entry.config,
        });

        expectSuccess(result);
        expect(result.projectDir).toBeDefined();

        const externalProjectDir = await copyProjectOutsideWorkspace(
          result.projectDir!,
          entry.projectName,
        );

        await installAndBuildProject(externalProjectDir, entry.extraWebCommand);
      },
      300_000,
    );
  }
});
