# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better-T-Stack is a CLI scaffolding tool that generates end-to-end type-safe TypeScript projects. The repository is a monorepo containing:

- **CLI** (`apps/cli`): The core scaffolding tool published as `create-better-t-stack`
- **Documentation Website** (`apps/web`): Next.js site with Fumadocs at better-t-stack.dev
- **Backend** (`packages/backend`): Convex backend for analytics and GitHub webhook integration

## Common Commands

### Root-level Development

```bash
# Install dependencies
bun install

# Run CLI in development mode
bun dev:cli

# Run documentation website in development mode
bun dev:web

# Build everything
bun build

# Lint and format
bun lint
bun format

# Run tests
bun test    # in apps/cli directory
```

### CLI Development

```bash
cd apps/cli

# Build with watch mode
bun dev

# Run the CLI locally
bun run ../../dist/cli.js    # or use `node dist/cli.js` from apps/cli

# Run tests (requires building first)
bun run test

# Type check
bun run check-types
```

### Web Development

```bash
cd apps/web

# Start Next.js dev server with Turbopack
bun dev

# Build for production
bun build

# Generate analytics data
bun run generate-analytics

# Generate schema
bun run generate-schema
```

### Backend Development

```bash
cd packages/backend

# Start Convex development server
bun dev

# Setup Convex (configure and run until success)
bun dev:setup

# Deploy to production
bun deploy
```

## Code Architecture

### CLI Architecture

The CLI follows a **functional programming** paradigm with a prompt-driven configuration flow:

1. **Entry Point** (`src/index.ts`): Defines oRPC router with commands (`init`, `add`, `sponsors`, `docs`, `builder`)
2. **Prompts** (`src/prompts/`): Interactive prompts for gathering user configuration (frontend, backend, database, etc.)
3. **Validation** (`src/validation.ts`): Config validation and compatibility checking
4. **Core Handlers** (`src/helpers/core/`):
   - `command-handlers.ts`: Orchestrates project creation and addon addition
   - `create-project.ts`: Main project scaffolding logic
   - `add-addons.ts`: Adds addons to existing projects
   - `install-dependencies.ts`: Handles package installation
5. **Template Processing** (`src/utils/template-processor.ts`): Handlebars template compilation and file generation
6. **Templates** (`templates/`): Handlebars templates organized by category (frontend, backend, api, db, addons, etc.)

### Template System

Templates use Handlebars (`.hbs` files) with custom helpers:
- `eq`, `ne`: equality/inequality checks
- `and`, `or`: logical operations
- `includes`: array membership checks

**Important**: Use explicit conditionals in templates (e.g., `{{#if (eq orm "prisma")}}` not generic `{{#if orm}}`).

### Configuration Flow

```
User Input (CLI flags or prompts)
  → Flag Processing (validation.ts)
  → Compatibility Validation (utils/compatibility-rules.ts)
  → Config Building (prompts/config-prompts.ts)
  → Template Selection & Processing (helpers/core/create-project.ts)
  → File Generation (utils/template-processor.ts)
  → Dependency Installation (helpers/core/install-dependencies.ts)
```

### Type System

Core types defined in `src/types.ts`:
- `ProjectConfig`: Complete project configuration
- `BetterTStackConfig`: Persisted config in `.bts/config.json`
- `CreateInput`, `AddInput`: Command input types
- Schema types: `Frontend`, `Backend`, `Database`, `ORM`, `API`, `Runtime`, `Addons`, etc.

All types use **type aliases** (not interfaces) and are derived from Zod schemas for runtime validation.

### Testing Strategy

Tests in `apps/cli/test/` use Vitest and cover:
- Configuration combinations (database-orm, backend-runtime, etc.)
- Integration tests (full project scaffolding)
- Individual feature tests (addons, auth, deployment, examples)
- Benchmark tests for performance monitoring

## Coding Conventions

