/**
 * Script to calculate the total number of possible project combinations
 * Run with: bun run scripts/count-combinations.ts
 */

// All options from schemas.ts
const options = {
  // Core options
  ecosystem: ["typescript", "rust"],

  // TypeScript ecosystem options
  database: ["none", "sqlite", "postgres", "mysql", "mongodb"],
  orm: ["drizzle", "prisma", "mongoose", "typeorm", "kysely", "mikroorm", "sequelize", "none"],
  backend: [
    "hono",
    "express",
    "fastify",
    "elysia",
    "fets",
    "nestjs",
    "adonisjs",
    "nitro",
    "encore",
    "convex",
    "self",
    "none",
  ],
  runtime: ["bun", "node", "workers", "none"],
  frontend: [
    "tanstack-router",
    "react-router",
    "tanstack-start",
    "next",
    "nuxt",
    "native-bare",
    "native-uniwind",
    "native-unistyles",
    "svelte",
    "solid",
    "astro",
    "qwik",
    "angular",
    "redwood",
    "fresh",
    "none",
  ],
  astroIntegration: ["react", "vue", "svelte", "solid", "none"],
  addons: [
    "pwa",
    "tauri",
    "starlight",
    "biome",
    "lefthook",
    "husky",
    "ruler",
    "turborepo",
    "fumadocs",
    "ultracite",
    "oxlint",
    "opentui",
    "wxt",
    "msw",
    "storybook",
    "none",
  ],
  examples: ["ai", "none"],
  packageManager: ["npm", "pnpm", "bun"],
  dbSetup: [
    "turso",
    "neon",
    "prisma-postgres",
    "planetscale",
    "mongodb-atlas",
    "supabase",
    "d1",
    "docker",
    "none",
  ],
  api: ["trpc", "orpc", "ts-rest", "garph", "none"],
  auth: ["better-auth", "clerk", "nextauth", "none"],
  payments: ["polar", "stripe", "lemon-squeezy", "paddle", "dodo", "none"],
  webDeploy: ["cloudflare", "none"],
  serverDeploy: ["cloudflare", "none"],
  ai: [
    "vercel-ai",
    "mastra",
    "voltagent",
    "langgraph",
    "openai-agents",
    "google-adk",
    "modelfusion",
    "langchain",
    "llamaindex",
    "none",
  ],
  effect: ["effect", "effect-full", "none"],
  stateManagement: [
    "zustand",
    "jotai",
    "nanostores",
    "redux-toolkit",
    "mobx",
    "xstate",
    "valtio",
    "tanstack-store",
    "legend-state",
    "none",
  ],
  forms: [
    "tanstack-form",
    "react-hook-form",
    "formik",
    "final-form",
    "conform",
    "modular-forms",
    "none",
  ],
  testing: ["vitest", "playwright", "vitest-playwright", "jest", "cypress", "none"],
  email: [
    "react-email",
    "resend",
    "nodemailer",
    "postmark",
    "sendgrid",
    "aws-ses",
    "mailgun",
    "plunk",
    "none",
  ],
  cssFramework: ["tailwind", "scss", "less", "postcss-only", "none"],
  uiLibrary: [
    "shadcn-ui",
    "daisyui",
    "radix-ui",
    "headless-ui",
    "park-ui",
    "chakra-ui",
    "nextui",
    "mantine",
    "base-ui",
    "ark-ui",
    "react-aria",
    "none",
  ],
  validation: [
    "zod",
    "valibot",
    "arktype",
    "typebox",
    "typia",
    "runtypes",
    "effect-schema",
    "none",
  ],
  realtime: ["socket-io", "partykit", "ably", "pusher", "liveblocks", "yjs", "none"],
  jobQueue: ["bullmq", "trigger-dev", "inngest", "temporal", "none"],
  cms: ["payload", "sanity", "strapi", "none"],
  caching: ["upstash-redis", "none"],
  animation: ["framer-motion", "gsap", "react-spring", "auto-animate", "lottie", "none"],
  fileUpload: ["uploadthing", "filepond", "uppy", "none"],
  logging: ["pino", "winston", "none"],
  observability: ["opentelemetry", "none"],

  // Rust ecosystem options
  rustWebFramework: ["axum", "actix-web", "none"],
  rustFrontend: ["leptos", "dioxus", "none"],
  rustOrm: ["sea-orm", "sqlx", "none"],
  rustApi: ["tonic", "async-graphql", "none"],
  rustCli: ["clap", "ratatui", "none"],
  rustLibraries: ["serde", "validator", "jsonwebtoken", "argon2", "tokio-test", "mockall", "none"],
};

