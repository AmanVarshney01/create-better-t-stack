# Better Fullstack Website

The official website for Better Fullstack, built with TanStack Start.

## Getting Started

To run the development server:

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3333](http://localhost:3333) with your browser to see the site.

## Project Structure

- `/src/routes` - TanStack Router file-based routes
- `/src/components` - React components
- `/public` - Static assets

## Performance Budget CI

This app enforces JS/CSS bundle-size budgets in CI.

```bash
# Compare current build assets with baseline and fail on over-budget regressions
bun run perf:check

# Refresh baseline after intentional optimizations/refactors
bun run perf:baseline
```

Baseline and thresholds live in `/perf-baseline.json`.
Only update the baseline when changes are intentional and reviewed.

## Learn More

- [TanStack Start](https://tanstack.com/start) - The framework used
- [Better Fullstack](https://github.com/Marve10s/Better-Fullstack) - Main project repo
