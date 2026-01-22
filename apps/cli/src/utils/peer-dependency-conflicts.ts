/**
 * Peer dependency conflict definitions.
 *
 * This file contains declarative definitions of known package conflicts
 * that can occur based on CLI option selections.
 */

export interface PeerDependencyConflict {
  /** Unique identifier for the conflict */
  id: string;
  /** Human-readable explanation of the conflict */
  description: string;
  /** Packages involved in the conflict */
  packages: string[];
  /** Whether to block (error) or just warn */
  severity: "error" | "warning";
  /** Actionable advice for resolving the conflict */
  resolution: string;
  /** CLI options that trigger this conflict check */
  triggeredBy: {
    optionKey: string;
    values: string[];
  }[];
  /** Options that conflict with the triggering options */
  conflictsWithOptions: {
    optionKey: string;
    values: string[];
  }[];
}

/**
 * Known peer dependency conflicts.
 *
 * Add new conflicts here as they are discovered.
 * The validator will check these against the user's selected options.
 */
export const PEER_DEPENDENCY_CONFLICTS: PeerDependencyConflict[] = [
  // 1. React 19 + older state management
  {
    id: "redux-toolkit-react19",
    description: "redux-toolkit with React 19 may have peer dependency warnings",
    packages: ["@reduxjs/toolkit", "react-redux"],
    severity: "warning",
    resolution: "Consider using zustand or jotai for React 19 projects, or ensure react-redux v9+",
    triggeredBy: [{ optionKey: "stateManagement", values: ["redux-toolkit"] }],
    conflictsWithOptions: [{ optionKey: "frontend", values: ["next"] }], // Next 15 uses React 19
  },

  // 2. Effect ecosystem with Zod
  {
    id: "effect-schema-zod-overlap",
    description: "@effect/schema and zod both provide validation - may cause confusion",
    packages: ["@effect/schema", "zod"],
    severity: "warning",
    resolution: "Use --validation effect-schema with Effect, or --effect none with Zod",
    triggeredBy: [{ optionKey: "effect", values: ["effect-full"] }],
    conflictsWithOptions: [{ optionKey: "validation", values: ["zod"] }],
  },

  // 3. Prisma D1 requires specific versions
  {
    id: "prisma-d1-version",
    description: "Prisma with D1 requires Prisma 5.x+ and specific adapter setup",
    packages: ["prisma", "@prisma/adapter-d1"],
    severity: "warning",
    resolution: "Consider Drizzle ORM for simpler D1 integration",
    triggeredBy: [{ optionKey: "orm", values: ["prisma"] }],
    conflictsWithOptions: [{ optionKey: "dbSetup", values: ["d1"] }],
  },

  // 4. Biome conflicts with ESLint/Prettier addons
  {
    id: "biome-linting-overlap",
    description: "Biome includes linting/formatting - other linting addons are redundant",
    packages: ["@biomejs/biome", "eslint", "prettier"],
    severity: "warning",
    resolution: "Choose either Biome (all-in-one) or other linting tools, not both",
    triggeredBy: [{ optionKey: "addons", values: ["biome"] }],
    conflictsWithOptions: [{ optionKey: "addons", values: ["ultracite", "oxlint"] }],
  },

  // 5. Animation libraries with React 19
  {
    id: "framer-motion-react19",
    description: "framer-motion versions <12 may have React 19 issues",
    packages: ["framer-motion"],
    severity: "warning",
    resolution: "The CLI uses motion (framer-motion v12+) which supports React 19",
    triggeredBy: [{ optionKey: "animation", values: ["framer-motion"] }],
    conflictsWithOptions: [{ optionKey: "frontend", values: ["next"] }],
  },
];