// Helper to calculate power set size (2^n) for multi-select arrays
// We subtract 1 to exclude the empty set, but add back combinations with "none"
function powerSetSize(arr: string[]): number {
  // For arrays that include "none", we need to consider:
  // - Selecting "none" alone (1 way)
  // - Selecting any non-empty subset of non-"none" items (2^(n-1) - 1 ways)
  const nonNoneItems = arr.filter((item) => item !== "none").length;
  // Empty selection not allowed, so 2^n - 1 for non-none items, plus "none" option
  return Math.pow(2, nonNoneItems); // All subsets including empty (which maps to "none")
}

function formatNumber(n: bigint | number): string {
  return n.toLocaleString("en-US");
}

function scientificNotation(n: bigint): string {
  const str = n.toString();
  const exp = str.length - 1;
  const mantissa = str[0] + "." + str.slice(1, 4);
  return `${mantissa} × 10^${exp}`;
}

console.log("=".repeat(70));
console.log("Better Fullstack - Project Combination Calculator");
console.log("=".repeat(70));
console.log();

// Count individual options
console.log("OPTION COUNTS:");
console.log("-".repeat(70));

const singleSelectOptions = [
  "ecosystem",
  "database",
  "orm",
  "backend",
  "runtime",
  "astroIntegration",
  "packageManager",
  "dbSetup",
  "api",
  "auth",
  "payments",
  "webDeploy",
  "serverDeploy",
  "ai",
  "effect",
  "stateManagement",
  "forms",
  "testing",
  "email",
  "cssFramework",
  "uiLibrary",
  "validation",
  "realtime",
  "jobQueue",
  "cms",
  "caching",
  "animation",
  "fileUpload",
  "logging",
  "observability",
  "rustWebFramework",
  "rustFrontend",
  "rustOrm",
  "rustApi",
  "rustCli",
];

const multiSelectOptions = ["frontend", "addons", "examples", "rustLibraries"];

let totalSingleSelect = 1n;
for (const opt of singleSelectOptions) {
  const count = options[opt as keyof typeof options].length;
  console.log(`  ${opt.padEnd(20)} ${count} options`);
  totalSingleSelect *= BigInt(count);
}

console.log();
console.log("MULTI-SELECT OPTIONS (power set - any combination):");
console.log("-".repeat(70));

let totalMultiSelect = 1n;
for (const opt of multiSelectOptions) {
  const arr = options[opt as keyof typeof options];
  const count = powerSetSize(arr);
  const nonNoneCount = arr.filter((item) => item !== "none").length;
  console.log(
    `  ${opt.padEnd(20)} ${arr.length} items → 2^${nonNoneCount} = ${formatNumber(count)} combinations`,
  );
  totalMultiSelect *= BigInt(count);
}

console.log();
console.log("=".repeat(70));
console.log("THEORETICAL MAXIMUM (without constraints):");
console.log("=".repeat(70));

const theoreticalTotal = totalSingleSelect * totalMultiSelect;
console.log();
console.log(`  Single-select combinations: ${formatNumber(totalSingleSelect)}`);
console.log(`  Multi-select combinations:  ${formatNumber(totalMultiSelect)}`);
console.log();
console.log(`  TOTAL THEORETICAL: ${scientificNotation(theoreticalTotal)}`);
console.log(`                     ${formatNumber(theoreticalTotal)}`);

