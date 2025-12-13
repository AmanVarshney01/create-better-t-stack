import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import type {
  Addons,
  API,
  Auth,
  Backend,
  Database,
  DatabaseSetup,
  Frontend,
  ORM,
  PackageManager,
  ProjectConfig,
  Runtime,
} from "../../types";

/**
 * Returns the appropriate dlx command for the selected package manager
 */
function getDlxCmd(packageManager: PackageManager) {
  if (packageManager === "bun") return "bunx";
  if (packageManager === "pnpm") return "pnpm dlx";
  return "npx";
}

/**
 * Sets up Claude Code integration for the generated project.
 * Creates CLAUDE.md, .claude/commands/, and .claude/spec/ files.
 */
export async function setupClaudeIntegration(projectDir: string, options: ProjectConfig) {
  try {
    // Create CLAUDE.md at project root
    await createClaudeMd(projectDir, options);

    // Create .claude/commands/ directory with relevant commands
    await createClaudeCommands(projectDir, options);

    // Create .claude/spec/ directory with project templates
    await createClaudeSpec(projectDir, options);

    consola.success("Claude Code integration configured successfully");
  } catch (error) {
    // Log warning but continue - Claude setup is non-critical
    consola.warn("Claude Code integration skipped due to error:", error);
  }
}

/**
 * Creates the CLAUDE.md file with comprehensive project context
 */
async function createClaudeMd(projectDir: string, options: ProjectConfig) {
  const claudeMdPath = path.join(projectDir, "CLAUDE.md");
  const content = generateClaudeMdContent(options);
  await fs.writeFile(claudeMdPath, content);
}

/**
 * Creates .claude/commands/ with contextual slash commands
 */
async function createClaudeCommands(projectDir: string, options: ProjectConfig) {
  const commandsDir = path.join(projectDir, ".claude", "commands");
  await fs.ensureDir(commandsDir);

  const commands = getRelevantCommands(options);

  for (const [filename, content] of Object.entries(commands)) {
    await fs.writeFile(path.join(commandsDir, filename), content);
  }
}

/**
 * Creates .claude/spec/ with project specification templates
 */
async function createClaudeSpec(projectDir: string, options: ProjectConfig) {
  const specDir = path.join(projectDir, ".claude", "spec");
  await fs.ensureDir(specDir);

  // PROJECT_SPEC.md
  await fs.writeFile(path.join(specDir, "PROJECT_SPEC.md"), generateProjectSpecTemplate(options));

  // FEATURE_TEMPLATE.md
  await fs.writeFile(path.join(specDir, "FEATURE_TEMPLATE.md"), generateFeatureTemplate(options));
}

/**
 * Generates comprehensive CLAUDE.md content based on stack choices
 */
function generateClaudeMdContent(options: ProjectConfig) {
  const {
    projectName,
    packageManager,
    database,
    auth,
    addons,
    orm,
    runtime,
    frontend,
    backend,
    api,
    dbSetup,
  } = options;

  const isConvex = backend === "convex";
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");
  const hasBackend = backend !== "none" && backend !== "self";
  const hasDatabase = database !== "none";
  const hasApi = api !== "none";
  const hasAuth = auth !== "none";

  const runCmd = `${packageManager} run`;

  // Build stack overview table rows dynamically (avoids empty lines)
  const stackRows: string[] = [];
  if (hasFrontend) stackRows.push(`| Frontend | ${getFrontendName(frontend)} |`);
  if (hasBackend && !isConvex) stackRows.push(`| Backend | ${getBackendName(backend)} |`);
  if (isConvex) stackRows.push(`| Backend | Convex (real-time BaaS) |`);
  if (hasApi && !isConvex) stackRows.push(`| API | ${api.toUpperCase()} |`);
  if (hasDatabase && !isConvex)
    stackRows.push(`| Database | ${getDatabaseName(database)} with ${getOrmName(orm)} |`);
  if (hasAuth) stackRows.push(`| Auth | ${getAuthName(auth)} |`);
  if (runtime !== "none") stackRows.push(`| Runtime | ${getRuntimeName(runtime)} |`);
  stackRows.push(`| Package Manager | ${packageManager} |`);

  // Build quick commands dynamically (avoids empty lines)
  const quickCommands: string[] = [
    `${runCmd} dev          # Start all apps in development`,
    `${runCmd} build        # Build all apps`,
    `${runCmd} check-types  # TypeScript type checking`,
  ];
  if (hasDatabase && !isConvex) {
    quickCommands.push(`${runCmd} db:push      # Push database schema changes`);
    quickCommands.push(`${runCmd} db:studio    # Open database GUI`);
  }
  if (addons.includes("biome"))
    quickCommands.push(`${runCmd} check        # Run Biome linting/formatting`);
  if (addons.includes("oxlint")) quickCommands.push(`${runCmd} lint         # Run Oxlint`);

  let content = `# ${projectName}

This is a Better T Stack project. Follow the patterns and conventions below when making changes.

## Stack Overview

| Layer | Technology |
|-------|------------|
${stackRows.join("\n")}

## Quick Commands

\`\`\`bash
${quickCommands.join("\n")}
\`\`\`

## Project Structure

\`\`\`
${projectName}/
${generateProjectStructureTree(options)}
\`\`\`

## Development Guidelines

### Code Organization
${generateCodeOrganizationGuidelines(options)}

### Type Safety Rules
${generateTypeSafetyRules(options)}

${hasFrontend ? generateFrontendPatterns(options) : ""}

${hasBackend && !isConvex ? generateBackendPatterns(options) : ""}

${isConvex ? generateConvexPatterns(options) : ""}

${hasApi && !isConvex ? generateApiPatterns(options) : ""}

${hasDatabase && !isConvex ? generateDatabasePatterns(options) : ""}

${hasAuth ? generateAuthPatterns(options) : ""}

## Do NOT

${generateAntiPatterns(options)}

## File Naming Conventions

${generateNamingConventions(options)}
`;

  return content.trim() + "\n";
}

