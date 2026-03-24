import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

async function generateReadme(config: Parameters<typeof createVirtual>[0]): Promise<string> {
  const result = await createVirtual({
    projectName: "readme-check",
    frontend: ["tanstack-router"],
    backend: "hono",
    runtime: "bun",
    database: "sqlite",
    orm: "drizzle",
    auth: "clerk",
    api: "trpc",
    addons: ["turborepo"],
    examples: ["todo"],
    dbSetup: "none",
    webDeploy: "none",
    serverDeploy: "none",
    install: false,
    git: false,
    packageManager: "bun",
    payments: "none",
    ...config,
  });

  expect(result.isOk()).toBe(true);

  if (result.isErr()) {
    throw result.error;
  }

  const files = collectFiles(result.value.root, result.value.root.path);
  return files.get("README.md") ?? "";
}

describe("README generation", () => {
  it("documents Clerk env setup for next + express", async () => {
    const readme = await generateReadme({
      frontend: ["next"],
      backend: "express",
    });

    expect(readme).toContain("`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `apps/web/.env`");
    expect(readme).toContain("`CLERK_SECRET_KEY` in `apps/web/.env` for Clerk server middleware");
    expect(readme).toContain("`CLERK_SECRET_KEY` in `apps/server/.env` for server-side Clerk auth");
    expect(readme).toContain(
      "`CLERK_PUBLISHABLE_KEY` in `apps/server/.env` for Clerk backend middleware",
    );
  });

  it("documents Clerk request verification for self backends", async () => {
    const readme = await generateReadme({
      frontend: ["next"],
      backend: "self",
      runtime: "none",
    });

    expect(readme).toContain("`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `apps/web/.env`");
    expect(readme).toContain(
      "`CLERK_SECRET_KEY` in `apps/web/.env` for Clerk server middleware and server-side Clerk auth",
    );
    expect(readme).toContain(
      "`CLERK_PUBLISHABLE_KEY` in `apps/web/.env` for server-side Clerk request verification",
    );
  });

  it("documents Clerk native env setup for standalone backends", async () => {
    const readme = await generateReadme({
      frontend: ["native-uniwind"],
      backend: "hono",
      api: "trpc",
    });

    expect(readme).toContain("`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `apps/native/.env`");
    expect(readme).toContain("`CLERK_SECRET_KEY` in `apps/server/.env` for server-side Clerk auth");
    expect(readme).toContain(
      "`CLERK_PUBLISHABLE_KEY` in `apps/server/.env` for server-side Clerk request verification",
    );
    expect(readme).not.toContain("Open [http://localhost:3001]");
    expect(readme).not.toContain("web/         # Frontend application");
  });
});
