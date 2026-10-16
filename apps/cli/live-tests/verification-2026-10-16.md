# Supabase stack verification — 2026-10-16

Verified stable Supabase CLI **2.121.0** with its experimental stack runtime on macOS Apple silicon. The container daemon was unavailable, so automatic setup selected the **native** runtime. No Supabase account or hosted database was used.

## Generated applications

All cases use PostgreSQL, Better Auth, the todo example, automatic Supabase setup, Git initialization, and no addons or deployment targets. Each case must pass installation, assigned-URL verification, migration generation/application, repeated migration application, database push, typechecking, production build, development and production runtime checks, and stack cleanup.

| Frontend        | Backend | API  | Package manager | ORM     | Run directory  |
| --------------- | ------- | ---- | --------------- | ------- | -------------- |
| TanStack Router | Hono    | tRPC | pnpm            | Drizzle | `faffac25e288` |
| TanStack Router | Hono    | tRPC | pnpm            | Prisma  | `faffac25e288` |
| Nuxt            | self    | oRPC | Bun             | Drizzle | `38244f6859e1` |
| Nuxt            | self    | oRPC | Bun             | Prisma  | `38244f6859e1` |
| TanStack Router | Hono    | tRPC | npm             | Drizzle | `408a76d48024` |
| TanStack Router | Hono    | tRPC | npm             | Prisma  | `1df3dfc64d7d` |

Results: **6/6 selected cases passed**. Every recorded Supabase stack for these runs was destroyed successfully. The successful npm cases are recorded across two run directories after fixing the runner’s hoisted Prisma CLI lookup.

Browser checks cover signup, sign-in, sign-out, protected navigation, session persistence, and todo create/update/delete. Direct PostgreSQL queries verify the user and todo records. A saved todo and account survive the development-to-production application restart. Nuxt also verifies server-rendered authentication and protected RPC data with JavaScript disabled.

The runner verifies that the CLI wrote both `DATABASE_URL` and `DIRECT_URL` to the correct app environment and that both match the actual stack's JSON status output. Supabase cases use an isolated `SUPABASE_HOME` under `apps/cli/.smoke/supabase`; downloads are cached across cases.

To reproduce a pair, run the following from the repository root. Omit `orm` to enumerate both supported PostgreSQL ORMs. The final npm/Prisma rerun selected `"orm":"prisma"` explicitly. For the Nuxt pair, set `frontend` to `["nuxt"]`, `backend` to `"self"`, `runtime` to `"none"`, `api` to `"orpc"`, and `packageManager` to `"bun"`.

```sh
bun run build:cli
bun run test:live run --where '{"frontend":["tanstack-router"],"backend":"hono","runtime":"bun","database":"postgres","dbSetup":"supabase","api":"trpc","auth":"better-auth","payments":"none","webDeploy":"none","serverDeploy":"none","packageManager":"pnpm","addons":[],"examples":["todo"]}'
```

Result directories are private, ignored artifacts under `apps/cli/.smoke/live/`. Each records the source fingerprint, selections, redacted command logs, browser traces, and cleanup state. Inspect a recorded run with `bun run test:live report --directory apps/cli/.smoke/live/RUN_ID`.

## Integration findings

Supabase includes the Git branch in its local stack identity. A real reproduction showed that starting a stack before `git init` made the next `status` command exit with code 1. Supabase setup now prepares the Git repository before starting the database, then the existing post-scaffold step commits the completed project. The regression suite checks Git readiness before provider commands; every case above also verifies status after the generated project's initial commit.

The npm/Prisma run also exposed a runner assumption that Prisma lived in the database workspace’s `node_modules`. The runner now resolves Prisma’s exported CLI entrypoint from that workspace, supporting npm hoisting as well as Bun and pnpm. A regression fixture covers a hoisted package with separate package-root and CLI exports.

A separate native stop/start check retained the assigned database URL and a saved SQL row. Its disposable stack was destroyed afterward.

Cleanup lists stacks in the isolated test home, matches exact project roots, and destroys only their explicit stack IDs. Regression cases cover branch changes, unrelated project roots, initialization failing before stack creation, and failed cleanup remaining pending for retry. An interrupted exploratory setup was cleaned up through the runner's cleanup command.

## Repository checks and limits

- `bun run check`: passed.
- `bun run build:cli`: passed, including publint.
- CLI source and test typechecks: passed.
- Full CLI suite: **877 passed, 65 skipped, 0 failed**. The skips are optional suites; they are not counted as runtime passes.
- Shared types suite: **7 passed**.
- Focused live-runner suites: **16 passed** across `runner.test.ts` and `supabase.test.ts`.
- Focused Supabase setup suite: **15 passed**, including Bun/npm/pnpm, split/fullstack environments, preserved credentials/configuration, invalid status output, and provider failures. These cases are included in the full CLI total.

This verifies the selected applications on the native macOS runtime. Docker/Podman execution, Linux, Windows, native mobile apps, hosted Supabase, and cloud deployment against Supabase were not exercised. The experimental stack API is pinned to the verified stable CLI release; the CLI v3 prerelease is not used.

Sources: [Supabase 2.121.0 release notes](https://github.com/supabase/cli/releases/tag/v2.121.0), [runtime requirements](https://supabase.com/docs/guides/local-development/docker-and-native-runtimes), [multiple local projects and experimental activation](https://supabase.com/docs/guides/local-development/running-multiple-local-projects).
