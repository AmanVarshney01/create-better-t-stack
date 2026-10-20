import { expect } from "bun:test";
import { createServer } from "node:net";
import path from "node:path";

import { execa } from "execa";
import fs from "fs-extra";
import { z } from "zod";

import type { PackageManager } from "./samples";

export const packageScriptsSchema = z.object({
  scripts: z.record(z.string(), z.string()).optional(),
});

const serverAddressSchema = z.object({ port: z.number().int().positive() });

function readPositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const commandTimeoutMs = readPositiveIntEnv("BTS_BUILD_SAMPLE_COMMAND_TIMEOUT_MS", 600_000);
export const commandProgressIntervalMs = readPositiveIntEnv(
  "BTS_BUILD_SAMPLE_PROGRESS_INTERVAL_MS",
  30_000,
);
export const sampleTimeoutMs = readPositiveIntEnv("BTS_BUILD_SAMPLE_TIMEOUT_MS", 1_500_000);
export function formatOutput(output: string | undefined) {
  if (!output) return "";
  if (output.length <= 8_000) return output;

  const head = output.slice(0, 3_000);
  const tail = output.slice(-4_000);
  return `${head}\n\n... [${output.length - 7_000} chars omitted] ...\n\n${tail}`;
}

export async function runCommand(
  sampleName: string,
  projectDir: string,
  command: string,
  args: string[],
) {
  const commandLabel = [command, ...args].join(" ");
  const startedAt = Date.now();
  let progressInterval: ReturnType<typeof setInterval> | undefined;

  console.info(
    JSON.stringify({
      event: "generated-build:command:start",
      sample: sampleName,
      command: commandLabel,
    }),
  );

  try {
    progressInterval = setInterval(() => {
      console.info(
        JSON.stringify({
          event: "generated-build:command:progress",
          sample: sampleName,
          command: commandLabel,
          elapsedMs: Date.now() - startedAt,
        }),
      );
    }, commandProgressIntervalMs);

    const result = await execa(command, args, {
      cwd: projectDir,
      all: true,
      reject: false,
      timeout: commandTimeoutMs,
      env: {
        ...process.env,
        CI: "1",
        BTS_TELEMETRY: "0",
        NEXT_TELEMETRY_DISABLED: "1",
        HUSKY: "0",
        NODE_ENV: args.some((arg) => arg === "build" || arg.startsWith("build:"))
          ? "production"
          : process.env.NODE_ENV,
      },
    });

    if (result.failed) {
      throw new Error(
        [
          `Command failed in ${projectDir}: ${commandLabel}`,
          `Exit code: ${result.exitCode ?? "unknown"}`,
          formatOutput(result.all),
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
    }

    console.info(
      JSON.stringify({
        event: "generated-build:command:done",
        sample: sampleName,
        command: commandLabel,
        elapsedMs: Date.now() - startedAt,
      }),
    );
  } finally {
    if (progressInterval) clearInterval(progressInterval);
  }
}

export function getPackageManagerCommand(
  packageManager: PackageManager,
  script: "install" | "build",
) {
  if (script === "install") {
    return { command: packageManager, args: ["install"] };
  }
  return { command: packageManager, args: ["run", script] };
}

export async function runWorkspaceTypeChecks(
  sampleName: string,
  projectDir: string,
  packageManager: PackageManager,
) {
  for (const workspaceRoot of ["apps", "packages"]) {
    const rootDir = path.join(projectDir, workspaceRoot);
    if (!(await fs.pathExists(rootDir))) continue;

    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!entry.isDirectory()) continue;

      const workspaceDir = path.join(rootDir, entry.name);
      const packageJsonPath = path.join(workspaceDir, "package.json");
      if (!(await fs.pathExists(packageJsonPath))) continue;

      const packageJson = packageScriptsSchema.parse(await fs.readJson(packageJsonPath));
      const typecheckScript = packageJson.scripts?.["check-types"];
      if (await fs.pathExists(path.join(workspaceDir, "tsconfig.json"))) {
        expect(
          typecheckScript,
          `${sampleName}: ${workspaceRoot}/${entry.name} needs a check-types script`,
        ).toBeDefined();
      }
      if (!typecheckScript) continue;

      await runCommand(
        `${sampleName}:${workspaceRoot}/${entry.name}`,
        workspaceDir,
        packageManager,
        ["run", "check-types"],
      );
    }
  }
}
export async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = serverAddressSchema.safeParse(server.address());
      if (!address.success) {
        server.close();
        reject(new Error("Could not allocate a port for the generated runtime probe"));
        return;
      }

      server.close((error) => {
        if (error) reject(error);
        else resolve(address.data.port);
      });
    });
  });
}
export async function fetchWhenReady(url: string, init?: RequestInit) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(5000),
      });
      // SSR can send headers before compilation/streaming finishes. Consume the
      // body inside the retry boundary so a timeout does not escape afterwards.
      const body = await response.arrayBuffer();
      return new Response(body, { status: response.status, headers: response.headers });
    } catch {
      init?.signal?.throwIfAborted();
      await Bun.sleep(100);
      init?.signal?.throwIfAborted();
    }
  }

  return undefined;
}