// Calculate TypeScript-only combinations
console.log();
console.log("=".repeat(70));
console.log("BY ECOSYSTEM:");
console.log("=".repeat(70));

// TypeScript ecosystem (excludes Rust options)
const tsOnlyOptions = singleSelectOptions.filter(
  (opt) => !opt.startsWith("rust") && opt !== "ecosystem",
);
let tsSingleSelect = 1n;
for (const opt of tsOnlyOptions) {
  tsSingleSelect *= BigInt(options[opt as keyof typeof options].length);
}

const tsMultiOptions = multiSelectOptions.filter((opt) => opt !== "rustLibraries");
let tsMultiSelect = 1n;
for (const opt of tsMultiOptions) {
  tsMultiSelect *= BigInt(powerSetSize(options[opt as keyof typeof options]));
}

const tsTotal = tsSingleSelect * tsMultiSelect;

// Rust ecosystem
const rustOnlyOptions = singleSelectOptions.filter((opt) => opt.startsWith("rust"));
let rustSingleSelect = 1n;
for (const opt of rustOnlyOptions) {
  rustSingleSelect *= BigInt(options[opt as keyof typeof options].length);
}

const rustLibsCombinations = BigInt(powerSetSize(options.rustLibraries));
const rustTotal = rustSingleSelect * rustLibsCombinations;

console.log();
console.log(`  TypeScript ecosystem: ${scientificNotation(tsTotal)}`);
console.log(`  Rust ecosystem:       ${formatNumber(rustTotal)} combinations`);
console.log();
console.log(`  Combined (TS + Rust): ${scientificNotation(tsTotal + rustTotal)}`);

// Summary table
console.log();
console.log("=".repeat(70));
console.log("SUMMARY TABLE:");
console.log("=".repeat(70));
console.log();

const categories = [
  { name: "Databases", count: options.database.length },
  { name: "ORMs", count: options.orm.length },
  { name: "Backends", count: options.backend.length },
  { name: "Runtimes", count: options.runtime.length },
  { name: "Frontends", count: options.frontend.length },
  { name: "Addons", count: options.addons.length },
  { name: "APIs", count: options.api.length },
  { name: "Auth Providers", count: options.auth.length },
  { name: "Payment Providers", count: options.payments.length },
  { name: "AI SDKs", count: options.ai.length },
  { name: "State Management", count: options.stateManagement.length },
  { name: "Form Libraries", count: options.forms.length },
  { name: "Testing Frameworks", count: options.testing.length },
  { name: "Email Services", count: options.email.length },
  { name: "UI Libraries", count: options.uiLibrary.length },
  { name: "CSS Frameworks", count: options.cssFramework.length },
  { name: "Validation Libraries", count: options.validation.length },
  { name: "Realtime Solutions", count: options.realtime.length },
  { name: "Job Queues", count: options.jobQueue.length },
  { name: "CMS Options", count: options.cms.length },
  { name: "Animation Libraries", count: options.animation.length },
  { name: "File Upload", count: options.fileUpload.length },
  { name: "Rust Web Frameworks", count: options.rustWebFramework.length },
  { name: "Rust Frontends", count: options.rustFrontend.length },
  { name: "Rust ORMs", count: options.rustOrm.length },
];

console.log("  Category                 Options");
console.log("  " + "-".repeat(40));
for (const cat of categories) {
  console.log(`  ${cat.name.padEnd(22)} ${cat.count}`);
}

const totalOptions = categories.reduce((sum, cat) => sum + cat.count, 0);
console.log("  " + "-".repeat(40));
console.log(`  ${"TOTAL OPTIONS".padEnd(22)} ${totalOptions}`);

console.log();
console.log("=".repeat(70));
console.log("NOTE: The actual valid combinations are fewer due to compatibility");
console.log("constraints (e.g., tRPC requires React, Mongoose requires MongoDB).");
console.log("=".repeat(70));