// ============================================================================
// Helper functions for content generation
// ============================================================================

function getFrontendName(frontend: Frontend[]) {
  const names: Record<string, string> = {
    "tanstack-router": "React + TanStack Router",
    "react-router": "React + React Router",
    "tanstack-start": "React + TanStack Start (SSR)",
    next: "Next.js (App Router)",
    nuxt: "Nuxt 3",
    svelte: "SvelteKit",
    solid: "SolidJS",
    "native-bare": "React Native (Expo)",
    "native-uniwind": "React Native (Expo + NativeWind)",
    "native-unistyles": "React Native (Expo + Unistyles)",
  };
  return frontend.map((f) => names[f] || f).join(", ");
}

function getBackendName(backend: Backend) {
  const names: Record<string, string> = {
    hono: "Hono",
    express: "Express",
    fastify: "Fastify",
    elysia: "Elysia",
    convex: "Convex",
  };
  return names[backend] || backend;
}

function getDatabaseName(database: Database) {
  const names: Record<string, string> = {
    sqlite: "SQLite",
    postgres: "PostgreSQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
  };
  return names[database] || database;
}

function getOrmName(orm: ORM) {
  const names: Record<string, string> = {
    drizzle: "Drizzle ORM",
    prisma: "Prisma",
    mongoose: "Mongoose",
  };
  return names[orm] || orm;
}

function getAuthName(auth: Auth) {
  const names: Record<string, string> = {
    "better-auth": "Better-Auth",
    clerk: "Clerk",
  };
  return names[auth] || auth;
}

function getRuntimeName(runtime: Runtime) {
  const names: Record<string, string> = {
    bun: "Bun",
    node: "Node.js",
    workers: "Cloudflare Workers",
  };
  return names[runtime] || runtime;
}

function generateProjectStructureTree(options: ProjectConfig) {
  const { frontend, backend, addons, api, auth, database } = options;
  const isConvex = backend === "convex";
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");
  const hasBackend = backend !== "none" && backend !== "self";
  const isSelfBackend = backend === "self";
  const hasNative = frontend.some((f) => f.startsWith("native-"));
  const hasDatabase = database !== "none";

  const lines: string[] = ["├── apps/"];

  // Build apps entries
  const appsEntries: string[] = [];
  if (hasFrontend && !hasNative) {
    appsEntries.push("web/              # Frontend application");
  }
  if (hasNative) {
    appsEntries.push("web/              # Web frontend");
    appsEntries.push("native/           # React Native mobile app");
  }
  if (hasBackend && !isConvex && !isSelfBackend) {
    appsEntries.push("server/           # Backend API server");
  }
  if (addons.includes("starlight") || addons.includes("fumadocs")) {
    appsEntries.push("docs/             # Documentation site");
  }

  // Add apps entries with proper tree markers
  appsEntries.forEach((entry, i) => {
    const marker = i === appsEntries.length - 1 ? "└──" : "├──";
    lines.push(`│   ${marker} ${entry}`);
  });

  if (!isSelfBackend) {
    lines.push("├── packages/");

    // Build packages entries
    const pkgEntries: string[] = [];
    if (api !== "none" && !isConvex) {
      pkgEntries.push("api/              # Shared API definitions");
    }
    if (auth !== "none" && !isConvex) {
      pkgEntries.push("auth/             # Authentication logic");
    }
    if (hasDatabase && !isConvex) {
      pkgEntries.push("db/               # Database schema & queries");
    }
    if (isConvex) {
      pkgEntries.push("backend/          # Convex functions & schema");
    }

    // Add packages entries with proper tree markers
    pkgEntries.forEach((entry, i) => {
      const marker = i === pkgEntries.length - 1 ? "└──" : "├──";
      lines.push(`│   ${marker} ${entry}`);
    });
  }

  lines.push("├── CLAUDE.md             # This file (Claude context)");
  lines.push("├── .claude/              # Claude commands & specs");
  lines.push("└── package.json          # Root package.json");

  return lines.join("\n");
}

