# Live generated-project tests

Run from the repository root. These tests create disposable projects and databases, install through the actual CLI, run generated commands, and exercise the app in Chromium. They are not connected to CI or the release workflow.

```sh
bun run build:cli
cd apps/cli && bunx playwright install chromium && cd ../..
bun run test:live plan --where '{"frontend":["tanstack-router"],"backend":"hono","runtime":"bun","database":"sqlite","orm":"drizzle","dbSetup":"none","api":"trpc","auth":"better-auth","payments":"none","webDeploy":"none","serverDeploy":"none","packageManager":"bun","addons":[],"examples":["todo"]}'
```

Replace `plan` with `run` to execute that selection. Remove selection fields to enumerate their valid alternatives. An empty selection enumerates all supported core stack choices, frontend/native pairs, addon subsets, and example subsets using the existing compatibility rules. It does **not** yet enumerate addon-specific options or automatic database-setup login flows.

The complete matrix has millions of core cases before addon and example subsets. Use explicit filters for manageable batches; a successful batch is not complete-matrix certification.

`--limit N` bounds a run for development; a limited run reports incomplete coverage and exits nonzero. Zero matching cases also exits nonzero. An enumerated case only passes after its runtime checks and resource cleanup succeed. Missing adapters or credentials are blocked, never passed.

## Accounts

Supply credentials in the local process environment or use the provider CLI's existing login. Do not commit credentials here.

Account-free Neon claims use a separate context file per case, so parallel batches do not link the repository to a disposable project.

| Provider                                    | Runner input                                                            | Status                                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Neon                                        | Optional `NEON_API_KEY`, `BTS_LIVE_NEON_ORG_ID`, `BTS_LIVE_NEON_REGION` | Account-free claimable project, or authenticated API project; deleted after the case                |
| Prisma Postgres                             | No account; optional `BTS_LIVE_PRISMA_POSTGRES_REGION`                  | Disposable database expires after two hours                                                         |
| Vercel                                      | Existing `vercel login`; `BTS_LIVE_VERCEL_SCOPE`                        | Disposable project; production and preview deployments; browser checks and runtime logs implemented |
| Cloudflare through Alchemy                  | Project-local Alchemy profile; `CLOUDFLARE_ACCOUNT_ID`                  | Adapter needs an authenticated live run; Wrangler login alone is insufficient                       |
| Clerk, Polar sandbox, Convex                | Dedicated test accounts to be added later                               | Blocked; provider-specific verification still required                                              |
| Supabase, Turso, PlanetScale, MongoDB Atlas | Dedicated test accounts to be added later                               | Blocked; database provisioners still required                                                       |

Vercel function cases require the Node runtime; Bun remains a supported package manager. The runner verifies production and preview on its disposable project. It creates a deployment-protection bypass secret scoped to that project and verifies that preview access without it is denied. Authorization exchanges the bypass header for Vercel's scoped cookie at each deployment origin, without following bootstrap redirects. Subsequent requests use cookies, so external resources do not receive the bypass header. Nuxt dashboards are also checked with JavaScript disabled to verify server-rendered sessions and private RPC data.

## Verification and current limits

- The CLI must save the requested selections in `bts.jsonc`; silently selecting a default is a failure.
- Generated dependencies install, then the project typechecks. Local cases build and exercise both the generated development and production servers.
- SQLite and Neon cases generate and apply a migration, repeat it to check idempotence, then run `db:push`. Prisma generates its client and initial migration SQL with the documented `migrate diff` command before applying it.
- Browser checks cover rendering, API health, Better Auth signup/login/logout, session persistence after reload, protected navigation, and todo create/update/delete with reloads. Browser crashes, hydration mismatches, failed requests, API errors, and incorrect API origins fail the case.
- Direct SQLite/PostgreSQL queries verify signup and todo changes. The same account and a saved todo must survive the development-to-production restart or Vercel production-to-preview deployment. Server-only cases verify HTTP auth, protected RPC calls and todo CRUD. PWA cases check the manifest, icons, service worker, offline navigation, and exclusion of auth/RPC responses from caches.
- Native devices, Docker, mixed deployment providers, AI, payments, and unsupported addons are explicitly blocked until their runtime checks exist.
- Live tests exposed a Next.js public environment replacement failure, login hydration errors, Nuxt session hydration and early form interaction failures, cold dependency optimization failures, and an empty Prisma migration directory. Fixes must pass freshly generated cases; a passing retry alone does not resolve a finding.
- Framework-specific browser selectors still need validation across the full matrix. A passing TanStack Router case does not certify other frameworks.

## Results, resume, and cleanup

The runner prints its directory under `apps/cli/.smoke/live/`. It contains SQLite results, generated projects, redacted command logs, browser traces, and screenshots for failures. Generated `.env` files and browser traces can contain disposable test credentials; the directory is private and ignored by Git.

```sh
bun run test:live report --directory apps/cli/.smoke/live/RUN_ID
bun run test:live cleanup --directory apps/cli/.smoke/live/RUN_ID
```

Repeat the same `run --where ...` command to resume. Passed cases are skipped; use `--retry-failed` to retry failures. Blocked and interrupted cases are revisited. The identity includes the built CLI, CLI source used by the runner, generated-template bundle, shared types, runner source, lockfile, commit, and filter; changed inputs require a new run directory.

Cleanup normally runs after each case. `--retain-failed` preserves failed deployments for investigation; clean them with the command above. Interruptions retain resource records so cleanup can resume. A failed cleanup keeps the case failed and the resource pending. Unconfirmed Vercel creation intents require inspecting the create log/account before reconciliation; cleanup will not delete an unconfirmed project by name.

Only one process can mutate a given run directory. `runner.lock` contains its PID. After an ungraceful kill, confirm that process is gone before removing the stale lock. Local cases also refuse to use occupied framework ports.

The small runner regression suite does not deploy anything:

```sh
bun test apps/cli/live-tests/runner.test.ts
```

With Chromium installed, the optional credential-scoping regression checks browser, JavaScript-disabled SSR and HTTP contexts against local protected and external origins:

```sh
BTS_LIVE_BROWSER_TESTS=1 bun test apps/cli/live-tests/protection.test.ts
```

## Selected validation run

The [2026-10-02 verification record](./verification-2026-10-02.md) lists the 19 local, five Postgres, and two Vercel fixtures that passed, including production and protected preview stages.

The [official documentation and type audit](./docs-audit-2026-10-02.md) explains the reviewed changes, upstream sources and corrections to verified PR findings.
