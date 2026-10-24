# Options and compatibility

The schema is the source of truth: `bts_get_schema`, or `npx create-better-t-stack@latest schema --name createInput`. This page lists the values at the time of writing.

## Values

| Field                       | Values                                                                                                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend` (array)          | `tanstack-router`, `react-router`, `tanstack-start`, `next`, `nuxt`, `svelte`, `solid`, `astro`, `native-bare`, `native-uniwind`, `native-unistyles`, `none`                                    |
| `backend`                   | `hono`, `express`, `fastify`, `elysia`, `convex`, `self`, `none`                                                                                                                                |
| `runtime`                   | `bun`, `node`, `workers`, `none`                                                                                                                                                                |
| `api`                       | `trpc`, `orpc`, `none`                                                                                                                                                                          |
| `database`                  | `sqlite`, `postgres`, `mysql`, `mongodb`, `none`                                                                                                                                                |
| `orm`                       | `drizzle`, `prisma`, `mongoose`, `none`                                                                                                                                                         |
| `auth`                      | `better-auth`, `clerk`, `none`                                                                                                                                                                  |
| `payments`                  | `polar`, `none`                                                                                                                                                                                 |
| `addons` (array)            | `pwa`, `tauri`, `electrobun`, `starlight`, `fumadocs`, `biome`, `oxlint`, `ultracite`, `husky`, `lefthook`, `turborepo`, `nx`, `vite-plus`, `mcp`, `skills`, `opentui`, `wxt`, `evlog`, `axiom` |
| `examples` (array)          | `todo`, `ai`                                                                                                                                                                                    |
| `dbSetup`                   | `turso`, `neon`, `prisma-postgres`, `planetscale`, `mongodb-atlas`, `supabase`, `d1`, `docker`, `none`                                                                                          |
| `webDeploy`, `serverDeploy` | `cloudflare`, `vercel`, `prisma`, `docker`, `none`                                                                                                                                              |
| `packageManager`            | `bun`, `pnpm`, `npm`                                                                                                                                                                            |
| `template` (CLI only)       | `mern`, `pern`, `t3`, `uniwind`, `none`                                                                                                                                                         |
| `directoryConflict`         | `merge`, `overwrite`, `increment`, `error`                                                                                                                                                      |

`frontend` lists app surfaces, not styling. An empty array and `["none"]` mean the same thing. Never mix `"none"` with other values.

## Compatibility rules that come up most

- A database needs an ORM, and an ORM needs a database.
- `mongodb` works with `mongoose` or `prisma`, not `drizzle`.
- `runtime: workers` needs `backend: hono` and `serverDeploy: cloudflare`.
- `backend: convex` needs `database: none`. Convex is the data layer.
- `backend: self` means the web framework serves the API. It works with `next`, `tanstack-start`, `nuxt`, `svelte`, `solid` and `astro`.
- Pick at most one web frontend. One native frontend can sit next to it.
- `turborepo`, `nx` and `vite-plus` are task runners. Pick at most one.
- `axiom` can only be chosen at creation, never added later.

A plan or dry run names the exact conflict, so run one when you're unsure.

## Nested options

`addonOptions` configures prompt-driven addons: the Fumadocs template, search and AI chat, the WXT and OpenTUI templates, the MCP addon's servers and agents, and the Skills addon's sources. `dbSetupOptions` controls database provisioning. Check their shape with `schema --name addonOptions` and `schema --name dbSetupOptions`. The hosted MCP server doesn't accept either.
