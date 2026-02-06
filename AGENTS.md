# AGENTS.md

Instructions for AI coding agents working with this codebase.

## Development Workflow

### Build & Lint

- **Package Manager:** Use `bun` for all operations. Do not use `npm`, `yarn`, or `pnpm`.
- **Install Dependencies:** `bun install`
- **Build:** `bun run build` (uses TurboRepo)
- **Lint & Format:** `bun check` (runs `oxfmt` and `oxlint`). Fix issues with `oxfmt .` if needed.
- **Dev Server:** `bun run dev`

### Testing

- **Runner:** Use `bun test`.
- **Run All Tests:** `bun test` (in a specific package/app directory).
- **Run Single Test File:** `bun test <path/to/file>`
  - Example: `bun test apps/cli/test/cli.test.ts`
- **Run Specific Test Case:** `bun test -t "test name pattern"`
- **Note:** Always run `bun run build` before testing if testing build artifacts, or ensure the test command handles it (e.g., `apps/cli` runs build in its test script).

## Code Style & Conventions

### General

- **Runtime:** This is a **Bun** project.
  - Use `Bun.file` over `node:fs`.
  - Use `Bun.serve` over `express`.
  - Use `Bun.env` or just `process.env` (auto-loaded).
- **Paradigm:** Prefer **Functional Programming**. Avoid Object-Oriented patterns (classes) unless strictly required by a framework.
  - Use standard `function name() {}` declarations for top-level functions (better stack traces/hoisting) instead of arrow functions `const name = () => {}`, unless inside components/callbacks.
- **Types:** Use **Type Aliases** (`type X = ...`) instead of interfaces (`interface X ...`).
- **Formatting:** Adhere to `oxfmt` defaults.
- **Comments:** No emojis in code or comments.
- **Exports:** Prefer named exports over default exports.

### Apps & Packages

- **Monorepo:** Uses TurboRepo.
- **CLI:** Located in `apps/cli`.
- **Web:** Located in `apps/web`.
- **Backend:** Located in `packages/backend` (Convex).

## Framework Specifics

### Convex (Backend)

- **Syntax:** Always use the new object-style syntax for functions.
  ```ts
  export const myFunc = query({
    args: { name: v.string() },
    returns: v.string(), // Always specify returns
    handler: async (ctx, args) => { ... }
  });
  ```
- **Validators:** Strict validation required.
  - Use `v.null()` for void/null returns.
  - Use `v.id("tableName")` for IDs.
- **Internal vs Public:**
  - Public: `query`, `mutation`, `action` (in `convex/` root or subfolders).
  - Internal: `internalQuery`, `internalMutation`, `internalAction`.
- **Calling Functions:**
  - Use `ctx.runQuery(api.path.to.func, args)`.
  - Use `internal.path.to.func` for internal functions.
- **Schema:** Defined in `convex/schema.ts` using `defineSchema` and `defineTable`.
- **Actions:** Use `"use node";` at the top if using Node.js built-ins. Actions do not have DB access (`ctx.db`); use queries/mutations for data.

### Handlebars (Templates)

- Avoid generic `if/else`. Use explicit helpers: `{{#if (eq orm "prisma")}}`.
- Escape double braces if needed: `\{{`.

<!-- opensrc:start -->

## Source Code Reference

Source code for dependencies is available in `opensrc/` for deeper understanding of implementation details.

See `opensrc/sources.json` for the list of available packages and their versions.

Use this source code when you need to understand how a package works internally, not just its types/interface.

### Fetching Additional Source Code

To fetch source code for a package or repository you need to understand, run:

```bash
npx opensrc <package>           # npm package (e.g., npx opensrc zod)
npx opensrc pypi:<package>      # Python package (e.g., npx opensrc pypi:requests)
npx opensrc crates:<package>    # Rust crate (e.g., npx opensrc crates:serde)
npx opensrc <owner>/<repo>      # GitHub repo (e.g., npx opensrc vercel/ai)
```

<!-- opensrc:end -->
