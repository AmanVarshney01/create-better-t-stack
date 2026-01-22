import type { ExecaChildProcess } from "execa";

import { execa } from "execa";
import { join } from "node:path";

import { runTRPCTest, type TestConfig } from "../test-utils";

export interface ServerProcess {
  process: ExecaChildProcess;
  port: number;
  baseUrl: string;
  kill: () => Promise<void>;
}

export interface E2EProjectResult {
  projectDir: string;
  success: boolean;
  error?: string;
}

export interface StartServerOptions {
  packageManager?: "bun" | "npm" | "pnpm";
  port?: number;
  timeout?: number;
}

/**
 * Generate a project with dependencies installed for E2E testing
 */
export async function setupE2EProject(
  projectName: string,
  config: Partial<TestConfig>,
  smokeDir?: string,
): Promise<E2EProjectResult> {
  const result = await runTRPCTest({
    projectName,
    install: true,
    git: false,
    smokeDir,
    ...config,
  });

  return {
    projectDir: result.projectDir ?? "",
    success: result.success,
    error: result.error,
  };
}

/**
 * Start the dev server and wait for it to be ready
 */
export async function startServer(
  projectDir: string,
  options: StartServerOptions = {},
): Promise<ServerProcess> {
  const { packageManager = "bun", port = 3000, timeout = 60000 } = options;

  const serverDir = join(projectDir, "apps", "server");
  const baseUrl = `http://localhost:${port}`;

  // Use the package manager to run the dev script
  // The dev script handles runtime-specific execution (bun run --hot vs tsx watch)
  let command: string;
  let args: string[];

  switch (packageManager) {
    case "npm":
      command = "npm";
      args = ["run", "dev"];
      break;
    case "pnpm":
      command = "pnpm";
      args = ["dev"];
      break;
    case "bun":
    default:
      command = "bun";
      args = ["run", "dev"];
      break;
  }

  let serverOutput = "";
  let serverError = "";

  const serverProcess = execa(command, args, {
    cwd: serverDir,
    stdio: "pipe",
    env: {
      ...process.env,
      PORT: String(port),
      NODE_ENV: "development",
    },
    reject: false,
  });

  // Define handlers so we can remove them later
  const stdoutHandler = (data: Buffer) => {
    serverOutput += data.toString();
  };
  const stderrHandler = (data: Buffer) => {
    serverError += data.toString();
  };

  // Capture server output for debugging
  serverProcess.stdout?.on("data", stdoutHandler);
  serverProcess.stderr?.on("data", stderrHandler);

  // Wait for server to be ready
  const isReady = await waitForServer(baseUrl, timeout);

  if (!isReady) {
    // Remove listeners before killing to prevent unhandled events
    serverProcess.stdout?.off("data", stdoutHandler);
    serverProcess.stderr?.off("data", stderrHandler);
    serverProcess.kill("SIGTERM");
    console.error(`[E2E] Server stdout:\n${serverOutput}`);
    console.error(`[E2E] Server stderr:\n${serverError}`);
    throw new Error(`Server failed to start within ${timeout}ms. Check server logs above.`);
  }

  return {
    process: serverProcess,
    port,
    baseUrl,
    kill: async () => {
      // Remove event listeners before killing to prevent unhandled events
      serverProcess.stdout?.off("data", stdoutHandler);
      serverProcess.stderr?.off("data", stderrHandler);

      serverProcess.kill("SIGTERM");
      // Give it a moment to gracefully shutdown
      await new Promise((r) => setTimeout(r, 1000));
      if (!serverProcess.killed) {
        serverProcess.kill("SIGKILL");
      }
      // Wait a bit more for streams to fully close
      await new Promise((r) => setTimeout(r, 100));
    },
  };
}

/**
 * Poll URL until it responds or timeout
 */
export async function waitForServer(url: string, timeout = 60000): Promise<boolean> {
  const start = Date.now();
  const pollInterval = 500;

  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, pollInterval));
  }

  return false;
}

/**
 * Check the health endpoint (GET /)
 */
export async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(baseUrl, {
      signal: AbortSignal.timeout(10000),
    });
    const text = await response.text();
    return response.ok && text === "OK";
  } catch {
    return false;
  }
}

/**
 * Call a tRPC procedure via HTTP
 * tRPC queries use GET with input in query params, mutations use POST
 */
export async function callTRPC(
  baseUrl: string,
  procedure: string,
  input?: unknown,
): Promise<{ status: number; body: unknown }> {
  // tRPC queries use GET requests with batch format
  const url = new URL(`/trpc/${procedure}`, baseUrl);

  // For queries with no input, we still need the batch format
  const inputParam = input !== undefined ? JSON.stringify({ 0: input }) : JSON.stringify({ 0: {} });
  url.searchParams.set("batch", "1");
  url.searchParams.set("input", inputParam);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    const body = await response.json();
    return { status: response.status, body };
  } catch (error) {
    return {
      status: 500,
      body: { error: error instanceof Error ? error.message : "Unknown error" },
    };
  }
}

/**
 * Call an oRPC procedure via HTTP
 * oRPC uses POST requests with the procedure path
 */
export async function callORPC(
  baseUrl: string,
  procedure: string,
  input?: unknown,
): Promise<{ status: number; body: unknown }> {
  const url = new URL(`/rpc/${procedure}`, baseUrl);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: input !== undefined ? JSON.stringify(input) : undefined,
      signal: AbortSignal.timeout(10000),
    });

    const body = await response.json();
    return { status: response.status, body };
  } catch (error) {
    return {
      status: 500,
      body: { error: error instanceof Error ? error.message : "Unknown error" },
    };
  }
}
