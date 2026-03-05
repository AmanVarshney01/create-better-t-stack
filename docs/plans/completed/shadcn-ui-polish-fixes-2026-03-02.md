# shadcn/ui Polish Fixes (2026-03-02)

## Status

- [x] Complete

## Key changes

- Removed framer-motion scale hover/tap effects from shadcn sub-option cards.
- Made shadcn section collapsible using the same interaction pattern as regular sections.
- Added color swatch rendering for `shadcnColorTheme` and `shadcnBaseColor`.
- Added missing icon library entries (`hugeicons`, `remixicon`) and fixed Base UI icon mapping.
- Added missing shadcn tech resource link entries (`docsUrl`) to satisfy builder link validation.

## Validation (recorded at time of change)

- `bun run --filter=web build` -> PASS
- `bun run --filter=web lint` -> PASS
- `bun run --cwd apps/web validate:tech-links` -> PASS
