/**
 * Vercel configuration post-processor
 * Builds vercel.json programmatically (Vercel Services: web + server in one project)
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

type VercelRewrite = { source: string; destination: string | { service: string } };

type VercelRoute = {
  src: string;
  transforms: { type: string; op: string; args: string }[];
};

type VercelService = {
  root: string;
  framework: string;
  entrypoint?: string;
  installCommand?: string;
  buildCommand?: string;
  outputDirectory?: string;
  rewrites?: VercelRewrite[];
  routes?: VercelRoute[];
};

function getWebFramework(frontend: ProjectConfig["frontend"], isDesktop: boolean): string {
  if (frontend.includes("next")) return "nextjs";
  if (frontend.includes("nuxt")) return "nuxtjs";
  if (frontend.includes("svelte")) return "sveltekit";
  if (frontend.includes("astro")) return "astro";
  if (frontend.includes("tanstack-start")) return "tanstack-start";
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
    frontend.includes("tanstack-router") ||
    frontend.includes("solid") ||
    (frontend.includes("react-router") && isDesktop);
  const installCommand = `cd ../.. && ${packageManager} install`;

  const services: Record<string, VercelService> = {};

  if (hasWeb) {
    const web: VercelService = {
      root: "apps/web",
      framework: getWebFramework(frontend, isDesktop),
      installCommand,
    };
    if (hasServer) {
      // Same-origin /api: the client calls the domain it was served from
      web.buildCommand = `${getPublicServerUrlVar(frontend)}=/api ${packageManager} run build`;
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
    const server: VercelService = {
      root: "apps/server",
      framework: backend,
      entrypoint: "src/index.ts",
      installCommand,
    };
    if (hasWeb) {
      // /api/auth/* must reach the server unstripped: better-auth derives its
      // router base path from the public URL path
      server.routes = [
        {
          src: "/api/((?!auth(?:/|$)).*)",
          transforms: [{ type: "request.path", op: "set", args: "/$1" }],
        },
      ];
    }
    services.server = server;
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

  vfs.writeJson("vercel.json", {
    $schema: "https://openapi.vercel.sh/vercel.json",
    ...(hasServer && runtime === "bun" ? { bunVersion: "1.x" } : {}),
    services,
    rewrites,
  });
}
