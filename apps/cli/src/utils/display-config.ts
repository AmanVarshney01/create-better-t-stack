import pc from "picocolors";

import type { ProjectConfig } from "../types";

export type ConfigDisplayRow = {
  label: string;
  value: string;
};

export type ConfigDisplaySection = {
  title: string;
  rows: ConfigDisplayRow[];
};

const VALUE_LABELS: Record<string, string> = {
  none: "None",
  "tanstack-router": "TanStack Router",
  "react-router": "React Router",
  "tanstack-start": "TanStack Start",
  next: "Next.js",
  nuxt: "Nuxt",
  svelte: "SvelteKit",
  solid: "SolidStart",
  astro: "Astro",
  "native-bare": "Expo (bare)",
  "native-uniwind": "Expo + Uniwind",
  "native-unistyles": "Expo + Unistyles",
  hono: "Hono",
  express: "Express",
  fastify: "Fastify",
  elysia: "Elysia",
  convex: "Convex",
  self: "Fullstack framework",
  bun: "Bun",
  node: "Node.js",
  workers: "Cloudflare Workers",
  trpc: "tRPC",
  orpc: "oRPC",
  sqlite: "SQLite",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  drizzle: "Drizzle",
  prisma: "Prisma",
  mongoose: "Mongoose",
  "better-auth": "Better Auth",
  clerk: "Clerk",
  polar: "Polar",
  mollie: "Mollie",
  pwa: "PWA",
  tauri: "Tauri",
  electrobun: "Electrobun",
  biome: "Biome",
  oxlint: "Oxlint + Oxfmt",
  ultracite: "Ultracite",
  lefthook: "Lefthook",
  husky: "Husky",
  turborepo: "Turborepo",
  nx: "Nx",
  "vite-plus": "Vite+",
  starlight: "Starlight",
  fumadocs: "Fumadocs",
  opentui: "OpenTUI",
  wxt: "WXT",
  skills: "Agent skills",
  mcp: "MCP servers",
  evlog: "evlog",
  todo: "Todo app",
  ai: "AI chat",
  turso: "Turso",
  neon: "Neon",
  planetscale: "PlanetScale",
  supabase: "Supabase",
  "prisma-postgres": "Prisma Postgres",
  "mongodb-atlas": "MongoDB Atlas",
  d1: "Cloudflare D1",
  docker: "Docker",
  cloudflare: "Cloudflare",
  vercel: "Vercel",
  npm: "npm",
  pnpm: "pnpm",
};

export function formatConfigValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(formatConfigValue).join(", ") : "None";
  }

  const text = String(value);
  return (
    VALUE_LABELS[text] ??
    text
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function section(
  title: string,
  entries: Array<[label: string, value: unknown, format?: "raw"]>,
): ConfigDisplaySection | undefined {
  const rows = entries
    .filter(([, value]) => value !== undefined)
    .map(([label, value, format]) => ({
      label,
      value: format === "raw" ? String(value) : formatConfigValue(value),
    }));

  return rows.length > 0 ? { title, rows } : undefined;
}

export function getConfigSections(config: Partial<ProjectConfig>): ConfigDisplaySection[] {
  return [
    section("Project", [
      ["Name", config.projectName, "raw"],
      ["Directory", config.relativePath, "raw"],
    ]),
    section("Application", [
      ["Frontend", config.frontend],
      ["Backend", config.backend],
      ["Runtime", config.runtime],
      ["API", config.api],
    ]),
    section("Data", [
      ["Database", config.database],
      ["ORM", config.orm],
      ["Setup", config.dbSetup],
    ]),
    section("Product", [
      ["Auth", config.auth],
      ["Payments", config.payments],
      ["Addons", config.addons],
      ["Examples", config.examples],
    ]),
    section("Delivery", [
      ["Web deploy", config.webDeploy],
      ["Server deploy", config.serverDeploy],
      ["Package manager", config.packageManager],
      ["Git", config.git],
      ["Install deps", config.install],
    ]),
  ].filter((value): value is ConfigDisplaySection => value !== undefined);
}

export function displayConfig(config: Partial<ProjectConfig>): string {
  const sections = getConfigSections(config);
  if (sections.length === 0) {
    return pc.yellow("No configuration selected.");
  }

  return sections
    .map(({ title, rows }) => {
      const labelWidth = Math.max(...rows.map(({ label }) => label.length));
      const renderedRows = rows
        .map(({ label, value }) => `  ${pc.dim(label.padEnd(labelWidth))}  ${value}`)
        .join("\n");
      return `${pc.magenta(pc.bold(title))}\n${renderedRows}`;
    })
    .join("\n\n");
}
