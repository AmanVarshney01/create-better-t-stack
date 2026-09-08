import type { ProjectConfig } from "@better-t-stack/types";
import { dirname, relative } from "pathe";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { processSingleTemplate, type TemplateData } from "../template-handlers/utils";
import { addPackageDependency } from "../utils/add-deps";

type Package = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function importPath(from: string, to: string): string {
  const path = relative(dirname(from), to).replace(/\.ts$/, "");
  return path.startsWith(".") ? path : `./${path}`;
}

function schemaKeys(vfs: VirtualFileSystem, app: string, config: ProjectConfig): Set<string> {
  const keys = new Set<string>();
  for (const match of (vfs.readFile(`${app}/.env`) ?? "").matchAll(/^\s*#?\s*([A-Z][A-Z0-9_]*)=/gm))
    keys.add(match[1]!);
  if (app === "apps/web" && config.backend === "none") {
    for (const key of keys) if (key.endsWith("SERVER_URL")) keys.delete(key);
  }
  if (
    config.addons.includes("axiom") &&
    ((app === "apps/server" && ["hono", "express", "fastify", "elysia"].includes(config.backend)) ||
      (app === "apps/web" &&
        config.frontend.some((f) =>
          ["next", "tanstack-start", "nuxt", "svelte", "astro"].includes(f),
        )))
  ) {
    for (const key of ["AXIOM_API_KEY", "AXIOM_DATASET", "AXIOM_EDGE_URL"]) keys.add(key);
  }
  const server = app === (config.backend === "self" ? "apps/web" : "apps/server");
  if (server) {
    if (config.database !== "none" && config.dbSetup !== "d1") {
      if (
        config.database === "mysql" &&
        config.orm === "drizzle" &&
        config.dbSetup === "planetscale"
      ) {
        for (const key of ["DATABASE_HOST", "DATABASE_USERNAME", "DATABASE_PASSWORD"])
          keys.add(key);
      } else keys.add("DATABASE_URL");
      if (config.dbSetup === "turso") keys.add("DATABASE_AUTH_TOKEN");
    }
  }
  return keys;
}

function schema(keys: Set<string>, config: ProjectConfig): string {
  const lines = [
    "# @defaultRequired=true",
    "# @defaultSensitive=true",
    "# @currentEnv=$NODE_ENV",
    "# @generateTsTypes(path=./src/env.ts, exposeEnv=local)",
    "# ---",
    "",
    "# @public @type=enum(development, production, test)",
    "NODE_ENV=development",
    "",
  ];
  const vercel = config.webDeploy === "vercel" || config.serverDeploy === "vercel";
  if (vercel && (keys.has("BETTER_AUTH_URL") || keys.has("CORS_ORIGIN"))) {
    for (const key of ["VERCEL_ENV", "VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL"]) {
      lines.push("# @internal @required=false", `${key}=`, "");
    }
    lines.push(
      "# @internal @required=false @type=url(prependHttps=true)",
      "VERCEL_ORIGIN=if(eq($VERCEL_ENV, production), fallback($VERCEL_PROJECT_PRODUCTION_URL, $VERCEL_URL), fallback($VERCEL_URL, $VERCEL_PROJECT_PRODUCTION_URL))",
      "",
    );
  }
  for (const key of keys) {
    if (key === "NODE_ENV") continue;
    if (key.startsWith("AXIOM_")) {
      lines.push(
        "# Supplied by Alchemy at runtime; builds do not need ingest credentials.",
        `# @dynamic @required=false @type=${key === "AXIOM_EDGE_URL" ? "url" : "string(minLength=1)"}`,
        `${key}=`,
        "",
      );
      continue;
    }
    const isPublic = /^(VITE_|NEXT_PUBLIC_|NUXT_PUBLIC_|PUBLIC_|EXPO_PUBLIC_)/.test(key);
    let type = "string(minLength=1)";
    if (key === "BETTER_AUTH_SECRET") type = "string(minLength=32)";
    else if ((key.endsWith("URL") && key !== "DATABASE_URL") || key === "CORS_ORIGIN") type = "url";
    if (
      key.endsWith("SERVER_URL") &&
      config.webDeploy === "vercel" &&
      config.serverDeploy === "vercel"
    ) {
      type = 'string(matches="^(https?://|/(?!/))")';
    }
    const publicServer = [
      "CORS_ORIGIN",
      "BETTER_AUTH_URL",
      "POLAR_SUCCESS_URL",
      "CLERK_PUBLISHABLE_KEY",
    ].includes(key);
    let value = "";
    if (vercel && ["BETTER_AUTH_URL", "CORS_ORIGIN"].includes(key)) {
      value = "$VERCEL_ORIGIN";
      if (
        key === "BETTER_AUTH_URL" &&
        config.webDeploy === "vercel" &&
        config.serverDeploy === "vercel" &&
        config.backend !== "self"
      ) {
        value = 'if($VERCEL_ORIGIN, "${VERCEL_ORIGIN}/api/auth", undefined)';
      }
    }
    if (key.includes("CONVEX_") && key.endsWith("URL"))
      type = 'url(matches="^(?!https?://example[.]convex[.])")';
    lines.push(
      `# ${isPublic ? "@public " : publicServer ? "@public @dynamic " : ""}@type=${type}`,
      `${key}=${value}`,
      "",
    );
  }
  return lines.join("\n");
}

function processAlchemySchema(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const source = vfs.readFile("packages/infra/alchemy.run.ts");
  if (!source) return;
  // Import only actual deployment inputs. Resource URLs and managed database
  // credentials are Alchemy outputs, so validating them here blocks provisioning.
  const inputs = new Set([
    "NODE_ENV",
    ...Array.from(source.matchAll(/Config\.(?:string|redacted)\("([A-Z_]+)"\)/g), (m) => m[1]!),
  ]);
  const imports: string[] = [];
  for (const app of ["apps/server", "apps/web"]) {
    if (!vfs.exists(`${app}/.env.schema`)) continue;
    const keys = new Set(["NODE_ENV", ...schemaKeys(vfs, app, config)]);
    const pick = [...inputs].filter((key) => keys.has(key));
    if (!pick.length) continue;
    imports.push(`# @import(../../${app}/, pick=[${pick.join(", ")}])`);
    for (const key of pick) inputs.delete(key);
  }
  vfs.writeFile(
    "packages/infra/.env.schema",
    [
      ...imports,
      "# @defaultRequired=false",
      "# @defaultSensitive=true",
      "# ---",
      "ALCHEMY_PASSWORD=",
      ...[...inputs].map((key) => `\n# @required @type=string(minLength=1)\n${key}=`),
      "",
    ].join("\n"),
  );
}

function processCloudflarePublicEnv(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.webDeploy !== "cloudflare") return;
  if (
    !vfs
      .getAllFiles()
      .some(
        (file) =>
          file.startsWith("apps/web/") &&
          vfs.readFile(file)?.includes(`@${config.projectName}/env/web`),
      )
  )
    return;
  const keys = [...schemaKeys(vfs, "apps/web", config)].filter((key) =>
    /^(VITE_|NEXT_PUBLIC_|NUXT_PUBLIC_|PUBLIC_)/.test(key),
  );
  const svelte = config.frontend.includes("svelte");
  const next = config.frontend.includes("next");
  const nuxt = config.frontend.includes("nuxt");
  const lines = [
    "// Alchemy validates deployment inputs with Varlock; Workers use native env bindings.",
    'import type { PublicCoercedEnvSchema } from "./env";',
  ];
  if (svelte && keys.length) lines.push(`import { ${keys.join(", ")} } from "$env/static/public";`);
  if (nuxt && keys.length) lines.push('import { useRuntimeConfig } from "#imports";');
  lines.push("", "export const env = {");
  for (const key of keys) {
    if (nuxt) {
      const name = key
        .replace(/^NUXT_PUBLIC_/, "")
        .toLowerCase()
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      lines.push(`  get ${key}() { return useRuntimeConfig().public.${name}; },`);
    } else {
      lines.push(
        `  ${key}: ${svelte ? key : next ? `process.env.${key}!` : `import.meta.env.${key}`},`,
      );
    }
  }
  lines.push(
    `} satisfies Pick<PublicCoercedEnvSchema, ${keys.map((key) => JSON.stringify(key)).join(" | ") || "never"}>;`,
    "",
  );
  vfs.writeFile("apps/web/src/env.public.ts", lines.join("\n"));
}

/** App-owned schemas, loading, and composition of configured shared services. */
export function processVarlock(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): void {
  const server = config.backend === "self" ? "apps/web" : "apps/server";
  const commands: string[] = [];
  const allKeys = new Set([
    "NODE_ENV",
    "CI",
    "VERCEL",
    "VERCEL_ENV",
    "VERCEL_URL",
    "VERCEL_PROJECT_PRODUCTION_URL",
    "_VARLOCK_ENV_KEY",
  ]);
  for (const app of ["apps/web", "apps/server", "apps/native"]) {
    if (!vfs.exists(`${app}/package.json`)) continue;
    const keys = schemaKeys(vfs, app, config);
    for (const key of keys) allKeys.add(key);
    vfs.writeFile(`${app}/.env.schema`, schema(keys, config));
    vfs.writeFile(`${app}/bunfig.toml`, `env = false\n${vfs.readFile(`${app}/bunfig.toml`) ?? ""}`);
    const pkg = vfs.readJson<Package>(`${app}/package.json`)!;
    pkg.scripts = { ...pkg.scripts, "env:generate": "varlock codegen" };
    vfs.writeJson(`${app}/package.json`, pkg);
    commands.push(`varlock codegen --path ./${app}/`);
    const ignore = `${app}/.gitignore`;
    vfs.writeFile(ignore, `${vfs.readFile(ignore) ?? ""}\n!.env.schema\n/src/env.ts\n`);
  }
  if (vfs.exists("packages/db/package.json")) {
    const keys = config.dbSetup === "d1" ? ["NODE_ENV"] : ["NODE_ENV", "DATABASE_*"];
    vfs.writeFile(
      "packages/db/.env.schema",
      `# @import(../../${server}/, pick=[${keys.join(", ")}])\n# @generateTsTypes(path=./src/env.ts, exposeEnv=local)\n# ---\n`,
    );
    addPackageDependency({
      vfs,
      packagePath: "packages/db/package.json",
      devDependencies: ["varlock"],
    });
    commands.push("varlock codegen --path ./packages/db/");
    const ignore = "packages/db/.gitignore";
    vfs.writeFile(ignore, `${vfs.readFile(ignore) ?? ""}\n!.env.schema\n/src/env.ts\n`);
  }
  processAlchemySchema(vfs, config);
  processCloudflarePublicEnv(vfs, config);
  vfs.writeFile("bunfig.toml", `env = false\n${vfs.readFile("bunfig.toml") ?? ""}`);
  const root = vfs.readJson<Package>("package.json")!;
  root.scripts ??= {};
  if (commands.length) {
    root.scripts["env:generate"] = commands.join(" && ");
    root.scripts.postinstall = [root.scripts.postinstall, ...commands].filter(Boolean).join(" && ");
  }
  vfs.writeJson("package.json", root);
  if (["express", "fastify"].includes(config.backend) && config.auth === "better-auth") {
    addPackageDependency({
      vfs,
      packagePath: `${server}/package.json`,
      dependencies: ["better-auth"],
    });
  }
  if (config.backend !== "none" && config.backend !== "convex") {
    processSingleTemplate(
      vfs,
      templates,
      "env/env.server.ts",
      `${server}/src/env.server.ts`,
      config,
    );
    if (config.database !== "none" || config.auth === "better-auth") {
      processSingleTemplate(vfs, templates, "env/services.ts", `${server}/src/services.ts`, config);
    }
  }
  // Imports of app-owned modules are relative, so packages never depend on application source.
  for (const file of vfs.getAllFiles()) {
    if (!file.startsWith("apps/") || !/\.(ts|tsx|vue|svelte|astro)$/.test(file)) continue;
    const app = file.split("/").slice(0, 2).join("/");
    let content = vfs.readFile(file)!;
    content = content
      .replaceAll(
        `@${config.projectName}/env/web`,
        importPath(
          file,
          config.webDeploy === "cloudflare" ? "apps/web/src/env.public" : "apps/web/src/env",
        ),
      )
      .replaceAll(`@${config.projectName}/env/native`, importPath(file, "apps/native/src/env"))
      .replaceAll(`@${config.projectName}/env/server`, importPath(file, `${server}/src/env.server`))
      .replaceAll(
        `@${config.projectName}/app-services`,
        importPath(file, `${server}/src/services`),
      );
    if (file !== "apps/web/src/client.ts") {
      content = content.replaceAll(
        `@${config.projectName}/auth/client`,
        importPath(file, "apps/web/src/client"),
      );
    }
    if (app === server) {
      if (file !== `${server}/src/context.ts`) {
        content = content.replaceAll(
          `@${config.projectName}/api/context`,
          importPath(file, `${server}/src/context`),
        );
      }
      if (!file.endsWith("/services.ts"))
        content = content
          .replaceAll(
            `"@${config.projectName}/auth"`,
            `"${importPath(file, `${server}/src/services`)}"`,
          )
          .replaceAll(
            `'@${config.projectName}/auth'`,
            `'${importPath(file, `${server}/src/services`)}'`,
          );
    }
    // The official generated local accessor exports ENV.
    content = content.replace(
      /import \{ env \} from (["'][^"']*\/env["'])/g,
      "import { ENV as env } from $1",
    );
    vfs.writeFile(file, content);
  }
  if (vfs.exists(`${server}/cloudflare-env.d.ts`)) {
    addPackageDependency({
      vfs,
      packagePath: `${server}/package.json`,
      customDevDependencies: {
        [`@${config.projectName}/infra`]: config.packageManager === "npm" ? "*" : "workspace:*",
      },
    });
  }
  const turbo = vfs.readJson<{ globalEnv?: string[]; globalDependencies?: string[] }>("turbo.json");
  if (turbo) {
    turbo.globalEnv = [...new Set([...(turbo.globalEnv ?? []), ...allKeys])].sort();
    turbo.globalDependencies = [
      ...new Set([
        ...(turbo.globalDependencies ?? []),
        ".env*",
        "apps/*/.env*",
        "packages/*/.env*",
      ]),
    ];
    vfs.writeJson("turbo.json", turbo);
  }
}
