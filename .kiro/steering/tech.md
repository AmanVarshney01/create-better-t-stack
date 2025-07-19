# Technology Stack & Build System

## Build System
- **Monorepo**: Turborepo for optimized builds and task orchestration
- **Package Manager**: Bun (primary), with npm/pnpm support
- **Node Version**: >= 20 (specified in engines)
- **TypeScript**: v5.8.3 across all packages

## Core Technologies

### CLI Application (`apps/cli`)
- **Runtime**: Node.js with ES modules
- **Build Tool**: tsdown for TypeScript compilation
- **CLI Framework**: tRPC CLI with @clack/prompts for interactive prompts
- **Template Engine**: Handlebars for code generation
- **File Operations**: fs-extra, globby for file system operations
- **Code Manipulation**: ts-morph for TypeScript AST manipulation

### Web Application (`apps/web`)
- **Framework**: Next.js 15.3.5 with React 19
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Documentation**: Fumadocs for MDX-based docs
- **Deployment**: OpenNext for Cloudflare deployment
- **Analytics**: PostHog integration

## Code Quality & Standards
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Git Hooks**: Husky with lint-staged for pre-commit checks
- **Changesets**: For version management and publishing

## Common Commands

### Development
```bash
# Start all development servers
bun dev

# Start specific app
bun dev:cli    # CLI development with watch mode
bun dev:web    # Web app development

# Build all packages
bun build

# Build specific packages
bun build:cli
bun build:web
```

### Code Quality
```bash
# Format and lint all files
bun format

# Type checking
bun check

# Run tests (where available)
bun test
```

### Publishing & Deployment
```bash
# Publish CLI package
bun publish-packages

# Deploy web app to Cloudflare
bun deploy:web
```

## Template System
- Templates stored in `apps/cli/templates/` with Handlebars (.hbs) files
- Organized by feature: addons, api, auth, backend, db, frontend, etc.
- Dynamic code generation based on user selections
- Support for multiple frameworks and configurations

## Development Patterns
- ES modules throughout (type: "module")
- Strict TypeScript configuration
- Zod for runtime validation and type safety
- Consistent error handling with consola
- Telemetry integration (can be disabled via BTS_TELEMETRY_DISABLED=1)