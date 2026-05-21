import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

async function readBunfig(config: TestConfig) {
  const result = await runTRPCTest({
    ...config,
    packageManager: "bun",
    install: false,
    git: false,
  });

  expectSuccess(result);

  return readFile(path.join(result.projectDir!, "bunfig.toml"), "utf8");
}

describe("bunfig", () => {
  it("keeps native Expo stacks isolated without Bun peer auto-installs", async () => {
    const content = await readBunfig({
      projectName: "bunfig-native-expo",
      frontend: ["native-bare"],
      backend: "none",
      runtime: "none",
      api: "none",
      database: "none",
      orm: "none",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(content).toContain('linker = "isolated"');
    expect(content).toContain("peer = false");
  });

  it("keeps Nuxt hoisted for its resolver", async () => {
    const content = await readBunfig({
      projectName: "bunfig-nuxt",
      frontend: ["nuxt"],
      backend: "hono",
      runtime: "bun",
      api: "orpc",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      payments: "none",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
    });

    expect(content).toContain('linker = "hoisted"');
    expect(content).not.toContain("peer = false");
  });
});
