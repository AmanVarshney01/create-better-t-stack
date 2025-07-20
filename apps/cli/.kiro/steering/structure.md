# Project Structure & Organization

## Root Directory Structure
```
create-better-t-stack/
├── src/                    # Source code
├── templates/              # Handlebars templates for code generation
├── dist/                   # Compiled output (generated)
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
└── tsdown.config.ts       # Build configuration
```

## Source Code Organization (`src/`)
```
src/
├── index.ts               # CLI entry point with tRPC router
├── types.ts               # Zod schemas and TypeScript types
├── constants.ts           # Configuration constants and compatibility matrices
├── validation.ts          # Input validation logic
├── helpers/               # Core functionality modules
│   ├── database-providers/    # Database setup implementations
│   ├── project-generation/    # Project scaffolding logic
│   └── setup/                # Feature-specific setup handlers
├── prompts/               # CLI prompt definitions
└── utils/                 # Utility functions
```

## Template Organization (`templates/`)
Templates follow a hierarchical structure matching the feature matrix:
```
templates/
├── base/                  # Base project files
├── frontend/              # Frontend framework templates
│   ├── react/
│   ├── native/
│   ├── nuxt/
│   ├── solid/
│   └── svelte/
├── backend/               # Backend framework templates
├── api/                   # API layer templates (tRPC/oRPC)
├── auth/                  # Authentication templates
├── db/                    # Database and ORM templates
├── addons/                # Additional features
├── examples/              # Example implementations
└── deploy/                # Deployment configurations
```

## Key Architectural Principles

### File Naming Conventions
- **Kebab-case**: For directories and template files
- **PascalCase**: For TypeScript types and schemas
- **camelCase**: For variables and functions
- **SCREAMING_SNAKE_CASE**: For constants

### Module Organization
- **Single responsibility**: Each helper module handles one specific concern
- **Feature-based grouping**: Related functionality grouped together
- **Template mirroring**: Template structure mirrors generated project structure

### Configuration Management
- **Centralized constants**: All configuration in `constants.ts`
- **Compatibility matrices**: Define valid feature combinations
- **Default configurations**: Sensible defaults for quick setup
- **Schema validation**: All inputs validated with Zod

### Template System
- **Handlebars templating**: `.hbs` files for dynamic content
- **Conditional rendering**: Templates adapt based on selected features
- **Nested structure**: Templates organized by technology stack
- **Shared components**: Common templates reused across configurations