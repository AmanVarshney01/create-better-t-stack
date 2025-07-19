# Design Document

## Overview

This design outlines the integration of bknd.io into the better-t-stack CLI, following the same patterns established by better-auth integration. bknd will be added as a backend option that integrates directly into frontend frameworks rather than requiring a separate server setup. The integration will use Handlebars templates, conditional logic, and the existing dependency management system to provide a seamless developer experience.

## Architecture

### Core Integration Pattern

Following the better-auth model, bknd integration will use:

1. **Backend Selection Integration**: Add bknd as an option in the backend selection prompt
2. **Template-Based Code Generation**: Use Handlebars templates (.hbs) to generate framework-specific integration code
3. **Dependency Management**: Leverage existing `addPackageDependency` utility to install bknd packages
4. **Configuration-Driven Setup**: Generate `bknd.config.ts` files with appropriate database connections
5. **Framework-Specific Adapters**: Generate integration code for each selected frontend framework

### Project Structure Impact

Unlike traditional backends that create a separate `apps/server` directory, bknd integrates directly into frontend applications:

```
project-root/
├── apps/
│   ├── web/                    # Web frontend with bknd integration
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── bknd.ts     # bknd client setup
│   │   │   └── app/
│   │   │       └── api/
│   │   │           └── [...bknd]/  # API routes (Next.js)
│   │   └── bknd.config.ts      # bknd configuration
│   └── native/                 # Native app with bknd client
│       └── lib/
│           └── bknd.ts         # Mobile bknd client
└── bknd.config.ts              # Root bknd config (if needed)
```

## Components and Interfaces

### 1. CLI Integration Components

#### Backend Selection Enhancement
- **File**: `apps/cli/src/prompts/backend.ts`
- **Changes**: Add bknd option to backend selection
- **Interface**: Extend `Backend` type to include "bknd"

#### Database Configuration Prompt
- **File**: `apps/cli/src/prompts/bknd-database.ts` (new)
- **Purpose**: Handle bknd-specific database configuration
- **Options**: SQLite (file/memory), PostgreSQL, Turso, Cloudflare D1

#### Setup Handler
- **File**: `apps/cli/src/helpers/setup/bknd-setup.ts` (new)
- **Purpose**: Orchestrate bknd integration setup
- **Responsibilities**:
  - Add dependencies to appropriate packages
  - Generate configuration files
  - Skip traditional database/ORM setup when bknd is selected

### 2. Template Structure

Following the better-auth template organization pattern:

```
apps/cli/templates/bknd/
├── config/
│   └── bknd.config.ts.hbs          # Main configuration template
├── web/
│   ├── next/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── bknd.ts.hbs     # Next.js bknd client
│   │   │   └── app/
│   │   │       ├── api/
│   │   │       │   └── [...bknd]/
│   │   │       │       └── route.ts.hbs  # API route handler
│   │   │       └── admin/
│   │   │           └── [[...admin]]/
│   │   │               └── page.tsx.hbs  # Admin UI page
│   │   └── middleware.ts.hbs       # Auth middleware (if needed)
│   ├── react/
│   │   ├── base/
│   │   │   └── src/
│   │   │       └── lib/
│   │   │           └── bknd-client.ts.hbs
│   │   ├── tanstack-router/
│   │   │   └── src/
│   │   │       ├── lib/
│   │   │       │   └── bknd-client.ts.hbs
│   │   │       └── routes/
│   │   │           ├── api/
│   │   │           │   └── $.ts.hbs    # Catch-all API route
│   │   │           └── admin/
│   │   │               └── $.tsx.hbs   # Admin UI route
│   │   └── react-router/
│   │       └── src/
│   │           ├── lib/
│   │           │   └── bknd-client.ts.hbs
│   │           └── routes/
│   │               └── api.$.ts.hbs
│   ├── nuxt/
│   │   ├── server/
│   │   │   └── api/
│   │   │       └── [...bknd].ts.hbs
│   │   ├── plugins/
│   │   │   └── bknd-client.ts.hbs
│   │   └── pages/
│   │       └── admin/
│   │           └── [...admin].vue.hbs
│   ├── svelte/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── bknd-client.ts.hbs
│   │   │   └── routes/
│   │   │       ├── api/
│   │   │       │   └── [...bknd]/
│   │   │       │       └── +server.ts.hbs
│   │   │       └── admin/
│   │   │           └── [...admin]/
│   │   │               └── +page.svelte.hbs
│   └── solid/
│       └── src/
│           ├── lib/
│           │   └── bknd-client.ts.hbs
│           └── routes/
│               ├── api/
│               │   └── [...bknd].ts.hbs
│               └── admin/
│                   └── [...admin].tsx.hbs
└── native/
    ├── nativewind/
    │   └── lib/
    │       └── bknd-client.ts.hbs
    └── unistyles/
        └── lib/
            └── bknd-client.ts.hbs
```