function generateCodeOrganizationGuidelines(options: ProjectConfig) {
  const { frontend, backend, api } = options;
  const isConvex = backend === "convex";
  const lines: string[] = [];

  lines.push("- Keep shared types in `packages/` for reuse across apps");
  lines.push("- Colocate related code (component + styles + tests)");
  lines.push("- Use barrel exports (`index.ts`) for clean imports");

  if (frontend.includes("tanstack-router") || frontend.includes("tanstack-start")) {
    lines.push("- Place route components in `apps/web/src/routes/`");
    lines.push("- Use file-based routing conventions");
  }

  if (frontend.includes("next")) {
    lines.push("- Place pages in `apps/web/app/`");
    lines.push("- Use Server Components by default, Client Components when needed");
  }

  if ((api === "trpc" || api === "orpc") && !isConvex) {
    lines.push("- Define API procedures in `packages/api/src/routers/`");
    lines.push("- Group related procedures in the same router file");
  }

  return lines.map((l) => l).join("\n");
}

function generateTypeSafetyRules(options: ProjectConfig) {
  const { api, orm, backend } = options;
  const isConvex = backend === "convex";
  const lines: string[] = [];

  lines.push("- NEVER use `any` type - use `unknown` and narrow with type guards");
  lines.push("- Prefer TypeScript's inferred return types; avoid unnecessary explicit annotations");
  lines.push("- Use Zod for runtime validation at API boundaries");

  if (api === "trpc" && !isConvex) {
    lines.push("- Leverage tRPC's end-to-end type inference");
    lines.push("- Use `input` schemas on all procedures");
  }

  if (api === "orpc" && !isConvex) {
    lines.push("- Leverage oRPC's type-safe API with OpenAPI output");
    lines.push("- Define input/output schemas for all procedures");
  }

  if (orm === "drizzle") {
    lines.push("- Use Drizzle's type-safe query builder");
    lines.push("- Infer types from schema: `typeof users.$inferSelect`");
  }

  if (orm === "prisma") {
    lines.push("- Use Prisma's generated types");
    lines.push("- Import types from `@prisma/client`");
  }

  if (isConvex) {
    lines.push("- Use Convex's type-safe functions (`query`, `mutation`, `action`)");
    lines.push("- Define schemas with Convex validators");
  }

  return lines.map((l) => l).join("\n");
}

function generateFrontendPatterns(options: ProjectConfig) {
  const { frontend } = options;
  let content = "\n### Frontend Patterns\n\n";

  if (frontend.includes("tanstack-router")) {
    content += `**TanStack Router:**
- Route files: \`apps/web/src/routes/\`
- Use \`createFileRoute\` for type-safe routes
- Use \`loader\` for data fetching
- Use \`useSearch\` for type-safe search params

\`\`\`typescript
// apps/web/src/routes/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    // Fetch user data
  },
  component: UserPage,
});
\`\`\`
`;
  }

  if (frontend.includes("tanstack-start")) {
    content += `**TanStack Start (SSR):**
- Use \`createServerFn\` for server-side data fetching
- Place server functions in route files or separate modules
- Leverage streaming and suspense for optimal UX

\`\`\`typescript
import { createServerFn } from "@tanstack/react-start";

const getUser = createServerFn("GET", async (userId: string) => {
  // Server-side logic
});
\`\`\`
`;
  }

  if (frontend.includes("next")) {
    content += `**Next.js App Router:**
- Pages in \`apps/web/app/\`
- Use Server Components by default
- Add \`"use client"\` only when needed (interactivity, hooks)
- Use \`loading.tsx\` for loading states
- Use \`error.tsx\` for error boundaries

\`\`\`typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component (when needed)
"use client";
export function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
\`\`\`
`;
  }

  if (frontend.includes("svelte")) {
    content += `**SvelteKit:**
- Routes in \`apps/web/src/routes/\`
- Use \`+page.svelte\` for pages
- Use \`+page.server.ts\` for server-side load functions
- Use \`+server.ts\` for API endpoints

\`\`\`typescript
// +page.server.ts
export const load = async ({ params }) => {
  return { user: await getUser(params.id) };
};
\`\`\`
`;
  }

  if (frontend.includes("nuxt")) {
    content += `**Nuxt 3:**
- Pages in \`apps/web/pages/\`
- Use composables in \`apps/web/composables/\`
- Server API in \`apps/web/server/api/\`
- Use \`useFetch\` and \`useAsyncData\` for data fetching
`;
  }

  if (frontend.includes("solid")) {
    content += `**SolidJS:**
- Use \`createSignal\` for reactive state
- Use \`createResource\` for async data
- Use \`createEffect\` for side effects
- Components are functions that run once (not like React)
`;
  }

  content += `
**UI Components (shadcn/ui):**
- Components in \`apps/web/src/components/ui/\`
- Use \`cn()\` utility for conditional classes
- Follow shadcn/ui patterns for consistency
`;

  return content;
}

