# Selected live verification — 2026-10-02

The CLI was rebuilt from the source changes on `test/live-deployments`. Every case below passed installation, typechecking, builds, authentication and todo checks in a real browser, direct database assertions, persistence across restarts or deployment stages, and recorded cleanup. Nuxt dashboards were also checked with JavaScript disabled.

These selections cover the outstanding handoff batches; they do not certify the complete combination matrix or providers without implemented verification adapters.

## Repository checks

- `bun run check`: passed.
- `bun run build:cli`: passed, including publint.
- CLI and CLI-test typechecks: passed.
- Template-generator typecheck: passed.
- `BTS_MATRIX_MODE=smoke bun test` in `apps/cli`: 1,080 passed, 56 skipped, zero failures.
- Website and shared-type tests: 86 passed, zero failures.

## Generated-build CI follow-up

The first GitHub Actions run passed the main test suite but failed seven generated-build shards at Alchemy CLI startup. The pinned Effect platform release candidates resolved their transitive `@effect/platform-node-shared` caret dependency to the incompatible stable release. Generated Alchemy workspaces now override that dependency to match their Effect version, using the appropriate Bun/npm or pnpm workspace configuration.

After the fix, `workers-clerk-hono` (Bun) and `tanstack-start-axiom-pnpm` passed fresh installation, Alchemy CLI startup, typechecks, and builds. Twelve dependency-generation regression cases cover Cloudflare, Prisma hosting, Axiom, and stacks without Alchemy across Bun, npm, and pnpm. The full GitHub generated-build matrix must also pass before merge.

## Runtime cases

Every case uses Better Auth and the todo example, with no addons. Local cases run development and production servers; Vercel cases run production and preview deployments. Preview access without a bypass is checked, then browser requests use a project-scoped bypass.

| Batch                         | Frontend        | Backend | Package manager | Database setup  | ORM     | Result directory |
| ----------------------------- | --------------- | ------- | --------------- | --------------- | ------- | ---------------- |
| SQLite                        | solid           | hono    | npm             | none            | drizzle | `bc1e94b53c02`   |
| SQLite                        | react-router    | hono    | bun             | none            | drizzle | `7b3d329bc012`   |
| SQLite                        | tanstack-router | hono    | bun             | none            | drizzle | `dfefe51ebb46`   |
| SQLite                        | next            | hono    | bun             | none            | drizzle | `2844bf1b0ddb`   |
| SQLite                        | nuxt            | hono    | bun             | none            | drizzle | `419c7363a7e3`   |
| SQLite                        | svelte          | hono    | bun             | none            | drizzle | `76dbd8b01fba`   |
| SQLite                        | astro           | hono    | bun             | none            | drizzle | `3f5648377e74`   |
| SQLite                        | solid           | hono    | bun             | none            | drizzle | `ea171ad05e8b`   |
| SQLite                        | tanstack-start  | hono    | bun             | none            | drizzle | `6e39ad50aeed`   |
| SQLite                        | next            | self    | bun             | none            | drizzle | `7cd15596da32`   |
| SQLite                        | nuxt            | self    | bun             | none            | drizzle | `a4152fa3103a`   |
| SQLite                        | svelte          | self    | bun             | none            | drizzle | `9683b92381c6`   |
| SQLite                        | astro           | self    | bun             | none            | drizzle | `a6e19d9be2b2`   |
| SQLite                        | solid           | self    | bun             | none            | drizzle | `77d18018020f`   |
| SQLite                        | tanstack-start  | self    | bun             | none            | drizzle | `d87103c1f85f`   |
| SQLite                        | solid           | self    | npm             | none            | drizzle | `37db2e500218`   |
| SQLite                        | solid           | hono    | pnpm            | none            | drizzle | `5393f62bca76`   |
| SQLite                        | solid           | self    | pnpm            | none            | drizzle | `45baf27a2269`   |
| SQLite                        | nuxt            | self    | bun             | none            | prisma  | `ec04d87e0fa3`   |
| Postgres                      | tanstack-router | hono    | bun             | neon            | drizzle | `cd5058f29231`   |
| Postgres                      | next            | hono    | bun             | neon            | prisma  | `a82b257fc6d3`   |
| Postgres                      | nuxt            | self    | bun             | neon            | prisma  | `f8f7383130b0`   |
| Postgres                      | nuxt            | self    | bun             | prisma-postgres | prisma  | `47523279cba0`   |
| Postgres                      | nuxt            | hono    | bun             | prisma-postgres | drizzle | `5456b32f3d37`   |
| Vercel production and preview | nuxt            | hono    | bun             | neon            | drizzle | `9c2c786b2be1`   |
| Vercel production and preview | next            | hono    | bun             | prisma-postgres | prisma  | `6655b17b5dd6`   |

