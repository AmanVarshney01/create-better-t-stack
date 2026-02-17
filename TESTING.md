# Testing Guide

Guide for running tests in the Better-Fullstack project.

## Quick Start

```bash
# Run all tests (recommended)
turbo test

# Run tests directly (after build)
cd apps/cli && bun test

# Run E2E tests (starts actual servers)
cd apps/cli && bun run test:e2e
```

## Test Commands

### Unit & Integration Tests

```bash
# Run all tests via turbo (builds dependencies automatically)
turbo test

# Run specific package tests
turbo test --filter=create-better-fullstack

# Run tests directly (requires build first)
cd apps/cli && bun test

# Build and test manually
cd apps/cli && bun run build && bun test

# Run specific test file
cd apps/cli && bun test test/auth.test.ts

# Run multiple test files
cd apps/cli && bun test test/auth.test.ts test/database-orm.test.ts

# Run tests matching a pattern
cd apps/cli && bun test --filter "better-auth"
```

> **Note:** `turbo test` handles building dependencies automatically. If running `bun test` directly, ensure you've run `turbo build` or `bun run build` first.

### E2E Tests

E2E tests generate real projects, install dependencies, and start dev servers.

```bash
# Run E2E tests
cd apps/cli && bun run test:e2e

# Or manually with environment variable
cd apps/cli && E2E=1 bun test ./test/e2e/e2e.e2e.ts
```

> **Note:** E2E tests use `.e2e.ts` extension and require `E2E=1` environment variable. Regular `bun test` won't run them.

## Test Categories

| Category            | File                          | Description                              |
| ------------------- | ----------------------------- | ---------------------------------------- |
| Auth                | `auth.test.ts`                | Authentication provider combinations     |
| Database/ORM        | `database-orm.test.ts`        | Database and ORM compatibility           |
| Backend             | `backend-runtime.test.ts`     | Backend framework configurations         |
| Encore              | `encore.test.ts`              | Encore.ts backend tests                  |
| Validation          | `validation.test.ts`          | Input validation                         |
| Template Validation | `template-validation.test.ts` | Generated code syntax validation         |
| E2E                 | `e2e/e2e.e2e.ts`              | Full project generation + server startup |

## E2E Test Configurations

| Config              | Backend | Runtime | API  |
| ------------------- | ------- | ------- | ---- |
| `hono-trpc-bun`     | hono    | bun     | trpc |
| `hono-orpc-bun`     | hono    | bun     | orpc |
| `express-trpc-node` | express | node    | trpc |

### What E2E Tests Verify

- Dependencies install without errors
- Dev server starts and responds
- `GET /` returns `"OK"`
- tRPC/oRPC healthCheck procedure works

## Directory Structure

```
apps/cli/
├── test/
│   ├── setup.ts              # Global test setup/teardown
│   ├── test-utils.ts         # Test helpers
│   ├── validation-utils.ts   # Template validation helpers
│   ├── *.test.ts             # Unit/integration tests
│   └── e2e/
│       ├── e2e.e2e.ts        # E2E test suite
│       └── e2e-utils.ts      # E2E helpers
├── .smoke/                   # Generated projects (unit tests)
└── .smoke-e2e/               # Generated projects (E2E tests)
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it } from "bun:test";
import { expectSuccess, expectError, runTRPCTest } from "./test-utils";

describe("Feature Name", () => {
  it("should work with valid config", async () => {
    const result = await runTRPCTest({
      projectName: "test-project",
      backend: "hono",
      runtime: "bun",
      // ... other options
    });
    expectSuccess(result);
  });

  it("should fail with invalid config", async () => {
    const result = await runTRPCTest({
      projectName: "invalid-project",
      // ... invalid options
      expectError: true,
    });
    expectError(result, "Expected error message");
  });
});
```

### Matrix Harness (CLI E2E)

The matrix harness tests actual CLI invocation across 10 diverse stack combinations (TypeScript, Rust, Python, Go). Unlike the programmatic matrix tests, this runs the real CLI binary end-to-end.

```bash
# Local source mode (uses repo source, requires build)
bun scripts/cli-matrix-harness.ts

# Production package mode (uses bun create better-fullstack@latest)
bun scripts/cli-matrix-harness.ts --prod

# Verbose output
bun scripts/cli-matrix-harness.ts --verbose
```

Reports are written to `reports/` (gitignored). Temp projects are created in `$TMPDIR/bfs-matrix-runs/current` and cleaned at the start of each run.

## Tips

- Tests generate projects in `.smoke/` directory (auto-cleaned)
- Use `install: false` for faster tests (default)
- E2E tests take longer (~15-60 seconds each)
- Run specific test files during development for faster feedback

## Manual Production Create Runs (Non-TypeScript)

Date: 2026-02-17
Command base:

```bash
bun create better-fullstack@latest <project-name> --yes --no-install --no-git --disable-analytics ...
```

Coverage goal: 10 unique templates across `rust`, `python`, and `go` only (no TypeScript).

### Combos Tried

| #   | Project Name                                        | Ecosystem | Key Options                                                              | Result |
| --- | --------------------------------------------------- | --------- | ------------------------------------------------------------------------ | ------ |
| 1   | `rust-actix-leptos-seaorm-graphql-ratatui`          | rust      | actix-web + leptos + sea-orm + async-graphql + ratatui + serde/validator | PASS   |
| 2   | `rust-axum-dioxus-sqlx-tonic-clap`                  | rust      | axum + dioxus + sqlx + tonic + clap + jsonwebtoken/argon2                | PASS   |
| 3   | `rust-axum-none-sqlx-none-none`                     | rust      | axum + sqlx                                                              | PASS   |
| 4   | `rust-none-dioxus-none-graphql-clap`                | rust      | dioxus + async-graphql + clap + mockall                                  | PASS   |
| 5   | `python-django-sqlmodel-celery-ruff-langchain`      | python    | django + sqlmodel + pydantic + langchain + celery + ruff                 | PASS   |
| 6   | `python-fastapi-sqlmodel-none-openai-crewai`        | python    | fastapi + sqlmodel + openai-sdk + crewai                                 | PASS   |
| 7   | `python-fastapi-sqlalchemy-pydantic-anthropic-ruff` | python    | fastapi + sqlalchemy + pydantic + anthropic-sdk + ruff                   | PASS   |
| 8   | `go-echo-gorm-none-cobra-zap`                       | go        | echo + gorm + cobra + zap                                                | PASS   |
| 9   | `go-gin-sqlc-grpc-bubbletea-none`                   | go        | gin + sqlc + grpc-go + bubbletea                                         | PASS   |
| 10  | `go-echo-none-grpc-none-zap`                        | go        | echo + grpc-go + zap                                                     | PASS   |

### Verification Performed

- Project creation exit status checked for all 10 runs.
- Expected ecosystem root files verified (`Cargo.toml`, `pyproject.toml`, `go.mod`).
- Marker checks confirmed selected options are reflected in generated files for each run.
- Python syntax check run with `python3 -m compileall -q .` for all Python projects.

### Environment Limits

- `cargo` and `go` were not available in the runner environment during this pass, so `cargo check` and `go build/test` were not executed.
- No generation errors were observed in CLI output logs for these runs.
