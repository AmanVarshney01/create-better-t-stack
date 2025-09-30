# Catalog Implementation Summary

## Overview
Implemented support for Bun and pnpm catalogs to reduce duplication of dependency versions across monorepo packages.

## What are Catalogs?
Catalogs allow you to define dependency versions once in a central location and reference them across multiple packages using the `catalog:` protocol. This ensures version consistency and makes updates easier.

## Implementation Details

### Files Created/Modified

1. **`apps/cli/src/utils/setup-catalogs.ts`** (NEW)
   - Main implementation file for catalog functionality
   - Scans all workspace packages for dependencies:
     - apps/server
     - apps/web
     - packages/api
     - packages/db
     - packages/auth
     - packages/backend (for Convex)
   - Identifies duplicated dependencies (those appearing in 2+ packages)
   - Creates catalog entries for Bun or pnpm
   - Updates package.json files to use `catalog:` protocol

2. **`apps/cli/src/helpers/core/create-project.ts`** (MODIFIED)
   - Added `setupCatalogs()` call after `updatePackageConfigurations()`
   - Catalogs are set up after all dependencies are added but before deployment setup

3. **`apps/cli/package.json`** (MODIFIED)
   - Added `yaml` dependency for pnpm-workspace.yaml parsing

4. **`apps/cli/test/catalogs.test.ts`** (NEW)
   - Comprehensive test suite covering:
     - Bun catalog setup
     - pnpm catalog setup
     - npm (no catalog) behavior
     - Convex backend catalog support
     - Selective cataloging (only duplicates)

## How It Works

### For Bun
- Catalogs are added to `package.json` under `workspaces.catalog`
- If `workspaces` is an array, it's converted to object format:

**Before (array format)**:
```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

**After (object format with catalog)**:
```json
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      "dotenv": "^16.4.7",
      "zod": "^4.1.11",
      "tsdown": "^0.15.4"
    }
  }
}
```

### For pnpm
- Catalogs are added to `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
catalog:
  dotenv: ^16.4.7
  zod: ^4.1.11
  tsdown: ^0.15.4
```

### For npm
- No catalogs are created (npm doesn't support this feature)
- Dependencies keep their actual version numbers

### Package References
- Package.json files in workspace packages use `catalog:` protocol:
```json
{
  "dependencies": {
    "dotenv": "catalog:",
    "zod": "catalog:"
  }
}
```

## Behavior

### When Catalogs Are Created
- Package manager is Bun or pnpm
- At least one dependency appears in multiple packages
- Works for both regular server backends (Hono, Elysia) and Convex backends

### What Gets Cataloged
- Only external dependencies (not workspace packages like `@project-name/db`)
- Only dependencies that appear in 2+ of these packages:
  - apps/server
  - apps/web
  - packages/api
  - packages/db
  - packages/auth
  - packages/backend (for Convex)

### What Doesn't Get Cataloged
- Workspace dependencies (those starting with `@project-name/`)
- Dependencies with `workspace:` protocol
- Dependencies appearing in only one package
- Any dependencies when npm is the package manager

## Benefits

1. **Version Consistency**: All packages use the same version of shared dependencies
2. **Easier Updates**: Update a dependency version in one place instead of multiple
3. **Reduced Duplication**: Less repetition in package.json files
4. **Better Maintenance**: Clear view of which dependencies are standardized

## Example Output

For a project using Bun with hono backend, better-auth, and trpc:

**Root package.json (Bun)**:
```json
{
  "workspaces": {
    "catalog": {
      "dotenv": "^16.4.7",
      "zod": "^4.1.11",
      "tsdown": "^0.15.4"
    }
  }
}
```

**packages/db/package.json**:
```json
{
  "dependencies": {
    "dotenv": "catalog:",
    "zod": "catalog:"
  },
  "devDependencies": {
    "tsdown": "catalog:"
  }
}
```

**packages/auth/package.json**:
```json
{
  "dependencies": {
    "dotenv": "catalog:",
    "zod": "catalog:",
    "@my-app/db": "workspace:*"
  },
  "devDependencies": {
    "tsdown": "catalog:"
  }
}
```

## Testing

Run tests with:
```bash
cd apps/cli
bun test catalogs.test.ts
```

Tests verify:
- Bun catalog creation and references
- pnpm catalog creation and references
- npm skips catalog creation
- Convex backend catalog support (packages/backend)
- Only duplicated dependencies are cataloged
- Web app dependencies are included in catalogs
