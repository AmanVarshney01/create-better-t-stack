import { createServer } from "node:net";
import path from "node:path";

import type { ProjectConfig } from "@better-t-stack/types";

import { Commands } from "./command";
import type { Deployment } from "./providers";

async function requireAvailablePort(port: number) {
  await new Promise<void>((resolve, reject) => {
    const server = createServer();
    server.once("error", () =>
      reject(
        new Error(`Port ${port} is occupied; stop the existing app before running local tests.`),
      ),
    );
    server.listen(port, () => server.close((error) => (error ? reject(error) : resolve())));
  });
}

type Mode = "development" | "production";

function serviceArgs(config: ProjectConfig, app: string, mode: Mode, port: number): string[] {
  if (mode === "development") return ["run", "dev"];
  if (app === "server") return ["run", "start"];
  const frontend = config.frontend[0];
  if (frontend === "next" || frontend === "react-router" || frontend === "solid")
    return ["run", "start"];
  if (frontend === "nuxt") return ["run", "preview"];
  const script =
    frontend === "tanstack-router" || frontend === "tanstack-start" ? "serve" : "preview";
  return [
    "run",
    script,
    ...(config.packageManager === "npm" ? ["--"] : []),
    "--port",
    String(port),
  ];
}

async function startService(
  config: ProjectConfig,
  commands: Commands,
  app: string,
  port: number,
  mode: Mode,
) {
  await requireAvailablePort(port);
  const runtime = commands.start(
    `${app}-${mode}`,
    path.join(config.projectDir, "apps", app),
    config.packageManager,
    serviceArgs(config, app, mode, port),
    {
      NODE_ENV: mode,
      PORT: String(port),
      NITRO_PORT: String(port),
      ASTRO_DEV_BACKGROUND: "0",
      ASTRO_PREVIEW_BACKGROUND: "0",
    },
  );
  const origin = `http://localhost:${port}`;
  const readiness = new AbortController();
  const signal = AbortSignal.any([commands.signal, readiness.signal]);
  const ready = async () => {
    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      signal.throwIfAborted();
      try {
        const response = await fetch(origin, {
          signal: AbortSignal.any([signal, AbortSignal.timeout(5_000)]),
        });
        await response.arrayBuffer();
        if (response.ok) return;
      } catch {
        signal.throwIfAborted();
      }
      await Bun.sleep(500);
    }
    throw new Error(`${app} did not become ready at ${origin}; ${runtime.log}`);
  };
  try {
    await Promise.race([
      ready(),
      runtime.finished.then((result) => {
        throw new Error(`${app} exited before becoming ready (${result.exitCode}); ${runtime.log}`);
      }),
    ]);
  } finally {
    readiness.abort();
  }
  return origin;
}

export async function startLocal(
  config: ProjectConfig,
  commands: Commands,
  mode: Mode,
): Promise<Deployment> {
  const hasServer = !["none", "self", "convex"].includes(config.backend);
  const server = hasServer ? await startService(config, commands, "server", 3000, mode) : undefined;
  if (!config.frontend.length) return { server };
  const webPort = config.frontend.some((f) => f === "svelte" || f === "react-router")
    ? 5173
    : config.frontend.includes("astro")
      ? 4321
      : 3001;
  const web = await startService(config, commands, "web", webPort, mode);
  return { web, server: config.backend === "self" ? `${web}/api` : server };
}
