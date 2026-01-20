# Better Fullstack

> **Note:** This project is a fork of [create-better-t-stack](https://github.com/AmanVarshney01/create-better-t-stack) created by [Aman Varshney](https://github.com/AmanVarshney01).

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations.

## Philosophy

- Roll your own stack: you pick only the parts you need, nothing extra.
- Minimal templates: bare-bones scaffolds with zero bloat.
- Latest dependencies: always use current, stable versions by default.
- Free and open source: forever.

## Quick Start

```bash
# Using bun (recommended)
bun create better-fullstack@latest

# Using pnpm
pnpm create better-fullstack@latest

# Using npm
npx create-better-fullstack@latest
```

## Features

- Frontend: React (TanStack Router, React Router, TanStack Start), Next.js, Nuxt, Svelte, Solid, React Native (NativeWind/Unistyles), or none
- Backend: Hono, Express, Fastify, Elysia, Next API Routes, Convex, or none
- API: tRPC or oRPC (or none)
- Runtime: Bun, Node.js, or Cloudflare Workers
- Databases: SQLite, PostgreSQL, MySQL, MongoDB (or none)
- ORMs: Drizzle, Prisma, Mongoose (or none)
- Auth: Better-Auth (optional)
- Addons: Turborepo, PWA, Tauri, Biome, Lefthook, Husky, Starlight, Fumadocs, Ruler, Ultracite, Oxlint
- Examples: Todo, AI
- DB Setup: Turso, Neon, Supabase, Prisma PostgreSQL, MongoDB Atlas, Cloudflare D1, Docker
- Web Deploy: Cloudflare Workers

Type safety end-to-end, clean monorepo layout, and zero lock-in: you choose only what you need.

## Repository Structure

This repository is organized as a monorepo containing:

- **CLI**: [`apps/cli`](apps/cli) - The scaffolding CLI tool
- **Website**: [`apps/web`](apps/web) - Official website

## Development

```bash
# Clone the repository
git clone https://github.com/Marve10s/Better-Fullstack.git

# Install dependencies
bun install

# Start CLI development
bun dev:cli

# Start website development
bun dev:web
```

## Contributing

Please read the [Contributing Guide](.github/CONTRIBUTING.md) first and open an issue before starting new features to ensure alignment with project goals.

## License

MIT
