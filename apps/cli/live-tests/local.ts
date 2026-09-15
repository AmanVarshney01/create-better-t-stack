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

async function startService(config: ProjectConfig, commands: Commands, app: string, port: number) {
  await requireAvailablePort(port);
  const runtime = commands.start(
    `${app}-dev`,
    path.join(config.projectDir, "apps", app),
    config.packageManager,
    ["run", "dev"],
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

export async function startLocal(config: ProjectConfig, commands: Commands): Promise<Deployment> {
  const hasServer = !["none", "self", "convex"].includes(config.backend);
  const server = hasServer ? await startService(config, commands, "server", 3000) : undefined;
  if (!config.frontend.length) return { server };
  const webPort = config.frontend.some((f) => f === "svelte" || f === "react-router")
    ? 5173
    : config.frontend.includes("astro")
      ? 4321
      : 3001;
  const web = await startService(config, commands, "web", webPort);
  return { web, server: config.backend === "self" ? `${web}/api` : server };
}
