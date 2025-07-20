# Design Document

## Overview

This design outlines the integration of bknd into the better-t-stack CLI, following the same patterns established by better-auth integration. bknd will be added as a backend option that integrates directly into frontend frameworks rather than requiring a separate server setup. The integration will use Handlebars templates, conditional logic, and the existing dependency management system to provide a seamless developer experience.

bknd is a lightweight, infrastructure-agnostic backend that runs in any JavaScript environment, providing instant backend capabilities with full REST API, built-in authentication, media handling, and workflow automation.

### Key bknd Features

bknd provides four essential building blocks that can be tightly connected:

1. **Data Module**: Define, query, and control data with ease

   - Supported field types: primary, text, number, date, boolean, enum, json, jsonschema
   - Relationship types: many-to-one, one-to-one, many-to-many, polymorphic
   - Powerful filtering with extensive where object support
   - Built-in validation and event system

2. **Auth Module**: Reliable authentication strategies

   - Email/Password authentication with SHA-256 hashing
   - OAuth/OIDC support (Google, GitHub, etc.)
   - JWT-based session management
   - Automatic user entity creation

3. **Media Module**: Effortless media file management

   - File uploads up to 5GB
   - S3-compatible storage adapters (S3, R2, Tigris, Cloudinary)
   - Entity integration for file attachments
   - Content delivery via API or direct provider serving

4. **Flows Module**: Workflow automation (UI in development)
   - Trigger-based executions (manual, system events, HTTP)
   - Task management with sequence, parallel, and loop support
   - OpenAPI specification task integration
   - Asynchronous and synchronous execution modes

### Admin UI and React SDK

bknd includes a comprehensive Admin UI and React SDK:

- **Admin UI**: Full-featured admin panel for data management, user administration, and system configuration
- **React SDK**: Type-safe client with hooks for data fetching and mutations
- **React Elements**: Pre-built components for authentication forms and media uploads
- **TypeScript Support**: Full type safety with generated types from database schema

## Architecture

### Core Integration Pattern

Following the Convex BaaS integration model, bknd integration will use:

1. **Backend Selection Integration**: Add bknd as an option in the backend selection prompt
2. **Template-Based Code Generation**: Use Handlebars templates (.hbs) to generate framework-specific integration code
3. **Dependency Management**: Leverage existing `addPackageDependency` utility to install bknd packages
4. **Configuration-Driven Setup**: Generate `bknd.config.ts` files with appropriate database connections
5. **Framework-Specific Adapters**: Generate integration code for each selected frontend framework
6. **BaaS Architecture**: Like Convex, bknd integrates directly into frontend apps without separate server setup
7. **Auto-Configuration**: Automatically disable conflicting options (ORM, Auth) when bknd is selected

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

#### Database Configuration Integration

- **File**: Modify existing database prompts in `apps/cli/src/prompts/database.ts`
- **Purpose**: Filter database options when bknd is selected
- **Supported Options**:
  - SQLite (embedded): Node.js SQLite or Bun SQLite, depending on runtime (use this if "Basic Setup - no cloud db integration" is the choice)
  - SQLite (remote): Turso, Cloudflare D1
  - PostgreSQL: Neon, Supabase, and Docker
- **Disabled Options**: MySQL, MongoDB (not supported by bknd)
- **Special Constraints**:
  - D1 requires Cloudflare Workers runtime
  - Node.js requires version 22 (LTS) or higher

#### Setup Handler

- **File**: `apps/cli/src/helpers/setup/bknd-setup.ts` (new)
- **Purpose**: Orchestrate bknd integration setup
- **Responsibilities**:
  - Add dependencies to appropriate packages
  - Generate configuration files
  - Automatically disable ORM selection (set to "None")
  - Automatically disable auth selection (set to "None")
  - Skip traditional database/ORM setup when bknd is selected
  - Handle email driver integration with Resend

### 2. Template Structure

Following the better-auth template organization pattern, with focus on supported frameworks:

```
apps/cli/templates/bknd/
├── config/
│   └── bknd.config.ts.hbs          # Main configuration template
├── web/
│   ├── next/                       # Next.js (supported)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── bknd.ts.hbs     # Next.js bknd client
│   │   │   └── app/
│   │   │       ├── api/
│   │   │       │   └── [[...bknd]]/
│   │   │       │       └── route.ts.hbs  # API route handler
│   │   │       └── admin/
│   │   │           └── [[...admin]]/
│   │   │               └── page.tsx.hbs  # Admin UI page
│   │   └── middleware.ts.hbs       # Auth middleware
│   ├── react/
│   │   └── react-router/           # React Router (supported)
│   │       └── src/
│   │           ├── lib/
│   │           │   └── bknd.ts.hbs
│   │           └── routes/
│   │               ├── api.$.ts.hbs    # API splat route
│   │               └── admin.$.tsx.hbs # Admin UI splat route
│   ├── unsupported/                # Warning templates for unsupported frameworks
│   │   ├── nuxt/
│   │   │   └── warning.md.hbs      # Nuxt not yet supported warning
│   │   ├── svelte/
│   │   │   └── warning.md.hbs      # Svelte not yet supported warning
│   │   ├── solid/
│   │   │   └── warning.md.hbs      # SolidJS not yet supported warning
│   │   └── tanstack-start/
│   │       └── warning.md.hbs      # TanStack Start not yet supported warning
│   └── examples/
│       ├── todo/
│       │   ├── todo-schema.ts.hbs      # Todo entity definition
│       │   ├── todo-api.ts.hbs         # Todo CRUD operations
│       │   └── todo-component.tsx.hbs  # React component example
│       ├── ai-chat/
│       │   ├── chat-schema.ts.hbs      # Chat entity definition
│       │   └── chat-component.tsx.hbs  # AI chat React component
│       └── media/
│           ├── media-dropzone.tsx.hbs  # Media upload component
│           └── media-gallery.tsx.hbs   # Media gallery component
└── native/
    ├── nativewind/
    │   └── lib/
    │       └── bknd-client.ts.hbs
    └── unistyles/
        └── lib/
            └── bknd-client.ts.hbs
```

### 3. Client Setup Templates

bknd provides different client setup patterns for each framework:

#### Next.js Client Setup

```typescript
// apps/cli/templates/bknd/web/next/src/lib/bknd.ts.hbs
import {
  type NextjsBkndConfig,
  getApp as getBkndApp,
} from "bknd/adapter/nextjs";
import { headers } from "next/headers";
import config from "../../../bknd.config";

export { config };

export async function getApp() {
  return await getBkndApp(config, process.env);
}

export async function getApi(opts?: { verify?: boolean }) {
  const app = await getApp();
  if (opts?.verify) {
    const api = app.getApi({ headers: await headers() });
    await api.verifyAuth();
    return api;
  }
  return app.getApi();
}
```

#### React Router Client Setup

```typescript
// apps/cli/templates/bknd/web/react/react-router/src/lib/bknd.ts.hbs
import {
  type ReactRouterBkndConfig,
  getApp as getBkndApp,
} from "bknd/adapter/react-router";
import config from "../../../bknd.config";

export { config };

export async function getApp() {
  return await getBkndApp(config, process.env as any);
}

export async function getApi(
  args?: { request: Request },
  opts?: { verify?: boolean }
) {
  const app = await getApp();
  if (opts?.verify) {
    const api = app.getApi({ headers: args?.request.headers });
    await api.verifyAuth();
    return api;
  }
  return app.getApi();
}
```

### 4. Configuration Templates

#### Main Configuration Template

```typescript
// apps/cli/templates/bknd/config/bknd.config.ts.hbs
import type { {{#if (eq frontend "next")}}NextjsBkndConfig{{else if (eq frontend "react-router")}}ReactRouterBkndConfig{{else}}BkndConfig{{/if}} } from "bknd/adapter/{{#if (eq frontend "next")}}nextjs{{else if (eq frontend "react-router")}}react-router{{else}}node{{/if}}";

export default {
  connection: {
    {{#if (eq database "sqlite")}}
    url: "file:data.db"
    {{/if}}
    {{#if (eq database "postgres")}}
    url: process.env.DATABASE_URL
    {{/if}}
    {{#if (eq database "neon")}}
    url: process.env.DATABASE_URL
    {{/if}}
    {{#if (eq database "supabase")}}
    url: process.env.DATABASE_URL
    {{/if}}
    {{#if (eq database "turso")}}
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
    {{/if}}
    {{#if (eq database "d1")}}
    // D1 configuration handled automatically by Cloudflare adapter
    {{/if}}
  },
  // bknd comes with built-in auth, media, and flows modules
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
    },
    media: {
      enabled: true
    }
  }
} satisfies {{#if (eq frontend "next")}}NextjsBkndConfig{{else if (eq frontend "react-router")}}ReactRouterBkndConfig{{else}}BkndConfig{{/if}};
```

#### React SDK Integration Template

```typescript
// apps/cli/templates/bknd/web/shared/client-provider.tsx.hbs
import { ClientProvider } from "bknd/client";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function BkndProvider({ children }: Props) {
  return <ClientProvider>{children}</ClientProvider>;
}
```

#### Example Component Templates

