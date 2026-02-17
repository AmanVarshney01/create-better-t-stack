<div align="center">
<br>

```
 ____       _   _             _____      _ _     _             _
| __ )  ___| |_| |_ ___ _ __|  ___|   _| | |___| |_ __ _  ___| | __
|  _ \ / _ \ __| __/ _ \ '__| |_ | | | | | / __| __/ _` |/ __| |/ /
| |_) |  __/ |_| ||  __/ |  |  _|| |_| | | \__ \ || (_| | (__|   <
|____/ \___|\__|\__\___|_|  |_|   \__,_|_|_|___/\__\__,_|\___|_|\_\
```

**Compose your fullstack app like a playlist — pick the tracks, we handle the mixing.**

<br>

[![Version](https://img.shields.io/npm/v/create-better-fullstack?style=for-the-badge&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/create-better-fullstack)
&nbsp;
[![Downloads](https://img.shields.io/npm/dm/create-better-fullstack?style=for-the-badge&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/create-better-fullstack)
&nbsp;
[![License](https://img.shields.io/github/license/Marve10s/Better-Fullstack?style=for-the-badge&colorA=18181B&colorB=28CF8D)](LICENSE)

<br>

[Website](https://better-fullstack-web.vercel.app) &nbsp;&bull;&nbsp; [Quick Start](#get-started) &nbsp;&bull;&nbsp; [Stack](#the-stack) &nbsp;&bull;&nbsp; [Contributing](.github/CONTRIBUTING.md)

</div>

<br>

---

<br>

### Get Started

```bash
bunx create-better-fullstack@latest
```

Or jump straight in with a preset:

```bash
bunx create-better-fullstack@latest --template t3     # Next.js + tRPC + Drizzle + Tailwind
bunx create-better-fullstack@latest --template mern   # MongoDB + Express + React + Node
bunx create-better-fullstack@latest --template pern   # PostgreSQL + Express + React + Node
bunx create-better-fullstack@latest --yolo             # Dealer's choice
```

<br>

---

<br>

### The Stack

> 100+ integrations. 4 languages. Everything optional.

<br>

<details>
<summary><strong>Ecosystems</strong></summary>

```
TypeScript     The default — all integrations below are available
Rust           Axum · Actix Web · Leptos · Dioxus · SeaORM · SQLx · tonic (gRPC) · async-graphql
Python         FastAPI · Django · SQLAlchemy · SQLModel · Pydantic · LangChain · CrewAI · Celery
Go             Gin · Echo · GORM · sqlc · gRPC · Cobra · BubbleTea · Zap
```

Start with `--ecosystem rust`, `--ecosystem python`, or `--ecosystem go`.

</details>

<details>
<summary><strong>Application Layer</strong></summary>

```
Frontend       Next.js · Nuxt · SvelteKit · SolidStart · Astro · Qwik · Angular · RedwoodJS · Fresh · React Native
Backend        Hono · Express · Fastify · Elysia · feTS · NestJS · AdonisJS · Nitro · Encore · Convex
API            tRPC · oRPC · ts-rest · GraphQL (Garph)
```

</details>

<details>
<summary><strong>Data Layer</strong></summary>

```
Database       PostgreSQL · MySQL · SQLite · MongoDB
ORM            Drizzle · Prisma · TypeORM · Kysely · MikroORM · Sequelize · Mongoose
Hosting        Turso · Neon · Supabase · PlanetScale · MongoDB Atlas · Cloudflare D1 · Upstash
```

</details>

<details>
<summary><strong>Services</strong></summary>

```
Auth           Better Auth · Clerk · NextAuth · Supabase Auth · Auth0
Payments       Stripe · Polar · Lemon Squeezy · Paddle · Dodo
Email          React Email + Resend · Nodemailer · Postmark · SendGrid · AWS SES · Mailgun
Real-time      Socket.IO · PartyKit · Ably · Pusher · Liveblocks · Yjs
Jobs           BullMQ · Trigger.dev · Inngest · Temporal
```

</details>

<details>
<summary><strong>AI</strong></summary>

```
SDKs           Vercel AI · Mastra · VoltAgent · LangGraph · OpenAI Agents · Google ADK · LangChain · LlamaIndex
```

</details>

<details>
<summary><strong>Frontend Extras</strong></summary>

```
UI             shadcn/ui · Radix · Headless UI · Chakra · Mantine · DaisyUI · NextUI · Park UI
State          Zustand · Jotai · Redux Toolkit · XState · TanStack Store
Forms          TanStack Form · React Hook Form · Formik · Conform
Animation      Framer Motion · GSAP · React Spring
Styling        Tailwind CSS · SCSS · Less
```

</details>

<details>
<summary><strong>DevOps</strong></summary>

```
Testing        Vitest · Playwright · Jest · Cypress
Deploy         Cloudflare · Fly.io · Railway · Docker · SST
Observability  OpenTelemetry · Pino · Winston
Tooling        Turborepo · Biome · Oxlint · Husky · Lefthook · Storybook · MSW
Desktop/PWA    Tauri · PWA · WXT (browser extensions)
Docs           Starlight · Fumadocs
```

</details>

<br>

---

<br>

### CLI Reference

| Flag                 | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `--yes`              | Accept all defaults                            |
| `--yolo`             | Random configuration                           |
| `--no-git`           | Skip git initialization                        |
| `--no-install`       | Skip dependency installation                   |
| `--template <name>`  | Use a preset (`t3`, `mern`, `pern`, `uniwind`) |
| `--ecosystem <lang>` | Start in `rust`, `python`, or `go` mode        |
| `--verbose`          | Show detailed output                           |

<br>

---

<br>

### Star History

<div align="center">
  <a href="https://star-history.com/#Marve10s/Better-Fullstack&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Marve10s/Better-Fullstack&type=Date&theme=dark" />
      <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Marve10s/Better-Fullstack&type=Date" />
      <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Marve10s/Better-Fullstack&type=Date" width="600" />
    </picture>
  </a>
</div>

<br>

---

<br>

### Contributing

See the [Contributing Guide](.github/CONTRIBUTING.md). Open an issue before starting work on new features.

```bash
git clone https://github.com/Marve10s/Better-Fullstack.git && cd Better-Fullstack
bun install
bun dev:cli    # CLI development
bun dev:web    # Website development
```

<br>

### License

MIT

<br>

---

<p align="center">
  Fork of <a href="https://github.com/AmanVarshney01/create-better-t-stack">create-better-t-stack</a> by <a href="https://github.com/AmanVarshney01">Aman Varshney</a>
</p>
