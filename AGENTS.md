# Repository Guidelines

## Project Structure & Module Organization

This repo is a Bun + Turborepo monorepo.

- `apps/cli`: published CLI (`create-better-t-stack`), with source in `apps/cli/src` and tests in `apps/cli/test`.
- `apps/web`: Next.js docs/site (`apps/web/src`, `apps/web/content/docs`, `apps/web/public`).
- `packages/template-generator`: template generation engine used by the CLI.
- `packages/types`: shared schemas/types.
- `packages/backend`: Convex backend used by web features.
- `plugin/`: installable agent plugin (Claude Code + Codex) — skills, commands, and MCP wiring; published via the root marketplaces (`.claude-plugin/`, `.agents/plugins/`).

## Build, Test, and Development Commands

- `bun install`: install workspace dependencies.
- `bun dev:cli`: watch-build CLI package.
- `bun dev:web`: run web app locally (`next dev --port 3333`).
- `bun build`: build all packages/apps through Turbo.
- `bun build:cli`: build only the CLI target.
- `bun run check`: format + lint (`oxfmt . && oxlint .`).
- `cd apps/cli && bun run test`: run CLI integration tests.

## Coding Style & Naming Conventions

- Language: TypeScript (strict mode enabled across projects).
- Modules: ESM-first (`"type": "module"` where applicable).
- Formatting/linting: `oxfmt` and `oxlint`; run `bun run check` before committing.
- File naming: prefer kebab-case files (for example `database-setup.ts`).
- Symbols: `camelCase` for functions/variables, `PascalCase` for types/components.
- Keep feature logic near domain folders (`helpers`, `utils`, `template-handlers`).

## Error Handling Conventions

- In CLI code, prefer `better-result` over ad-hoc `try/catch` for recoverable flows.
- Return typed `Result<T, E>` and use `Result.ok`, `Result.err`, `Result.try`, and `Result.tryPromise`.
- Reuse domain errors from `apps/cli/src/utils/errors.ts` (`CLIError`, `ProjectCreationError`, `UserCancelledError`) and convert thrown prompt errors at boundaries.

## Template Authoring (Handlebars)

- Templates live in `packages/template-generator/templates` and use helpers from `packages/template-generator/src/core/template-processor.ts` (`eq`, `ne`, `and`, `or`, `includes`).
- For conditional ORM-specific output, use helper form with quoted values:
  - `{{#if (eq orm "prisma")}}`
  - `{{else if (eq orm "drizzle")}}`
  - `{{/if}}`
  - Example: `packages/template-generator/templates/packages/infra/alchemy.run.ts.hbs`.
- When files must contain literal `{{ ... }}` (Vue/JSX/template syntax), escape opening braces as `\{{` in `.hbs` files so Handlebars does not evaluate them.
  - Example: `packages/template-generator/templates/frontend/nuxt/app/pages/index.vue.hbs`.

## Testing Guidelines

A test earns its place when it can fail while a user would get hurt. Tests live in three tiers, each with one job:

| Tier             | Where                                      | Runs                     | Proves                                                                                                 |
| ---------------- | ------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Contract         | `apps/cli/test/*.test.ts`, `apps/web/test` | Every PR                 | The CLI, MCP and oRPC interfaces reject bad input, write the right files and keep existing ones        |
| Generated builds | `apps/cli/test/generated-builds.test.ts`   | Every PR and daily       | Generated projects install the latest dependencies, typecheck, build and, where a sample opts in, boot |
| Live             | `apps/cli/live-tests`                      | Locally, before releases | Generated apps work in a browser against real databases and deployments                                |

- Use `bun:test`. Reuse `apps/cli/test/setup.ts` for disposable project directories.
- Never assert that generated output contains text copied from a template. The generated-builds tier already proves templates compile and run.
- Do not add isolated unit tests or mocked helper tests.
- To cover a new stack, add a sample to `apps/cli/test/generated-builds/samples.ts`. If it needs a runtime check, name it in the sample's `checks` and implement it in `probes.ts`.
- When an upstream release breaks a generated build, fix the template so it works on the latest version. Never pin an older dependency.
- Keep live tests out of CI. Record their results in the pull request, not in the repository.

## Commit & Pull Request Guidelines

- Use Conventional Commits with scope, matching history:
  - `feat(cli): ...`, `fix(web): ...`, `docs(cli): ...`
- Open an issue/discussion before major feature work.
- PRs should include:
  - clear summary,
  - linked issue (if applicable),
  - verification steps run (`bun run check`, relevant tests),
  - screenshots/GIFs for web UI changes.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `AmanVarshney01/create-better-t-stack` using the `gh` CLI.

### Triage labels

The canonical triage roles map directly to same-named GitHub labels.
