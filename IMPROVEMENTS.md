# Improvement Ideas

A collection of potential improvements for the Better-Fullstack project.

---

## CLI & Template Generator

1. **Template validation tests** - Verify all generated templates are valid TypeScript/have no syntax errors -- should be ready
2. **Generated project E2E tests** - Actually run the generated projects and verify they work (start dev server, hit endpoints) -- should be ready
3. **Template snapshot tests** - Detect unintended changes to generated output -- should be ready
4. **Dependency conflict detection** - Warn when selected options have incompatible peer dependencies
5. **Interactive upgrade command** - `bun run cli upgrade` to update existing projects to newer templates
6. **Project health check command** - Analyze an existing project and suggest improvements
7. **Config validation** - Validate `bts.config.json` and warn about deprecated options

---

## Testing Infrastructure

8. **Matrix testing** - Test all valid frontend × backend × database combinations automatically
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

18. **VS Code extension** - Snippets, schema validation for config files
19. **CLI autocomplete** - Shell completions for bash/zsh/fish
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

### #1 Template Validation Tests (In Progress)

**Goal:** Create tests that verify all generated TypeScript/JavaScript files are syntactically valid and have no type errors.

**Context:**

- The CLI generates projects using Handlebars templates from `packages/template-generator/templates/`
- Generated files include `.ts`, `.tsx`, `.js`, `.json`, `package.json`, config files
- Current tests verify the CLI creates files, but don't verify the generated code is valid
- Need to catch template bugs like: missing imports, syntax errors, unclosed brackets, invalid TypeScript

**Approach:**

- Generate sample projects with various configurations
- Run TypeScript compiler (`tsc --noEmit`) on generated projects
- Verify no syntax/type errors
- Integrate into existing test suite

**Related files:**

- `apps/cli/test/` - Existing test infrastructure
- `packages/template-generator/templates/` - Source templates
- `apps/cli/test/test-utils.ts` - Test utilities
