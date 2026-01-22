# Improvement Ideas

A collection of potential improvements for the Better-Fullstack project.

---

## CLI & Template Generator

1. **Template validation tests** - Verify all generated templates are valid TypeScript/have no syntax errors _(Implemented)_
2. **Generated project E2E tests** - Actually run the generated projects and verify they work (start dev server, hit endpoints) _(Implemented)_
3. **Template snapshot tests** - Detect unintended changes to generated output _(Implemented)_
4. **Dependency conflict detection** - Warn when selected options have incompatible peer dependencies _(Implemented)_
5. **Project health check command** - Analyze an existing project and suggest improvements
6. **Config validation** - Validate `bts.config.json` and warn about deprecated options

---

## Testing Infrastructure

8. **Matrix testing** - Test all valid frontend × backend × database combinations automatically _(Implemented)_
9. **Generated project build verification** - CI job that builds sample generated projects
10. **Performance benchmarks** - Track CLI execution time, template generation speed
11. **Visual regression tests** - Screenshot testing for the web builder UI
12. **API contract tests** - Ensure CLI flags match web builder options

---

## Documentation

13. **Auto-generated CLI docs** - Generate documentation from Zod schemas
14. **Changelog automation** - Auto-generate changelog from commit messages
15. **Example projects gallery** - Showcase of projects built with Better-Fullstack
16. **Video tutorials** - Walkthrough of common use cases
17. **Troubleshooting guide** - Common errors and solutions

---

## Developer Experience

20. **Better error messages** - Suggest fixes for common mistakes
21. **Offline mode** - Cache npm registry responses for faster repeated runs
22. **Debug mode** - Verbose logging to diagnose template generation issues

---

## Web Builder

23. **Shareable stack links** - Short URLs for sharing configurations
24. **Stack comparison** - Compare two configurations side-by-side
25. **Popularity stats** - Show which combinations are most used
26. **Compatibility warnings** - Real-time warnings when selecting incompatible options
27. **Export to different formats** - Export config as JSON, YAML, or shell script

---

## CI/CD & Release

28. **Automated canary releases** - Publish canary versions on every PR
29. **Release preview environments** - Deploy preview of docs/web for each PR
30. **Dependency update automation** - Weekly PR for outdated deps _(Implemented)_
31. **Breaking change detection** - Warn when PRs contain breaking changes
32. **Multi-platform testing** - Test CLI on Windows, macOS, Linux

---

## Analytics & Insights

33. **Usage analytics dashboard** - See which options are popular (opt-in)
34. **Error reporting** - Collect anonymous crash reports to fix bugs
35. **Feature request voting** - Let users vote on new features
36. **Community showcases** - User-submitted projects built with the CLI

---

## Code Quality

37. **Stricter TypeScript** - Enable more strict compiler options
38. **Dead code detection** - Find unused templates or code paths
39. **Circular dependency detection** - Prevent circular imports
40. **Bundle analysis** - Track and optimize CLI bundle size

---

## Priority Recommendations

### Quick Wins (High Impact, Low Effort)

- #8 Matrix testing - Catch compatibility bugs early
- #18 CLI autocomplete - Better UX with minimal effort
- #20 Better error messages - Reduce support burden
- #23 Shareable links - Already partially done with URL state

### High Impact (Medium Effort)

- #2 E2E tests on generated projects - Ensure templates actually work
- #5 Upgrade command - Help existing users stay current
- #9 Generated project build verification in CI - Catch regressions

### Nice to Have

- #18 VS Code extension
- #33 Usage analytics dashboard
- #15 Example projects gallery

---

## Current Work

### #1-3 Template Validation, E2E, and Snapshot Tests (Completed)

**Status:** Implemented in `apps/cli/test/`

**Files:**

- `apps/cli/test/template-validation.test.ts` - Validates TypeScript/JSON syntax for all configurations
- `apps/cli/test/e2e.test.ts` - End-to-end tests that run generated projects
- `apps/cli/test/template-snapshots.test.ts` - Snapshot tests for generated output
- `apps/cli/test/validation-utils.ts` - Shared validation utilities

---

### #8 Matrix Testing System (Completed)

**Status:** Implemented in `apps/cli/test/matrix/`

**Goal:** Automatically test ALL valid frontend × backend × database × ORM combinations.

**Implementation:**

```
apps/cli/test/matrix/
├── combination-generator.ts  # Generates valid combinations from compatibility rules
└── matrix-test.test.ts       # Test suite that validates all combinations
```

**Key Statistics:**

- Tier 1 (Core Stack): ~1,451 valid combinations out of 6,600 theoretical (22% coverage)
- Tier 2 (+ API variations): ~5,588 valid combinations
- Tier 3 (+ Auth variations): ~16,579 valid combinations

**Compatibility Rules Encoded:**

- Database-ORM compatibility (e.g., MongoDB only works with Mongoose/Prisma)
- Backend-Runtime compatibility (e.g., Elysia only works with Bun)
- Frontend-Backend compatibility (e.g., Qwik/Angular/Redwood/Fresh require backend=none)
- Frontend-API compatibility (e.g., tRPC requires React-based frontends)
- Special cases: Convex, NextAuth, Astro integrations, Workers runtime

**Usage:**

```bash
# Run all Tier 1 tests (takes ~3-4 hours)
bun test ./test/matrix/matrix-test.test.ts

# Run specific combination tests
bun test ./test/matrix/matrix-test.test.ts -t "validates: tanstack-router_hono_sqlite_drizzle"

# Run edge case tests only
bun test ./test/matrix/matrix-test.test.ts -t "Edge Cases"

# Run coverage report
bun test ./test/matrix/matrix-test.test.ts -t "Coverage Report"
```

**Test Configuration:**
Edit `TEST_CONFIG` in `matrix-test.test.ts` to enable Tier 2/3 tests:

```typescript
const TEST_CONFIG = {
  tier1: true,   // Core stack (~1,451 combinations)
  tier2: false,  // + API variations (~5,588 combinations)
  tier3: false,  // + Auth variations (~16,579 combinations)
};
```

**Performance:**

- Each test takes ~8-10 seconds (uses `createVirtual()` for in-memory generation)
- Full Tier 1 suite: ~3-4 hours
- Recommended: Run as scheduled nightly test or on-demand, not on every PR
