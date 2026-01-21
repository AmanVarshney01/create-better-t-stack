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
        constant.ts         # StackState, DEFAULT_STACK, TECH_OPTIONS
        stack-url-keys.ts   # Short URL key mappings
        stack-search-schema.ts # Zod schema for URL params
        stack-url-state.ts  # URL state parsing/serialization
        stack-url-state.client.ts # Client-side URL parsing
        stack-utils.ts      # CLI command generation
  cli/                      # CLI scaffolding tool
    src/
      prompts/              # Interactive prompts
      utils/                # Utilities including compatibility-rules.ts
      constants.ts          # Default config, compatibility constants
    test/                   # Test files

packages/
  types/                    # Shared TypeScript types
    src/
      schemas.ts            # ALL Zod schema definitions (single source of truth)
      index.ts              # Re-exports
  template-generator/       # Template generation logic
    src/
      processors/           # Dependency processors (one per category)
      template-handlers/    # Template file handlers
      utils/add-deps.ts     # Dependency version map
    templates/              # Handlebars template files
  backend/                  # Convex backend
    convex/                 # Convex functions and schema
  create-bfs/               # Alias package for CLI

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
bun run lint             # Run turbo lint (includes sync test)

# Testing
cd apps/cli && bun test                    # Run all CLI tests
cd apps/cli && bun test cli-builder-sync   # Run sync test only
```

---

## Adding New Libraries/Options (CRITICAL)

**IMPORTANT**: When adding ANY new library, option, or category, you MUST update BOTH the CLI AND the web Builder to keep them in sync.

### Complete 8-Step Workflow

#### STEP 1: Add Schema Type (`packages/types/src/schemas.ts`)

```typescript
// Add new schema enum
export const NewLibrarySchema = z
  .enum(["option1", "option2", "option3", "none"])
  .describe("Description for CLI help text");

// Add to CreateInputSchema (around line 288)
newLibrary: NewLibrarySchema.optional(),

// Add to ProjectConfigSchema (around line 355)
newLibrary: NewLibrarySchema,

// Add to BetterTStackConfigSchema (around line 403)
newLibrary: NewLibrarySchema,

