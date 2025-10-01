# Fullstack Backend Implementation

## Overview
Implemented `--backend self` option to support fullstack frameworks (Next.js, Nuxt, SvelteKit, TanStack Start) that have their own backend capabilities.

## Key Changes

### 1. Updated Backend Schema
**File:** `apps/cli/src/types.ts`
- Removed `"next"` from backend options (no longer needed as separate backend)
- Added `"self"` to backend options: `["hono", "express", "fastify", "elysia", "convex", "self", "none"]`

### 2. Updated Backend Prompt
**File:** `apps/cli/src/prompts/backend.ts`
- Shows "Self (Fullstack)" option when a fullstack-capable frontend is selected (next, nuxt, svelte, tanstack-start)
- Makes "self" the default when a fullstack frontend is chosen
- Hides "self" option when non-fullstack frontends are selected

### 3. Added Validation
**File:** `apps/cli/src/utils/compatibility-rules.ts`
- New function: `validateSelfBackendCompatibility()`
- Ensures `--backend self` only works with fullstack frontends
- Prevents using multiple frontends with `--backend self`
- Provides clear error messages

**File:** `apps/cli/src/utils/config-validation.ts`
- Added validation call in `validateFullConfig()`

### 4. Updated Prompts
**File:** `apps/cli/src/prompts/api.ts`
- Still prompts for API choice (tRPC, oRPC, or none)
- Fullstack frameworks can use tRPC/oRPC for type-safe client-server communication

**File:** `apps/cli/src/prompts/runtime.ts`
- Returns `"none"` when `backend === "self"` (fullstack frameworks handle their own runtime)

### 5. Updated Project Creation
**File:** `apps/cli/src/helpers/core/create-project.ts`
- Skips `apps/server` creation when `backend === "self"`
- Skips backend framework setup when `backend === "self"`
- Still creates packages (api, auth, db) for shared business logic

### 6. Updated Package Configuration
**File:** `apps/cli/src/helpers/core/project-config.ts`
- Skips `dev:server` script when `backend === "self"`
- Doesn't try to update `apps/server/package.json` when it doesn't exist

### 7. Updated Workspace Setup
**File:** `apps/cli/src/helpers/core/workspace-setup.ts`
- When `backend === "self"`, adds api/auth/db package dependencies to `apps/web` instead of `apps/server`
- Automatically handles missing `apps/server` directory

## Project Structure

### With `--backend self` (Fullstack)
```
my-app/
├── apps/
│   └── web/              # Fullstack app (Next/Nuxt/SvelteKit/TanStack Start)
│       └── package.json  # Depends on @my-app/api, @my-app/auth, @my-app/db
├── packages/
│   ├── api/              # API layer / business logic
│   ├── auth/             # Auth configuration & logic
│   └── db/               # Database schema & queries
└── package.json
```

### With traditional backend (hono, express, etc.)
```
my-app/
├── apps/
│   ├── web/              # Frontend
│   └── server/           # Backend server
├── packages/
│   ├── api/              # API layer
│   ├── auth/             # Auth logic
│   └── db/               # Database layer
└── package.json
```

## Usage Examples

### Full Stack Next.js with tRPC
```bash
create-better-t-stack my-app --frontend next --backend self --api trpc --database postgres --orm drizzle --auth better-auth
```

### Full Stack Nuxt with oRPC
```bash
create-better-t-stack my-app --frontend nuxt --backend self --api orpc --database sqlite --orm drizzle
```

### Full Stack SvelteKit with oRPC
```bash
create-better-t-stack my-app --frontend svelte --backend self --api orpc --database postgres --orm prisma
```

### Full Stack TanStack Start with tRPC
```bash
create-better-t-stack my-app --frontend tanstack-start --backend self --api trpc --database mysql --orm drizzle
```

### Full Stack Next.js without API layer (using Server Actions only)
```bash
create-better-t-stack my-app --frontend next --backend self --api none --database postgres --orm drizzle
```

### Error Cases
```bash
# ❌ Error: self backend requires fullstack frontend
create-better-t-stack my-app --frontend tanstack-router --backend self

# ❌ Error: self backend requires single frontend
create-better-t-stack my-app --frontend next --frontend native-nativewind --backend self

# ❌ Error: self backend requires fullstack frontend
create-better-t-stack my-app --frontend solid --backend self
```

## Benefits

1. **Clear Separation**: Distinguishes between fullstack frameworks and separate backend servers
2. **No Duplication**: Avoids having both `apps/server` and fullstack framework handling backend
3. **Shared Packages**: Still maintains clean separation of concerns with packages/api, packages/auth, packages/db
4. **Better DX**: Makes intent explicit - you're choosing a fullstack architecture
5. **Maintainable**: Easier to understand and maintain than having "next" as both frontend and backend

## Behavior

### When `backend === "self"`
- ✅ Creates `apps/web` with fullstack framework
- ✅ Creates `packages/api`, `packages/auth`, `packages/db`
- ❌ Skips `apps/server` creation
- ❌ No `dev:server` script
- ✅ API prompts for choice (tRPC, oRPC, or none) - can use type-safe APIs!
- ✅ Runtime set to "none" (framework manages runtime)
- ✅ Web app depends on all workspace packages
- ✅ Catalog support works correctly

### Supported Fullstack Frontends
- **Next.js**: App Router with Server Actions, API Routes, Route Handlers
- **Nuxt**: Nuxt Server Routes and Server API
- **SvelteKit**: SvelteKit Endpoints and Form Actions  
- **TanStack Start**: Server Functions and API Routes

## Testing

To test the implementation:

```bash
# Build CLI
cd apps/cli && bun run build

# Test fullstack setup
cd ../..
bun dist/cli.js test-next --frontend next --backend self --database postgres --orm drizzle

# Verify structure
ls -la test-next/apps    # Should only have 'web'
ls -la test-next/packages # Should have 'api', 'auth', 'db'
```

## Migration Guide

### For existing projects using "next" as backend:
The old `--backend next` is no longer supported. Instead:

**Old:**
```bash
create-better-t-stack my-app --backend next
```

**New:**
```bash
create-better-t-stack my-app --frontend next --backend self
```

This makes the intent clearer - you're creating a fullstack Next.js app, not a separate Next.js backend server.
