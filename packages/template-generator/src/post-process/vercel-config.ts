/**
 * Vercel configuration post-processor
 * Builds vercel.json programmatically (Vercel Services: web + server in one project)
 */

import type { ProjectConfig } from "@better-t-stack/types";
import type { ServiceConfig, Services } from "@vercel/build-utils";

import type { VirtualFileSystem } from "../core/virtual-fs";

type VercelRewrite = NonNullable<ServiceConfig["rewrites"]>[number];

type PackageJson = { varlock?: { loadPath: string } };

function getWebFramework(frontend: ProjectConfig["frontend"], isDesktop: boolean): string {
  if (frontend.includes("next")) return "nextjs";
  if (frontend.includes("nuxt")) return "nuxtjs";
  if (frontend.includes("svelte")) return "sveltekit";
  if (frontend.includes("astro")) return "astro";
  if (frontend.includes("tanstack-start")) return "tanstack-start";
  if (frontend.includes("solid")) return "nitro";
  // Desktop addons force React Router into a static export served as a plain vite app
  if (frontend.includes("react-router") && !isDesktop) return "react-router";
  return "vite";
}

function getPublicServerUrlVar(frontend: ProjectConfig["frontend"]): string {
  if (frontend.includes("next")) return "NEXT_PUBLIC_SERVER_URL";
  if (frontend.includes("nuxt")) return "NUXT_PUBLIC_SERVER_URL";
  if (frontend.includes("svelte") || frontend.includes("astro")) return "PUBLIC_SERVER_URL";
  return "VITE_SERVER_URL";
}

export function processVercelConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, backend, runtime, frontend, addons, packageManager } = config;

  if (webDeploy !== "vercel" && serverDeploy !== "vercel") return;

  const hasWeb = webDeploy === "vercel";
  const hasServer = serverDeploy === "vercel" && backend !== "self";
  const isDesktop = addons.includes("tauri") || addons.includes("electrobun");
  const isStaticSpa =
    frontend.includes("tanstack-router") || (frontend.includes("react-router") && isDesktop);
  const installCommand = `cd ../.. && ${packageManager} install`;

  const services: Services = {};

  if (hasWeb) {
    const web: ServiceConfig = {
      root: "apps/web",
      framework: getWebFramework(frontend, isDesktop),
      installCommand,
    };
    if (hasServer) {
      // Same-origin /api: the client calls the domain it was served from
      web.buildCommand = `${getPublicServerUrlVar(frontend)}=/api ${packageManager} run build`;
      if (!isStaticSpa) {
        // SSR calls the server over an internal, deployment-aware URL that skips
        // Deployment Protection, so protected previews still render their data
        web.bindings = [{ type: "service", service: "server", format: "url", env: "SERVER_URL" }];
      }
    }
    if (frontend.includes("react-router") && isDesktop) {
      web.outputDirectory = "build/client";
    }
    if (isStaticSpa) {
      web.rewrites = [{ source: "/(.*)", destination: "/index.html" }];
    }
    services.web = web;
  }

  if (hasServer) {
    services.server = {
      root: "apps/server",
      framework: backend,
      entrypoint: "src/index.ts",
      installCommand,
      // Vercel compiles the entrypoint itself; a dist bundle would be deployed apart
      // from apps/server/node_modules, which bun and pnpm installs rely on
      buildCommand: `${packageManager} run env:generate && ${packageManager} run check-types`,
      functions: {
        // varlock/auto-load runs the Varlock CLI, which file tracing can't follow.
        // Paths are relative to the repository root, the function's working directory
        "src/index.ts": {
          includeFiles:
            "{package.json,apps/server/.env.schema,node_modules/.bin/varlock,node_modules/varlock/**}",
        },
      },
    };
    const pkg = vfs.readJson<PackageJson>("package.json");
    if (pkg) vfs.writeJson("package.json", { ...pkg, varlock: { loadPath: "./apps/server/" } });
  }

  if (config.orm === "prisma" && config.database !== "none") {
    // Prisma Client is generated code, so every service build has to create it first
    for (const service of Object.values(services)) {
      const command = service.buildCommand ?? `${packageManager} run build`;
      service.buildCommand = `cd ../.. && ${packageManager} run db:generate && cd ${service.root} && ${command}`;
    }
  }

  const rewrites: VercelRewrite[] = [];
  if (hasWeb && hasServer) {
    rewrites.push(
      { source: "/api/(.*)", destination: { service: "server" } },
      { source: "/(.*)", destination: { service: "web" } },
    );
  } else if (hasWeb) {
    rewrites.push({ source: "/(.*)", destination: { service: "web" } });
  } else if (hasServer) {
    rewrites.push({ source: "/(.*)", destination: { service: "server" } });
  }

  const vercelConfig = {
    $schema: "https://openapi.vercel.sh/vercel.json",
    bunVersion: runtime === "bun" ? "1.x" : undefined,
    services,
    rewrites,
  };
  vfs.writeFile("vercel.json", JSON.stringify(vercelConfig, null, 2));
}
