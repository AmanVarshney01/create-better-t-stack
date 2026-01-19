# Ralph Agent Instructions

You are an autonomous coding agent working on the Better-Fullstack project - a CLI scaffolding tool with a TanStack Start website and Convex backend.

## Your Task

1. Read the PRD at `scripts/ralph/prd.json`
2. Read the progress log at `scripts/ralph/progress.txt` (check Codebase Patterns section first)
3. Read `AGENTS.md` for project context
4. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
5. Pick the **highest priority** user story where `passes: false`
6. Implement that single user story
7. **Run tests** (see Testing Requirements below)
8. Run quality checks: `bun run check` and `bun run build`
9. Update AGENTS.md files if you discover reusable patterns
10. If ALL checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
11. Update the PRD to set `passes: true` for the completed story
12. Append your progress to `scripts/ralph/progress.txt`

---

## CRITICAL: Testing Requirements for New Library Options

When adding a new library/option to the CLI (schema stories), you MUST:

### Step 1: Add the Schema

Add to `packages/types/src/schemas.ts` following existing patterns.

### Step 2: Write Tests FIRST

Before implementing templates, create tests in `apps/cli/test/` to verify:

1. **Project creation succeeds** with the new option
2. **Combinations work** with existing options (frontend, backend, etc.)
3. **Incompatible combinations fail** with proper error messages

Example test file pattern (`apps/cli/test/[feature].test.ts`):

```typescript
import { describe, it } from "bun:test";
import { expectSuccess, runTRPCTest } from "./test-utils";

describe("[Feature] Configurations", () => {
  it("should work with [new-option] + basic config", async () => {
    const result = await runTRPCTest({
      projectName: "[new-option]-basic",
      // Add your new option here
      [newOption]: "[value]",
      // Standard config
      frontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      auth: "none",
      api: "trpc",
      addons: ["none"],
      examples: ["none"],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      install: false,
    });
    expectSuccess(result);
  });

  // Test with different frontends
  const frontends = ["tanstack-router", "react-router", "next", "tanstack-start"];
  for (const frontend of frontends) {
    it(`should work with [new-option] + ${frontend}`, async () => {
      const result = await runTRPCTest({
        projectName: `[new-option]-${frontend}`,
        [newOption]: "[value]",
        frontend: [frontend],
        // ... rest of config
        install: false,
      });
      expectSuccess(result);
    });
  }
});
```

### Step 3: Run Tests

```bash
cd apps/cli && bun test                    # Run all tests
cd apps/cli && bun test test/[feature].test.ts  # Run specific test file
```

### Step 4: Verify Test Projects Build

After tests pass, verify a sample project actually builds:

```bash
# Create a test project with the new option
cd apps/cli/.smoke
cd [test-project-name]
bun install
bun run build  # or equivalent build command
```

### Step 5: Only Then Implement Templates

After tests are green and verified, implement the actual template code.

---

## Project Structure

```
apps/
  web/                      # TanStack Start website
    src/
      routes/               # File-based routes
      components/           # React components
  cli/                      # CLI scaffolding tool
    src/
      prompts/              # User prompts (follow existing patterns)
      helpers/              # Setup helpers
      types.ts              # Re-exports from packages/types
    test/                   # Tests (IMPORTANT!)
      test-utils.ts         # Test utilities
      *.test.ts             # Test files
    .smoke/                 # Test project output directory

packages/
  types/                    # Shared types and schemas
    src/
      schemas.ts            # Zod schemas (add new options here)
  template-generator/       # Template generation logic
    src/
      processors/           # Dependency processors
  backend/                  # Convex backend
    convex/                 # Convex functions
```

---

## Quality Commands

```bash
# Linting and formatting
bun run check        # Run oxfmt and oxlint

# Building
bun run build        # Build all packages with turbo

# Testing (IMPORTANT!)
cd apps/cli && bun test                    # Run ALL tests
cd apps/cli && bun test test/api.test.ts   # Run specific test file
cd apps/cli && bun test --watch            # Watch mode

# Convex (if needed)
cd packages/backend && bun run dev
```

---

## Testing Workflow Summary

For ANY story that adds a new CLI option:

1. ✅ Add schema to `packages/types/src/schemas.ts`
2. ✅ Write tests in `apps/cli/test/[feature].test.ts`
3. ✅ Run `cd apps/cli && bun test` - tests should FAIL initially (TDD)
4. ✅ Add prompt in `apps/cli/src/prompts/[feature].ts`
5. ✅ Add to constants/defaults if needed
6. ✅ Run tests again - they should PASS now
7. ✅ Run `bun run check && bun run build`
8. ✅ Verify a smoke test project builds: `cd apps/cli/.smoke/[project] && bun install && bun run build`
9. ✅ Commit only after ALL checks pass

---

## Progress Report Format

APPEND to scripts/ralph/progress.txt:

```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- Tests added/modified
- **Test results:** [PASS/FAIL with details]
- **Learnings for future iterations:**
  - Patterns discovered
  - Gotchas encountered
---
```

---

## Stop Condition

After completing a user story, check if ALL stories have `passes: true`.

If ALL stories are complete and passing, reply with:
<promise>COMPLETE</promise>

If there are still stories with `passes: false`, end your response normally.

---

## Key Gotchas

- Use `bun` commands, not `npm` or `yarn`
- TanStack Start uses Vite, not Next.js conventions
- **ALWAYS write tests before marking schema stories as complete**
- Test projects go in `apps/cli/.smoke/` directory
- Run `bun run check` before committing (catches formatting issues)
- Tests use `install: false` to skip npm install (faster)

---

## Example: Adding AI SDK Option

Reference implementation pattern in: `scripts/ralph/examples/add-ai-schema.example.ts`

Files to modify/create:

1. `packages/types/src/schemas.ts` - Add AISchema
2. `apps/cli/test/ai.test.ts` - Add tests (NEW)
3. `apps/cli/src/prompts/ai.ts` - Add prompt (NEW)
4. `apps/cli/src/constants.ts` - Add default
5. Wire up in CLI flow
