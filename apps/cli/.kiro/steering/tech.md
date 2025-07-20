# Tech Stack & Build System

## Core Technologies
- **Language**: TypeScript with strict mode enabled
- **Runtime**: Node.js, Bun, or Cloudflare Workers
- **Build Tool**: tsdown for CLI compilation
- **Package Manager**: npm, pnpm, or bun (auto-detected)
- **Module System**: ESM (ES Modules)

## CLI Framework
- **tRPC CLI**: Used for command routing and type-safe CLI operations
- **Clack Prompts**: Interactive CLI prompts with consistent UX
- **Consola**: Logging and console output
- **Zod**: Runtime type validation and schema definitions

## Key Dependencies
- **Template Engine**: Handlebars for file templating
- **File Operations**: fs-extra for enhanced file system operations
- **Process Execution**: execa for running shell commands
- **Code Manipulation**: ts-morph for TypeScript AST manipulation
- **Path Matching**: globby for file pattern matching

## Build & Development Commands

### Development
```bash
npm run dev          # Watch mode compilation
npm run build        # Production build
npm run check-types  # TypeScript type checking
npm run check        # Biome linting and formatting
npm run test         # Run test suite
```

### Publishing
```bash
npm run prepublishOnly  # Automatic build before publish
```

## Code Quality Tools
- **Biome**: Linting and code formatting
- **TypeScript**: Strict type checking
- **Vitest**: Testing framework

## Architecture Patterns
- **Schema-first**: All inputs validated with Zod schemas
- **Type-safe CLI**: tRPC procedures for command handling
- **Template-driven**: Handlebars templates for code generation
- **Compatibility validation**: Matrix-based feature compatibility checking
- **Telemetry**: Optional usage analytics with PostHog