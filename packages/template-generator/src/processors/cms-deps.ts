import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processCMSDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { cms, frontend, database } = config;

  // Skip if not selected or set to "none"
  if (!cms || cms === "none") return;

  // Both Payload and Sanity require Next.js for optimal integration
  const hasNext = frontend.includes("next");

  if (cms === "payload") {
    // Payload is a Next.js-only CMS in v3
    if (!hasNext) return;

    const webPath = "apps/web/package.json";
    if (vfs.exists(webPath)) {
      const deps = getPayloadDeps(database);
      if (deps.length > 0) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: deps,
        });
      }
    }
  }

  if (cms === "sanity") {
    // Sanity works best with Next.js due to next-sanity integration
    if (!hasNext) return;

    const webPath = "apps/web/package.json";
    if (vfs.exists(webPath)) {
      const deps = getSanityDeps();
      if (deps.length > 0) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: deps,
        });
      }
    }
  }

  if (cms === "strapi") {
    // Strapi client works with any frontend but we provide Next.js templates
    if (!hasNext) return;

    const webPath = "apps/web/package.json";
    if (vfs.exists(webPath)) {
      const deps = getStrapiDeps();
      if (deps.length > 0) {
        addPackageDependency({
          vfs,
          packagePath: webPath,
          dependencies: deps,
        });
      }
    }
  }
}

function getPayloadDeps(database: ProjectConfig["database"]): AvailableDependencies[] {
  const deps: AvailableDependencies[] = [
    "payload",
    "@payloadcms/next",
    "@payloadcms/richtext-lexical",
  ];

  // Add appropriate database adapter based on selected database
  switch (database) {
    case "postgres":
      deps.push("@payloadcms/db-postgres");
      break;
    case "mongodb":
      deps.push("@payloadcms/db-mongodb");
      break;
    case "sqlite":
      deps.push("@payloadcms/db-sqlite");
      break;
    default:
      // Default to SQLite for simplicity
      deps.push("@payloadcms/db-sqlite");
      break;
  }

  return deps;
}

function getSanityDeps(): AvailableDependencies[] {
  return ["sanity", "next-sanity", "@sanity/image-url", "@sanity/vision"];
}

function getStrapiDeps(): AvailableDependencies[] {
  return ["@strapi/client", "qs"];
}
