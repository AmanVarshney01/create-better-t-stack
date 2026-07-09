import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processAlchemyPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, frontend, backend } = config;

  if (webDeploy !== "cloudflare") return;

  if (frontend.includes("next")) {
    processNextAlchemy(vfs, config);
  } else if (frontend.includes("react-router")) {
    processReactRouterAlchemy(vfs);
  } else if (frontend.includes("svelte")) {
    // keep the adapter's worker internals out of the public asset upload
    vfs.writeFile("apps/web/static/.assetsignore", "_worker.js\n_routes.json\n");
    if (backend === "self") {
      writeDevWranglerConfig(vfs, config);
    }
  } else if (frontend.includes("nuxt") && backend === "self") {
    writeDevWranglerConfig(vfs, config);
    // page SSR runs through vite-node, which cannot resolve workerd's
    // cloudflare:workers module; nuxt.config aliases it to this proxy in dev
    vfs.writeFile(
      "apps/web/cloudflare-workers.dev.ts",
      `import { getPlatformProxy } from "wrangler";

const proxy = await getPlatformProxy();

export const env: Record<string, unknown> = new Proxy(
	{},
	{
		get(_target, prop) {
			if (typeof prop !== "string") return undefined;
			return (proxy.env as Record<string, unknown>)[prop] ?? process.env[prop];
		},
	},
);
`,
    );
  } else if (backend === "self" && frontend.includes("astro")) {
    // framework dev servers read local bindings (miniflare D1) from this config
    writeDevWranglerConfig(vfs, config);
  }
}

function d1DatabasesBlock(config: ProjectConfig): string {
  if (config.dbSetup !== "d1") return "";
  const isPrisma = config.orm === "prisma";
  const migrationsDir = isPrisma
    ? "../../packages/db/prisma/migrations"
    : "../../packages/db/src/migrations";
  // prisma nests migrations as <timestamp>_<name>/migration.sql
  const pattern = isPrisma ? `,\n      "migrations_pattern": "*/migration.sql"` : "";
  return `,
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "${config.projectName}-db-local",
      "database_id": "local",
      "migrations_dir": "${migrationsDir}"${pattern}
    }
  ]`;
}

function writeDevWranglerConfig(vfs: VirtualFileSystem, config: ProjectConfig) {
  const wranglerConfigPath = "apps/web/wrangler.jsonc";
  if (vfs.exists(wranglerConfigPath) || config.dbSetup !== "d1") return;
  vfs.writeFile(
    wranglerConfigPath,
    `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "${config.projectName}-web",
  "compatibility_date": "2025-05-05",
  "compatibility_flags": ["nodejs_compat"]${d1DatabasesBlock(config)}
}
`,
  );
  addLocalD1MigrateScript(vfs);
}

function addLocalD1MigrateScript(vfs: VirtualFileSystem) {
  const webPkgPath = "apps/web/package.json";
  if (!vfs.exists(webPkgPath)) return;
  const raw = vfs.readFile(webPkgPath);
  if (!raw) return;
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts ?? {};
  if (!pkg.scripts["db:migrate:local"]) {
    pkg.scripts["db:migrate:local"] = "wrangler d1 migrations apply DB --local";
    vfs.writeFile(webPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}

// React Router's ssr build is a manifest, not a worker; these two files wrap it
// into a fetch handler (workers/app.ts, wired as the ssr rollup input by the
// vite config template) and render with web streams instead of node streams.
function processReactRouterAlchemy(vfs: VirtualFileSystem) {
  const webAppDir = "apps/web";

  const workerEntryPath = `${webAppDir}/workers/app.ts`;
  if (!vfs.exists(workerEntryPath)) {
    vfs.writeFile(
      workerEntryPath,
      `import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
	// @ts-expect-error - virtual module provided by React Router at build time
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	fetch(request: Request) {
		return requestHandler(request);
	},
};
`,
    );
  }

  const entryServerPath = `${webAppDir}/src/entry.server.tsx`;
  if (!vfs.exists(entryServerPath)) {
    vfs.writeFile(
      entryServerPath,
      `import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
) {
	let statusCode = responseStatusCode;
	let shellRendered = false;
	const userAgent = request.headers.get("user-agent");

	const body = await renderToReadableStream(
		<ServerRouter context={routerContext} url={request.url} />,
		{
			signal: request.signal,
			onError(error: unknown) {
				statusCode = 500;
				// errors after shell render stream to the client; only log those
				if (shellRendered) {
					console.error(error);
				}
			},
		},
	);
	shellRendered = true;

	// crawlers and SPA-mode prerenders need the full document before responding
	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: statusCode,
	});
}
`,
    );
  }
}

// OpenNext builds the Worker artifact that packages/infra deploys with
// `bundle: false`; it reads wrangler.jsonc for the worker/assets layout.
function processNextAlchemy(vfs: VirtualFileSystem, config: ProjectConfig) {
  const webAppDir = "apps/web";

  const openNextConfigPath = `${webAppDir}/open-next.config.ts`;
  if (!vfs.exists(openNextConfigPath)) {
    const openNextConfigContent = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
`;
    vfs.writeFile(openNextConfigPath, openNextConfigContent);
  }

  const wranglerConfigPath = `${webAppDir}/wrangler.jsonc`;
  if (!vfs.exists(wranglerConfigPath)) {
    const wranglerConfigContent = `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "${config.projectName}-web",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-05-05",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }${config.backend === "self" ? d1DatabasesBlock(config) : ""}
}
`;
    vfs.writeFile(wranglerConfigPath, wranglerConfigContent);
    if (config.backend === "self" && config.dbSetup === "d1") {
      addLocalD1MigrateScript(vfs);
    }
  }

  const webPkgPath = `${webAppDir}/package.json`;
  if (vfs.exists(webPkgPath)) {
    const raw = vfs.readFile(webPkgPath);
    if (raw) {
      const pkg = JSON.parse(raw);
      pkg.scripts = pkg.scripts ?? {};
      if (!pkg.scripts["build:cloudflare"]) {
        pkg.scripts["build:cloudflare"] = "opennextjs-cloudflare build";
      }
      vfs.writeFile(webPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    }
  }
}