function generateBackendPatterns(options: ProjectConfig) {
  const { backend, runtime } = options;
  let content = "\n### Backend Patterns\n\n";

  if (backend === "hono") {
    content += `**Hono:**
- Routes in \`apps/server/src/\`
- Use \`Hono\` app instance
- Middleware with \`app.use()\`
- Type-safe context with generics

\`\`\`typescript
import { Hono } from "hono";

const app = new Hono()
  .get("/users/:id", async (c) => {
    const id = c.req.param("id");
    return c.json({ id });
  });
\`\`\`
`;
  }

  if (backend === "express") {
    content += `**Express:**
- Routes in \`apps/server/src/routes/\`
- Use Router for modular routes
- Middleware pattern for cross-cutting concerns
`;
  }

  if (backend === "fastify") {
    content += `**Fastify:**
- Routes in \`apps/server/src/routes/\`
- Use schema validation for requests
- Plugin architecture for features
`;
  }

  if (backend === "elysia") {
    content += `**Elysia:**
- Type-safe by default
- Use method chaining for routes
- Plugins with \`.use()\`

\`\`\`typescript
import { Elysia, t } from "elysia";

const app = new Elysia()
  .get("/users/:id", ({ params }) => {
    return { id: params.id };
  }, {
    params: t.Object({ id: t.String() })
  });
\`\`\`
`;
  }

  if (runtime === "workers") {
    content += `
**Cloudflare Workers:**
- Exports default handler
- Use \`env\` for bindings (D1, KV, etc.)
- Cold starts are minimal but be mindful
`;
  }

  return content;
}

function generateConvexPatterns(options: ProjectConfig) {
  return `
### Convex Patterns

**Functions Location:** \`packages/backend/convex/\`

**Query (read-only):**
\`\`\`typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
\`\`\`

**Mutation (write):**
\`\`\`typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", { name: args.name });
  },
});
\`\`\`

**Schema:** Define in \`packages/backend/convex/schema.ts\`

**Real-time:** Queries automatically update when data changes
`;
}

function generateApiPatterns(options: ProjectConfig) {
  const { api } = options;
  let content = "\n### API Patterns\n\n";

  if (api === "trpc") {
    content += `**tRPC:**
- Routers in \`packages/api/src/routers/\`
- Export from \`packages/api/src/root.ts\`
- Use \`publicProcedure\` or \`protectedProcedure\`

\`\`\`typescript
// packages/api/src/routers/user.ts
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Return user
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Create user
    }),
});
\`\`\`

**Client Usage:**
\`\`\`typescript
// Type-safe API calls
const user = await trpc.user.getById.query({ id: "123" });
await trpc.user.create.mutate({ name: "John" });
\`\`\`
`;
  }

  if (api === "orpc") {
    content += `**oRPC:**
- Similar to tRPC with OpenAPI output
- Routers in \`packages/api/src/routers/\`
- Generates OpenAPI spec automatically

\`\`\`typescript
// packages/api/src/routers/user.ts
import { z } from "zod";
import { publicProcedure, router } from "../orpc";

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Return user
    }),
});
\`\`\`
`;
  }

  return content;
}