```typescript
// apps/cli/templates/bknd/examples/todo/todo-component.tsx.hbs
import { useEntityQuery } from "bknd/client";
import { useState } from "react";

export function TodoList() {
  const { data: todos, create, update, _delete } = useEntityQuery("todos");
  const [newTodo, setNewTodo] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    await create({ title: newTodo, done: false });
    setNewTodo("");
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => update({ done: !todo.done }, todo.id)}
            />
            <span>{todo.title}</span>
            <button onClick={() => _delete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Admin UI Integration Templates

Each framework has its own Admin UI integration pattern:

**Next.js Admin UI:**

```typescript
// apps/cli/templates/bknd/web/next/src/app/admin/[[...admin]]/page.tsx.hbs
import { Admin } from "bknd/ui";
import { getApi } from "@/lib/bknd";
import "bknd/dist/styles.css";

export default async function AdminPage() {
  const api = await getApi({ verify: true });

  return (
    <Admin
      withProvider={{ user: api.getUser() }}
      config={{
        basepath: "/admin",
        logo_return_path: "/../",
        color_scheme: "system",
      }}
    />
  );
}
```

**React Router Admin UI:**

```typescript
// apps/cli/templates/bknd/web/react/react-router/src/routes/admin.$.tsx.hbs
import { lazy, Suspense, useSyncExternalStore } from "react";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { getApi } from "~/lib/bknd";

const Admin = lazy(() =>
  import("bknd/ui").then((mod) => ({ default: mod.Admin }))
);
import "bknd/dist/styles.css";

export const loader = async (args: LoaderFunctionArgs) => {
  const api = await getApi(args, { verify: true });
  return { user: api.getUser() };
};

export default function AdminPage() {
  const { user } = useLoaderData<typeof loader>();
  const hydrated = useSyncExternalStore(
    () => {},
    () => true,
    () => false
  );
  if (!hydrated) return null;

  return (
    <Suspense>
      <Admin
        withProvider={{ user }}
        config={{ basepath: "/admin", logo_return_path: "/../" }}
      />
    </Suspense>
  );
}
```

## Data Models

### Extended CLI Types

```typescript
// Addition to apps/cli/src/types.ts
export const BackendSchema = z
  .enum([
    "hono",
    "express",
    "fastify",
    "next",
    "elysia",
    "convex",
    "bknd",
    "none",
  ])
  .describe("Backend framework");

// No additional database schema needed - bknd uses existing Database type
// No additional ProjectConfig fields needed - existing database field is sufficient
```

### Dependency Mapping

```typescript
// Addition to apps/cli/src/constants.ts
export const dependencyVersionMap = {
  // ... existing dependencies
  bknd: "^0.13.0",
  "@bknd/postgres": "^0.13.0", // For PostgreSQL support
  "@bknd/sqlocal": "^0.13.0", // For SQLocal support
  "@libsql/client": "^0.14.0", // For LibSQL/Turso support

  "@hono/vite-dev-server": "^0.16.0", // For Vite integration
} as const;
```

## Requirements vs Implementation Notes

### Framework Support Discrepancy

The requirements document mentions TanStack Start support (Requirement 2.3), but:

1. **better-t-stack compatibility**: The current `BACKEND_COMPATIBILITY.bknd.frontends` in constants.ts only includes `["next", "react-router", "native-nativewind", "native-unistyles"]`
2. **bknd official support**: TanStack Start is not listed as officially supported by bknd in their documentation
3. **Resolution**: TanStack Start should be treated as unsupported and show warnings, similar to other unsupported frameworks

## Error Handling

### Validation and Constraints

1. **Framework Compatibility**: Validate that selected frontends are compatible with bknd
   - Supported: Next.js, React Router
   - Unsupported: Nuxt, Svelte, SolidJS, TanStack Start (show warnings)
2. **Database Validation**: Ensure selected database type is supported by bknd
   - Supported: SQLite, libSQL (Turso), PostgreSQL, Neon, Supabase, Cloudflare D1
   - Unsupported: MySQL, MongoDB (automatically disabled)
   - Special: D1 requires Cloudflare Workers runtime
3. **Runtime Requirements**:
   - Node.js version 22 (LTS) or higher required
4. **Dependency Conflicts**: Check for conflicts between bknd and other selected backends
5. **Template Validation**: Validate that all required template variables are available
6. **Runtime Constraints**: Validate D1 + Cloudflare Workers combination
7. **Auto-Disable Validation**: Ensure ORM and Auth are automatically set to "None" when bknd is selected

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
- Add React Router support
- Create basic client setup templates

### Phase 3: Advanced Features

- Add authentication integration
- Implement media handling templates
- Create example templates (todo, ai)
- Add admin UI integration

### Phase 4: Framework Warnings and Future Support

- Implement warning system for unsupported frameworks (Nuxt, Svelte, SolidJS, TanStack Start)
- Create documentation for future framework support
- Enhance React Native templates
- Add framework compatibility validation
- Add PostgreSQL adapter support (@bknd/postgres)

### Phase 5: Polish and Documentation

- Add comprehensive error handling
- Create documentation templates
- Implement advanced database configurations
- Add testing and validation
