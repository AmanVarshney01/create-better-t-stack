#!/usr/bin/env bun
import { readFileSync } from "fs";
import { join } from "path";

const COMBOS_FILE = join(import.meta.dir, "combos.json");

const FRONTENDS = [
  "next",
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "nuxt",
  "svelte",
  "solid",
  "solid-start",
  "astro",
  "qwik",
  "angular",
  "redwood",
] as const;

const BACKENDS = [
  "hono",
  "express",
  "fastify",
  "elysia",
  "fets",
  "nestjs",
  "adonisjs",
  "nitro",
  "self",
  "none",
] as const;

const RUNTIMES = ["bun", "node"] as const;
const DATABASES = ["sqlite", "postgres", "mysql", "mongodb", "none"] as const;
const ORMS = [
  "drizzle",
  "prisma",
  "mongoose",
  "typeorm",
  "kysely",
  "mikroorm",
  "sequelize",
  "none",
] as const;
const APIS = ["trpc", "orpc", "ts-rest", "garph", "none"] as const;
const AUTHS = ["better-auth", "clerk", "none"] as const;
const CSS_FRAMEWORKS = ["tailwind", "scss", "none"] as const;
const UI_LIBRARIES = ["shadcn-ui", "daisyui", "radix-ui", "park-ui", "none"] as const;
const VALIDATIONS = ["zod", "valibot", "arktype", "typebox", "none"] as const;
const TESTINGS = ["vitest", "playwright", "none"] as const;
const STATE_MGMTS = ["zustand", "jotai", "nanostores", "none"] as const;
const LOGGINGS = ["pino", "winston", "none"] as const;
const FORMS = ["tanstack-form", "react-hook-form", "none"] as const;
const AIS = ["vercel-ai", "mastra", "none"] as const;
const EFFECTS = ["effect", "none"] as const;
const ANIMATIONS = ["framer-motion", "gsap", "none"] as const;
const EMAILS = ["react-email", "resend", "none"] as const;
const PAYMENTS = ["stripe", "polar", "none"] as const;
const REALTIMES = ["socket-io", "partykit", "none"] as const;
const JOB_QUEUES = ["bullmq", "inngest", "none"] as const;
const ADDONS = ["turborepo", "biome", "pwa", "storybook", "none"] as const;
const ASTRO_INTEGRATIONS = ["react", "vue", "svelte", "solid", "none"] as const;

