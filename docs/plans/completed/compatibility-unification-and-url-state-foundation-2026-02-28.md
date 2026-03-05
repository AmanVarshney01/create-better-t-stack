# Compatibility Unification and URL State Foundation (2026-02-28)

## Status

- [x] Compatibility unification between CLI and web
- [x] URL state parse/serialize consolidation

## Key changes

- Added shared compatibility engine in `packages/types/src/compatibility.ts` and exported from `packages/types/src/index.ts`.
- Migrated web and CLI compatibility utilities to shared logic.
- Added shared URL-state adapter and refactored server/client/schema/share-url code paths in web app to use it.
- Added/updated parity and URL-state tests.

## Validation (recorded at time of change)

- `cd apps/cli && bun test test/compatibility-engine.test.ts` -> PASS
- `cd apps/web && bun test test/compatibility-parity.test.ts` -> PASS
- `cd apps/cli && bun test test/cli-builder-sync.test.ts` -> PASS
- `bun run --filter=web test` -> PASS
- `bun run build` -> PASS
- `bun run build:web` -> PASS
