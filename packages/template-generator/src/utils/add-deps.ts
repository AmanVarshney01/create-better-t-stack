/**
 * Add dependencies to a package.json in the virtual filesystem
 */

import type { VirtualFileSystem } from "../core/virtual-fs";

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

export const dependencyVersionMap = {
  typescript: "^5",

  "better-auth": "^1.4.18",
  "@better-auth/expo": "^1.4.18",

  "@clerk/nextjs": "^6.37.4",
  "@clerk/clerk-react": "^5.60.1",
  "@clerk/tanstack-react-start": "^0.29.2",
  "@clerk/clerk-expo": "^2.19.23",

  // Auth.js (NextAuth v5)
  "next-auth": "^4.24.13",
  "@auth/core": "^0.34.3",
  "@auth/drizzle-adapter": "^1.11.1",
  "@auth/prisma-adapter": "^2.11.1",

  // Stack Auth
  "@stackframe/stack": "^2.8.68",

  // Supabase Auth
  "@supabase/supabase-js": "^2.96.0",
  "@supabase/ssr": "^0.8.0",

  // Auth0
  "@auth0/nextjs-auth0": "^4.15.0",

  "drizzle-orm": "^0.45.1",
  "drizzle-kit": "^0.31.9",
  "@planetscale/database": "^1.19.0",

  "@libsql/client": "^0.17.0",
  libsql: "0.5.22",

  "@neondatabase/serverless": "^1.0.2",
  pg: "^8.16.3",
  "@types/pg": "^8.16.0",
  "@types/ws": "^8.18.1",
  ws: "^8.18.3",

  mysql2: "^3.14.0",

  "@prisma/client": "^7.4.0",
  prisma: "^7.1.0",
  "@prisma/adapter-d1": "^7.4.0",
  "@prisma/adapter-neon": "^7.4.0",
  "@prisma/adapter-mariadb": "^7.4.0",
  "@prisma/adapter-libsql": "^7.4.0",
  "@prisma/adapter-better-sqlite3": "^7.4.0",
  "@prisma/adapter-pg": "^7.4.0",
  "@prisma/adapter-planetscale": "^7.4.0",

  mongoose: "^8.14.0",

  // TypeORM
  typeorm: "^0.3.23",
  "better-sqlite3": "^11.9.1",
  "@types/better-sqlite3": "^7.6.13",

  // Kysely
  kysely: "^0.28.3",

  // MikroORM
  "@mikro-orm/core": "^6.6.7",
  "@mikro-orm/sqlite": "^6.6.7",
  "@mikro-orm/postgresql": "^6.6.7",
  "@mikro-orm/mysql": "^6.6.7",
  "@mikro-orm/better-sqlite": "^6.6.7",

  // Sequelize
  sequelize: "^6.37.5",
  "sequelize-typescript": "^2.1.6",
  sqlite3: "^5.1.7",

  "vite-plugin-pwa": "^1.2.0",
  "@vite-pwa/assets-generator": "^1.0.2",

  "@tauri-apps/cli": "^2.10.0",

  "@biomejs/biome": "^2.4.2",

  oxlint: "^1.34.0",
  oxfmt: "^0.19.0",

  husky: "^9.1.7",
  lefthook: "^2.0.13",
  "lint-staged": "^16.2.7",

  tsx: "^4.19.2",
  "@types/node": "^22.13.14",

  "@types/bun": "^1.3.9",

  "@elysiajs/node": "^1.4.5",

  "@elysiajs/cors": "^1.4.1",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.21",

  "@hono/node-server": "^1.19.9",
  "@hono/trpc-server": "^0.4.2",
  hono: "^4.8.2",

  cors: "^2.8.5",
  express: "^5.1.0",
  "@types/express": "^5.0.6",
  "@types/cors": "^2.8.19",

  fastify: "^5.3.3",
  "@fastify/cors": "^11.2.0",

  "@nestjs/core": "^11.1.13",
  "@nestjs/common": "^11.1.13",
  "@nestjs/platform-express": "^11.1.13",
  "reflect-metadata": "^0.2.2",
  rxjs: "^7.8.1",

  // Encore.ts
  "encore.dev": "^1.54.0",

  // AdonisJS
  "@adonisjs/core": "^6.20.0",
  "@adonisjs/cors": "^2.2.1",
  "@adonisjs/tsconfig": "^1.4.1",

  // Nitro
  nitropack: "^2.11.12",
  h3: "^1.15.3",

  // feTS
  fets: "^0.8.5",

  turbo: "^2.6.3",

  ai: "^6.0.3",
  "@ai-sdk/google": "^3.0.29",
  "@ai-sdk/vue": "^3.0.86",
  "@ai-sdk/svelte": "^4.0.86",
  "@ai-sdk/react": "^3.0.88",
  "@ai-sdk/devtools": "^0.0.14",
  streamdown: "^1.6.10",
  shiki: "^3.20.0",

  // Mastra AI Framework
  mastra: "^0.24.9",
  "@mastra/core": "^0.24.9",

  // VoltAgent AI Framework
  "@voltagent/core": "^2.4.1",
  "@voltagent/server-hono": "^2.0.6",
  "@voltagent/libsql": "^2.1.1",
  "@voltagent/logger": "^2.0.2",

  // LangGraph.js AI Framework
  "@langchain/langgraph": "^1.1.4",
  "@langchain/core": "^1.1.24",
  "@langchain/google-genai": "^2.1.18",

  // OpenAI Agents SDK
  "@openai/agents": "^0.4.11",

  // Google ADK (Agent Development Kit)
  "@google/adk": "^0.3.0",

  // ModelFusion AI Library
  modelfusion: "^0.137.0",

  // LangChain (standalone)
  langchain: "^0.3.20",

  // LlamaIndex
  llamaindex: "^0.9.5",

  "@orpc/server": "^1.13.5",
  "@orpc/client": "^1.13.5",
  "@orpc/openapi": "^1.13.5",
  "@orpc/zod": "^1.13.5",
  "@orpc/tanstack-query": "^1.13.5",

  // ts-rest
  "@ts-rest/core": "^3.52.1",
  "@ts-rest/react-query": "^3.52.1",
  "@ts-rest/serverless": "^3.52.1",
  "@ts-rest/next": "^3.52.1",

  // Garph (GraphQL)
  garph: "^0.6.8",
  "graphql-yoga": "^5.18.0",
  graphql: "^16.11.0",
  "@garph/gqty": "^0.4.5",
  gqty: "^3.5.0",

  "@trpc/tanstack-react-query": "^11.10.0",
  "@trpc/server": "^11.10.0",
  "@trpc/client": "^11.10.0",

  next: "^16.1.1",

  convex: "^1.31.2",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.3.2",
  "convex-svelte": "^0.0.12",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.10.10",

  "@tanstack/svelte-query": "^5.85.3",
  "@tanstack/svelte-query-devtools": "^5.85.3",

  "@tanstack/vue-query-devtools": "^5.90.2",
  "@tanstack/vue-query": "^5.92.9",

  "@tanstack/react-query-devtools": "^5.91.3",
  "@tanstack/react-query": "^5.90.21",
  "@tanstack/react-router-ssr-query": "^1.160.2",

  "@tanstack/solid-query": "^5.90.23",
  "@tanstack/solid-query-devtools": "^5.91.3",
  "@tanstack/solid-router-devtools": "^1.160.0",

  wrangler: "^4.54.0",
  "@cloudflare/vite-plugin": "^1.25.1",
  "@opennextjs/cloudflare": "^1.16.5",
  "nitro-cloudflare-dev": "^0.2.2",
  "@sveltejs/adapter-cloudflare": "^7.2.7",
  "@sveltejs/adapter-node": "^5.5.3",
  "@cloudflare/workers-types": "^4.20260217.0",

  alchemy: "^0.82.1",

  // SST (Serverless Stack)
  sst: "^3.6.11",
  "aws-cdk-lib": "^2.238.0",
  constructs: "^10.4.2",
  "@opennextjs/aws": "^3.9.16",

  dotenv: "^17.2.2",
  tsdown: "^0.16.5",
  zod: "^4.1.13",
  "@t3-oss/env-core": "^0.13.10",
  "@t3-oss/env-nextjs": "^0.13.10",
  "@t3-oss/env-nuxt": "^0.13.10",
  srvx: "0.8.15",

  "@polar-sh/better-auth": "^1.8.1",
  "@polar-sh/sdk": "^0.43.1",

  // Email
  resend: "^4.5.1",
  "@react-email/components": "^0.0.36",
  "react-email": "^3.0.6",
  nodemailer: "^6.10.1",
  "@types/nodemailer": "^6.4.17",
  postmark: "^4.0.5",
  "@sendgrid/mail": "^8.1.6",
  "@aws-sdk/client-ses": "^3.991.0",
  "@aws-sdk/client-s3": "^3.991.0",
  "@aws-sdk/s3-request-presigner": "^3.991.0",
  "mailgun.js": "^10.2.3",
  "form-data": "^4.0.5",
  "@plunk/node": "^3.0.3",

  // Effect ecosystem (updated 2026-01-21)
  effect: "^3.19.14",
  "@effect/schema": "^0.75.5",
  "@effect/platform": "^0.94.5",
  "@effect/platform-node": "^0.104.1",
  "@effect/platform-bun": "^0.87.1",
  "@effect/platform-browser": "^0.74.0",
  "@effect/sql": "^0.49.0",
  "@effect/sql-sqlite-node": "^0.50.1",
  "@effect/sql-sqlite-bun": "^0.50.2",
  "@effect/sql-pg": "^0.50.3",
  "@effect/sql-mysql2": "^0.50.0",
  "@effect/sql-libsql": "^0.39.0",
  "@effect/sql-drizzle": "^0.48.1",
  "@effect/cli": "^0.73.2",
  "@effect/vitest": "^0.27.0",
  "@effect/opentelemetry": "^0.61.0",
  "@effect/rpc": "^0.73.2",
  "@effect/rpc-http": "^0.52.4",
  "@effect/cluster": "^0.56.4",
  "@effect/workflow": "^0.16.0",
  "@effect/ai": "^0.33.2",
  "@effect/ai-openai": "^0.37.2",
  "@effect/ai-anthropic": "^0.33.2",

  // CSS preprocessors
  sass: "^1.86.0",
  less: "^4.3.0",

  // UI libraries
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-slot": "^1.2.4",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-toast": "^1.2.15",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-tabs": "^1.1.13",

  "@headlessui/react": "^2.2.9",
  "@headlessui/vue": "^1.7.23",

  "@park-ui/panda-preset": "^0.43.1",

  "@chakra-ui/react": "^3.33.0",
  "@emotion/react": "^11.14.0",

  "@heroui/react": "^2.8.9",
  "framer-motion": "^12.34.1",

  // Mantine
  "@mantine/core": "^8.3.15",
  "@mantine/hooks": "^8.3.15",

  // Base UI
  "@base-ui-components/react": "^1.0.0-rc.0",

  // Ark UI (headless components for React/Vue/Solid/Svelte)
  "@ark-ui/react": "^5.31.0",
  "@ark-ui/vue": "^5.31.0",
  "@ark-ui/solid": "^5.31.0",
  "@ark-ui/svelte": "^5.16.0",

  // React Aria (Adobe's accessible components for React)
  "react-aria-components": "^1.15.1",

  daisyui: "^5.0.0",

  // Qwik
  "@builder.io/qwik": "^1.19.0",
  "@builder.io/qwik-city": "^1.19.0",
  "@builder.io/qwik-react": "^0.5.8",

  // Angular
  "@angular/core": "^19.2.0",
  "@angular/common": "^19.2.0",
  "@angular/compiler": "^19.2.0",
  "@angular/platform-browser": "^19.2.0",
  "@angular/platform-browser-dynamic": "^19.2.0",
  "@angular/router": "^19.2.0",
  "@angular/forms": "^19.2.0",
  "@angular/animations": "^19.2.0",
  "@angular-devkit/build-angular": "^19.2.0",
  "@angular/cli": "^19.2.0",
  "@angular/compiler-cli": "^19.2.0",

  // State management
  zustand: "^5.0.5",
  jotai: "^2.12.5",
  nanostores: "^0.11.3",
  "@nanostores/react": "^0.8.4",
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0",
  mobx: "^6.13.5",
  "mobx-react-lite": "^4.1.1",
  xstate: "^5.19.4",
  "@xstate/react": "^5.0.4",
  valtio: "^2.1.2",
  "@tanstack/store": "^0.9.1",
  "@tanstack/react-store": "^0.9.1",
  "@legendapp/state": "^2.1.15",
  "@legendapp/state-react": "^4.0.0",

  // Validation libraries
  valibot: "^1.1.0",
  arktype: "^2.1.29",
  "@sinclair/typebox": "^0.34.48",
  typia: "^9.7.1",
  runtypes: "^7.0.4",

  // Form libraries
  formik: "^2.4.6",
  yup: "^1.6.1",
  "final-form": "^4.20.10",
  "react-final-form": "^6.5.9",
  "@conform-to/react": "^1.17.1",
  "@conform-to/zod": "^1.17.1",
  "@modular-forms/solid": "^0.25.1",
  "@modular-forms/qwik": "^0.29.1",
  "@tanstack/react-form": "^1.28.3",
  "@tanstack/solid-form": "^1.28.3",

  // Real-time/WebSocket
  "socket.io": "^4.8.3",
  "socket.io-client": "^4.8.3",
  partykit: "^0.0.111",
  partysocket: "^1.0.2",
  ably: "^2.6.3",
  pusher: "^5.2.0",
  "pusher-js": "^8.4.0-rc2",
  "@liveblocks/client": "^3.13.5",
  "@liveblocks/react": "^3.13.5",
  "@liveblocks/node": "^3.13.5",
  yjs: "^13.6.27",
  "y-websocket": "^2.1.0",
  "y-protocols": "^1.0.7",
  "@y-sweet/sdk": "^0.9.1",
  "@y-sweet/react": "^0.9.1",

  // Job Queues / Background Workers
  bullmq: "^5.34.8",
  ioredis: "^5.4.2",
  "@trigger.dev/sdk": "^4.3.3",
  inngest: "^3.33.0",
  "@temporalio/client": "^1.14.1",
  "@temporalio/worker": "^1.14.1",
  "@temporalio/workflow": "^1.14.1",
  "@temporalio/activity": "^1.14.1",

  // Testing - Jest
  jest: "^29.7.0",
  "@types/jest": "^29.5.14",
  "ts-jest": "^29.4.6",
  "@jest/globals": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",

  // Testing - Cypress
  cypress: "^14.3.3",

  // Testing - Vitest
  vitest: "^3.1.1",
  "@vitest/ui": "^3.1.1",
  "@vitest/coverage-v8": "^3.1.1",
  jsdom: "^26.0.0",
  "happy-dom": "^18.0.1",

  // Testing - Playwright
  "@playwright/test": "^1.58.2",
  playwright: "^1.52.0",

  // Testing Library
  "@testing-library/dom": "^10.4.1",
  "@testing-library/react": "^16.3.2",
  "@testing-library/vue": "^8.1.0",
  "@testing-library/svelte": "^5.3.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1",

  // MSW (Mock Service Worker)
  msw: "^2.7.0",

  // Storybook
  storybook: "^9.0.15",
  "@storybook/react-vite": "^9.0.15",
  "@storybook/vue3-vite": "^9.0.15",
  "@storybook/svelte-vite": "^9.0.15",
  "@storybook/nextjs": "^9.0.15",
  "@storybook/addon-essentials": "^8.6.14",
  "@storybook/addon-interactions": "^8.6.14",
  "@storybook/test": "^8.6.15",

  // Animation
  motion: "^12.17.0",
  gsap: "^3.12.7",
  "@react-spring/web": "^9.7.5",
  "@react-spring/native": "^9.7.5",
  "@formkit/auto-animate": "^0.9.0",
  "lottie-react": "^2.4.1",
  "lottie-react-native": "^7.3.6",

  // Payments - Stripe
  stripe: "^17.5.0",
  "@stripe/stripe-js": "^5.5.0",
  "@stripe/react-stripe-js": "^3.1.1",

  // Payments - Lemon Squeezy
  "@lemonsqueezy/lemonsqueezy.js": "^4.0.0",

  // Payments - Paddle
  "@paddle/paddle-node-sdk": "^1.8.0",
  "@paddle/paddle-js": "^1.6.2",

  // Payments - Dodo Payments
  dodopayments: "^0.23.0",
  "dodopayments-checkout": "^0.2.1",

  // File Upload - UploadThing
  uploadthing: "^7.8.0",
  "@uploadthing/react": "^7.3.3",
  "@uploadthing/svelte": "^7.3.3",
  "@uploadthing/vue": "^7.3.3",
  "@uploadthing/solid": "^7.3.3",
  "@uploadthing/nuxt": "^7.1.10",
  "@uploadthing/expo": "^7.2.6",

  // File Upload - FilePond
  filepond: "^4.32.10",
  "react-filepond": "^7.1.3",
  "svelte-filepond": "^0.2.2",
  "vue-filepond": "^7.0.4",
  "filepond-plugin-image-preview": "^4.6.12",
  "filepond-plugin-file-validate-type": "^1.2.9",
  "filepond-plugin-file-validate-size": "^2.2.8",

  // File Upload - Uppy
  "@uppy/core": "^4.4.0",
  "@uppy/dashboard": "^4.3.2",
  "@uppy/drag-drop": "^4.1.1",
  "@uppy/progress-bar": "^4.3.2",
  "@uppy/xhr-upload": "^4.3.0",
  "@uppy/tus": "^4.2.0",
  "@uppy/react": "^4.1.0",
  "@uppy/svelte": "^4.1.0",
  "@uppy/vue": "^3.2.0",
  "@uppy/angular": "^0.8.0",

  // RedwoodJS
  "@redwoodjs/core": "^8.9.0",
  "@redwoodjs/web": "^8.9.0",
  "@redwoodjs/api": "^8.9.0",
  "@redwoodjs/router": "^8.9.0",
  "@redwoodjs/forms": "^8.9.0",
  "@redwoodjs/graphql-server": "^8.9.0",
  "@redwoodjs/vite": "^8.9.0",
  "@redwoodjs/project-config": "^8.9.0",

  // Fresh (Deno-native framework - uses JSR/deno.json, not npm)
  // These are reference versions for Fresh ecosystem
  preact: "^10.25.4",
  "preact-render-to-string": "^6.6.5",

  // Logging
  pino: "^9.6.0",
  "pino-pretty": "^13.1.3",
  "pino-http": "^10.4.0",
  winston: "^3.19.0",

  // OpenTelemetry
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/sdk-node": "^0.212.0",
  "@opentelemetry/auto-instrumentations-node": "^0.70.0",
  "@opentelemetry/exporter-trace-otlp-http": "^0.212.0",
  "@opentelemetry/exporter-metrics-otlp-http": "^0.212.0",
  "@opentelemetry/resources": "^1.30.1",
  "@opentelemetry/semantic-conventions": "^1.39.0",

  // Sentry
  "@sentry/node": "^9.1.0",
  "@sentry/profiling-node": "^9.1.0",

  // Grafana (Prometheus metrics)
  "prom-client": "^15.1.3",

  // Headless CMS - Payload
  payload: "^3.14.1",
  "@payloadcms/next": "^3.76.1",
  "@payloadcms/richtext-lexical": "^3.76.1",
  "@payloadcms/db-postgres": "^3.76.1",
  "@payloadcms/db-mongodb": "^3.76.1",
  "@payloadcms/db-sqlite": "^3.76.1",
  "@payloadcms/plugin-seo": "^3.76.1",
  "@payloadcms/storage-s3": "^3.76.1",

  // Headless CMS - Sanity
  sanity: "^3.82.0",
  "next-sanity": "^9.11.2",
  "@sanity/image-url": "^1.1.0",
  "@sanity/vision": "^3.82.0",

  // Headless CMS - Strapi
  "@strapi/client": "^1.6.1",
  qs: "^6.14.0",

  // Caching - Upstash Redis
  "@upstash/redis": "^1.36.2",

  // Search - Meilisearch
  meilisearch: "^0.44.1",

  // Search - Typesense
  typesense: "^2.0.0",

  // EdgeDB
  edgedb: "^2.0.1",
  "@edgedb/generate": "^0.6.1",

  // Feature Flags - GrowthBook
  "@growthbook/growthbook": "^1.6.4",
  "@growthbook/growthbook-react": "^1.6.4",

  // Feature Flags + Analytics - PostHog
  "posthog-js": "^1.347.2",
  "posthog-node": "^4.3.3",

  // Analytics - Plausible
  "plausible-tracker": "^0.3.9",
} as const;

