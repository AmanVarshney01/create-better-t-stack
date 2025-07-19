# Project Structure & Organization

## Monorepo Layout
```
better-t-stack/
├── apps/                    # Applications
│   ├── cli/                # CLI tool (create-better-t-stack)
│   └── web/                # Documentation website
├── packages/               # Shared packages (currently empty)
├── .changeset/            # Version management
├── .github/               # GitHub workflows and templates
├── .husky/                # Git hooks
└── .kiro/                 # Kiro IDE configuration
```

## CLI Application Structure (`apps/cli/`)
```
apps/cli/
├── src/
│   ├── helpers/           # Core functionality
│   │   ├── database-providers/    # DB setup (Turso, Neon, Supabase, etc.)
│   │   ├── project-generation/    # Project scaffolding logic
│   │   └── setup/                 # Feature setup (auth, API, addons, etc.)
│   ├── prompts/           # Interactive CLI prompts
│   ├── utils/             # Utility functions
│   ├── index.ts           # Main CLI entry point (tRPC router)
│   ├── types.ts           # Zod schemas and TypeScript types
│   └── validation.ts      # Input validation
├── templates/             # Handlebars templates for code generation
│   ├── addons/           # PWA, Tauri, Biome, Husky, etc.
│   ├── api/              # tRPC, oRPC configurations
│   ├── auth/             # Better-Auth setup
│   ├── backend/          # Hono, Express, Elysia, etc.
│   ├── db/               # Drizzle, Prisma, Mongoose configs
│   ├── frontend/         # React, Svelte, Nuxt, etc.
│   └── examples/         # Todo app, AI chat examples
└── dist/                 # Compiled output
```

## Web Application Structure (`apps/web/`)
```
apps/web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (home)/      # Marketing pages
│   │   ├── docs/        # Documentation
│   │   └── api/         # API routes
│   ├── components/       # React components
│   └── lib/             # Utilities and configurations
├── content/docs/         # MDX documentation files
├── public/              # Static assets
└── scripts/             # Build scripts (analytics, schema generation)
```

## Key Organizational Principles

### Template Organization
- Templates mirror the structure of generated projects
- Each template category (frontend, backend, db, etc.) has subdirectories for different options
- Handlebars (.hbs) files for dynamic content generation
- Static files copied as-is during project generation

### Helper Functions Structure
- `database-providers/`: Database-specific setup logic
- `project-generation/`: Core scaffolding and file generation
- `setup/`: Feature-specific configuration (auth, API layers, addons)
- Clear separation between prompting, validation, and execution

### Configuration Files
- Root-level configs apply to entire monorepo (turbo.json, biome.json)
- App-specific configs in respective directories
- Shared TypeScript config inheritance
- Environment-specific configurations (development vs production)

### Naming Conventions
- kebab-case for file and directory names
- PascalCase for React components and TypeScript types
- camelCase for functions and variables
- Descriptive names that indicate purpose (e.g., `database-providers`, `project-generation`)

### Import/Export Patterns
- ES modules throughout
- Barrel exports from index files where appropriate
- Relative imports for local files
- Absolute imports for external packages
- Clear separation between types and runtime code