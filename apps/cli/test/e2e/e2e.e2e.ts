import { beforeAll, describe, expect, it } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

import type { API, Backend, Runtime } from "../../src/types";

import {
  callORPC,
  callTRPC,
  checkHealth,
  setupE2EProject,
  startServer,
  type ServerProcess,
} from "./e2e-utils";

// E2E tests are expensive - only run when explicitly enabled with E2E=1
// These tests are NOT run in CI, only locally
const shouldRunE2E = process.env.E2E === "1";
const describeE2E = shouldRunE2E ? describe : describe.skip;

// E2E smoke directory - completely separate from unit test smoke directory
// Uses .smoke-e2e/ instead of .smoke/ to avoid interference with regular tests
const E2E_SMOKE_DIR = join(import.meta.dir, "..", "..", ".smoke-e2e");

// Test configurations
interface E2ETestConfig {
  name: string;
  backend: Backend;
  runtime: Runtime;
  api: API;
  callApi: (baseUrl: string, procedure: string) => Promise<{ status: number; body: unknown }>;
}

const testConfigs: E2ETestConfig[] = [
  {
    name: "hono-trpc-bun",
    backend: "hono",
    runtime: "bun",
    api: "trpc",
    callApi: callTRPC,
  },
  {
    name: "hono-orpc-bun",
    backend: "hono",
    runtime: "bun",
    api: "orpc",
    callApi: callORPC,
  },
  {
    name: "express-trpc-node",
    backend: "express",
    runtime: "node",
    api: "trpc",
    callApi: callTRPC,
  },
];

// Use a fixed port - servers listen on 3000 (hardcoded in templates)
const SERVER_PORT = 3000;

/**
 * Run E2E test for a single configuration
 * Handles full lifecycle: setup -> test -> teardown
 */
async function runE2ETest(config: E2ETestConfig): Promise<void> {
  let server: ServerProcess | null = null;

  try {
    // Generate the project with dependencies installed
    console.log(`[E2E] Setting up project: ${config.name}`);
    const result = await setupE2EProject(
      config.name,
      {
        backend: config.backend,
        runtime: config.runtime,
        api: config.api,
        frontend: ["tanstack-router"],
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        payments: "none",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        cssFramework: "tailwind",
        uiLibrary: "none",
        effect: "none",
        email: "none",
        fileUpload: "none",
        stateManagement: "none",
        forms: "react-hook-form",
        testing: "vitest",
        validation: "zod",
        realtime: "none",
        animation: "none",
        logging: "none",
        observability: "none",
        caching: "none",
        cms: "none",
        ai: "none",
        jobQueue: "none",
      },
      E2E_SMOKE_DIR,
    );

    if (!result.success) {
      throw new Error(`Failed to setup project: ${result.error}`);
    }

    const projectDir = result.projectDir;
    console.log(`[E2E] Project created at: ${projectDir}`);

    // Start the server
    console.log(`[E2E] Starting server on port ${SERVER_PORT}...`);
    server = await startServer(projectDir, {
      port: SERVER_PORT,
      timeout: 90000, // 90s timeout for server startup
    });
    console.log(`[E2E] Server started at: ${server.baseUrl}`);

    // Test 1: Health endpoint
    console.log(`[E2E] Testing health endpoint...`);
    const isHealthy = await checkHealth(server.baseUrl);
    expect(isHealthy).toBe(true);
    console.log(`[E2E] Health check passed`);

    // Test 2: API healthCheck procedure
    console.log(`[E2E] Testing API healthCheck procedure...`);
    const response = await config.callApi(server.baseUrl, "healthCheck");
    expect(response.status).toBe(200);

    // tRPC returns batched results, oRPC returns wrapped JSON
    if (config.api === "trpc") {
      // tRPC batch response format: [{ result: { data: "OK" } }]
      const body = response.body as Array<{ result: { data: string } }>;
      expect(body).toBeArray();
      expect(body[0]?.result?.data).toBe("OK");
    } else {
      // oRPC returns { json: value }
      const body = response.body as { json: string };
      expect(body.json).toBe("OK");
    }
    console.log(`[E2E] API healthCheck passed`);
  } finally {
    // Always cleanup server
    if (server) {
      console.log(`[E2E] Stopping server: ${config.name}`);
      await server.kill();
      // Wait for port to be released
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

describeE2E("E2E: Generated Project Tests", () => {
  // Setup E2E smoke directory once
  beforeAll(async () => {
    await rm(E2E_SMOKE_DIR, { recursive: true, force: true });
    await mkdir(E2E_SMOKE_DIR, { recursive: true });
  });

  // Each test runs a complete lifecycle for one configuration
  // Tests run sequentially, preventing port conflicts
  for (const config of testConfigs) {
    it(`${config.name}: generates, starts, and serves correctly`, async () => {
      await runE2ETest(config);
    }, 300000); // 5 minute timeout per config
  }
});
