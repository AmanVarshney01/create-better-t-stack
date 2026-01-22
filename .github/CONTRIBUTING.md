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
│   ├── cli/     # create-better-fullstack CLI
│   └── web/     # Documentation website
└── packages/    # Shared packages
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

<br>

## Testing

```bash
turbo test              # Run all tests
turbo build             # Build all packages
bun run check           # Lint and format
```

See [TESTING.md](../TESTING.md) for the full testing guide.

<br>

## Making Changes

1. **Open an issue** — Describe the bug or feature
2. **Fork & clone** — Create your own copy
3. **Branch** — `git checkout -b feat/your-feature` or `fix/your-bug`
4. **Code** — Follow existing patterns
5. **Test** — `turbo test`
6. **Check** — `bun run check`
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
```

<br>

## Need Help?

- Check [existing issues](https://github.com/Marve10s/Better-Fullstack/issues)
- Open a [new issue](https://github.com/Marve10s/Better-Fullstack/issues/new) with your question

<br>

---

By contributing, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