export type AvailableDependencies = keyof typeof dependencyVersionMap;

export type AddDepsOptions = {
  vfs: VirtualFileSystem;
  packagePath: string;
  dependencies?: AvailableDependencies[];
  devDependencies?: AvailableDependencies[];
  customDependencies?: Record<string, string>;
  customDevDependencies?: Record<string, string>;
};

/**
 * Add dependencies to a package.json file in the VFS
 */
export function addPackageDependency(options: AddDepsOptions): void {
  const {
    vfs,
    packagePath,
    dependencies = [],
    devDependencies = [],
    customDependencies = {},
    customDevDependencies = {},
  } = options;

  const pkgJson = vfs.readJson<PackageJson>(packagePath);
  if (!pkgJson) return;

  // Initialize if not present
  pkgJson.dependencies = pkgJson.dependencies || {};
  pkgJson.devDependencies = pkgJson.devDependencies || {};

  // Add regular dependencies
  for (const dep of dependencies) {
    if (!pkgJson.dependencies[dep]) {
      const version = dependencyVersionMap[dep as AvailableDependencies];
      if (!version) {
        throw new Error(
          `Missing version for dependency: ${dep}. Add it to dependencyVersionMap in add-deps.ts`,
        );
      }
      pkgJson.dependencies[dep] = version;
    }
  }

  // Add dev dependencies
  for (const dep of devDependencies) {
    if (!pkgJson.devDependencies[dep]) {
      const version = dependencyVersionMap[dep as AvailableDependencies];
      if (!version) {
        throw new Error(
          `Missing version for devDependency: ${dep}. Add it to dependencyVersionMap in add-deps.ts`,
        );
      }
      pkgJson.devDependencies[dep] = version;
    }
  }

  // Add custom dependencies (with specific versions)
  for (const [dep, version] of Object.entries(customDependencies)) {
    pkgJson.dependencies[dep] = version;
  }

  // Add custom dev dependencies (with specific versions)
  for (const [dep, version] of Object.entries(customDevDependencies)) {
    pkgJson.devDependencies[dep] = version;
  }

  vfs.writeJson(packagePath, pkgJson);
}
