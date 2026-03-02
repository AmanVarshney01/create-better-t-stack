# Codex Improvements Plan (2026-03-02)

## Overview

This document tracks the prioritized backlog for upcoming Better-Fullstack engineering improvements and ecosystem expansion work.

## Improvement Backlog (Engineering)

1. Finish Task 3: improve `/api/preview` fidelity so preview output matches real generation behavior.
2. Remove stale/experimental web routes and unreferenced components to reduce maintenance cost.
3. Automate combinations count generation (remove hardcoded values).
4. Tighten CLI/web sync tests to remove parser skips and unmapped category blind spots.
5. Normalize naming consistency:
   - Use `SvelteKit` consistently in UI copy.
   - Keep backward-compatible aliases for existing IDs (`svelte`, `self-svelte`) while migrating display names.
6. Clarify backend taxonomy in UI/CLI:
   - Split backend options into standalone backends vs framework fullstack (`self-*`) modes.
7. Add canonical option metadata map:
   - Single source for IDs, aliases, labels, and category semantics used by CLI + web + URL state.
8. Add compatibility UX improvements:
   - Deterministic disabled reasons.
   - One-click suggested compatible fallback selections.
9. Reduce snapshot brittleness:
   - Normalize generated file whitespace/newlines before snapshot assertions.
10. Add release-focused CI lane:

- Fast fail for key template snapshots + compatibility parity + CLI/web sync.

11. Add contract tests for CLI/web parity:

- Same normalized stack input must yield equivalent compatibility and command outcomes.

12. Continue weekly upstream backports:

- Prioritize reliability fixes, dependency safety, and compatibility improvements.

## Expansion Backlog (Libraries/Frameworks/Languages/Services)

1. Deploy services: `vercel`, `render`, `netlify`.
2. Auth services: `kinde`, `workos`.
3. Search services: `algolia`, `opensearch`.
4. Feature flags: `unleash`, `flagsmith`.
5. Observability services: `axiom`, `betterstack`, `datadog`.
6. CMS: `directus`, `keystatic`.
7. Storage: `supabase-storage`.
8. API frameworks: `pothos`, `effect-rpc`.
9. Frontend framework: `remix`.
10. Python frameworks: `flask`, `litestar`.
11. Go frameworks: `chi`, `fiber`.
12. New language ecosystems: `elixir/phoenix` or `c#/aspnet`.