Results: **19/19 SQLite cases, 5/5 Postgres cases, and 2/2 Vercel fixtures (four deployment stages)**.

Result directories are private, ignored artifacts under `apps/cli/.smoke/live/`. Inspect an existing result with `bun run test:live report --directory apps/cli/.smoke/live/RUN_ID`. The table records successful runs after their relevant fixes; earlier failed attempts remain available locally for diagnosis.

All recorded Neon and Vercel resources for these successful runs were cleaned up. Prisma Postgres databases use the requested two-hour expiration instead of immediate deletion.

The runtime fixtures use Bun 1.4.2 and Node 26.7.0 on macOS. The runner remains local-only; these live deployments are not wired into CI or releases.

## Official documentation audit follow-up

The [documentation/type audit](./docs-audit-2026-10-02.md) covers the final corrections and their official sources. Standard Better Auth packages are aligned at 1.7.7; Solid runtime/compiler packages use rc.13 with matching router, Vite plugin and Query releases. The historical batches above predate some audit corrections.

- Root formatting/lint, CLI/test/template-generator typechecks, CLI build/publint and template-generator build/publint passed.
- Default CLI suite: 803 passed, 57 skipped, zero failures.
- CLI smoke creation matrix: 1,087 passed, 57 skipped, zero failures.
- Website/shared-type tests: 86 passed, zero failures.
- Focused deployment/runner regressions: 94 passed, one optional browser test skipped.
- Opt-in bypass-cookie browser regression: one passed, 40 assertions. It covers browser, JavaScript-disabled SSR and HTTP contexts, external assets and redirects, and bootstrap redirects with no credential disclosure.
- Fresh `solid-v2-prisma-web` and `nuxt-sqlite-fullstack` generated-build samples passed installation, typechecks, builds and HTTP runtime checks. The Solid production entry boots without the duplicate exports reported by CI.

Version-aligned local runtime cases (Better Auth 1.7.7; development and production):

| Frontend | Backend | Package manager | SQLite ORM | Result directory |
| -------- | ------- | --------------- | ---------- | ---------------- |
| solid    | hono    | bun             | drizzle    | `dda641449be6`   |
| solid    | self    | bun             | drizzle    | `50cc652d1ec5`   |
| solid    | hono    | npm             | drizzle    | `b6ac11927d1a`   |
| solid    | self    | npm             | drizzle    | `d54ed57e6847`   |
| solid    | hono    | pnpm            | drizzle    | `de5867f8e182`   |
| solid    | self    | pnpm            | drizzle    | `9acfdcbcaaad`   |
| nuxt     | self    | bun             | drizzle    | `69fcde0fb1e0`   |
| nuxt     | self    | bun             | prisma     | `f77463c9de61`   |
| none     | hono    | bun             | drizzle    | `ac3aadb0aa80`   |

All nine passed. Nuxt includes authenticated server-rendered HTML/private RPC checks with JavaScript disabled; the server-only case verifies auth, RPC and database CRUD without launching Chromium. Cases whose exact source fingerprint had already passed were resumed rather than regenerated.

Final audit Vercel reruns (Better Auth 1.7.7 and the scoped-cookie runner):

| Frontend | Backend     | Postgres setup               | ORM     | Stages                         | Result directory |
| -------- | ----------- | ---------------------------- | ------- | ------------------------------ | ---------------- |
| nuxt     | hono / Node | account-free Neon            | drizzle | production + protected preview | `5fdd6a4b95ef`   |
| next     | hono / Node | account-free Prisma Postgres | prisma  | production + protected preview | `743598338907`   |

Both fixtures passed all four deployment stages, including authentication, persisted todos, direct database assertions and cleanup. Nuxt additionally passed its authenticated dashboard/private RPC checks with JavaScript disabled. Production ran against its public alias without bypass credentials; preview required a real Vercel bypass cookie and denied unauthenticated access. Both result databases contain zero pending resources; Prisma Postgres has its requested two-hour TTL.

An earlier audit attempt incorrectly expected an authorization cookie on the public production alias. It failed visibly and cleaned up resources; authorization is now confined to protected previews. The final passing rows above include that correction.