function generateDatabasePatterns(options: ProjectConfig) {
  const { orm, database } = options;
  let content = "\n### Database Patterns\n\n";

  if (orm === "drizzle") {
    content += `**Drizzle ORM:**
- Schema in \`packages/db/src/schema/\`
- Migrations in \`packages/db/src/migrations/\`
- Use type-safe query builder

\`\`\`typescript
// packages/db/src/schema/users.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
\`\`\`

**Queries:**
\`\`\`typescript
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Select
const user = await db.select().from(users).where(eq(users.id, id));

// Insert
await db.insert(users).values({ name, email });

// Update
await db.update(users).set({ name }).where(eq(users.id, id));
\`\`\`
`;
  }

  if (orm === "prisma") {
    content += `**Prisma:**
- Schema in \`packages/db/prisma/schema.prisma\`
- Use Prisma Client for queries

\`\`\`prisma
// schema.prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
\`\`\`

**Queries:**
\`\`\`typescript
import { prisma } from "@/db";

// Find
const user = await prisma.user.findUnique({ where: { id } });

// Create
await prisma.user.create({ data: { name, email } });

// Update
await prisma.user.update({ where: { id }, data: { name } });
\`\`\`
`;
  }

  if (orm === "mongoose") {
    content += `**Mongoose:**
- Models in \`packages/db/src/models/\`
- Use schemas for validation

\`\`\`typescript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
\`\`\`
`;
  }

  return content;
}

function generateAuthPatterns(options: ProjectConfig) {
  const { auth } = options;
  let content = "\n### Authentication Patterns\n\n";

  if (auth === "better-auth") {
    content += `**Better-Auth:**
- Config in \`packages/auth/src/\`
- Use \`auth.api\` for server-side
- Use \`authClient\` for client-side

**Server:**
\`\`\`typescript
import { auth } from "@/auth";

// In API route/procedure
const session = await auth.api.getSession({ headers });
if (!session) throw new Error("Unauthorized");
\`\`\`

**Client:**
\`\`\`typescript
import { authClient } from "@/auth/client";

// Sign in
await authClient.signIn.email({ email, password });

// Get session
const session = await authClient.getSession();
\`\`\`
`;
  }

  if (auth === "clerk") {
    content += `**Clerk:**
- Use \`@clerk/nextjs\` or framework-specific package
- Wrap app with \`ClerkProvider\`
- Use \`auth()\` for server-side auth

**Server:**
\`\`\`typescript
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
\`\`\`

**Client:**
\`\`\`typescript
import { useAuth, useUser } from "@clerk/nextjs";

const { isSignedIn } = useAuth();
const { user } = useUser();
\`\`\`
`;
  }

  return content;
}

function generateAntiPatterns(options: ProjectConfig) {
  const { api, orm, frontend, backend, addons } = options;
  const isConvex = backend === "convex";
  const lines: string[] = [];

  // Universal anti-patterns
  lines.push("- Use `any` type (use `unknown` with type guards instead)");
  lines.push("- Skip input validation on API endpoints");
  lines.push("- Commit `.env` files or secrets to git");
  lines.push("- Mix server and client code inappropriately");

  if (api === "trpc" || api === "orpc") {
    lines.push("- Call procedures directly from client (use the typed client)");
    lines.push("- Skip Zod validation on procedure inputs");
  }

  if (orm === "drizzle" || orm === "prisma") {
    lines.push("- Write raw SQL when ORM methods exist");
    lines.push("- Skip migrations (always use `db:push` or migrations)");
  }

  if (frontend.includes("next")) {
    lines.push('- Make client components without explicit `"use client"` directive');
    lines.push("- Fetch data in client components when server components work");
  }

  if (frontend.includes("tanstack-router") || frontend.includes("tanstack-start")) {
    lines.push("- Skip loader for route data (avoid useEffect for initial data)");
  }

  if (isConvex) {
    lines.push("- Mutate data in queries (use mutations)");
    lines.push("- Skip Convex validators for function arguments");
  }

  if (addons.includes("biome")) {
    lines.push("- Ignore Biome lint errors without good reason");
  }

  lines.push("- Create files outside the established project structure");
  lines.push("- Add dependencies without updating `package.json`");

  return lines.map((l) => `- ${l.replace(/^- /, "")}`).join("\n");
}

function generateNamingConventions(options: ProjectConfig) {
  const { frontend } = options;
  const lines: string[] = [];

  lines.push("- **Components:** PascalCase (`UserProfile.tsx`)");
  lines.push("- **Utilities/Hooks:** camelCase (`useAuth.ts`, `formatDate.ts`)");
  lines.push("- **Constants:** SCREAMING_SNAKE_CASE (`API_BASE_URL`)");
  lines.push(
    "- **Types/Interfaces:** PascalCase with descriptive names (`UserProfile`, `CreateUserInput`)",
  );

  if (frontend.includes("tanstack-router") || frontend.includes("tanstack-start")) {
    lines.push("- **Routes:** kebab-case directories (`/user-settings/`)");
  }

  if (frontend.includes("next")) {
    lines.push("- **Pages:** lowercase directories in `app/`");
    lines.push("- **API Routes:** `route.ts` files");
  }

  if (frontend.includes("svelte")) {
    lines.push("- **Pages:** `+page.svelte` convention");
    lines.push("- **Layouts:** `+layout.svelte`");
  }

  lines.push("- **Database tables:** snake_case (`user_profiles`)");
  lines.push("- **Environment variables:** SCREAMING_SNAKE_CASE (`DATABASE_URL`)");

  return lines.map((l) => l).join("\n");
}

