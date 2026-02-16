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
# Using bun (recommended)
bun create better-t-stack@latest

# Using pnpm
pnpm create better-t-stack@latest

# Using npm
npx create-better-t-stack@latest
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
| **Database Setup**       | • Turso (SQLite)<br>• Cloudflare D1 (SQLite)<br>• Neon (PostgreSQL)<br>• Supabase (PostgreSQL)<br>• Prisma Postgres<br>• MongoDB Atlas<br>• None (manual setup)                                                                                            |
| **Authentication**       | Better-Auth (email/password, with more options coming soon)                                                                                                                                                                                                |
| **Styling**              | Tailwind CSS with shadcn/ui components                                                                                                                                                                                                                     |
| **Addons**               | • PWA support<br>• Tauri (desktop applications)<br>• Starlight (documentation site)<br>• Biome (linting and formatting)<br>• Lefthook, Husky (Git hooks)<br>• Turborepo (optimized builds)                                                                 |
| **Examples**             | • Todo app<br>• AI Chat interface (using Vercel AI SDK)                                                                                                                                                                                                    |
| **Developer Experience** | • Automatic Git initialization<br>• Package manager choice (npm, pnpm, bun)<br>• Automatic dependency installation                                                                                                                                         |

## Usage

```bash
Usage: create-better-t-stack [project-directory] [options]

Options:
  -V, --version                   Output the version number
  -y, --yes                       Use default configuration
  --template <type>               Use a template (mern, pern, t3, uniwind, none)
  --database <type>               Database type (none, sqlite, postgres, mysql, mongodb)
  --orm <type>                    ORM type (none, drizzle, prisma, mongoose)
  --auth <provider>               Authentication (better-auth, clerk, none)
  --payments <provider>           Payments provider (polar, none)
  --frontend <types...>           Frontend types (tanstack-router, react-router, tanstack-start, next, nuxt, svelte, solid, astro, native-bare, native-uniwind, native-unistyles, none)
  --addons <types...>             Additional addons (pwa, tauri, starlight, biome, lefthook, husky, ruler, mcp, turborepo, fumadocs, ultracite, oxlint, opentui, wxt, skills, none)
  --examples <types...>           Examples to include (todo, ai, none)
  --git                           Initialize git repository
  --no-git                        Skip git initialization
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install                       Install dependencies
  --no-install                    Skip installing dependencies
  --db-setup <setup>              Database setup (turso, d1, neon, supabase, prisma-postgres, planetscale, mongodb-atlas, docker, none)
  --web-deploy <setup>            Web deployment (cloudflare, none)
  --server-deploy <setup>         Server deployment (cloudflare, none)
  --backend <framework>           Backend framework (hono, express, fastify, elysia, convex, self, none)
  --runtime <runtime>             Runtime (bun, node, workers, none)
  --api <type>                    API type (trpc, orpc, none)
  --directory-conflict <strategy> Directory strategy (merge, overwrite, increment, error)
  --manual-db                     Skip automatic database setup prompts
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

You can disable telemetry by setting the `BTS_TELEMETRY_DISABLED` environment variable:

```bash
# Disable telemetry for a single run
BTS_TELEMETRY_DISABLED=1 npx create-better-t-stack

# Disable telemetry globally in your shell profile (.bashrc, .zshrc, etc.)
export BTS_TELEMETRY_DISABLED=1
```

## Examples

Create a project with default configuration:

```bash
npx create-better-t-stack --yes
```

Create a project with specific options:

```bash
npx create-better-t-stack --database postgres --orm drizzle --auth --addons pwa biome
```

Create a project with Elysia backend and Node.js runtime:

```bash
npx create-better-t-stack --backend elysia --runtime node
```

Create a project with multiple frontend options (one web + one native):

```bash
npx create-better-t-stack --frontend tanstack-router native-bare
```

Create a project with examples:

```bash
npx create-better-t-stack --examples todo ai
```

Create a project with Turso database setup:

```bash
npx create-better-t-stack --database sqlite --orm drizzle --db-setup turso
```

Create a project with Supabase PostgreSQL setup:

```bash
npx create-better-t-stack --database postgres --orm drizzle --db-setup supabase --auth better-auth
```

Create a project with Convex backend:

```bash
npx create-better-t-stack --backend convex --frontend tanstack-router
```

Create a project with documentation site:

```bash
npx create-better-t-stack --addons starlight
```

Create a minimal TypeScript project with no backend:

```bash
npx create-better-t-stack --backend none --frontend tanstack-router
```

Create a backend-only project with no frontend:

```bash
npx create-better-t-stack --frontend none --backend hono --database postgres --orm drizzle
```

Create a simple frontend-only project:

```bash
npx create-better-t-stack --backend none --frontend next --addons none --examples none
```

Create a Cloudflare Workers project:

```bash
npx create-better-t-stack --backend hono --runtime workers --database sqlite --orm drizzle --db-setup d1
```

Create a minimal API-only project:

```bash
npx create-better-t-stack --frontend none --backend hono --api trpc --database none --addons none
```

## Compatibility Notes

- **Convex backend**: Requires `database`, `orm`, `api`, `runtime`, and `server-deploy` to be `none`; auth can be `better-auth`, `clerk`, or `none` depending frontend compatibility
- **Backend 'none'**: If selected, this option will force related options like API, ORM, database, authentication, and runtime to 'none'. Examples will also be disabled (set to none/empty).
- **Frontend 'none'**: Creates a backend-only project. When selected, PWA, Tauri, and certain examples may be disabled.
- **API 'none'**: Disables tRPC/oRPC setup. Can be used with backend frameworks for REST APIs or custom API implementations.
- **Database 'none'**: Disables database setup and requires ORM to be `none`.
- **ORM 'none'**: Can be used when you want to handle database operations manually or use a different ORM.
- **Runtime 'none'**: Only available with Convex backend, backend `none`, or backend `self`.
- **Cloudflare Workers runtime**: Only compatible with Hono backend, Drizzle ORM (or no ORM), and SQLite database (with D1 setup). Not compatible with MongoDB.
- **Addons 'none'**: Skips all addons.
- **Examples 'none'**: Skips all example implementations (todo, AI chat).
- **Nuxt, Svelte, SolidJS, and Astro** frontends are only compatible with oRPC API layer
- **PWA support** requires TanStack Router, React Router, Next.js, or SolidJS
- **Tauri desktop app** requires TanStack Router, React Router, Nuxt, Svelte, SolidJS, or Next.js
- **AI example** is not compatible with Solid or Astro. With Convex backend, it also excludes Nuxt and Svelte.

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
