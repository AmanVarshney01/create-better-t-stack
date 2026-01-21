# Better Fullstack CLI

A CLI-first toolkit for building Full Stack applications. Skip the configuration. Ship the code.

## Quick Start

```bash
# Using bun (recommended)
bun create better-fullstack@latest

# Using pnpm
pnpm create better-fullstack@latest

# Using npm
npx create-better-fullstack@latest
```

## Usage

```bash
Usage: create-better-fullstack [project-directory] [options]

Options:
  -V, --version                   Output the version number
  -y, --yes                       Use default configuration
  --yolo                          Random configuration (experimental)
  --database <type>               Database type (none, sqlite, postgres, mysql, mongodb)
  --orm <type>                    ORM type (drizzle, prisma, mongoose, typeorm, kysely, mikroorm, sequelize, none)
  --auth <type>                   Authentication (better-auth, clerk, nextauth, none)
  --payments <type>               Payments (polar, stripe, lemon-squeezy, paddle, dodo, none)
  --frontend <types...>           Frontend types
  --backend <framework>           Backend framework
  --runtime <runtime>             Runtime (bun, node, workers, none)
  --api <type>                    API type (trpc, orpc, ts-rest, garph, none)
  --addons <types...>             Additional addons
  --examples <types...>           Examples to include (todo, ai, none)
  --git / --no-git                Initialize git repository
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install / --no-install        Install dependencies
  --db-setup <setup>              Database setup
  -h, --help                      Display help
```

## Examples

```bash
# Default configuration
npx create-better-fullstack --yes

# With specific options
npx create-better-fullstack --database postgres --orm drizzle --auth better-auth --addons pwa biome

# Elysia backend with Node.js
npx create-better-fullstack --backend elysia --runtime node

# Multiple frontends (web + native)
npx create-better-fullstack --frontend tanstack-router native-bare
```

## Project Structure

```
my-app/
├── apps/
│   ├── web/          # Frontend application
│   ├── server/       # Backend API
│   ├── native/       # (optional) Mobile application
│   └── docs/         # (optional) Documentation site
├── packages/         # Shared packages
└── README.md
```
