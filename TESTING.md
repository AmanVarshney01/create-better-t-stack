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

## Tips

- Tests generate projects in `.smoke/` directory (auto-cleaned)
- Use `install: false` for faster tests (default)
- E2E tests take longer (~15-60 seconds each)
- Run specific test files during development for faster feedback
