import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { create } from "../src/index";

const SMOKE_DIR_PATH = path.join(import.meta.dir, "..", ".smoke");

describe("Dodo payments generation", () => {
  it("emits Dodo deps and env vars for a reference stack", async () => {
    const projectPath = path.join(SMOKE_DIR_PATH, "dodo-reference-stack");
    await fs.remove(projectPath);

    const result = await create(projectPath, {
      frontend: ["next"],
      backend: "hono",
      runtime: "node",
      database: "none",
      orm: "none",
      api: "trpc",
      auth: "better-auth",
      payments: "dodo",
      addons: ["turborepo"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
      git: true,
      packageManager: "bun",
      disableAnalytics: true,
      directoryConflict: "overwrite",
    });

    expect(result.isOk()).toBe(true);

    const authPkgPath = path.join(projectPath, "packages", "auth", "package.json");
    const webPkgPath = path.join(projectPath, "apps", "web", "package.json");
    const serverEnvPath = path.join(projectPath, "apps", "server", ".env");
    const paymentsPath = path.join(projectPath, "packages", "auth", "src", "lib", "payments.ts");
    const successPath = path.join(
      projectPath,
      "apps",
      "web",
      "src",
      "app",
      "payment",
      "success",
      "page.tsx",
    );

    const authPkg = await fs.readJson(authPkgPath);
    const webPkg = await fs.readJson(webPkgPath);
    const serverEnv = await fs.readFile(serverEnvPath, "utf8");

    expect(authPkg.dependencies?.["@dodopayments/better-auth"]).toBeDefined();
    expect(authPkg.dependencies?.dodopayments).toBeDefined();
    expect(webPkg.dependencies?.["@dodopayments/better-auth"]).toBeDefined();
    expect(serverEnv).toContain("DODO_PAYMENTS_API_KEY=");
    expect(serverEnv).toContain("DODO_PAYMENTS_WEBHOOK_SECRET=");
    expect(serverEnv).toContain("DODO_PAYMENTS_ENVIRONMENT=");
    expect(await fs.pathExists(paymentsPath)).toBe(true);
    expect(await fs.pathExists(successPath)).toBe(true);
  });
});
