# Codex Improvements Backlog

## Overview

Planned engineering improvements and ecosystem expansion for Better-Fullstack.

## Engineering

1. Improve `/api/preview` fidelity so preview output matches real generation behavior.
2. Remove stale/experimental web routes and unreferenced components.
3. Automate combinations count generation (remove hardcoded values).
4. Tighten CLI/web sync tests to remove parser skips and unmapped category blind spots.
5. Normalize naming consistency (`SvelteKit` display name, preserve backward-compatible aliases).
6. Clarify backend taxonomy in UI/CLI (standalone backend vs `self-*` fullstack modes).
7. Add canonical option metadata map for IDs, aliases, labels, and category semantics.
8. Add compatibility UX improvements (deterministic disabled reasons + suggested fallbacks).
9. Reduce snapshot brittleness by normalizing generated file whitespace/newlines.
10. Add release-focused CI lane for template snapshots + compatibility parity + CLI/web sync.
11. Add contract tests to enforce CLI/web compatibility and command parity.
12. Continue weekly upstream backports focused on reliability, dependency safety, and compatibility.

## Expansion

1. Deploy services: `vercel`, `render`, `netlify`.
2. Auth services: `kinde`, `workos`.
3. Search services: `algolia`, `opensearch`.
4. Feature flags: `unleash`, `flagsmith`.
5. Observability: `axiom`, `betterstack`, `datadog`.
6. CMS: `directus`, `keystatic`.
7. Storage: `supabase-storage`.
8. API frameworks: `pothos`, `effect-rpc`.
9. Frontend framework: `remix`.
10. Python frameworks: `flask`, `litestar`.
11. Go frameworks: `chi`, `fiber`.
12. New language ecosystems: `elixir/phoenix` or `c#/aspnet`.
