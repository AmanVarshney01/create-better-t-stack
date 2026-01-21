# Better Fullstack

A CLI-first toolkit for building Full Stack applications. Skip the configuration. Ship the code.

**Website:** [better-fullstack-web.vercel.app](https://better-fullstack-web.vercel.app/)

> Fork of [create-better-t-stack](https://github.com/AmanVarshney01/create-better-t-stack) by [Aman Varshney](https://github.com/AmanVarshney01)

## Quick Start

```bash
bun create better-fullstack@latest
```

```bash
pnpm create better-fullstack@latest
```

```bash
npx create-better-fullstack@latest
```

## What You Get

Pick only what you need. Everything is optional.

### Frontend

React (TanStack Router, React Router, TanStack Start), Next.js, Nuxt, SvelteKit, SolidStart, Astro, Qwik, Angular, RedwoodJS, Fresh, React Native (NativeWind, Unistyles)

### Backend

Hono, Express, Fastify, Elysia, feTS, NestJS, AdonisJS, Nitro, Encore, Convex

### Database & ORM

SQLite, PostgreSQL, MySQL, MongoDB with Drizzle, Prisma, TypeORM, Kysely, MikroORM, Sequelize, or Mongoose

### API Layer

tRPC, oRPC, ts-rest, Garph (GraphQL)

### Auth & Payments

Better Auth, Clerk, NextAuth | Polar, Stripe, Lemon Squeezy, Paddle, Dodo

### AI SDKs

Vercel AI, Mastra, VoltAgent, LangGraph, OpenAI Agents, Google ADK, ModelFusion, LangChain, LlamaIndex

### State & Forms

Zustand, Jotai, Redux Toolkit, XState, TanStack Store | TanStack Form, React Hook Form, Formik, Conform

### Testing

Vitest, Playwright, Jest, Cypress

### Real-time & Jobs

Socket.IO, PartyKit, Ably, Pusher, Liveblocks, Yjs | BullMQ, Trigger.dev, Inngest, Temporal

### Email

React Email, Resend, Nodemailer, Postmark, SendGrid, AWS SES, Mailgun, Plunk

### UI & Styling

Tailwind CSS, shadcn/ui, Radix UI, Headless UI, Chakra UI, Mantine, DaisyUI, NextUI, Park UI | Framer Motion, GSAP, React Spring

### Tooling

Turborepo, Biome, Oxlint, Husky, Lefthook, Storybook, MSW

### Docs & Desktop

Starlight, Fumadocs | Tauri, PWA, WXT (Browser Extensions)

### Infra & Observability

Turso, Neon, Supabase, PlanetScale, MongoDB Atlas, Cloudflare D1 | Upstash Redis, OpenTelemetry, Pino, Winston

### Rust Ecosystem

Axum, Actix Web | Leptos, Dioxus | SeaORM, SQLx | tonic (gRPC), async-graphql

## Templates

Start with a pre-configured stack:

```bash
bun create better-fullstack --template t3      # T3-style stack
bun create better-fullstack --template mern    # MongoDB, Express, React, Node
bun create better-fullstack --template pern    # PostgreSQL, Express, React, Node
```

## Flags

```bash
--yes          # Accept defaults
--yolo         # Random configuration
--no-git       # Skip git init
--no-install   # Skip dependency installation
```

## Development

```bash
git clone https://github.com/Marve10s/Better-Fullstack.git
cd Better-Fullstack
bun install
bun dev:cli    # CLI development
bun dev:web    # Website development
```

## Contributing

See [Contributing Guide](.github/CONTRIBUTING.md). Open an issue before starting new features.

## License

MIT
