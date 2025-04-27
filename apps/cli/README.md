# Create Better-T-Stack CLI

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations

## Sponsors

<p align="center">
<img src="https://cdn.jsdelivr.net/gh/amanvarshney01/sponsors@master/sponsorkit/sponsors.svg" alt="Sponsors" width="300">
</p>

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

- **TypeScript**: End-to-end type safety.
- **Monorepo Structure**: Choose between Turborepo for optimized builds or standard pnpm/npm/bun workspaces.
- **Frontend Options**:
  - React with Vite: TanStack Router, React Router, or TanStack Start.
  - Next.js (Full-stack or frontend-only).
  - Nuxt (Vue framework).
  - SvelteKit.
  - React Native with Expo for mobile apps.
  - None.
- **UI**: Tailwind CSS with shadcn/ui components pre-configured.
- **Backend Frameworks**: Choose between Hono, Express, Elysia, or use Next.js API routes.
- **API Layer**: End-to-end type safety with tRPC or oRPC.
- **Runtime Options**: Choose between Bun or Node.js for your server.
- **Database Options**: SQLite, PostgreSQL, MySQL, MongoDB, or no database.
- **ORM Selection**: Choose between Drizzle ORM (TypeScript-first), Prisma (feature-rich), or no ORM.
- **Database Setup**: Optional automated setup for Turso (SQLite), Neon (Postgres), Prisma Postgres (Supabase), or MongoDB Atlas.
- **Authentication**: Optional auth setup using Better-Auth (email/password, OAuth coming soon).
- **Addons**:
  - **PWA**: Add Progressive Web App support.
  - **Tauri**: Build native desktop applications.
  - **Starlight**: Add an Astro-based documentation site.
  - **Biome**: Integrated linting and formatting.
  - **Husky**: Git hooks for code quality checks (lint-staged).
  - **Turborepo**: Optimized monorepo build system.
- **Examples**: Include pre-built examples like a Todo app or an AI Chat interface (using Vercel AI SDK).
- **Developer Experience**:
  - Automatic Git initialization.
  - Choice of package manager (npm, pnpm, bun).
  - Optional automatic dependency installation.

## Usage

```bash
Usage: create-better-t-stack [project-directory] [options]

Options:
  -V, --version                   Output the version number
  -y, --yes                       Use default configuration
  --database <type>               Database type (none, sqlite, postgres, mysql, mongodb)
  --orm <type>                    ORM type (none, drizzle, prisma)
  --auth                          Include authentication
  --no-auth                       Exclude authentication
  --frontend <types...>           Frontend types (tanstack-router, react-router, tanstack-start, next, nuxt, svelte, native, none)
  --addons <types...>             Additional addons (pwa, tauri, starlight, biome, husky, turborepo, none)
  --examples <types...>           Examples to include (todo, ai, none)
  --git                           Initialize git repository
  --no-git                        Skip git initialization
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install                       Install dependencies
  --no-install                    Skip installing dependencies
  --db-setup <setup>              Database setup (turso, neon, prisma-postgres, mongodb-atlas, none)
  --backend <framework>           Backend framework (hono, express, elysia)
  --runtime <runtime>             Runtime (bun, node)
  --api <type>                    API type (trpc, orpc)
  -h, --help                      Display help
```

## Examples

Create a project with default configuration:

```bash
npx create-better-t-stack my-app --yes
```

Create a project with specific options:

```bash
npx create-better-t-stack my-app --database postgres --orm drizzle --auth --addons pwa biome
```

Create a project with Elysia and Node.js runtime:

```bash
npx create-better-t-stack my-app --backend elysia --runtime node
```

Create a project with specific frontend options:

```bash
npx create-better-t-stack my-app --frontend tanstack-router native
```

Create a project with examples:

```bash
npx create-better-t-stack my-app --examples todo ai
```

Create a project with Turso database setup:

```bash
npx create-better-t-stack my-app --db-setup turso
```

Create a project with documentation site:

```bash
npx create-better-t-stack my-app --addons starlight
```
