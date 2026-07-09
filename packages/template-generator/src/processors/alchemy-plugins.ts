import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processAlchemyPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, frontend } = config;

  if (webDeploy !== "cloudflare") return;

  if (frontend.includes("next")) {
    processNextAlchemy(vfs, config);
  } else if (frontend.includes("react-router")) {
    processReactRouterAlchemy(vfs);
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
      `import { renderToReadableStream } from "react-dom/server";
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

	if (routerContext.isSpaMode) {
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
  "compatibility_date": "2025-03-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
`;
    vfs.writeFile(wranglerConfigPath, wranglerConfigContent);
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
