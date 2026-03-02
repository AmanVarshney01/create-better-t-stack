# Codex Improvements Completed

## 2026-02-28: Compatibility and URL State Foundation

Status:

- [x] Compatibility unification between CLI and web
- [x] URL state parse/serialize consolidation

Key changes:

- Added shared compatibility engine in `packages/types/src/compatibility.ts` and exported from `packages/types/src/index.ts`.
- Migrated web and CLI compatibility utilities to shared logic.
- Added shared URL-state adapter and refactored server/client/schema/share-url code paths in web app to use it.
- Added/updated parity and URL-state tests.

Validation (recorded at time of change):

- `cd apps/cli && bun test test/compatibility-engine.test.ts` -> PASS
- `cd apps/web && bun test test/compatibility-parity.test.ts` -> PASS
- `cd apps/cli && bun test test/cli-builder-sync.test.ts` -> PASS
- `bun run --filter=web test` -> PASS
- `bun run build` -> PASS
- `bun run build:web` -> PASS

## 2026-03-02: shadcn/ui Polish Fixes

Status:

- [x] Complete

Key changes:

- Removed framer-motion scale hover/tap effects from shadcn sub-option cards.
- Made shadcn section collapsible using the same interaction pattern as regular sections.
- Added color swatch rendering for `shadcnColorTheme` and `shadcnBaseColor`.
- Added missing icon library entries (`hugeicons`, `remixicon`) and fixed Base UI icon mapping.
- Added missing shadcn tech resource link entries (`docsUrl`) to satisfy builder link validation.

Validation (recorded at time of change):

- `bun run --filter=web build` -> PASS
- `bun run --filter=web lint` -> PASS
- `bun run --cwd apps/web validate:tech-links` -> PASS
