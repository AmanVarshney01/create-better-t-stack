# Contributing

Thanks for wanting to contribute! Here's everything you need to get started.

> **Important**: Open an issue before starting work on new features or major changes.

<br>

## TL;DR

```bash
git clone https://github.com/Marve10s/Better-Fullstack.git
cd Better-Fullstack
bun install
bun dev:cli    # CLI development
bun dev:web    # Website development
```

<br>

## Project Structure

```
├── apps/
│   ├── cli/                    # create-better-fullstack CLI
│   └── web/                    # Documentation website
└── packages/
    ├── template-generator/     # Handlebars templates → generated output
    ├── types/                  # Shared TypeScript types & schemas
    ├── backend/                # Convex backend
    └── create-bfs/             # Project bootstrapper
```

<br>

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Bun](https://bun.sh/) (recommended)

### Setup

```bash
git clone https://github.com/Marve10s/Better-Fullstack.git
cd Better-Fullstack
bun install
```

### CLI

```bash
bun dev:cli
```

Runs tsdown in watch mode. To test globally:

```bash
cd apps/cli && bun link
create-better-fullstack
```

### Website

```bash
bun dev:web
```

### Template Generator

After editing `.hbs` template files:

```bash
bun run --filter=@better-fullstack/template-generator generate-templates
bun run --filter=@better-fullstack/template-generator build
bun run --filter=create-better-fullstack build
```

After editing `src/post-process/*.ts` files, only the build steps are needed (skip `generate-templates`).

<br>

## Testing

### Quick reference

```bash
bun run test              # CLI unit tests
bun run test:all          # All tests across the monorepo
bun run lint              # Lint all packages (turbo lint)
bun run check             # Format + lint (oxfmt + oxlint)
```

### CLI tests

```bash
bun run test:cli          # Unit tests
bun run test --watch      # Watch mode (from apps/cli/)
bun run test:coverage     # With coverage report
bun run test:ci           # CI mode (bail after 5 failures)
bun run test:e2e          # End-to-end tests
```

### Matrix tests

Test combinations of frontends, backends, databases, etc:

```bash
bun run test:matrix       # Batched mode
bun run test:matrix:fast  # 10% random sample
bun run test:matrix:full  # All combinations (slow)
```

### Web tests

```bash
cd apps/web
bun test                           # Unit tests
bun run validate:tech-links        # Validate all tech resource links
bun run perf:check                 # Check performance budget
```

### Type checking

```bash
bun run --filter=create-better-fullstack check-types     # CLI
bun run --filter=web typecheck                           # Website
bun run --filter=@better-fullstack/template-generator typecheck  # Template generator
```

### Build

```bash
turbo build               # Build everything
bun run build:cli         # CLI only
bun run build:web         # Website only
```

<br>

## Dependency Management

```bash
bun run update-deps       # Check template dependency versions
bun run update-deps:fix   # Auto-update template dependency versions
bun run sync-versions     # Check template version sync
```

<br>

## Making Changes

1. **Open an issue** — Describe the bug or feature
2. **Fork & clone** — Create your own copy
3. **Branch** — `git checkout -b feat/your-feature` or `fix/your-bug`
4. **Code** — Follow existing patterns
5. **Test** — `bun run test`
6. **Lint** — `bun run check`
7. **Commit** — Use conventional commits (see below)
8. **Push & PR** — Link the related issue

<br>

## Commit Convention

```
feat: add new feature
fix: resolve bug
docs: update documentation
chore: maintenance tasks
refactor: code changes without feature/fix
test: add or update tests
```

Lefthook runs `turbo lint` on every commit automatically.

<br>

## Need Help?

- Check [existing issues](https://github.com/Marve10s/Better-Fullstack/issues)
- Open a [new issue](https://github.com/Marve10s/Better-Fullstack/issues/new) with your question

<br>

---

By contributing, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
