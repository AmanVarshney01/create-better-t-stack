/**
 * JSON configuration post-processor
 * Applies config-dependent edits to JSON files so templates stay static.
 * Handlebars conditionals inside strict JSON force comma juggling; every
 * conditional JSON edit belongs here instead.
 */

import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

type JsonRecord = Record<string, unknown>;

type TsConfig = {
  compilerOptions?: JsonRecord & { types?: string[] };
  include?: string[];
  [key: string]: unknown;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  trustedDependencies?: string[];
  [key: string]: unknown;
};

export function processJsonConfigs(vfs: VirtualFileSystem, config: ProjectConfig): void {
  updateBaseTsconfig(vfs, config);
  updateNextTsconfig(vfs, config);
  updateServerTsconfig(vfs, config);
  updateBiomeConfig(vfs, config);
  updateComponentsJson(vfs, config);
  updateSvelteAdapter(vfs, config);
  updateServerPackage(vfs, config);
  normalizeWorkspaceProtocol(vfs, config);
}

function usesCloudflare(config: ProjectConfig): boolean {
  return config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare";
}

function updateBaseTsconfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const path = "packages/config/tsconfig.base.json";
  const tsconfig = vfs.readJson<TsConfig>(path);
  if (!tsconfig?.compilerOptions) return;

  const types = [config.runtime === "bun" ? "bun" : "node"];
  if (usesCloudflare(config)) {
    types.push("@cloudflare/workers-types");
  }
  tsconfig.compilerOptions.types = types;
  vfs.writeJson(path, tsconfig);
}

function updateNextTsconfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.frontend.includes("next")) return;

  const path = "apps/web/tsconfig.json";
  const tsconfig = vfs.readJson<TsConfig>(path);
  if (!tsconfig?.compilerOptions) return;

  let changed = false;
  if (usesCloudflare(config)) {
    tsconfig.compilerOptions.types = ["@cloudflare/workers-types"];
    changed = true;
  }
  if (config.serverDeploy === "cloudflare" && Array.isArray(tsconfig.include)) {
    tsconfig.include = ["../server/env.d.ts", ...tsconfig.include];
    changed = true;
  }
  if (changed) vfs.writeJson(path, tsconfig);
}

function updateServerTsconfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.backend !== "hono") return;

  const path = "apps/server/tsconfig.json";
  const tsconfig = vfs.readJson<TsConfig>(path);
  if (!tsconfig?.compilerOptions) return;

  tsconfig.compilerOptions.jsxImportSource = "hono/jsx";
  vfs.writeJson(path, tsconfig);
}

function updateBiomeConfig(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const hasSvelte = config.frontend.includes("svelte");
  const hasNuxt = config.frontend.includes("nuxt");
  if (!hasSvelte && !hasNuxt) return;

  const path = "biome.json";
  const biome = vfs.readJson<JsonRecord>(path);
  if (!biome) return;

  // Svelte/Vue compilers rely on patterns these rules flag
  biome.overrides = [
    {
      includes: ["**/*.svelte", "**/*.vue"],
      linter: {
        rules: {
          style: {
            useConst: "off",
            useImportType: "off",
          },
          correctness: {
            noUnusedVariables: "off",
            noUnusedImports: "off",
          },
        },
      },
    },
  ];
  vfs.writeJson(path, biome);
}

function updateComponentsJson(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.frontend.includes("next")) return;

  for (const path of ["packages/ui/components.json", "apps/web/components.json"]) {
    const components = vfs.readJson<JsonRecord>(path);
    if (!components) continue;
    components.rsc = true;
    vfs.writeJson(path, components);
  }
}

function updateSvelteAdapter(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.frontend.includes("svelte")) return;
  const isDesktop = config.addons.includes("tauri") || config.addons.includes("electrobun");
  if (!isDesktop) return;

  const path = "apps/web/package.json";
  const pkg = vfs.readJson<PackageJson>(path);
  if (!pkg?.devDependencies) return;

  // Desktop addons bundle static assets; SvelteKit must emit a static build
  delete pkg.devDependencies["@sveltejs/adapter-auto"];
  pkg.devDependencies["@sveltejs/adapter-static"] = "^3.0.10";
  vfs.writeJson(path, pkg);
}

function updateServerPackage(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.dbSetup !== "supabase") return;

  const path = "apps/server/package.json";
  const pkg = vfs.readJson<PackageJson>(path);
  if (!pkg) return;

  // Bun blocks postinstall scripts unless the package is trusted
  pkg.trustedDependencies = ["supabase"];
  vfs.writeJson(path, pkg);
}

function normalizeWorkspaceProtocol(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.packageManager !== "npm") return;

  for (const path of vfs.getAllFiles()) {
    if (!path.endsWith("package.json")) continue;
    const pkg = vfs.readJson<PackageJson>(path);
    if (!pkg) continue;

    let changed = false;
    for (const section of ["dependencies", "devDependencies"] as const) {
      const deps = pkg[section];
      if (!deps) continue;
      for (const [name, version] of Object.entries(deps)) {
        if (version.startsWith("workspace:")) {
          deps[name] = "*";
          changed = true;
        }
      }
    }
    if (changed) vfs.writeJson(path, pkg);
  }
}
