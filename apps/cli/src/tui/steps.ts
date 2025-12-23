import { DEFAULT_CONFIG } from "../constants";
import { getUserPkgManager } from "../utils/get-package-manager";

export interface StepConfig {
  id: string;
  title: string;
  type: "input" | "select" | "multiselect" | "confirm";
  skip?: (config: any) => boolean;
  getDefault?: (config: any) => any;
  getOptions?: (config: any) => { name: string; value: string; hint?: string }[];
  options?: { name: string; value: string; hint?: string }[];
}

// Steps EXACTLY matching config-prompts.ts order
export const STEPS: StepConfig[] = [
  // Project Name
  { id: "projectName", title: "Project name", type: "input" },

  // Frontend - first asks for project type (web/native)
  {
    id: "projectType",
    title: "Select project type",
    type: "multiselect",
    getDefault: () => ["web"], // Match clack's initialValues
    options: [
      { name: "Web", value: "web", hint: "React, Vue or Svelte Web Application" },
      { name: "Native", value: "native", hint: "Create a React Native/Expo app" },
    ],
  },

  // Web Framework - matching frontend.ts exactly
  {
    id: "webFramework",
    title: "Choose web",
    type: "select",
    skip: (c) => !c.projectType?.includes("web"),
    getDefault: () => DEFAULT_CONFIG.frontend[0], // tanstack-router
    options: [
      {
        name: "TanStack Router",
        value: "tanstack-router",
        hint: "Modern and scalable routing for React Applications",
      },
      {
        name: "React Router",
        value: "react-router",
        hint: "A user‑obsessed, standards‑focused, multi‑strategy router",
      },
      { name: "Next.js", value: "next", hint: "The React Framework for the Web" },
      { name: "Nuxt", value: "nuxt", hint: "The Progressive Web Framework for Vue.js" },
      { name: "Svelte", value: "svelte", hint: "web development for the rest of us" },
      {
        name: "Solid",
        value: "solid",
        hint: "Simple and performant reactivity for building user interfaces",
      },
      {
        name: "TanStack Start",
        value: "tanstack-start",
        hint: "SSR, Server Functions, API Routes and more with TanStack Router",
      },
    ],
  },

  // Native Framework - matching frontend.ts exactly
  {
    id: "nativeFramework",
    title: "Choose native",
    type: "select",
    skip: (c) => !c.projectType?.includes("native"),
    getDefault: () => "native-bare", // Match clack's initialValue
    options: [
      { name: "Bare", value: "native-bare", hint: "Bare Expo without styling library" },
      {
        name: "Uniwind",
        value: "native-uniwind",
        hint: "Fastest Tailwind bindings for React Native with HeroUI Native",
      },
      { name: "Unistyles", value: "native-unistyles", hint: "Consistent styling for React Native" },
    ],
  },

  // Backend - matching backend.ts exactly
  {
    id: "backend",
    title: "Select backend",
    type: "select",
    getDefault: (c) => {
      const frontends = c.frontend || [];
      const hasFullstack = frontends.some((f: string) => ["next", "tanstack-start"].includes(f));
      return hasFullstack ? "self" : DEFAULT_CONFIG.backend; // hono
    },
    getOptions: (c) => {
      const frontends = c.frontend || [];
      const hasFullstack = frontends.some((f: string) => ["next", "tanstack-start"].includes(f));
      const hasSolid = frontends.some((f: string) => f === "solid");

      const opts = [];
      if (hasFullstack) {
        opts.push({
          name: "Self (Fullstack)",
          value: "self",
          hint: "Use frontend's built-in api routes",
        });
      }
      opts.push(
        { name: "Hono", value: "hono", hint: "Lightweight, ultrafast web framework" },
        {
          name: "Express",
          value: "express",
          hint: "Fast, unopinionated, minimalist web framework for Node.js",
        },
        { name: "Fastify", value: "fastify", hint: "Fast, low-overhead web framework for Node.js" },
        {
          name: "Elysia",
          value: "elysia",
          hint: "Ergonomic web framework for building backend servers",
        },
      );
      if (!hasSolid) {
        opts.push({
          name: "Convex",
          value: "convex",
          hint: "Reactive backend-as-a-service platform",
        });
      }
      opts.push({ name: "None", value: "none", hint: "No backend server" });
      return opts;
    },
  },

  // Runtime - matching runtime.ts exactly
  {
    id: "runtime",
    title: "Select runtime",
    type: "select",
    skip: (c) => c.backend === "none" || c.backend === "convex" || c.backend === "self",
    getDefault: () => DEFAULT_CONFIG.runtime, // bun
    getOptions: (c) => {
      const opts = [
        { name: "Bun", value: "bun", hint: "Fast all-in-one JavaScript runtime" },
        { name: "Node.js", value: "node", hint: "Traditional Node.js runtime" },
      ];
      if (c.backend === "hono") {
        opts.push({
          name: "Cloudflare Workers",
          value: "workers",
          hint: "Edge runtime on Cloudflare's global network",
        });
      }
      return opts;
    },
  },

  // Database - matching database.ts exactly
  {
    id: "database",
    title: "Select database",
    type: "select",
    skip: (c) => c.backend === "none" || c.backend === "convex",
    getDefault: () => DEFAULT_CONFIG.database, // sqlite
    getOptions: (c) => {
      const opts = [
        { name: "None", value: "none", hint: "No database setup" },
        {
          name: "SQLite",
          value: "sqlite",
          hint: "lightweight, server-less, embedded relational database",
        },
        {
          name: "PostgreSQL",
          value: "postgres",
          hint: "powerful, open source object-relational database system",
        },
        { name: "MySQL", value: "mysql", hint: "popular open-source relational database system" },
      ];
      if (c.runtime !== "workers") {
        opts.push({
          name: "MongoDB",
          value: "mongodb",
          hint: "open-source NoSQL database that stores data in JSON-like documents",
        });
      }
      return opts;
    },
  },

  // ORM - matching orm.ts exactly
  {
    id: "orm",
    title: "Select ORM",
    type: "select",
    skip: (c) => c.database === "none" || c.backend === "convex",
    // orm.ts: mongodb→prisma, workers→drizzle, else DEFAULT_CONFIG.orm
    getDefault: (c) => {
      if (c.database === "mongodb") return "prisma";
      if (c.runtime === "workers") return "drizzle";
      return DEFAULT_CONFIG.orm; // drizzle
    },
    getOptions: (c) => {
      if (c.database === "mongodb") {
        return [
          { name: "Prisma", value: "prisma", hint: "Powerful, feature-rich ORM" },
          { name: "Mongoose", value: "mongoose", hint: "Elegant object modeling tool" },
        ];
      }
      return [
        { name: "Drizzle", value: "drizzle", hint: "Lightweight and performant TypeScript ORM" },
        { name: "Prisma", value: "prisma", hint: "Powerful, feature-rich ORM" },
      ];
    },
  },

  // API - matching api.ts exactly
  {
    id: "api",
    title: "Select API type",
    type: "select",
    skip: (c) => c.backend === "none" || c.backend === "convex",
    // api.ts uses first option: initialValue: apiOptions[0].value
    getDefault: () => "trpc", // First option in the list
    options: [
      { name: "tRPC", value: "trpc", hint: "End-to-end typesafe APIs made easy" },
      {
        name: "oRPC",
        value: "orpc",
        hint: "End-to-end type-safe APIs that adhere to OpenAPI standards",
      },
      {
        name: "None",
        value: "none",
        hint: "No API layer (e.g. for full-stack frameworks with Route Handlers)",
      },
    ],
  },

  // Auth - matching auth.ts exactly
  {
    id: "auth",
    title: "Select authentication provider",
    type: "select",
    skip: (c) => c.backend === "none",
    // auth.ts: Convex uses "none", else DEFAULT_CONFIG.auth
    getDefault: (c) => (c.backend === "convex" ? "none" : DEFAULT_CONFIG.auth),
    getOptions: (c) => {
      if (c.backend === "convex") {
        const frontends = c.frontend || [];
        const opts = [];
        const supportsBetterAuth = frontends.some((f: string) =>
          [
            "tanstack-router",
            "tanstack-start",
            "next",
            "native-bare",
            "native-uniwind",
            "native-unistyles",
          ].includes(f),
        );
        const supportsClerk = frontends.some((f: string) =>
          [
            "react-router",
            "tanstack-router",
            "tanstack-start",
            "next",
            "native-bare",
            "native-uniwind",
            "native-unistyles",
          ].includes(f),
        );
        if (supportsBetterAuth) {
          opts.push({
            name: "Better-Auth",
            value: "better-auth",
            hint: "comprehensive auth framework for TypeScript",
          });
        }
        if (supportsClerk) {
          opts.push({
            name: "Clerk",
            value: "clerk",
            hint: "More than auth, Complete User Management",
          });
        }
        opts.push({ name: "None", value: "none", hint: "No auth" });
        return opts;
      }
      return [
        {
          name: "Better-Auth",
          value: "better-auth",
          hint: "comprehensive auth framework for TypeScript",
        },
        { name: "None", value: "none" },
      ];
    },
  },

  // Payments - matching payments.ts exactly
  {
    id: "payments",
    title: "Select payments provider",
    type: "select",
    skip: (c) => {
      if (c.backend === "none") return true;
      if (c.auth !== "better-auth") return true;
      if (c.backend === "convex") return true;
      const frontends = c.frontend || [];
      const hasWeb = frontends.some((f: string) =>
        [
          "tanstack-router",
          "react-router",
          "next",
          "nuxt",
          "svelte",
          "solid",
          "tanstack-start",
        ].includes(f),
      );
      if (frontends.length > 0 && !hasWeb) return true;
      return false;
    },
    getDefault: () => "none",
    options: [
      {
        name: "Polar",
        value: "polar",
        hint: "Turn your software into a business. 6 lines of code.",
      },
      { name: "None", value: "none", hint: "No payments integration" },
    ],
  },

  // Addons - matching addons.ts exactly (grouped)
  {
    id: "addons",
    title: "Select addons",
    type: "multiselect",
    options: [
      // Documentation
      { name: "Starlight", value: "starlight", hint: "Build stellar docs with astro" },
      { name: "Fumadocs", value: "fumadocs", hint: "Build excellent documentation site" },
      // Linting
      { name: "Biome", value: "biome", hint: "Format, lint, and more" },
      { name: "Oxlint", value: "oxlint", hint: "Oxlint + Oxfmt (linting & formatting)" },
      {
        name: "Ultracite",
        value: "ultracite",
        hint: "Zero-config Biome preset with AI integration",
      },
      // Other
      { name: "Ruler", value: "ruler", hint: "Centralize your AI rules" },
      { name: "PWA", value: "pwa", hint: "Make your app installable and work offline" },
      { name: "Tauri", value: "tauri", hint: "Build native desktop apps from your web frontend" },
      { name: "Husky", value: "husky", hint: "Modern native Git hooks made easy" },
      { name: "OpenTUI", value: "opentui", hint: "Build terminal user interfaces" },
      { name: "WXT", value: "wxt", hint: "Build browser extensions" },
      { name: "Turborepo", value: "turborepo", hint: "High-performance build system" },
    ],
  },

  // Examples - matching examples.ts exactly
  {
    id: "examples",
    title: "Include examples",
    type: "multiselect",
    skip: (c) => {
      if (c.backend === "none") return true;
      if (c.backend !== "convex") {
        if (c.api === "none" || c.database === "none") return true;
      }
      return false;
    },
    options: [
      { name: "Todo App", value: "todo", hint: "A simple CRUD example app" },
      { name: "AI Chat", value: "ai", hint: "A simple AI chat interface using AI SDK" },
    ],
  },

  // Database Setup - matching database-setup.ts
  {
    id: "dbSetup",
    title: "Select database setup option",
    type: "select",
    skip: (c) => c.database === "none" || c.backend === "convex",
    getDefault: () => "none",
    getOptions: (c) => {
      if (c.database === "sqlite") {
        const opts = [
          { name: "Turso", value: "turso", hint: "SQLite for Production. Powered by libSQL" },
        ];
        if (c.runtime === "workers") {
          opts.push({
            name: "Cloudflare D1",
            value: "d1",
            hint: "Cloudflare's managed, serverless database",
          });
        }
        opts.push({ name: "None", value: "none", hint: "Manual setup" });
        return opts;
      }
      if (c.database === "postgres") {
        return [
          {
            name: "Neon Postgres",
            value: "neon",
            hint: "Serverless Postgres with branching capability",
          },
          { name: "PlanetScale", value: "planetscale", hint: "Postgres & Vitess (MySQL) on NVMe" },
          { name: "Supabase", value: "supabase", hint: "Local Supabase stack (requires Docker)" },
          {
            name: "Prisma Postgres",
            value: "prisma-postgres",
            hint: "Instant Postgres for Global Applications",
          },
          { name: "Docker", value: "docker", hint: "Run locally with docker compose" },
          { name: "None", value: "none", hint: "Manual setup" },
        ];
      }
      if (c.database === "mysql") {
        return [
          { name: "PlanetScale", value: "planetscale", hint: "MySQL on Vitess (NVMe, HA)" },
          { name: "Docker", value: "docker", hint: "Run locally with docker compose" },
          { name: "None", value: "none", hint: "Manual setup" },
        ];
      }
      if (c.database === "mongodb") {
        return [
          {
            name: "MongoDB Atlas",
            value: "mongodb-atlas",
            hint: "The most effective way to deploy MongoDB",
          },
          { name: "Docker", value: "docker", hint: "Run locally with docker compose" },
          { name: "None", value: "none", hint: "Manual setup" },
        ];
      }
      return [{ name: "None", value: "none", hint: "Manual setup" }];
    },
  },

  // Web Deploy - matching web-deploy.ts
  {
    id: "webDeploy",
    title: "Select web deployment",
    type: "select",
    skip: (c) => {
      const frontends = c.frontend || [];
      const hasWeb = frontends.some((f: string) =>
        [
          "tanstack-router",
          "react-router",
          "next",
          "nuxt",
          "svelte",
          "solid",
          "tanstack-start",
        ].includes(f),
      );
      return !hasWeb;
    },
    getDefault: () => "none",
    options: [
      { name: "Alchemy", value: "alchemy", hint: "Deploy to Cloudflare Workers using Alchemy" },
      { name: "None", value: "none", hint: "No deployment" },
    ],
  },

  // Server Deploy - matching server-deploy.ts (auto for workers runtime)
  {
    id: "serverDeploy",
    title: "Select server deployment",
    type: "select",
    skip: (c) => {
      // Skip if no backend or convex
      if (c.backend === "none" || c.backend === "convex") return true;
      // Only show for hono with workers runtime
      if (c.backend !== "hono") return true;
      // Auto-select alchemy for workers (skip prompt)
      if (c.runtime === "workers") return true;
      return true; // For now, always skip as per clack behavior
    },
    getDefault: (c) => {
      // Auto-select alchemy for workers runtime
      if (c.backend === "hono" && c.runtime === "workers") return "alchemy";
      return "none";
    },
    options: [
      { name: "Alchemy", value: "alchemy", hint: "Deploy to Cloudflare Workers using Alchemy" },
      { name: "None", value: "none", hint: "No server deployment" },
    ],
  },

  // Git - matching git.ts (confirm)
  {
    id: "git",
    title: "Initialize git repository?",
    type: "confirm",
  },

  // Package Manager - matching package-manager.ts exactly (detects current PM)
  {
    id: "packageManager",
    title: "Choose package manager",
    type: "select",
    // package-manager.ts uses getUserPkgManager() for initial value
    getDefault: () => getUserPkgManager(),
    options: [
      { name: "npm", value: "npm", hint: "Node Package Manager" },
      { name: "pnpm", value: "pnpm", hint: "Fast, disk space efficient package manager" },
      { name: "bun", value: "bun", hint: "All-in-one JavaScript runtime & toolkit" },
    ],
  },

  // Install - matching install.ts (confirm)
  {
    id: "install",
    title: "Install dependencies?",
    type: "confirm",
  },
];