const REACT_FRONTENDS = ["next", "react-router", "tanstack-router", "tanstack-start", "redwood"];
const SELF_FRONTENDS = ["next", "tanstack-start", "astro", "nuxt"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted<T>(arr: readonly T[], noneWeight = 0.4): T {
  if (Math.random() < noneWeight && arr.includes("none" as T)) return "none" as T;
  const filtered = arr.filter((v) => v !== "none");
  return filtered.length > 0 ? pick(filtered) : pick(arr);
}

interface Combo {
  name: string;
  cmd: string;
}

function generateCombo(): Combo {
  const frontend = pick(FRONTENDS);
  let backend = pick(BACKENDS);
  let runtime: string;
  let api: string;
  let orm: string;
  let database: string;
  let auth: string;
  let uiLibrary: string;
  let apiSet = false;

  if (frontend === "qwik") {
    backend = "none";
    api = "none";
    apiSet = true;
  }

  if (frontend === "angular") {
    api = "none";
    apiSet = true;
  }

  if (backend === "self" && !SELF_FRONTENDS.includes(frontend)) {
    backend = pick(BACKENDS.filter((b) => b !== "self" && b !== "none"));
  }

  if (backend === "self") {
    runtime = "none";
  } else if (backend === "nestjs" || backend === "adonisjs") {
    runtime = "node";
  } else if (backend === "none") {
    runtime = "none";
  } else {
    runtime = pick(RUNTIMES);
  }

  if (apiSet) {
  } else if (backend === "none" || backend === "self") {
    api = "none";
  } else if (REACT_FRONTENDS.includes(frontend)) {
    api = pick(APIS);
  } else {
    api = pick(APIS.filter((a) => a !== "trpc" && a !== "garph"));
  }

  database = pick(DATABASES);
  if (database === "mongodb") {
    orm = "mongoose";
  } else if (database === "none") {
    orm = "none";
  } else {
    orm = pick(ORMS.filter((o) => o !== "mongoose" && o !== "none"));
  }

  if (backend === "none") {
    database = "none";
    orm = "none";
  }

  const clerkOk =
    backend === "convex" || (backend === "self" && ["next", "tanstack-start"].includes(frontend));
  const authChoices = ["typeorm", "sequelize"].includes(orm)
    ? (["none"] as const)
    : clerkOk
      ? AUTHS
      : AUTHS.filter((a) => a !== "clerk");
  auth = pick(authChoices);

  if (auth === "better-auth" && database === "none") {
    database = pick(DATABASES.filter((d) => d !== "none" && d !== "mongodb"));
    orm = pick(ORMS.filter((o) => !["mongoose", "none", "typeorm", "sequelize"].includes(o)));
  }

  const cssFramework = pick(CSS_FRAMEWORKS);
  if (cssFramework !== "tailwind") {
    uiLibrary = "none";
  } else if (REACT_FRONTENDS.includes(frontend)) {
    uiLibrary = pick(UI_LIBRARIES);
  } else if (["svelte", "solid", "solid-start", "nuxt"].includes(frontend)) {
    uiLibrary = pick(["daisyui", "park-ui", "none"] as const);
  } else {
    uiLibrary = pick(["daisyui", "none"] as const);
  }

  const forms = REACT_FRONTENDS.includes(frontend) ? pickWeighted(FORMS, 0.5) : "none";

  const animation = REACT_FRONTENDS.includes(frontend)
    ? pickWeighted(ANIMATIONS, 0.6)
    : pickWeighted(["gsap", "none"] as const, 0.7);

  const validation = pickWeighted(VALIDATIONS, 0.4);
  const testing = pickWeighted(TESTINGS, 0.4);
  const stateMgmt = pickWeighted(STATE_MGMTS, 0.5);
  const logging = backend !== "none" ? pickWeighted(LOGGINGS, 0.5) : "none";
  const ai = pickWeighted(AIS, 0.6);
  const effect = pickWeighted(EFFECTS, 0.7);
  const email = backend !== "none" ? pickWeighted(EMAILS, 0.7) : "none";
  const payments = backend !== "none" ? pickWeighted(PAYMENTS, 0.7) : "none";
  const realtime = backend !== "none" ? pickWeighted(REALTIMES, 0.8) : "none";
  const jobQueue = backend !== "none" ? pickWeighted(JOB_QUEUES, 0.8) : "none";
  const addons = pickWeighted(ADDONS, 0.5);

  const parts = ["ts", frontend];
  if (backend !== "none") parts.push(backend);
  if (orm !== "none") parts.push(orm);
  if (database !== "none" && database !== "sqlite")
    parts.push(database === "postgres" ? "pg" : database);
  if (auth === "better-auth") parts.push("auth");
  if (effect !== "none") parts.push("effect");
  if (ai !== "none") parts.push("ai");
  const name = parts.join("-");

  const flags: string[] = [
    `--ecosystem typescript`,
    `--frontend ${frontend}`,
    `--css-framework ${cssFramework}`,
    `--ui-library ${uiLibrary}`,
    `--backend ${backend}`,
    `--runtime ${runtime}`,
    `--api ${api!}`,
    `--auth ${auth}`,
    `--payments ${payments}`,
    `--email ${email}`,
    `--file-upload none`,
    `--logging ${logging}`,
    `--observability none`,
    `--realtime ${realtime}`,
    `--job-queue ${jobQueue}`,
    `--caching none`,
    `--search none`,
    `--file-storage none`,
    `--cms none`,
    `--effect ${effect}`,
    `--ai ${ai}`,
    `--state-management ${stateMgmt}`,
    `--forms ${forms}`,
    `--validation ${validation}`,
    `--testing ${testing}`,
    `--animation ${animation}`,
    `--database ${database}`,
    `--orm ${orm}`,
    `--db-setup none`,
    `--package-manager bun`,
    `--git`,
    `--web-deploy none`,
    `--server-deploy none`,
    `--install`,
    `--addons ${addons}`,
    `--examples none`,
    `--ai-docs claude-md`,
  ];

  if (frontend === "astro") {
    const integration =
      backend === "self"
        ? pick(ASTRO_INTEGRATIONS.filter((i) => i !== "none"))
        : pick(ASTRO_INTEGRATIONS);
    flags.push(`--astro-integration ${integration}`);
  }

  const cmd = `bun create better-fullstack@latest ${name} ${flags.join(" ")}`;
  return { name, cmd };
}

const tested: Record<string, string> = JSON.parse(readFileSync(COMBOS_FILE, "utf8"));
const testedNames = new Set(Object.keys(tested));

const combos: Combo[] = [];
let attempts = 0;

while (combos.length < 10 && attempts < 500) {
  attempts++;
  const combo = generateCombo();
  if (!testedNames.has(combo.name) && !combos.find((c) => c.name === combo.name)) {
    combos.push(combo);
  }
}

console.log(`Generated ${combos.length} unique combos\n`);

for (const { name, cmd } of combos) {
  console.log(`# ${name}`);
  console.log(cmd);
  console.log();
}
