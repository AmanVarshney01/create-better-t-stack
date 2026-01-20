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

  "better-auth": "^1.4.9",
  "@better-auth/expo": "^1.4.9",

  "@clerk/nextjs": "^6.31.5",
  "@clerk/clerk-react": "^5.45.0",
  "@clerk/tanstack-react-start": "^0.26.3",
  "@clerk/clerk-expo": "^2.14.25",

  // Auth.js (NextAuth v5)
  "next-auth": "^5.0.0-beta.28",
  "@auth/core": "^0.39.1",
  "@auth/drizzle-adapter": "^1.8.1",
  "@auth/prisma-adapter": "^2.9.1",

  "drizzle-orm": "^0.45.1",
  "drizzle-kit": "^0.31.8",
  "@planetscale/database": "^1.19.0",

  "@libsql/client": "0.15.15",
  libsql: "0.5.22",

  "@neondatabase/serverless": "^1.0.2",
  pg: "^8.16.3",
  "@types/pg": "^8.15.6",
  "@types/ws": "^8.18.1",
  ws: "^8.18.3",

  mysql2: "^3.14.0",

  "@prisma/client": "^7.1.0",
  prisma: "^7.1.0",
  "@prisma/adapter-d1": "^7.1.0",
  "@prisma/adapter-neon": "^7.1.0",
  "@prisma/adapter-mariadb": "^7.1.0",
  "@prisma/adapter-libsql": "^7.1.0",
  "@prisma/adapter-better-sqlite3": "^7.1.0",
  "@prisma/adapter-pg": "^7.1.0",
  "@prisma/adapter-planetscale": "^7.1.0",

  mongoose: "^8.14.0",

  // TypeORM
  typeorm: "^0.3.23",
  "better-sqlite3": "^11.9.1",
  "@types/better-sqlite3": "^7.6.13",

  // Kysely
  kysely: "^0.28.3",

  // MikroORM
  "@mikro-orm/core": "^6.5.3",
  "@mikro-orm/sqlite": "^6.5.3",
  "@mikro-orm/postgresql": "^6.5.3",
  "@mikro-orm/mysql": "^6.5.3",
  "@mikro-orm/better-sqlite": "^6.5.3",

  // Sequelize
  sequelize: "^6.37.5",
  "sequelize-typescript": "^2.1.6",
  sqlite3: "^5.1.7",

  "vite-plugin-pwa": "^1.0.1",
  "@vite-pwa/assets-generator": "^1.0.0",

  "@tauri-apps/cli": "^2.4.0",

  "@biomejs/biome": "^2.2.0",

  oxlint: "^1.34.0",
  oxfmt: "^0.19.0",

  husky: "^9.1.7",
  lefthook: "^2.0.13",
  "lint-staged": "^16.1.2",

  tsx: "^4.19.2",
  "@types/node": "^22.13.14",

  "@types/bun": "^1.3.4",

  "@elysiajs/node": "^1.3.1",

  "@elysiajs/cors": "^1.4.1",
  "@elysiajs/trpc": "^1.1.0",
  elysia: "^1.4.21",

  "@hono/node-server": "^1.14.4",
  "@hono/trpc-server": "^0.4.0",
  hono: "^4.8.2",

  cors: "^2.8.5",
  express: "^5.1.0",
  "@types/express": "^5.0.1",
  "@types/cors": "^2.8.17",

  fastify: "^5.3.3",
  "@fastify/cors": "^11.0.1",

  "@nestjs/core": "^11.0.20",
  "@nestjs/common": "^11.0.20",
  "@nestjs/platform-express": "^11.0.20",
  "reflect-metadata": "^0.2.2",
  rxjs: "^7.8.1",

  // Encore.ts
  "encore.dev": "^1.50.0",

  // AdonisJS
  "@adonisjs/core": "^6.19.0",
  "@adonisjs/cors": "^2.2.1",
  "@adonisjs/tsconfig": "^1.4.0",

  // Nitro
  nitropack: "^2.11.12",
  h3: "^1.15.3",

  // feTS
  fets: "^0.8.5",

  turbo: "^2.6.3",

  ai: "^6.0.3",
  "@ai-sdk/google": "^3.0.1",
  "@ai-sdk/vue": "^3.0.3",
  "@ai-sdk/svelte": "^4.0.3",
  "@ai-sdk/react": "^3.0.3",
  "@ai-sdk/devtools": "^0.0.2",
  streamdown: "^1.6.10",
  shiki: "^3.20.0",

  // Mastra AI Framework
  mastra: "^0.24.9",
  "@mastra/core": "^0.24.9",

  // VoltAgent AI Framework
  "@voltagent/core": "^2.0.10",
  "@voltagent/server-hono": "^2.0.3",
  "@voltagent/libsql": "^2.0.3",
  "@voltagent/logger": "^2.0.2",

  // LangGraph.js AI Framework
  "@langchain/langgraph": "^1.0.15",
  "@langchain/core": "^1.1.12",
  "@langchain/google-genai": "^2.1.8",

  // OpenAI Agents SDK
  "@openai/agents": "^0.0.17",

  // Google ADK (Agent Development Kit)
  "@google/adk": "^0.2.0",

  // ModelFusion AI Library
  modelfusion: "^0.137.0",

  "@orpc/server": "^1.12.2",
  "@orpc/client": "^1.12.2",
  "@orpc/openapi": "^1.12.2",
  "@orpc/zod": "^1.12.2",
  "@orpc/tanstack-query": "^1.12.2",

  // ts-rest
  "@ts-rest/core": "^3.55.0",
  "@ts-rest/react-query": "^3.55.0",
  "@ts-rest/serverless": "^3.55.0",
  "@ts-rest/next": "^3.55.0",

  // Garph (GraphQL)
  garph: "^0.6.8",
  "graphql-yoga": "^5.10.11",
  graphql: "^16.11.0",
  "@garph/gqty": "^1.3.5",
  gqty: "^3.5.0",

  "@trpc/tanstack-react-query": "^11.7.2",
  "@trpc/server": "^11.7.2",
  "@trpc/client": "^11.7.2",

  next: "^16.1.1",

  convex: "^1.31.2",
  "@convex-dev/react-query": "^0.1.0",
  "@convex-dev/agent": "^0.3.2",
  "convex-svelte": "^0.0.12",
  "convex-nuxt": "0.1.5",
  "convex-vue": "^0.1.5",
  "@convex-dev/better-auth": "^0.10.9",

  "@tanstack/svelte-query": "^5.85.3",
  "@tanstack/svelte-query-devtools": "^5.85.3",

  "@tanstack/vue-query-devtools": "^5.90.2",
  "@tanstack/vue-query": "^5.90.2",

  "@tanstack/react-query-devtools": "^5.91.1",
  "@tanstack/react-query": "^5.90.12",
  "@tanstack/react-router-ssr-query": "^1.142.7",

  "@tanstack/solid-query": "^5.87.4",
  "@tanstack/solid-query-devtools": "^5.87.4",
  "@tanstack/solid-router-devtools": "^1.131.44",

  wrangler: "^4.54.0",
  "@cloudflare/vite-plugin": "^1.17.1",
  "@opennextjs/cloudflare": "^1.14.6",
  "nitro-cloudflare-dev": "^0.2.2",
  "@sveltejs/adapter-cloudflare": "^7.2.4",
  "@cloudflare/workers-types": "^4.20251213.0",

  alchemy: "^0.82.1",

  dotenv: "^17.2.2",
  tsdown: "^0.16.5",
  zod: "^4.1.13",
  "@t3-oss/env-core": "^0.13.1",
  "@t3-oss/env-nextjs": "^0.13.1",
  "@t3-oss/env-nuxt": "^0.13.1",
  srvx: "0.8.15",

  "@polar-sh/better-auth": "^1.1.3",
  "@polar-sh/sdk": "^0.34.16",

  // Email
  resend: "^4.5.1",
  "@react-email/components": "^0.0.36",
  "react-email": "^3.0.6",
  nodemailer: "^6.10.1",
  "@types/nodemailer": "^6.4.17",
  postmark: "^4.0.5",
  "@sendgrid/mail": "^8.1.4",
  "@aws-sdk/client-ses": "^3.970.0",
  "mailgun.js": "^10.2.3",
  "form-data": "^4.0.1",
  "@plunk/node": "^3.0.2",

  // Effect ecosystem
  effect: "^3.16.1",
  "@effect/schema": "^0.75.8",
  "@effect/platform": "^0.78.1",
  "@effect/platform-node": "^0.74.1",
  "@effect/platform-bun": "^0.58.1",
  "@effect/platform-browser": "^0.57.1",
  "@effect/sql": "^0.35.1",
  "@effect/sql-sqlite-node": "^0.29.1",
  "@effect/sql-sqlite-bun": "^0.29.1",
  "@effect/sql-pg": "^0.29.1",
  "@effect/sql-mysql2": "^0.29.1",
  "@effect/sql-libsql": "^0.29.1",
  "@effect/sql-drizzle": "^0.26.1",
  "@effect/cli": "^0.56.1",
  "@effect/vitest": "^0.17.1",
  "@effect/opentelemetry": "^0.43.1",
  "@effect/rpc": "^0.51.1",
  "@effect/rpc-http": "^0.51.1",
  "@effect/cluster": "^0.26.1",
  "@effect/workflow": "^0.26.1",
  "@effect/ai": "^0.5.1",
  "@effect/ai-openai": "^0.5.1",
  "@effect/ai-anthropic": "^0.5.1",

  // CSS preprocessors
  sass: "^1.86.0",
  less: "^4.3.0",

  // UI libraries
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-label": "^2.1.4",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-switch": "^1.1.7",
  "@radix-ui/react-tabs": "^1.1.7",

  "@headlessui/react": "^2.3.1",
  "@headlessui/vue": "^1.8.1",

  "@park-ui/panda-preset": "^0.47.0",
  "@park-ui/ark": "^0.47.0",

  "@chakra-ui/react": "^3.21.3",
  "@emotion/react": "^11.14.0",

  "@heroui/react": "^2.8.3",
  "framer-motion": "^12.17.0",

  // Mantine
  "@mantine/core": "^8.3.12",
  "@mantine/hooks": "^8.3.12",

  // Base UI
  "@base-ui-components/react": "^1.0.0-rc.0",

  // Ark UI (headless components for React/Vue/Solid/Svelte)
  "@ark-ui/react": "^5.30.0",
  "@ark-ui/vue": "^5.26.2",
  "@ark-ui/solid": "^5.30.0",
  "@ark-ui/svelte": "^5.15.0",

  // React Aria (Adobe's accessible components for React)
  "react-aria-components": "^1.14.0",

  daisyui: "^4.12.28",

  // Qwik
  "@builder.io/qwik": "^1.14.1",
  "@builder.io/qwik-city": "^1.14.1",
  "@builder.io/qwik-react": "^0.7.0",

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
  "@reduxjs/toolkit": "^2.8.2",
  "react-redux": "^9.2.0",
  mobx: "^6.13.5",
  "mobx-react-lite": "^4.1.0",
  xstate: "^5.19.4",
  "@xstate/react": "^5.0.4",
  valtio: "^2.1.2",
  "@tanstack/store": "^0.8.0",
  "@tanstack/react-store": "^0.8.0",
  "@legendapp/state": "^3.0.0",
  "@legendapp/state-react": "^4.0.0",

  // Validation libraries
  valibot: "^1.1.0",
  arktype: "^2.1.29",
  "@sinclair/typebox": "^0.34.31",
  typia: "^9.7.1",
  runtypes: "^7.0.4",

  // Form libraries
  formik: "^2.4.6",
  yup: "^1.6.1",
  "final-form": "^4.20.10",
  "react-final-form": "^6.5.9",
  "@conform-to/react": "^1.8.2",
  "@conform-to/zod": "^1.8.2",
  "@modular-forms/solid": "^0.25.1",
  "@modular-forms/qwik": "^0.29.1",

  // Real-time/WebSocket
  "socket.io": "^4.8.1",
  "socket.io-client": "^4.8.1",
  partykit: "^0.0.111",
  partysocket: "^1.0.2",
  ably: "^2.6.3",
  pusher: "^5.2.0",
  "pusher-js": "^8.4.0-rc2",
  "@liveblocks/client": "^3.11.0",
  "@liveblocks/react": "^3.13.2",
  "@liveblocks/node": "^3.11.0",
  yjs: "^13.6.27",
  "y-websocket": "^2.1.0",
  "y-protocols": "^1.0.6",
  "@y-sweet/sdk": "^0.6.3",
  "@y-sweet/react": "^0.6.3",

  // Job Queues / Background Workers
  bullmq: "^5.34.8",
  ioredis: "^5.4.2",
  "@trigger.dev/sdk": "^4.1.1",
  inngest: "^3.33.0",
  "@temporalio/client": "^1.11.7",
  "@temporalio/worker": "^1.11.7",
  "@temporalio/workflow": "^1.11.7",
  "@temporalio/activity": "^1.11.7",

  // Testing - Jest
  jest: "^29.7.0",
  "@types/jest": "^29.5.14",
  "ts-jest": "^29.2.5",
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
  "@playwright/test": "^1.52.0",
  playwright: "^1.52.0",

  // Testing Library
  "@testing-library/dom": "^10.4.0",
  "@testing-library/react": "^16.2.0",
  "@testing-library/vue": "^8.1.0",
  "@testing-library/svelte": "^5.2.7",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/user-event": "^14.6.1",

  // MSW (Mock Service Worker)
  msw: "^2.7.0",

  // Storybook
  storybook: "^9.0.15",
  "@storybook/react-vite": "^9.0.15",
  "@storybook/vue3-vite": "^9.0.15",
  "@storybook/svelte-vite": "^9.0.15",
  "@storybook/nextjs": "^9.0.15",
  "@storybook/addon-essentials": "^9.0.15",
  "@storybook/addon-interactions": "^9.0.15",
  "@storybook/test": "^9.0.15",

  // Animation
  motion: "^12.17.0",
  gsap: "^3.12.7",
  "@react-spring/web": "^9.7.5",
  "@react-spring/native": "^9.7.5",
  "@formkit/auto-animate": "^0.8.2",
  "lottie-react": "^2.4.1",
  "lottie-react-native": "^7.1.0",

  // Payments - Stripe
  stripe: "^17.5.0",
  "@stripe/stripe-js": "^5.5.0",
  "@stripe/react-stripe-js": "^3.1.1",

  // Payments - Lemon Squeezy
  "@lemonsqueezy/lemonsqueezy.js": "^4.0.0",

  // Payments - Paddle
  "@paddle/paddle-node-sdk": "^1.8.0",
  "@paddle/paddle-js": "^1.3.0",

  // Payments - Dodo Payments
  dodopayments: "^0.23.0",
  "dodopayments-checkout": "^0.2.1",

  // File Upload - UploadThing
  uploadthing: "^7.8.0",
  "@uploadthing/react": "^7.3.0",
  "@uploadthing/svelte": "^7.3.0",
  "@uploadthing/vue": "^7.3.0",
  "@uploadthing/solid": "^7.3.0",
  "@uploadthing/nuxt": "^7.3.0",
  "@uploadthing/expo": "^7.3.0",

  // File Upload - FilePond
  filepond: "^4.32.10",
  "react-filepond": "^7.1.2",
  "svelte-filepond": "^1.0.2",
  "vue-filepond": "^7.0.4",
  "filepond-plugin-image-preview": "^4.6.12",
  "filepond-plugin-file-validate-type": "^1.2.9",
  "filepond-plugin-file-validate-size": "^2.2.8",

  // File Upload - Uppy
  "@uppy/core": "^4.4.0",
  "@uppy/dashboard": "^4.3.2",
  "@uppy/drag-drop": "^4.1.1",
  "@uppy/progress-bar": "^4.2.0",
  "@uppy/xhr-upload": "^4.3.0",
  "@uppy/tus": "^4.2.0",
  "@uppy/react": "^4.1.0",
  "@uppy/svelte": "^4.1.0",
  "@uppy/vue": "^4.1.0",
  "@uppy/angular": "^0.8.0",

  // RedwoodJS
  "@redwoodjs/core": "^8.8.0",
  "@redwoodjs/web": "^8.6.1",
  "@redwoodjs/api": "^8.6.1",
  "@redwoodjs/router": "^8.6.1",
  "@redwoodjs/forms": "^8.6.1",
  "@redwoodjs/graphql-server": "^8.6.1",
  "@redwoodjs/vite": "^8.6.1",
  "@redwoodjs/project-config": "^8.6.1",

  // Fresh (Deno-native framework - uses JSR/deno.json, not npm)
  // These are reference versions for Fresh ecosystem
  preact: "^10.25.4",
  "preact-render-to-string": "^6.5.12",

  // Logging
  pino: "^9.6.0",
  "pino-pretty": "^13.0.0",
  "pino-http": "^10.4.0",
  winston: "^3.19.0",

  // OpenTelemetry
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/sdk-node": "^0.57.2",
  "@opentelemetry/auto-instrumentations-node": "^0.56.1",
  "@opentelemetry/exporter-trace-otlp-http": "^0.57.2",
  "@opentelemetry/exporter-metrics-otlp-http": "^0.57.2",
  "@opentelemetry/resources": "^1.30.1",
  "@opentelemetry/semantic-conventions": "^1.30.0",

  // Headless CMS - Payload
  payload: "^3.14.1",
  "@payloadcms/next": "^3.14.1",
  "@payloadcms/richtext-lexical": "^3.14.1",
  "@payloadcms/db-postgres": "^3.14.1",
  "@payloadcms/db-mongodb": "^3.14.1",
  "@payloadcms/db-sqlite": "^3.14.1",
  "@payloadcms/plugin-seo": "^3.14.1",
  "@payloadcms/storage-s3": "^3.14.1",
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
