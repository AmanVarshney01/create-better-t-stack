# AGENTS.md - AI Agent Instructions

This file contains instructions and context for AI coding agents working on this codebase.

## Project Overview

**Better-Fullstack** is a full-stack CLI scaffolding tool featuring:

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

## Adding New Libraries/Options (CLI + Builder Sync)

**CRITICAL**: When adding ANY new library, option, or category, you MUST update BOTH the CLI AND the web Builder to keep them in sync.

### CLI Updates (apps/cli/)

1. **`packages/types/src/schemas.ts`** - Add Zod schema (e.g., `CMSSchema = z.enum([...])`)
2. **`packages/types/src/index.ts`** - Export the new type
3. **`apps/cli/src/index.ts`** - Add to router schema with `.optional().describe()`
4. **`apps/cli/src/prompts/{category}.ts`** - Create interactive prompt file
5. **`apps/cli/src/prompts/config-prompts.ts`** - Wire prompt in `navigableGroup` and return object

### Builder Updates (apps/web/)

1. **`src/lib/constant.ts`** - Add to `StackState` type, `DEFAULT_STACK`, and `TECH_OPTIONS`
2. **`src/lib/stack-url-keys.ts`** - Add short URL key mapping (e.g., `forms: "frm"`)
3. **`src/lib/stack-search-schema.ts`** - Add to Zod schema
4. **`src/lib/stack-url-state.ts`** - Add to `parseSync` return object and `serializeStackParams`
5. **`src/lib/stack-url-state.client.ts`** - Add to `searchToStack` function
6. **`src/lib/stack-utils.ts`** - Add to `generateStackCommand` flags and `TYPESCRIPT_CATEGORY_ORDER`

### Verification

```bash
# Test CLI
cd apps/cli && bun run build
bun run apps/cli/src/cli.ts --help  # Verify new flag appears
bun run apps/cli/src/cli.ts         # Test interactive prompts

# Test Builder
cd apps/web && bun run build        # Ensure no TypeScript errors

# IMPORTANT: Run the sync test to catch missing options
cd apps/cli && bun test cli-builder-sync
```

### Automated Sync Test

The `apps/cli/test/cli-builder-sync.test.ts` test automatically verifies that:

- All Builder options exist in the CLI schemas
- All CLI options exist in the Builder (or are intentionally excluded)
- No new categories are missing from the mapping

**Always run this test after adding new libraries/options!**

## Gotchas

- Always use `bun` commands, not `npm` or `yarn`
- Run `bun run check` before committing
- TanStack Start uses Vite, not Next.js conventions
- Route files must export `Route` using `createFileRoute`
- Convex functions must be in `packages/backend/convex/`
- The website uses TailwindCSS v4 (different syntax from v3)
- **CLI and Builder must stay in sync** - see "Adding New Libraries" section above

## Migration Status

The website is being migrated from Next.js to TanStack Start:

- [x] Basic TanStack Router setup
- [x] Route structure created
- [ ] Full page migrations
- [ ] Server functions migration
- [ ] Convex integration in routes

## Publishing to NPM

The project publishes 4 packages to npm:

- `create-better-fullstack` - Main CLI package
- `create-bfs` - Alias package (runs create-better-fullstack)
- `@better-fullstack/types` - Shared TypeScript types
- `@better-fullstack/template-generator` - Template generation logic

### Release Process (Automated)

**Simply run:**

```bash
bun run bump
```

This interactive script will:

1. Ask for version type (patch/minor/major) or custom version
2. Create a release branch `release/v{version}`
3. Update all 4 package.json files with the new version
4. Build the CLI to verify it works
5. Commit changes and push the branch
6. Create a PR automatically via GitHub CLI
7. Optionally enable auto-merge

**After the PR is merged to main:**

- GitHub Actions automatically detects `chore(release):` commit message
- Creates a git tag `v{version}`
- Creates a GitHub Release with changelog
- Publishes all 4 packages to npm in the correct order

### Version Guidelines

- **Patch** (1.0.5 → 1.0.6): Bug fixes, dependency updates, small improvements
- **Minor** (1.0.5 → 1.1.0): New features, new CLI options, new libraries added
- **Major** (1.0.5 → 2.0.0): Breaking changes (changed CLI flags, removed options)

### Manual Steps (if needed)

If the bump script fails or you need manual control:

```bash
# 1. Make sure you're on main with clean working directory
git checkout main
git pull origin main
git status  # should be clean

# 2. Update versions in all package.json files:
#    - apps/cli/package.json
#    - packages/create-bfs/package.json (also update dependency version)
#    - packages/types/package.json
#    - packages/template-generator/package.json (also update @better-fullstack/types dependency)

# 3. Build and test
bun install
bun run build:cli
bun run apps/cli/src/cli.ts --help  # verify it works

# 4. Commit with the magic commit message format
git add -A
git commit -m "chore(release): 1.0.6"

# 5. Push to main (or create PR)
git push origin main
```

### Troubleshooting

- **"Version already exists"**: The release workflow skips if version is already on npm
- **PR checks failing**: Fix issues, push to the release branch, wait for checks
- **npm publish fails**: Check `NPM_TOKEN` secret in GitHub repo settings

## Ralph (Autonomous Agent Loop)

This project includes Ralph for autonomous development. See `scripts/ralph/README.md`.

```bash
./scripts/ralph/ralph.sh [max_iterations]
```
