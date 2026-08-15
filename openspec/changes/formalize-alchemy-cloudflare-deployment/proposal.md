## Why

Better-T-Stack's Cloudflare deployment path depends on the experimental Alchemy v2 API and carries targeted safeguards plus a permanent exact-version policy. Released beta.72 fixes the Effect startup incompatibility and consolidates the framework implementations into `@alchemy.run/cloudflare-frameworks`. Nuxt and Astro can therefore delegate build, development, adapter/preset, asset collection, and workspace-aware memoization to `Website.Nuxt` and `Website.Astro`; Vite-native frameworks already use `Website.Vite`. Next.js remains on its generic OpenNext path because the first-class provider requires OpenNext 1.20.1 while 1.20.2 is current, and SvelteKit remains generic because its provider requires Kit 3 while stable Kit is 2.70.x. Without one normative contract and executable retention/removal gates, an upgrade can reintroduce a known failure, preserve obsolete compatibility code, or trade working framework behavior for shorter infrastructure code.

## What Changes

- Define the accepted exact Alchemy version and the evidence required to upgrade it.
- Formalize the supported Cloudflare topology, framework, runtime, database, binding, and deployment-time value behavior.
- Classify every current workaround as a confirmed Alchemy defect workaround, framework/platform integration shim, Better-T-Stack correctness policy, limitation, or disproved claim.
- Make `docs/alchemy-v2-beta-findings.md` the versioned evidence ledger for upstream status, reproductions, current handling, and removal conditions.
- Specify provider-free generation/typecheck/build checks and credentialed disposable live tests for version upgrades, resource-wiring changes, and shim removal.
- Require owned-stage cleanup, process/port cleanup, leak auditing, and independent reconciliation for interrupted live tests.
- Remove one compatibility shim at a time only after its published-release reproduction, generated-project checks, affected live request, and ledger update all pass.
- Define an independent adoption gate for `Website.Nextjs`, `Website.Nuxt`, `Website.SvelteKit`, and `Website.Astro`, including dependency resolution, framework-version compatibility, build/config ownership, local development, workspace memoization, bindings, state continuity, and rollback.
- Generate the released first-class Nuxt and Astro paths, remove the provider-owned configuration they replace, and retain Next.js and SvelteKit generic paths until their dependency contracts match the latest stable generated frameworks.
- Keep unaffected Cloudflare resources on their current paths and record the source and executable evidence for each framework independently.
- Add Prisma as an Alchemy deployment target for supported web and server applications while keeping the CLI label provider-level rather than exposing the underlying resource name.
- Let the Alchemy deployment that owns the database-consuming application provision Neon, PlanetScale, or Prisma Postgres, inject typed runtime credentials, and apply checked-in migrations.
- Preserve external database setup when the database consumer is deployed by another provider.
- Replace the SolidStart 2 scaffold with Solid 2 start mode, router-neutral file routing, and the
  provider adapters required by each existing deployment target.

### Non-goals

- Removing A4, A5, or the permanent A6 exact-version policy without its named gate.
- Refactoring all deployment providers behind a common lifecycle abstraction.
- Adding or redesigning Vercel, Railway, or Docker deployment.
- Adding Waku to Better-T-Stack merely because Alchemy PR #886 includes it.
- Upgrading another frontend framework major version solely to satisfy an unreleased Alchemy source provider.
- Treating a merged upstream pull request as usable before publication.
- Installing a branch, git dependency, unpublished framework package, dependency override, or hoisted linker to bypass the release gate.
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