/**
 * Returns relevant slash commands based on project configuration
 */
function getRelevantCommands(options: ProjectConfig) {
  const { frontend, backend, database, api, addons, packageManager, dbSetup } = options;
  const commands: Record<string, string> = {};
  const runCmd = `${packageManager} run`;
  const isConvex = backend === "convex";
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");
  const hasBackend = backend !== "none" && backend !== "self";
  const hasDatabase = database !== "none";
  const hasApi = api !== "none";

  // Always include dev command
  commands["dev.md"] = `---
description: Start development environment
---

Start all applications in development mode:

\`\`\`bash
${runCmd} dev
\`\`\`

This will start:
${hasFrontend ? "- Web app (usually http://localhost:3001 or 5173)" : ""}
${hasBackend && !isConvex ? "- API server (usually http://localhost:3000)" : ""}
${isConvex ? "- Convex backend (connected to cloud)" : ""}
`;

  // Always include add-feature
  commands["add-feature.md"] = generateAddFeatureCommand(options);

  // Always include test
  commands["test.md"] = `---
description: Run tests
---

Run the test suite:

\`\`\`bash
${runCmd} test
\`\`\`

For watch mode:
\`\`\`bash
${runCmd} test:watch
\`\`\`
`;

  // Frontend-specific commands
  if (hasFrontend) {
    commands["add-route.md"] = generateAddRouteCommand(options);
    commands["add-component.md"] = generateAddComponentCommand(options);
  }

  // API commands (tRPC/oRPC)
  if (hasApi && !isConvex) {
    commands["add-procedure.md"] = generateAddProcedureCommand(options);
  }

  // Database commands
  if (hasDatabase && !isConvex) {
    commands["db-migrate.md"] = generateDbMigrateCommand(options);
    commands["db-studio.md"] = generateDbStudioCommand(options);
  }

  // Convex commands
  if (isConvex) {
    const dlxCmd = getDlxCmd(packageManager);
    commands["convex-deploy.md"] = `---
description: Deploy Convex functions
---

Deploy your Convex backend to production:

\`\`\`bash
${dlxCmd} convex deploy
\`\`\`

For development:
\`\`\`bash
${runCmd} dev:setup
\`\`\`
`;
  }

  // Linting commands
  if (addons.includes("biome")) {
    commands["lint.md"] = `---
description: Run linting and formatting
---

Check and fix code with Biome:

\`\`\`bash
${runCmd} check
\`\`\`

This runs Biome for:
- Linting (catching errors and bad patterns)
- Formatting (consistent code style)
`;
  }

  if (addons.includes("oxlint")) {
    commands["lint.md"] = `---
description: Run linting
---

Run Oxlint:

\`\`\`bash
${runCmd} lint
\`\`\`
`;
  }

  return commands;
}

function generateAddFeatureCommand(options: ProjectConfig) {
  const { frontend, api, backend, database, orm } = options;
  const isConvex = backend === "convex";
  const hasApi = api !== "none";
  const hasFrontend = frontend.length > 0 && !frontend.includes("none");

  let steps = `---
description: Add a new feature with proper structure
---

When adding a new feature, follow this structure:

## Steps

`;

  if (hasFrontend) {
    if (frontend.includes("tanstack-router") || frontend.includes("tanstack-start")) {
      steps += `### 1. Add Route (if needed)
Create route file in \`apps/web/src/routes/\`:
\`\`\`
apps/web/src/routes/[feature-name]/
├── route.tsx        # Route component
└── -components/     # Feature-specific components
\`\`\`

`;
    } else if (frontend.includes("next")) {
      steps += `### 1. Add Page (if needed)
Create page in \`apps/web/app/\`:
\`\`\`
apps/web/app/[feature-name]/
├── page.tsx         # Page component
├── loading.tsx      # Loading state
└── error.tsx        # Error boundary
\`\`\`

`;
    }
  }

  if (hasApi && !isConvex) {
    steps += `### 2. Add API Procedures
Create router in \`packages/api/src/routers/[feature].ts\`:
- Define input schemas with Zod
- Add to root router in \`packages/api/src/root.ts\`

`;
  }

  if (isConvex) {
    steps += `### 2. Add Convex Functions
Create functions in \`packages/backend/convex/[feature].ts\`:
- Define queries for reading data
- Define mutations for writing data
- Update schema if needed

`;
  }

  if (database !== "none" && !isConvex) {
    steps += `### 3. Add Database Schema (if needed)
`;
    if (orm === "drizzle") {
      steps += `Create schema in \`packages/db/src/schema/[feature].ts\`:
- Define table with Drizzle
- Export types
- Run \`${options.packageManager} run db:push\`
`;
    } else if (orm === "prisma") {
      steps += `Update \`packages/db/prisma/schema.prisma\`:
- Add model
- Run \`${options.packageManager} run db:push\`
`;
    }
  }

  steps += `
## Checklist
- [ ] Route/page created (if UI feature)
- [ ] API procedures added (if data needed)
- [ ] Database schema updated (if new data model)
- [ ] Types are properly defined
- [ ] Error handling in place
- [ ] Loading states handled
`;

  return steps;
}

