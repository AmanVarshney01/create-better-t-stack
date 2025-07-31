# Create Better-T-Stack CLI

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations

## Sponsors

<p align="center">
<img src="https://sponsors.amanv.dev/sponsors.png" alt="Sponsors">
</p>

![demo](https://cdn.jsdelivr.net/gh/amanvarshney01/create-better-t-stack@master/demo.gif)

## Quick Start

Run without installing globally:

```bash
# Using npm
npx create-better-t-stack@latest

# Using bun
bun create better-t-stack@latest

# Using pnpm
pnpm create better-t-stack@latest
```

Follow the prompts to configure your project or use the `--yes` flag for defaults.

## Features

| Category                 | Options                                                                                                                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**           | End-to-end type safety across all parts of your application                                                                                                                                                                                                |
| **Frontend**             | • React with TanStack Router<br>• React with React Router<br>• React with TanStack Start (SSR)<br>• Next.js<br>• SvelteKit<br>• Nuxt (Vue)<br>• SolidJS<br>• React Native with NativeWind (via Expo)<br>• React Native with Unistyles (via Expo)<br>• None |
| **Backend**              | • Hono<br>• Express<br>• Elysia<br>• Next.js API routes<br>• Convex<br>• Fastify<br>• None                                                                                                                                                                 |
| **API Layer**            | • tRPC (type-safe APIs)<br>• oRPC (OpenAPI-compatible type-safe APIs)<br>• None                                                                                                                                                                            |
| **Runtime**              | • Bun<br>• Node.js<br>• Cloudflare Workers<br>• None                                                                                                                                                                                                       |
| **Database**             | • SQLite<br>• PostgreSQL<br>• MySQL<br>• MongoDB<br>• None                                                                                                                                                                                                 |
| **ORM**                  | • Drizzle (TypeScript-first)<br>• Prisma (feature-rich)<br>• Mongoose (for MongoDB)<br>• None                                                                                                                                                              |
| **Database Setup**       | • Turso (SQLite)<br>• Cloudflare D1 (SQLite)<br>• Neon (PostgreSQL)<br>• Supabase (PostgreSQL)<br>• Prisma Postgres (via Prisma Accelerate)<br>• MongoDB Atlas<br>• None (manual setup)                                                                    |
| **Authentication**       | Better-Auth (email/password, with more options coming soon)                                                                                                                                                                                                |
| **Styling**              | Tailwind CSS with shadcn/ui components                                                                                                                                                                                                                     |
| **Addons**               | • PWA support<br>• Tauri (desktop applications)<br>• Starlight (documentation site)<br>• Biome (linting and formatting)<br>• Husky (Git hooks)<br>• Turborepo (optimized builds)                                                                           |
| **Examples**             | • Todo app<br>• AI Chat interface (using Vercel AI SDK)                                                                                                                                                                                                    |
| **Developer Experience** | • Automatic Git initialization<br>• Package manager choice (npm, pnpm, bun)<br>• Automatic dependency installation                                                                                                                                         |

## Usage

```bash
Usage: create-better-t-stack [project-directory] [options]

Options:
  -V, --version                   Output the version number
  -y, --yes                       Use default configuration
  --database <type>               Database type (none, sqlite, postgres, mysql, mongodb)
  --orm <type>                    ORM type (none, drizzle, prisma, mongoose)
  --auth                          Include authentication
  --no-auth                       Exclude authentication
  --frontend <types...>           Frontend types (tanstack-router, react-router, tanstack-start, next, nuxt, svelte, solid, native-nativewind, native-unistyles, none)
  --addons <types...>             Additional addons (pwa, tauri, starlight, biome, husky, turborepo, none)
  --examples <types...>           Examples to include (todo, ai, none)
  --git                           Initialize git repository
  --no-git                        Skip git initialization
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install                       Install dependencies
  --no-install                    Skip installing dependencies
  --db-setup <setup>              Database setup (turso, d1, neon, supabase, prisma-postgres, mongodb-atlas, none)
  --backend <framework>           Backend framework (hono, express, elysia, next, convex, fastify, none)
  --runtime <runtime>             Runtime (bun, node, workers, none)
  --api <type>                    API type (trpc, orpc, none)
  -h, --help                      Display help
```

## Telemetry

This CLI collects anonymous usage data to help improve the tool. The data collected includes:
- Configuration options selected
- CLI version
- Node.js version
- Platform (OS)

**Telemetry is enabled by default in published versions** to help us understand usage patterns and improve the tool.

### Disabling Telemetry

You can disable telemetry by setting the `BTS_TELEMETRY` environment variable:

```bash
# Disable telemetry for a single run
BTS_TELEMETRY_DISABLED=1 npx create-better-t-stack my-app

# Disable telemetry globally in your shell profile (.bashrc, .zshrc, etc.)
export BTS_TELEMETRY_DISABLED=1
```

### Development

During development, telemetry is automatically disabled when `NODE_ENV=development`.

## Examples

Create a project with default configuration:

```bash
npx create-better-t-stack my-app --yes
```

Create a project with specific options:

```bash
npx create-better-t-stack my-app --database postgres --orm drizzle --auth --addons pwa biome
```

Create a project with Elysia backend and Node.js runtime:

```bash
npx create-better-t-stack my-app --backend elysia --runtime node
```

Create a project with multiple frontend options:

```bash
npx create-better-t-stack my-app --frontend tanstack-router native
```

Create a project with examples:

```bash
npx create-better-t-stack my-app --examples todo ai
```

Create a project with Turso database setup:

```bash
npx create-better-t-stack my-app --database sqlite --orm drizzle --db-setup turso
```

Create a project with Supabase PostgreSQL setup:

```bash
npx create-better-t-stack my-app --database postgres --orm drizzle --db-setup supabase --auth
```

Create a project with Convex backend:

```bash
npx create-better-t-stack my-app --backend convex --frontend tanstack-router
```

Create a project with documentation site:

```bash
npx create-better-t-stack my-app --addons starlight
```

Create a minimal TypeScript project with no backend:

```bash
npx create-better-t-stack my-app --backend none --frontend tanstack-router
```

Create a backend-only project with no frontend:

```bash
npx create-better-t-stack my-app --frontend none --backend hono --database postgres --orm drizzle
```

Create a simple frontend-only project:

```bash
npx create-better-t-stack my-app --backend none --frontend next --addons none --examples none
```

Create a Cloudflare Workers project:

```bash
npx create-better-t-stack my-app --backend hono --runtime workers --database sqlite --orm drizzle --db-setup d1
```

Create a minimal API-only project:

```bash
npx create-better-t-stack my-app --frontend none --backend hono --api trpc --database none --addons none
```

## Compatibility Notes

- **Convex backend**: Automatically disables authentication, database, ORM, and API options
- **Backend 'none'**: If selected, this option will force related options like API, ORM, database, authentication, and runtime to 'none'. Examples will also be disabled (set to none/empty).
- **Frontend 'none'**: Creates a backend-only project. When selected, PWA, Tauri, and certain examples may be disabled.
- **API 'none'**: Disables tRPC/oRPC setup. Can be used with backend frameworks for REST APIs or custom API implementations.
- **Database 'none'**: Disables database setup. Automatically sets ORM to 'none' and disables authentication.
- **ORM 'none'**: Can be used when you want to handle database operations manually or use a different ORM.
- **Runtime 'none'**: Only available with Convex backend or when backend is 'none'.
- **Cloudflare Workers runtime**: Only compatible with Hono backend, Drizzle ORM (or no ORM), and SQLite database (with D1 setup). Not compatible with MongoDB.
- **Addons 'none'**: Skips all addons (PWA, Tauri, Starlight, Biome, Husky, Turborepo).
- **Examples 'none'**: Skips all example implementations (todo, AI chat).
- **SvelteKit, Nuxt, and SolidJS** frontends are only compatible with oRPC API layer
- **PWA support** requires React with TanStack Router, React Router, or SolidJS
- **Tauri desktop app** requires React (TanStack Router/React Router), Nuxt, SvelteKit, or SolidJS
- **AI example** is not compatible with Elysia backend or SolidJS frontend

## Project Structure

The created project follows a clean monorepo structure:

```
my-better-t-app/
├── apps/
│   ├── web/          # Frontend application
│   ├── server/       # Backend API
│   ├── native/       # (optional) Mobile application
│   └── docs/         # (optional) Documentation site
├── packages/         # Shared packages
└── README.md         # Auto-generated project documentation
```

After project creation, you'll receive detailed instructions for next steps and additional setup requirements.
