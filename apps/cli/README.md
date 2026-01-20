# Better Fullstack CLI

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations.

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
  --database <type>               Database type (none, sqlite, postgres, mysql, mongodb)
  --orm <type>                    ORM type (none, drizzle, prisma, mongoose)
  --auth                          Include authentication
  --no-auth                       Exclude authentication
  --frontend <types...>           Frontend types (tanstack-router, react-router, tanstack-start, next, nuxt, svelte, solid, native-bare, native-uniwind, native-unistyles, none)
  --addons <types...>             Additional addons (pwa, tauri, starlight, biome, lefthook, husky, turborepo, fumadocs, ultracite, oxlint, none)
  --examples <types...>           Examples to include (todo, ai, none)
  --git                           Initialize git repository
  --no-git                        Skip git initialization
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install                       Install dependencies
  --no-install                    Skip installing dependencies
  --db-setup <setup>              Database setup (turso, d1, neon, supabase, prisma-postgres, mongodb-atlas, docker, none)
  --web-deploy <setup>            Web deployment (workers, alchemy, none)
  --server-deploy <setup>         Server deployment (workers, alchemy, none)
  --backend <framework>           Backend framework (hono, express, elysia, next, convex, fastify, none)
  --runtime <runtime>             Runtime (bun, node, workers, none)
  --api <type>                    API type (trpc, orpc, none)
  -h, --help                      Display help
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
