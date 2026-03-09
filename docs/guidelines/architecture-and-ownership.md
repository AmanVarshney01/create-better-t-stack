# Architecture And Ownership

This repository is a Bun workspace monorepo. Most agent mistakes here come from editing the right concept in the wrong package.

## Package map

- `apps/cli` publishes `create-better-fullstack`. It owns prompts, command flags, CLI UX, and generator integration tests.
- `apps/web` owns the marketing site, stack builder UI, URL state, and preview generation for the web configurator.
- `packages/types` is the core contract package. It owns schema values, compatibility input/output types, and canonical option metadata such as labels, aliases, and CLI value mapping.
- `packages/template-generator` owns the generated project tree. If a chosen stack should emit different files, the change usually belongs here.
- `packages/backend` holds shared backend/runtime helpers used by the web app and generated experiences.
- `scripts` contains release, dependency, cleanup, and upstream maintenance tooling.
- `docs/plans` is for backlog and completion records. `docs/guidelines` is for reusable agent-facing guidance.

## Where changes belong

- Add or remove supported stack values in `packages/types/src/schemas.ts` first.
- Normalize labels, aliases, selection semantics, or CLI value overrides in `packages/types/src/option-metadata.ts`.
- Change builder card text, icons, or descriptions in `apps/web/src/lib/constant.ts`.
- Change invalid stack combinations or adjustment messaging in `packages/types/src/compatibility.ts` and related CLI compatibility utilities.
- Change generated files in `packages/template-generator`.
- Change preview-only behavior in `apps/web/src/lib/preview-config.ts` and stack builder code.
- Change release or CI policy in `.github/workflows/` and root scripts.

## Coupling to remember

- `apps/web` and `apps/cli` should not invent their own stack IDs. Shared IDs and aliases belong in `packages/types`.
- `apps/web` depends on built outputs from `packages/types` and `packages/template-generator` during `prebuild`.
- `apps/cli` linting already includes the CLI/builder sync test, so option drift can fail lint before broader tests run.
- A label change can be safe while an ID change is usually not. IDs flow into URLs, CLI flags, compatibility rules, and generated output branches.
