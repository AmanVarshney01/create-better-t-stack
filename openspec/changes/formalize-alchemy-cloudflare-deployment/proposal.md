## Why

Better-T-Stack's Cloudflare deployment path depends on the experimental Alchemy v2 API and currently carries four targeted safeguards plus a permanent exact-version policy after independently retiring A1, A2, and A3. Next.js, Nuxt, SvelteKit, and Astro are currently deployed through generic `StaticSite` resources whose generated configuration owns each framework's build command, output paths, Worker entry, compatibility flags, bindings, and development server. Alchemy PRs #886 and #923 are merged and their first-class resources are published in beta.69, but publication exposed different framework-level compatibility gaps: the Nuxt development provider currently fails to parse its injected plugin, while SvelteKit, Astro, and Next.js still need their independent production, binding, memo, and version gates. Upstream source, published releases, framework integration constraints, and disproved review claims have repeatedly been conflated. Without one normative contract and executable retention/removal gates, an Alchemy upgrade can either reintroduce a known failure, preserve obsolete compatibility code indefinitely, or trade working framework behavior for superficially shorter infrastructure code.

## What Changes

- Define the accepted exact Alchemy version and the evidence required to upgrade it.
- Formalize the supported Cloudflare topology, framework, runtime, database, binding, and deployment-time value behavior.
- Classify every current workaround as a confirmed Alchemy defect workaround, framework/platform integration shim, Better-T-Stack correctness policy, limitation, or disproved claim.
- Make `docs/alchemy-v2-beta-findings.md` the versioned evidence ledger for upstream status, reproductions, current handling, and removal conditions.
- Specify provider-free generation/typecheck/build checks and credentialed disposable live tests for version upgrades, resource-wiring changes, and shim removal.
- Require owned-stage cleanup, process/port cleanup, leak auditing, and independent reconciliation for interrupted live tests.
- Remove one compatibility shim at a time only after its published-release reproduction, generated-project checks, affected live request, and ledger update all pass.
- Define an independent adoption gate for `Website.Nextjs`, `Website.Nuxt`, `Website.SvelteKit`, and `Website.Astro`, including dependency resolution, framework-version compatibility, build/config ownership, local development, workspace memoization, bindings, state continuity, and rollback.
- Specify the generated code that each first-class resource may replace and the framework configuration, adapter, dependency, and binding behavior that must remain until parity is proven.
- Keep unaffected Cloudflare resources on their current paths and prohibit an all-at-once framework migration merely because the upstream pull requests share a release.
- Add Prisma as an Alchemy deployment target for supported web and server applications while keeping the CLI label provider-level rather than exposing the underlying resource name.
- Let the Alchemy deployment that owns the database-consuming application provision Neon, PlanetScale, or Prisma Postgres, inject typed runtime credentials, and apply checked-in migrations.
- Preserve external database setup when the database consumer is deployed by another provider.

### Non-goals

- Removing A4, A5, or the permanent A6 exact-version policy without its named gate.
- Refactoring all deployment providers behind a common lifecycle abstraction.
- Adding or redesigning Vercel, Railway, or Docker deployment.
- Adding Waku to Better-T-Stack merely because Alchemy PR #886 includes it.
- Upgrading a frontend framework major version solely to satisfy an unreleased Alchemy source provider.
- Treating a merged upstream pull request as usable before publication.
- Installing a branch, git dependency, or unpublished `@distilled.cloud/*` package to bypass the release gate.
- Claiming `alchemy logs` authentication or OpenNext on-demand ISR is fixed without a focused live reproduction.

## Capabilities

### New Capabilities

- `alchemy-cloudflare-deployment`: Exact-version policy, supported Cloudflare matrix, sanctioned compatibility layer, bug ledger, verification, cleanup, and shim-removal gates.
- `alchemy-managed-databases`: Consumer-plane ownership, provisioning, credentials, migrations, and local/deploy lifecycle for Neon, PlanetScale, and Prisma Postgres.
- `alchemy-prisma-deployment`: Supported Prisma web/server topology, mixed-provider URL wiring, environment values, and verification.

### Modified Capabilities

None. This repository had no baseline OpenSpec capabilities before this proposal.

## Impact

This change governs `packages/template-generator/templates/packages/infra`, deployment and database ownership schemas, provider-aware setup, generated migration artifacts, application environment types, deployment tests, the external reproduction repository, live verification, and `docs/alchemy-v2-beta-findings.md`. Vercel, Railway, and Docker remain outside this Alchemy design.
