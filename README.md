# Better-T-Stack

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations

## Sponsors

<p align="center">
<img src="https://sponsors.amanv.dev/sponsors.png" alt="Sponsors">
</p>

![demo](https://cdn.jsdelivr.net/gh/amanvarshney01/create-better-t-stack/demo.gif)

## Philosophy

- Roll your own stack: you pick only the parts you need, nothing extra.
- Minimal templates: bare-bones scaffolds with zero bloat.
- Latest dependencies: always use current, stable versions by default.
- Free and open source: forever.

## Quick Start

```bash
# Using bun (recommended)
bun create better-t-stack@latest

# Using pnpm
pnpm create better-t-stack@latest

# Using npm
npx create-better-t-stack@latest
```

## Features

- Frontend: React (TanStack Router, React Router, TanStack Start), Next.js, Nuxt, Svelte, Solid, React Native (NativeWind/Unistyles), or none
- Backend: Hono, Express, Fastify, Elysia, Next API Routes, Convex, or none
- API: tRPC or oRPC (or none)
- Runtime: Bun, Node.js, or Cloudflare Workers
- Databases: SQLite, PostgreSQL, MySQL, MongoDB (or none)
- ORMs: Drizzle, Prisma, Mongoose (or none)
- Auth: Better-Auth (optional)
- Addons: Turborepo, PWA, Tauri, Biome, Husky, Starlight, Fumadocs, Ruler, Ultracite, Oxlint
- Examples: Todo, AI
- DB Setup: Turso, Neon, Supabase, Prisma PostgreSQL, MongoDB Atlas, Cloudflare D1, Docker
- Web Deploy: Cloudflare Workers

Type safety end-to-end, clean monorepo layout, and zero lock-in: you choose only what you need.

## Repository Structure

This repository is organized as a monorepo containing:

- **CLI**: [`apps/cli`](apps/cli) - The scaffolding CLI tool
- **Documentation**: [`apps/web`](apps/web) - Official website and documentation

## Documentation

Visit [better-t-stack.dev](https://better-t-stack.dev) for full documentation, guides, and examples. You can also use the visual Stack Builder at `https://better-t-stack.dev/new` to generate a command for your stack.

## Development

```bash
# Clone the repository
git clone https://github.com/AmanVarshney01/create-better-t-stack.git

# Install dependencies
bun install

# Start CLI development
bun dev:cli

# Start website development
bun dev:web
```

## Want to contribute?

Please read the Contribution Guide first and open an issue before starting new features to ensure alignment with project goals.

- Docs: [`Contributing`](/apps/web/content/docs/contributing.mdx)
- Repo guide: [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)

## Star History

<a href="https://www.star-history.com/#AmanVarshney01/create-better-t-stack&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=AmanVarshney01/create-better-t-stack&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=AmanVarshney01/create-better-t-stack&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=AmanVarshney01/create-better-t-stack&type=Date" />
 </picture>
</a>
