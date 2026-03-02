# Codex Improvements Plan (2026-02-28)

## Overview

This document tracks proposed improvements and ecosystem expansions, plus execution status for implementation tasks.

## Improvement Backlog (Engineering)

1. Unify compatibility logic into one source of truth shared by CLI and web builder.
2. Consolidate URL state parse/serialize mapping to reduce drift.
3. Improve preview fidelity so `/api/preview` matches real generation behavior.
4. Clean up experimental/stale routes and unreferenced components in web app.
5. Automate combinations count instead of hardcoded values.
6. Tighten sync tests to eliminate parser skips and unmapped category blind spots.
7. Continue upstream backports based on weekly gap report.

## Expansion Backlog (Libraries/Frameworks/Languages/Services)

1. Deploy services: `vercel`, `render`, `netlify`.
2. Auth services: `kinde`, `workos`.
3. Search services: `algolia`, `opensearch`.
4. Feature flags: `unleash`, `flagsmith`.
5. Observability services: `axiom`, `betterstack`, `datadog`.
6. CMS: `directus`, `keystatic`.
7. Storage: `supabase-storage`.
8. API frameworks: `pothos`, `effect-rpc`.
9. Frontend framework: `remix`.
10. Python frameworks: `flask`, `litestar`.
11. Go frameworks: `chi`, `fiber`.
12. New language ecosystems: `elixir/phoenix` or `c#/aspnet`.

## Execution Status

- [x] Task 1: Compatibility unification (full migration)
- [x] Task 2: URL state parse/serialize consolidation

## Task #1 Details

- Canonical behavior source: CLI.
- Added shared compatibility engine module in `@better-fullstack/types`:
  - `packages/types/src/compatibility.ts`
  - exported via `packages/types/src/index.ts`
- Migrated web builder compatibility utilities to thin adapters backed by shared engine:
  - `apps/web/src/components/stack-builder/utils.ts`
- Migrated CLI compatibility helpers to delegate shared logic where applicable:
  - `apps/cli/src/utils/compatibility-rules.ts`
- Added coverage for shared engine and web adapter parity:
  - `apps/cli/test/compatibility-engine.test.ts`
  - `apps/web/test/compatibility-parity.test.ts`

## Task #2 Details

- Added one shared URL state adapter to remove parse/serialize drift across server, client, and schema:
  - `apps/web/src/lib/stack-url-state.shared.ts`
- Refactored server URL parsing and serialization to delegate to shared helpers:
  - `apps/web/src/lib/stack-url-state.ts`
- Refactored client stack initialization to use shared parsing and removed debug logging:
  - `apps/web/src/lib/stack-url-state.client.ts`
- Refactored schema generation to derive short-key fields from central mapping metadata:
  - `apps/web/src/lib/stack-search-schema.ts`
- Refactored stack share URL generation to reuse shared serializer:
  - `apps/web/src/lib/stack-utils.ts`
- Added URL-state parity coverage:
  - `apps/web/test/stack-url-state.test.ts`

## Validation Evidence

### Task #1 Commands Run

1. `cd apps/cli && bun test test/compatibility-engine.test.ts` -> PASS (4 tests)
2. `cd apps/web && bun test test/compatibility-parity.test.ts` -> PASS (3 tests)
3. `cd apps/cli && bun test test/cli-builder-sync.test.ts` -> PASS
4. `bun run --filter=web test` -> PASS
5. `bun run build` -> PASS

### Task #1 Changed Files

- `docs/planned/Codex-improvements-2026-02-28.md`
- `packages/types/src/compatibility.ts`
- `packages/types/src/index.ts`
- `apps/web/src/components/stack-builder/utils.ts`
- `apps/cli/src/utils/compatibility-rules.ts`
- `apps/cli/test/compatibility-engine.test.ts`
- `apps/web/test/compatibility-parity.test.ts`
- `apps/cli/test/cli-builder-sync.test.ts` (sync mappings updated)

### Task #2 Commands Run

1. `bun run --filter=web test` -> PASS (155 tests, includes `test/stack-url-state.test.ts`)
2. `bun run build:web` -> PASS

### Task #2 Changed Files

- `docs/planned/Codex-improvements-2026-02-28.md`
- `apps/web/src/lib/stack-url-state.shared.ts`
- `apps/web/src/lib/stack-url-state.ts`
- `apps/web/src/lib/stack-url-state.client.ts`
- `apps/web/src/lib/stack-search-schema.ts`
- `apps/web/src/lib/stack-utils.ts`
- `apps/web/test/stack-url-state.test.ts`
