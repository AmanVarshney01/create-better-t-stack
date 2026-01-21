import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projectCreations: defineTable({
    // Ecosystem
    ecosystem: v.string(),

    // Core stack
    database: v.string(),
    orm: v.string(),
    backend: v.string(),
    runtime: v.string(),
    frontend: v.array(v.string()),
    api: v.string(),

    // Auth & Payments
    auth: v.string(),
    payments: v.string(),

    // Addons & Examples
    addons: v.array(v.string()),
    examples: v.array(v.string()),

    // Deployment
    dbSetup: v.string(),
    webDeploy: v.string(),
    serverDeploy: v.string(),

    // UI & Styling
    cssFramework: v.string(),
    uiLibrary: v.string(),
    animation: v.string(),

    // Data & State
    stateManagement: v.string(),
    forms: v.string(),
    validation: v.string(),
    realtime: v.string(),
    caching: v.string(),

    // Backend Features
    ai: v.string(),
    effect: v.string(),
    email: v.string(),
    fileUpload: v.string(),
    jobQueue: v.string(),
    logging: v.string(),
    observability: v.string(),
    cms: v.string(),
    testing: v.string(),

    // Rust ecosystem (optional)
    rustWebFramework: v.optional(v.string()),
    rustFrontend: v.optional(v.string()),
    rustOrm: v.optional(v.string()),
    rustApi: v.optional(v.string()),
    rustCli: v.optional(v.string()),
    rustLibraries: v.optional(v.array(v.string())),

    // Optional fields
    astroIntegration: v.optional(v.string()),

    // Project settings (not PII)
    git: v.boolean(),
    packageManager: v.string(),
    install: v.boolean(),

    // Metadata
    cli_version: v.optional(v.string()),
    node_version: v.optional(v.string()),
    platform: v.optional(v.string()),
  })
    .index("by_ecosystem", ["ecosystem"])
    .index("by_backend", ["backend"])
    .index("by_database", ["database"])
    .index("by_frontend", ["frontend"]),
});
