# AGENTS.md - AI Agent Instructions

This file contains instructions and context for AI coding agents working on this codebase.

## Project Overview

**Better-Fullstack** is a fork of [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) with the goal of creating a full-stack CLI scaffolding tool featuring:

- **TanStack Start** for the documentation/marketing website
- **Convex** as the backend database and real-time sync layer

### What This Project Does

1. **CLI Tool** (`apps/cli`): Scaffolds new TypeScript full-stack projects with customizable configurations
2. **Website** (`apps/web`): Documentation site and visual "Stack Builder" tool (being migrated to TanStack Start)
3. **Backend** (`packages/backend`): Convex backend for analytics, showcases, testimonials, etc.

## Current Tech Stack

### Website (`apps/web`)

- **Framework**: TanStack Start (TanStack Router + SSR)
- **UI**: React 19, TailwindCSS v4, Radix UI primitives
- **Backend**: Convex (real-time database)
- **Build**: Vite

### CLI (`apps/cli`)

- **Runtime**: Bun
- **Prompts**: @clack/prompts
- **Template Generation**: Handlebars, ts-morph

### Monorepo

- **Package Manager**: Bun
- **Orchestration**: Turborepo
- **Linting**: oxlint, oxfmt

## Directory Structure

```
apps/
  web/                      # TanStack Start website
    src/
      routes/               # TanStack Router file-based routes
      components/           # React components
        ui/                 # UI primitives (Radix-based)
      lib/                  # Utilities and helpers
  cli/                      # CLI scaffolding tool
    src/
      templates/            # Project templates

packages/
  backend/                  # Convex backend
    convex/                 # Convex functions and schema
      schema.ts             # Database schema
      analytics.ts          # Analytics queries/mutations
      showcase.ts           # Showcase queries
      testimonials.ts       # Testimonials queries
  template-generator/       # Template generation logic
  types/                    # Shared TypeScript types
  create-bts/               # Core CLI logic

scripts/
  ralph/                    # Ralph autonomous agent system
```

## Common Commands

```bash
# Development
bun install              # Install dependencies
bun run dev              # Start all apps in dev mode
bun run dev:web          # Start website (port 3333)
bun run dev:cli          # Start CLI in watch mode

# Building
bun run build            # Build all packages
bun run build:web        # Build website only
bun run build:cli        # Build CLI only

# Quality
bun run check            # Run oxfmt + oxlint
bun run lint             # Run turbo lint

# Convex
cd packages/backend
bun run dev              # Start Convex dev server
bun run deploy           # Deploy Convex functions
```

## TanStack Start Specifics

The website uses TanStack Start (full-stack React framework):

- **File-based routing**: Routes are in `apps/web/src/routes/`
- **Route file convention**: `__root.tsx` is the root layout, other files map to URL paths
- **Router config**: `apps/web/src/router.tsx`
- **SSR entry**: `apps/web/src/ssr.tsx`
- **Client entry**: `apps/web/src/client.tsx`
- **Route tree**: Auto-generated in `apps/web/src/routeTree.gen.ts`

### Creating New Routes

1. Create a file in `apps/web/src/routes/` (e.g., `about.tsx`)
2. Export a route using `createFileRoute`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div>About</div>
}
```

## Convex Specifics

Backend uses Convex for real-time data:

- **Schema**: `packages/backend/convex/schema.ts`
- **Functions**: Each `.ts` file in `convex/` exports queries/mutations
- **Generated types**: `packages/backend/convex/_generated/`

### Convex Patterns

- Use `query` for read operations
- Use `mutation` for write operations
- Use `action` for external API calls
- Import from `convex/_generated/server` for typed functions

## Code Style Guidelines

1. **TailwindCSS v4** for all styling - no CSS modules
2. **TypeScript strict mode** - avoid `any` types
3. **Radix UI** for accessible primitives (via `@base-ui/react`)
4. **Follow existing patterns** - check similar files first
5. **Small, focused components** - split large components

## Gotchas

- Always use `bun` commands, not `npm` or `yarn`
- Run `bun run check` before committing
- TanStack Start uses Vite, not Next.js conventions
- Route files must export `Route` using `createFileRoute`
- Convex functions must be in `packages/backend/convex/`
- The website uses TailwindCSS v4 (different syntax from v3)

## Migration Status

The website is being migrated from Next.js to TanStack Start:

- [x] Basic TanStack Router setup
- [x] Route structure created
- [ ] Full page migrations
- [ ] Server functions migration
- [ ] Convex integration in routes

## Ralph (Autonomous Agent Loop)

This project includes Ralph for autonomous development. See `scripts/ralph/README.md`.

```bash
./scripts/ralph/ralph.sh [max_iterations]
```
