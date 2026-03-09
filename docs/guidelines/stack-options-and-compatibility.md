# Stack Options And Compatibility

Use this guide when the task changes supported technologies, stack names, compatibility rules, or builder/CLI parity.

## Source of truth

- `packages/types/src/schemas.ts` defines the raw allowed values for CLI-facing schemas.
- `packages/types/src/option-metadata.ts` defines canonical option IDs, display labels, aliases, multi-select vs single-select semantics, and CLI value overrides.
- `packages/types/src/compatibility.ts` defines invalid combinations and user-facing compatibility messages.
- `apps/web/src/lib/constant.ts` exposes builder options and marketing copy for each category.
- `apps/cli/test/cli-builder-sync.test.ts` is the guardrail that checks builder options against canonical metadata and schema values.

## Canonical metadata rules

- Keep IDs stable. Prefer adding aliases over renaming IDs when preserving old URLs or previously shared values matters.
- Put display-only naming changes in metadata and builder labels, not in schema IDs.
- Use `normalizeOptionId()` for alias handling instead of duplicating ad hoc normalization logic.
- Multi-select behavior is defined centrally in `OPTION_CATEGORY_METADATA`; do not re-encode category selection semantics in local components.

Current examples:

- `sveltekit` normalizes to canonical web frontend ID `svelte`.
- `self-sveltekit` normalizes to canonical backend ID `self-svelte`.
- Several fullstack backend variants map to one CLI value (`self`) even though the builder preserves distinct canonical IDs.

## When adding or changing an option

1. Update the schema value list in `packages/types/src/schemas.ts`.
2. Update `packages/types/src/option-metadata.ts` if the option needs a friendly label, alias, or CLI value override.
3. Add or update the builder entry in `apps/web/src/lib/constant.ts`.
4. Update compatibility rules if the option has framework-specific constraints.
5. Update any tech links, preview labels, or prompt copy that mention the option.
6. Run parity and release-focused tests.

## Compatibility traps already known

- `shadcn-ui` is intentionally incompatible with `svelte` and `solid-start`.
- Redwood currently requires `api=none` and only supports `daisyui` or `none` for `uiLibrary`.
- Backend-aware path rules matter for Redwood: `web/api` only applies when Redwood owns both layers.

## Sync-test discipline

- Do not exclude schema values from parity tests without a documented product reason.
- If an exclusion is truly necessary, document it in code and revisit it quickly. The previous `umami` exclusion masked a real builder drift.