### From `.cursor/rules/better-t-stack-repo.mdc`:
- **Always use functional programming**; avoid OOP
- Define functions using `function` declarations, not arrow functions
- Use TypeScript **type aliases** instead of interfaces
- **No emojis** in code or documentation
- **Do not use explicit return types** on functions
- In Handlebars templates: use explicit conditions (e.g., `{{#if (eq orm "prisma")}}`)

### From `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`:
- Default to **Bun** instead of Node.js
- Use `bun <file>` not `node <file>` or `ts-node <file>`
- Use `bun test` not `jest` or `vitest`
- Use `bun install` not `npm install`, `yarn`, or `pnpm`
- Prefer Bun APIs: `Bun.serve()`, `bun:sqlite`, `Bun.file`, etc.

### From `.cursor/rules/convex_rules.mdc` (for backend work):
- Always use new Convex function syntax with `args`, `returns`, and `handler`
- Use `v.null()` validator for functions returning null
- Register internal functions with `internalQuery`, `internalMutation`, `internalAction`
- Always include argument and return validators

## Project Structure Patterns

### CLI Template Organization

```
templates/
├── frontend/        # React, Next, Nuxt, Svelte, Solid, React Native
├── backend/         # Hono, Express, Fastify, Elysia, Convex
├── api/             # tRPC, oRPC
├── db/              # Drizzle, Prisma, Mongoose schemas
├── auth/            # Better-Auth configurations
├── addons/          # PWA, Tauri, Turborepo, Biome, Husky, etc.
├── examples/        # Todo, AI examples
├── db-setup/        # Turso, Neon, Supabase, etc.
├── deploy/          # Cloudflare Workers deployment
└── base/            # Base files (gitignore, package.json scaffolds)
```

Templates are conditionally applied based on user configuration and compatibility rules.

### Monorepo Structure

Uses **Turborepo** for task orchestration:
- Parallel task execution
- Shared caching
- Task dependencies (e.g., `build` depends on `^build`)

Workspaces defined in root `package.json`:
- `apps/*`: CLI and web applications
- `packages/*`: Shared backend and utilities

## Key Implementation Details

### Compatibility System

`utils/compatibility-rules.ts` defines rules for valid configuration combinations:
- Database/ORM compatibility (e.g., MongoDB requires Mongoose)
- Backend/Runtime compatibility (e.g., Elysia requires Bun)
- Frontend/Backend/API compatibility matrices
- Addon compatibility with different stacks

### Programmatic API

The CLI exports a programmatic API (`init` function) that:
- Returns structured `InitResult` with success status, project paths, and timing
- Always runs in verbose mode to return full data
- Supports all CLI flags as function options
- Used for testing and integration scenarios

### Analytics & Telemetry

- PostHog integration for usage analytics (`utils/analytics.ts`)
- Opt-out via `--disable-analytics` flag
- Tracks project creation events with anonymized configuration data

### Version Management

Scripts in `scripts/`:
- `release.ts`: Production release workflow
- `canary-release.ts`: Canary/prerelease builds
- `bump-version.ts`: Version bumping across packages

## Development Workflow

### Adding a New Feature

1. Define types in `src/types.ts` (if needed)
2. Add validation schema and compatibility rules
3. Create prompt in `src/prompts/`
4. Add templates in `templates/`
5. Update command handler logic in `src/helpers/core/`
6. Write tests in `test/`
7. Update documentation in `apps/web/content/docs/`

### Testing Changes

```bash
cd apps/cli

# Build first
bun dev

# Run full test suite
bun run test

# Or test manually by linking
bun link
cd /tmp/test-dir
create-better-t-stack my-test-app --yes
```

### Release Process

```bash
# Bump version
bun run bump

# Create release (runs tests, builds, publishes)
bun run release

# Canary release
bun run canary
```

## Important Notes

- **Always read CONTRIBUTING.md** before starting new features and **open an issue first** to discuss
- The CLI must maintain **backwards compatibility** with existing `.bts/config.json` files
- All user-facing options must have **clear validation** and **helpful error messages**
- Templates should be **minimal** with **zero bloat** (core philosophy)
- Use **latest stable versions** of dependencies by default
- Test with all three package managers (npm, pnpm, bun)
