<div align="center">

<br>

```
  ██████╗  ███████╗████████╗████████╗███████╗██████╗
  ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
  ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
  ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
  ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
  ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

  ███████╗██╗   ██╗██╗     ██╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗
  ██╔════╝██║   ██║██║     ██║     ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
  █████╗   ██║   ██║██║     ██║     ███████╗   ██║   ███████║██║     █████╔╝
  ██╔══╝   ██║   ██║██║     ██║     ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
  ██║     ╚██████╔╝███████╗███████╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗
  ╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
```

**Compose your fullstack app like a playlist — pick the tracks, we handle the mixing.**

<br>

[![Version](https://img.shields.io/npm/v/create-better-fullstack?style=for-the-badge&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/create-better-fullstack)
&nbsp;
[![Downloads](https://img.shields.io/npm/dm/create-better-fullstack?style=for-the-badge&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/create-better-fullstack)
&nbsp;
[![License](https://img.shields.io/github/license/Marve10s/Better-Fullstack?style=for-the-badge&colorA=18181B&colorB=28CF8D)](LICENSE)

<br>

[Website](https://better-fullstack-web.vercel.app) &nbsp;&bull;&nbsp; [Quick Start](#-quick-start) &nbsp;&bull;&nbsp; [Stack](#-the-stack) &nbsp;&bull;&nbsp; [Contributing](#-contributing)

</div>

<br>

## ⚡ Quick Start

```bash
# npm
npx create-better-fullstack@latest

# pnpm
pnpm create better-fullstack@latest

# bun
bunx create-better-fullstack@latest
```

The interactive CLI walks you through every choice — frontend, backend, database, auth, and more.

<br>

## 🧩 The Stack

> **100+ integrations. 4 ecosystems. Everything optional.**

<table>
<tr><td>

### Ecosystems

|                |                                                                                   |
| -------------- | --------------------------------------------------------------------------------- |
| **TypeScript** | The default — all integrations below are available                                |
| **Rust**       | Axum · Actix Web · Leptos · Dioxus · SeaORM · SQLx · tonic · async-graphql        |
| **Python**     | FastAPI · Django · SQLAlchemy · SQLModel · Pydantic · LangChain · CrewAI · Celery |
| **Go**         | Gin · Echo · GORM · sqlc · gRPC · Cobra · BubbleTea · Zap                         |

</td></tr>
</table>

<details>
<summary><strong>Application Layer</strong></summary>
<br>

| Category     | Options                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------- |
| **Frontend** | Next.js · Nuxt · SvelteKit · SolidStart · Astro · Qwik · Angular · RedwoodJS · Fresh · React Native |
| **Backend**  | Hono · Express · Fastify · Elysia · feTS · NestJS · AdonisJS · Nitro · Encore · Convex              |
| **API**      | tRPC · oRPC · ts-rest · GraphQL (Garph)                                                             |

</details>

<details>
<summary><strong>Data Layer</strong></summary>
<br>

| Category     | Options                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| **Database** | PostgreSQL · MySQL · SQLite · MongoDB                                           |
| **ORM**      | Drizzle · Prisma · TypeORM · Kysely · MikroORM · Sequelize · Mongoose           |
| **Hosting**  | Turso · Neon · Supabase · PlanetScale · MongoDB Atlas · Cloudflare D1 · Upstash |

</details>

<details>
<summary><strong>Services</strong></summary>
<br>

| Category      | Options                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| **Auth**      | Better Auth · Clerk · NextAuth · Supabase Auth · Auth0                      |
| **Payments**  | Stripe · Polar · Lemon Squeezy · Paddle · Dodo                              |
| **Email**     | React Email + Resend · Nodemailer · Postmark · SendGrid · AWS SES · Mailgun |
| **Real-time** | Socket.IO · PartyKit · Ably · Pusher · Liveblocks · Yjs                     |
| **Jobs**      | BullMQ · Trigger.dev · Inngest · Temporal                                   |

</details>

<details>
<summary><strong>AI</strong></summary>
<br>

| Category | Options                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------ |
| **SDKs** | Vercel AI · Mastra · VoltAgent · LangGraph · OpenAI Agents · Google ADK · LangChain · LlamaIndex |

</details>

<details>
<summary><strong>Frontend Extras</strong></summary>
<br>

| Category      | Options                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| **UI**        | shadcn/ui · Radix · Headless UI · Chakra · Mantine · DaisyUI · NextUI · Park UI |
| **State**     | Zustand · Jotai · Redux Toolkit · XState · TanStack Store                       |
| **Forms**     | TanStack Form · React Hook Form · Formik · Conform                              |
| **Animation** | Framer Motion · GSAP · React Spring                                             |
| **Styling**   | Tailwind CSS · SCSS · Less                                                      |

</details>

<details>
<summary><strong>DevOps & Tooling</strong></summary>
<br>

| Category          | Options                                                         |
| ----------------- | --------------------------------------------------------------- |
| **Testing**       | Vitest · Playwright · Jest · Cypress                            |
| **Deploy**        | Cloudflare · Fly.io · Railway · Docker · SST                    |
| **Observability** | OpenTelemetry · Pino · Winston                                  |
| **Tooling**       | Turborepo · Biome · Oxlint · Husky · Lefthook · Storybook · MSW |
| **Desktop/PWA**   | Tauri · PWA · WXT (browser extensions)                          |
| **Docs**          | Starlight · Fumadocs                                            |

</details>

<br>

## 🔧 CLI Flags

| Flag                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `--yes`              | Accept all defaults                            |
| `--yolo`             | Random configuration                           |
| `--template <name>`  | Use a preset (`t3`, `mern`, `pern`, `uniwind`) |
| `--ecosystem <lang>` | Start in `rust`, `python`, or `go` mode        |
| `--no-git`           | Skip git initialization                        |
| `--no-install`       | Skip dependency installation                   |
| `--verbose`          | Show detailed output                           |

<br>

## 📊 Star History

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

## 🤝 Contributing

See the [Contributing Guide](.github/CONTRIBUTING.md). Open an issue before starting work on new features.

```bash
git clone https://github.com/Marve10s/Better-Fullstack.git && cd Better-Fullstack
bun install
bun dev:cli    # CLI development
bun dev:web    # Website development
```

<br>

## License

MIT

---

<p align="center">
  Fork of <a href="https://github.com/AmanVarshney01/create-better-t-stack">create-better-t-stack</a> by <a href="https://github.com/AmanVarshney01">Aman Varshney</a>
</p>