function generateAddRouteCommand(options: ProjectConfig) {
  const { frontend, packageManager } = options;
  let content = `---
description: Add a new route/page
---

`;

  if (frontend.includes("tanstack-router") || frontend.includes("tanstack-start")) {
    content += `## TanStack Router

Create a new route file:

\`\`\`bash
# For /users route
touch apps/web/src/routes/users/route.tsx
\`\`\`

**Template:**
\`\`\`typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
  loader: async () => {
    // Fetch data here
    return { users: [] };
  },
  component: UsersPage,
});

function UsersPage() {
  const { users } = Route.useLoaderData();
  return (
    <div>
      <h1>Users</h1>
      {/* Render users */}
    </div>
  );
}
\`\`\`

**Dynamic routes:** Use \`$param\` syntax (\`/users/$userId/route.tsx\`)
`;
  }

  if (frontend.includes("next")) {
    content += `## Next.js App Router

Create a new page:

\`\`\`bash
mkdir -p apps/web/app/users
touch apps/web/app/users/page.tsx
\`\`\`

**Template:**
\`\`\`typescript
export default async function UsersPage() {
  const users = await fetchUsers();
  return (
    <div>
      <h1>Users</h1>
      {/* Render users */}
    </div>
  );
}
\`\`\`

**Dynamic routes:** Use \`[param]\` syntax (\`/users/[userId]/page.tsx\`)
`;
  }

  if (frontend.includes("svelte")) {
    content += `## SvelteKit

Create a new route:

\`\`\`bash
mkdir -p apps/web/src/routes/users
touch apps/web/src/routes/users/+page.svelte
touch apps/web/src/routes/users/+page.server.ts
\`\`\`

**+page.server.ts:**
\`\`\`typescript
export const load = async () => {
  return { users: await fetchUsers() };
};
\`\`\`

**+page.svelte:**
\`\`\`svelte
<script>
  export let data;
</script>

<h1>Users</h1>
{#each data.users as user}
  <p>{user.name}</p>
{/each}
\`\`\`
`;
  }

  return content;
}

function generateAddComponentCommand(options: ProjectConfig) {
  return `---
description: Add a new UI component
---

## Create Component

Location: \`apps/web/src/components/\`

**Template:**
\`\`\`typescript
// apps/web/src/components/UserCard.tsx
import { cn } from "@/lib/utils";

type UserCardProps = {
  name: string;
  email: string;
  className?: string;
};

export function UserCard({ name, email, className }: UserCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-muted-foreground">{email}</p>
    </div>
  );
}
\`\`\`

## Guidelines

- Use \`cn()\` for conditional classes (from shadcn/ui)
- Define props with TypeScript type aliases
- Make components composable and reusable
- Colocate tests: \`UserCard.test.tsx\`
`;
}

function generateAddProcedureCommand(options: ProjectConfig) {
  const { api, packageManager } = options;

  if (api === "trpc") {
    return `---
description: Add a new tRPC procedure
---

## Create Procedure

### 1. Create or update router file

Location: \`packages/api/src/routers/\`

\`\`\`typescript
// packages/api/src/routers/user.ts
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";

export const userRouter = router({
  // Query (read)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Return data
    }),

  // Mutation (write)
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create and return
    }),
});
\`\`\`

### 2. Add to root router

\`\`\`typescript
// packages/api/src/root.ts
import { userRouter } from "./routers/user";

export const appRouter = router({
  user: userRouter,
  // ... other routers
});
\`\`\`

### 3. Use on client

\`\`\`typescript
// Query
const { data } = trpc.user.getById.useQuery({ id: "123" });

// Mutation
const mutation = trpc.user.create.useMutation();
await mutation.mutateAsync({ name: "John", email: "john@example.com" });
\`\`\`
`;
  }

  if (api === "orpc") {
    return `---
description: Add a new oRPC procedure
---

## Create Procedure

### 1. Create or update router file

Location: \`packages/api/src/routers/\`

\`\`\`typescript
// packages/api/src/routers/user.ts
import { z } from "zod";
import { publicProcedure, router } from "../orpc";

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Return data
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      // Create and return
    }),
});
\`\`\`

### 2. Add to root router

Update \`packages/api/src/root.ts\` to include the new router.

### 3. OpenAPI

oRPC automatically generates OpenAPI spec from your procedures.
`;
  }

  return "";
}