// Add export at bottom
export const NEW_LIBRARY_VALUES = NewLibrarySchema.options;
```

#### STEP 2: Export Type (`packages/types/src/index.ts`)

```typescript
export {
  NewLibrarySchema,
  type NewLibrary,
  NEW_LIBRARY_VALUES,
} from "./schemas";
```

#### STEP 3: Add CLI Router Flag (`apps/cli/src/index.ts`)

```typescript
// In the router schema z.object({...}) around line 131
newLibrary: NewLibrarySchema.optional().describe("Description shown in --help"),
```

#### STEP 4: Create Prompt File (`apps/cli/src/prompts/new-library.ts`)

```typescript
import type { Backend, NewLibrary } from "../types";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getNewLibraryChoice(
  newLibrary?: NewLibrary,
  backend?: Backend,
) {
  // Return early if flag provided via CLI
  if (newLibrary !== undefined) return newLibrary;

  // Skip if incompatible
  if (backend === "none" || backend === "convex") {
    return "none" as NewLibrary;
  }

  const options = [
    {
      value: "option1" as NewLibrary,
      label: "Option 1",
      hint: "Description of option 1",
    },
    {
      value: "option2" as NewLibrary,
      label: "Option 2",
      hint: "Description of option 2",
    },
    {
      value: "none" as NewLibrary,
      label: "None",
      hint: "Skip this feature",
    },
  ];

  const response = await navigableSelect<NewLibrary>({
    message: "Select new library",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");
  return response;
}
```

#### STEP 5: Wire Prompt (`apps/cli/src/prompts/config-prompts.ts`)

```typescript
// Add import at top
import { getNewLibraryChoice } from "./new-library";

// Add to PromptGroupResults type
newLibrary: NewLibrary;

// Add in navigableGroup (maintain order - before git/packageManager/install)
newLibrary: ({ results }) => {
  if (results.ecosystem === "rust") return Promise.resolve("none" as NewLibrary);
  return getNewLibraryChoice(flags.newLibrary, results.backend);
},

// Add to return object at bottom
newLibrary: result.newLibrary,
```

#### STEP 6: Add Template Generator (`packages/template-generator/`)

```typescript
// Create: src/processors/new-library-deps.ts
import type { ProjectConfig } from "@better-fullstack/types";
import { addDeps } from "../utils/add-deps";

export function processNewLibraryDeps(config: ProjectConfig) {
  const { newLibrary, frontend } = config;
  if (newLibrary === "none") return;

  if (newLibrary === "option1") {
    addDeps("server", { "option1-package": "^1.0.0" });

    // Add client package if web frontend exists
    const webFrontend = frontend.find(f => !f.startsWith("native"));
    if (webFrontend) {
      addDeps(webFrontend, { "option1-client": "^1.0.0" });
    }
  }

  if (newLibrary === "option2") {
    addDeps("server", { "option2-package": "^2.0.0" });
  }
}

// Register in src/processors/index.ts
export { processNewLibraryDeps } from "./new-library-deps";

// Call from src/generator.ts (in processConfig function)
processNewLibraryDeps(config);
```

#### STEP 7: Update Builder (`apps/web/src/lib/`)

**constant.ts:**

```typescript
// Add to StackState type
newLibrary: NewLibrary;

// Add to DEFAULT_STACK
newLibrary: "none",

// Add to TECH_OPTIONS
newLibrary: [
  { id: "option1", name: "Option 1", description: "...", icon: IconComponent },
  { id: "option2", name: "Option 2", description: "...", icon: IconComponent },
  { id: "none", name: "None", description: "Skip", icon: CircleOff },
],
```

**stack-url-keys.ts:**

```typescript
newLibrary: "nl",  // Short 2-3 char key for URL compression
```

**stack-search-schema.ts:**

```typescript
newLibrary: NewLibrarySchema.optional(),
```

**stack-url-state.ts:**

```typescript
// In parseSync return object
newLibrary: parsed.data.newLibrary ?? DEFAULT_STACK.newLibrary,

// In serializeStackParams
if (stack.newLibrary !== DEFAULT_STACK.newLibrary) {
  params.set(URL_KEYS.newLibrary, stack.newLibrary);
}
```

**stack-url-state.client.ts:**

```typescript
// In searchToStack function
newLibrary: (urlParams.get(URL_KEYS.newLibrary) as NewLibrary) ?? DEFAULT_STACK.newLibrary,
```

**stack-utils.ts:**

```typescript
// In generateStackCommand, add the flag
if (stack.newLibrary !== "none") {
  parts.push(`--new-library ${stack.newLibrary}`);
}

// In TYPESCRIPT_CATEGORY_ORDER array (maintains display order)
"newLibrary",
```

#### STEP 8: Test Everything

```bash
# Build CLI
cd apps/cli && bun run build

# Run sync test (CRITICAL - catches missing options)
bun test cli-builder-sync

# Test CLI flag appears in help
bun run apps/cli/src/cli.ts --help | grep new-library

# Test CLI flag works
bun run apps/cli/src/cli.ts test-project --new-library option1 --yes

# Test interactive prompt
bun run apps/cli/src/cli.ts  # Navigate through prompts

# Build web to verify no TypeScript errors
cd apps/web && bun run build
```

---

## Compatibility Rules

### Frontend Categories

```typescript
// React-based frontends (support React libraries like react-hook-form, tRPC client)
const REACT_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"];

// Native frontends (React Native)
const NATIVE_FRONTENDS = ["native-bare", "native-uniwind", "native-unistyles"];

// All web frontends
const WEB_FRONTENDS = [...REACT_FRONTENDS, "nuxt", "svelte", "solid", "astro", "qwik", "angular", "redwood", "fresh"];
```

### Backend Constraints

- **`convex`**: Has own patterns - skip most server libraries (auth, email, etc. handled differently)
- **`none`**: Frontend-only app - skip all server-side libraries
- **`self`**: Uses framework's built-in API routes (Next.js, TanStack Start, Astro)

### Creating Compatibility Functions (`apps/cli/src/utils/compatibility-rules.ts`)

```typescript
// Validation function (exits with error if incompatible)
export function validateNewLibraryCompatibility(
  library: NewLibrary,
  frontends: Frontend[],
) {
  if (library === "react-only-lib") {
    const hasReact = frontends.some(f => REACT_FRONTENDS.includes(f));
    if (!hasReact) {
      exitWithError("This library requires a React-based frontend.");
    }
  }
}

// Filter function for prompts (returns only valid options)
export function getCompatibleNewLibraries(frontends: Frontend[]): NewLibrary[] {
  const hasReact = frontends.some(f => REACT_FRONTENDS.includes(f));
  const all: NewLibrary[] = ["option1", "option2", "none"];
  return hasReact ? all : all.filter(l => l !== "react-only-lib");
}
```

### Compatibility Constants (`apps/cli/src/constants.ts`)

```typescript
export const NEW_LIBRARY_COMPATIBILITY: Record<NewLibrary, {
  frontends: readonly Frontend[];
  backends: readonly Backend[];
}> = {
  "option1": {
    frontends: ["tanstack-router", "react-router", "next"],
    backends: ["hono", "express", "fastify"],
  },
  "option2": {
    frontends: WEB_FRONTENDS,
    backends: ["hono", "express", "fastify", "elysia"],
  },
  "none": {
    frontends: ALL_FRONTENDS,
    backends: ALL_BACKENDS,
  },
};
```

---

## Testing Patterns

### 1. Sync Test (ALWAYS RUN)

```bash
cd apps/cli && bun test cli-builder-sync
```

This test automatically catches:

- Schema options missing from CLI prompts
- Builder options missing from CLI schemas
- CLI options missing from Builder

### 2. Integration Tests (`apps/cli/test/new-library.test.ts`)

```typescript
import { describe, expect, it } from "bun:test";
import { expectSuccess, runTRPCTest } from "./test-utils";

describe("New Library Integration", () => {
  it("should scaffold project with option1", async () => {
    const result = await runTRPCTest({
      frontend: ["tanstack-router"],
      backend: "hono",
      newLibrary: "option1",
    });
    expectSuccess(result);

    // Verify dependencies were added
    expect(result.files["apps/server/package.json"]).toContain("option1-package");
  });

  it("should skip when backend is none", async () => {
    const result = await runTRPCTest({
      frontend: ["tanstack-router"],
      backend: "none",
      newLibrary: "option1",
    });
    expectSuccess(result);

    // Verify NOT added (no server package exists)
    expect(result.files["apps/server/package.json"]).toBeUndefined();
  });

  it("should skip when ecosystem is rust", async () => {
    const result = await runTRPCTest({
      ecosystem: "rust",
      newLibrary: "option1",
    });
    expectSuccess(result);
    // Rust projects don't have the library
  });
});
```

### 3. Compatibility Tests

```typescript
describe("Compatibility Validation", () => {
  it("should reject incompatible frontend/library combination", async () => {
    // This should either error or auto-correct to "none"
    const result = await runTRPCTest({
      frontend: ["nuxt"],           // Vue-based
      newLibrary: "react-only-option", // React-only
    });
    // Verify the library was auto-corrected or error thrown
  });
});
```

---

## Template Generator Details

### Adding Dependencies (`packages/template-generator/src/utils/add-deps.ts`)

```typescript
import { addDeps } from "../utils/add-deps";

// Add to server package
addDeps("server", { "package-name": "^1.0.0" });

// Add to specific frontend
addDeps("tanstack-router", { "react-package": "^1.0.0" });

// Add dev dependency
addDeps("server", { "dev-package": "^1.0.0" }, true);

// Dependency version map (central source of truth)
export const dependencyVersionMap = {
  "new-package": "^1.0.0",
  "@scope/package": "^2.0.0",
};
```

### Adding Template Files

Templates are in `packages/template-generator/templates/`

```typescript
// In template handler
import { copyTemplateDir, renderTemplate } from "../core/template-reader";

// Copy entire directory
if (config.newLibrary === "option1") {
  await copyTemplateDir("new-library/option1", "apps/server/src/lib");
}

// Render single template with variables
await renderTemplate("new-library/config.ts.hbs", "apps/server/src/config.ts", {
  libraryOption: config.newLibrary,
  hasAuth: config.auth !== "none",
});
```

---

## TanStack Start Specifics

The website uses TanStack Start (full-stack React framework):

- **File-based routing**: Routes are in `apps/web/src/routes/`
- **Route file convention**: `__root.tsx` is the root layout, other files map to URL paths
- **Router config**: `apps/web/src/router.tsx`
- **SSR entry**: `apps/web/src/ssr.tsx`
- **Client entry**: `apps/web/src/client.tsx`
- **Route tree**: Auto-generated in `apps/web/src/routeTree.gen.ts`

### Creating New Routes

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div>About</div>
}
```

---

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

---

## Code Style Guidelines

1. **TailwindCSS v4** for all styling - no CSS modules
2. **TypeScript strict mode** - avoid `any` types
3. **Radix UI** for accessible primitives (via `@base-ui/react`)
4. **Follow existing patterns** - check similar files first
5. **Small, focused components** - split large components

---

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

```bash
# 1. Make sure you're on main with clean working directory
git checkout main
git pull origin main
git status  # should be clean

# 2. Update versions in all package.json files:
#    - apps/cli/package.json
#    - packages/create-bfs/package.json (also update dependency version)
#    - packages/types/package.json
#    - packages/template-generator/package.json

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

---

## Gotchas

- Always use `bun` commands, not `npm` or `yarn`
- Run `bun run check` before committing
- TanStack Start uses Vite, not Next.js conventions
- Route files must export `Route` using `createFileRoute`
- Convex functions must be in `packages/backend/convex/`
- The website uses TailwindCSS v4 (different syntax from v3)
- **CLI and Builder must stay in sync** - always run `bun test cli-builder-sync`
- **Never modify auto-generated files**: `routeTree.gen.ts`, `convex/_generated/*`

---

## Ralph (Autonomous Agent Loop)

This project includes Ralph for autonomous development. See `scripts/ralph/README.md`.

```bash
./scripts/ralph/ralph.sh [max_iterations]
```