### 3. Configuration Templates

#### Main Configuration Template
```typescript
// apps/cli/templates/bknd/config/bknd.config.ts.hbs
import type { {{#if (eq frontend "next")}}NextjsBkndConfig{{else}}BkndConfig{{/if}} } from "bknd/adapter/{{#if (eq frontend "next")}}nextjs{{else}}{{runtime}}{{/if}}";

export default {
  connection: {
    {{#if (eq database "sqlite")}}
    url: "file:data.db"
    {{/if}}
    {{#if (eq database "postgres")}}
    url: process.env.DATABASE_URL
    {{/if}}
    {{#if (eq database "turso")}}
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
    {{/if}}
  },
  {{#if auth}}
  initialConfig: {
    auth: {
      enabled: true,
      strategies: {
        password: {
          type: "password",
          config: {
            hashing: "sha256"
          }
        }
      }
    }
  }
  {{/if}}
} satisfies {{#if (eq frontend "next")}}NextjsBkndConfig{{else}}BkndConfig{{/if}};
```

## Data Models

### Extended CLI Types

```typescript
// Addition to apps/cli/src/types.ts
export const BackendSchema = z
  .enum(["hono", "express", "fastify", "next", "elysia", "convex", "bknd", "none"])
  .describe("Backend framework");

export const BkndDatabaseSchema = z
  .enum(["sqlite", "postgres", "turso", "d1", "memory"])
  .describe("bknd database type");

export type BkndDatabase = z.infer<typeof BkndDatabaseSchema>;

// Extension to ProjectConfig
export interface ProjectConfig {
  // ... existing fields
  bkndDatabase?: BkndDatabase;
}
```

### Dependency Mapping

```typescript
// Addition to apps/cli/src/constants.ts
export const dependencyVersionMap = {
  // ... existing dependencies
  "bknd": "^0.13.0",
  "@bknd/postgres": "^0.13.0",
  "@bknd/sqlocal": "^0.13.0",
} as const;
```

## Error Handling

### Validation and Constraints

1. **Framework Compatibility**: Validate that selected frontends are compatible with bknd
2. **Database Validation**: Ensure selected database type is supported by bknd
3. **Dependency Conflicts**: Check for conflicts between bknd and other selected backends
4. **Template Validation**: Validate that all required template variables are available

### Error Recovery

1. **Graceful Degradation**: If bknd setup fails, provide clear error messages and fallback options
2. **Partial Setup Recovery**: Allow users to retry specific parts of the setup process
3. **Cleanup on Failure**: Remove partially created files and dependencies if setup fails

## Testing Strategy

### Unit Tests

1. **Prompt Logic Tests**: Test bknd selection and database configuration prompts
2. **Template Generation Tests**: Verify correct template selection and variable substitution
3. **Dependency Management Tests**: Ensure correct packages are added to appropriate projects
4. **Configuration Generation Tests**: Validate generated bknd.config.ts files

### Integration Tests

1. **End-to-End Setup Tests**: Test complete project generation with bknd
2. **Framework Compatibility Tests**: Verify bknd works with each supported frontend
3. **Database Configuration Tests**: Test different database setups with bknd
4. **Multi-Frontend Tests**: Ensure bknd works correctly with multiple selected frontends

### Template Tests

1. **Template Compilation Tests**: Verify all Handlebars templates compile correctly
2. **Generated Code Validation**: Ensure generated code is syntactically correct
3. **Type Safety Tests**: Verify generated TypeScript code passes type checking

## Implementation Phases

### Phase 1: Core Integration
- Add bknd to backend selection
- Implement basic bknd setup handler
- Create core configuration templates
- Add dependency management

### Phase 2: Framework Templates
- Implement Next.js integration templates
- Add React Router and TanStack Router support
- Create basic client setup templates

### Phase 3: Advanced Features
- Add authentication integration
- Implement media handling templates
- Create example templates (todo, ai)
- Add admin UI integration

### Phase 4: Extended Framework Support
- Add Nuxt.js support
- Implement Svelte integration
- Add SolidJS support
- Create React Native templates

### Phase 5: Polish and Documentation
- Add comprehensive error handling
- Create documentation templates
- Implement advanced database configurations
- Add testing and validation