function generateDbMigrateCommand(options: ProjectConfig) {
  const { orm, packageManager, database, dbSetup } = options;
  const runCmd = `${packageManager} run`;
  const dlxCmd = getDlxCmd(packageManager);

  let content = `---
description: Run database migrations
---

`;

  if (orm === "drizzle") {
    content += `## Drizzle Migrations

### Push schema changes (development)
\`\`\`bash
${runCmd} db:push
\`\`\`

### Generate migration
\`\`\`bash
${runCmd} db:generate
\`\`\`

### Apply migrations (production)
\`\`\`bash
${runCmd} db:migrate
\`\`\`

### Schema location
\`packages/db/src/schema/\`

### Migrations location
\`packages/db/src/migrations/\`
`;
  }

  if (orm === "prisma") {
    content += `## Prisma Migrations

### Push schema changes (development)
\`\`\`bash
${runCmd} db:push
\`\`\`

### Create migration
\`\`\`bash
${dlxCmd} prisma migrate dev --name <migration-name>
\`\`\`

### Apply migrations (production)
\`\`\`bash
${dlxCmd} prisma migrate deploy
\`\`\`

### Generate client
\`\`\`bash
${dlxCmd} prisma generate
\`\`\`

### Schema location
\`packages/db/prisma/schema.prisma\`
`;
  }

  if (orm === "mongoose") {
    content += `## Mongoose

MongoDB is schemaless, so no migrations needed.
Schema validation is handled at the application level.

### Models location
\`packages/db/src/models/\`
`;
  }

  return content;
}

function generateDbStudioCommand(options: ProjectConfig) {
  const { orm, packageManager } = options;
  const runCmd = `${packageManager} run`;
  const dlxCmd = getDlxCmd(packageManager);

  let content = `---
description: Open database GUI
---

`;

  if (orm === "drizzle") {
    content += `## Drizzle Studio

Open the database GUI:

\`\`\`bash
${runCmd} db:studio
\`\`\`

This opens Drizzle Studio in your browser where you can:
- Browse tables
- View and edit data
- Run queries
`;
  }

  if (orm === "prisma") {
    content += `## Prisma Studio

Open the database GUI:

\`\`\`bash
${dlxCmd} prisma studio
\`\`\`

This opens Prisma Studio in your browser where you can:
- Browse models
- View and edit records
- Filter and sort data
`;
  }

  if (orm === "mongoose") {
    content += `## MongoDB GUI

Use MongoDB Compass or Atlas UI to browse your database.

Connection string is in your \`.env\` file as \`DATABASE_URL\`.
`;
  }

  return content;
}

function generateProjectSpecTemplate(options: ProjectConfig) {
  return `# Project Specification

<!-- Fill in this template to give Claude context about your project -->

## Overview

<!-- Brief description of what this project does -->


## Target Users

<!-- Who will use this application? -->


## Core Features

<!-- List the main features (check off as implemented) -->

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3


## Technical Requirements

### Performance
<!-- Response times, load handling, etc. -->


### Security
<!-- Authentication, authorization, data protection -->


### Accessibility
<!-- WCAG level, screen reader support, etc. -->


## Design Guidelines

### Brand
<!-- Colors, fonts, logo usage -->


### UI/UX
<!-- Design system, component library, interaction patterns -->


## API Requirements

<!-- External APIs, integrations, data formats -->


## Data Model

<!-- Key entities and relationships -->


## Out of Scope

<!-- What this project does NOT include -->

`;
}

function generateFeatureTemplate(options: ProjectConfig) {
  return `# Feature Specification

<!-- Copy this template for each new feature -->

## Feature Name

<!-- Clear, descriptive name -->


## User Story

As a [type of user],
I want [goal/desire],
So that [benefit/value].


## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3


## Technical Details

### Components Needed
<!-- List UI components -->


### API Endpoints
<!-- List required API procedures -->


### Database Changes
<!-- Schema changes needed -->


### State Management
<!-- How state will be managed -->


## Edge Cases

<!-- How to handle unusual situations -->


## Testing Plan

- [ ] Unit tests for:
- [ ] Integration tests for:
- [ ] E2E tests for:


## Design

<!-- Link to designs or describe UI -->


## Dependencies

<!-- Other features or external dependencies -->

`;
}
