import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const distributionValidator = v.record(v.string(), v.number());

export default defineSchema({
  videos: defineTable({
    embedId: v.string(),
    title: v.string(),
  }),

  tweets: defineTable({
    tweetId: v.string(),
    order: v.optional(v.number()),
  }),

  showcase: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    liveUrl: v.string(),
    tags: v.array(v.string()),
  }),

  analyticsEvents: defineTable({
    // Core
    ecosystem: v.optional(v.string()),
    database: v.optional(v.string()),
    orm: v.optional(v.string()),
    backend: v.optional(v.string()),
    runtime: v.optional(v.string()),
    frontend: v.optional(v.array(v.string())),
    api: v.optional(v.string()),
    auth: v.optional(v.string()),
    // Deployment
    dbSetup: v.optional(v.string()),
    webDeploy: v.optional(v.string()),
    serverDeploy: v.optional(v.string()),
    // Addons & Examples
    addons: v.optional(v.array(v.string())),
    examples: v.optional(v.array(v.string())),
    // Integrations
    payments: v.optional(v.string()),
    email: v.optional(v.string()),
    fileUpload: v.optional(v.string()),
    // Frontend extras
    astroIntegration: v.optional(v.string()),
    cssFramework: v.optional(v.string()),
    uiLibrary: v.optional(v.string()),
    stateManagement: v.optional(v.string()),
    forms: v.optional(v.string()),
    animation: v.optional(v.string()),
    validation: v.optional(v.string()),
    // Backend extras
    realtime: v.optional(v.string()),
    jobQueue: v.optional(v.string()),
    caching: v.optional(v.string()),
    logging: v.optional(v.string()),
    observability: v.optional(v.string()),
    // AI & CMS
    ai: v.optional(v.string()),
    cms: v.optional(v.string()),
    // Testing
    testing: v.optional(v.string()),
    // Effect
    effect: v.optional(v.string()),
    // Rust ecosystem
    rustWebFramework: v.optional(v.string()),
    rustFrontend: v.optional(v.string()),
    rustOrm: v.optional(v.string()),
    rustApi: v.optional(v.string()),
    rustCli: v.optional(v.string()),
    rustLibraries: v.optional(v.array(v.string())),
    // Setup options
    git: v.optional(v.boolean()),
    packageManager: v.optional(v.string()),
    install: v.optional(v.boolean()),
    // Meta
    cli_version: v.optional(v.string()),
    node_version: v.optional(v.string()),
    platform: v.optional(v.string()),
  }),

  analyticsStats: defineTable({
    totalProjects: v.number(),
    lastEventTime: v.number(),
    // Core
    ecosystem: distributionValidator,
    backend: distributionValidator,
    frontend: distributionValidator,
    database: distributionValidator,
    orm: distributionValidator,
    api: distributionValidator,
    auth: distributionValidator,
    runtime: distributionValidator,
    // Deployment
    dbSetup: distributionValidator,
    webDeploy: distributionValidator,
    serverDeploy: distributionValidator,
    // Addons & Examples
    addons: distributionValidator,
    examples: distributionValidator,
    // Integrations
    payments: distributionValidator,
    email: distributionValidator,
    fileUpload: distributionValidator,
    // Frontend extras
    astroIntegration: distributionValidator,
    cssFramework: distributionValidator,
    uiLibrary: distributionValidator,
    stateManagement: distributionValidator,
    forms: distributionValidator,
    animation: distributionValidator,
    validation: distributionValidator,
    // Backend extras
    realtime: distributionValidator,
    jobQueue: distributionValidator,
    caching: distributionValidator,
    logging: distributionValidator,
    observability: distributionValidator,
    // AI & CMS
    ai: distributionValidator,
    cms: distributionValidator,
    // Testing
    testing: distributionValidator,
    // Effect
    effect: distributionValidator,
    // Rust ecosystem
    rustWebFramework: distributionValidator,
    rustFrontend: distributionValidator,
    rustOrm: distributionValidator,
    rustApi: distributionValidator,
    rustCli: distributionValidator,
    rustLibraries: distributionValidator,
    // Setup options
    packageManager: distributionValidator,
    platform: distributionValidator,
    git: distributionValidator,
    install: distributionValidator,
    // Meta
    nodeVersion: distributionValidator,
    cliVersion: distributionValidator,
    // Aggregations
    hourlyDistribution: v.optional(distributionValidator),
    stackCombinations: v.optional(distributionValidator),
    dbOrmCombinations: v.optional(distributionValidator),
  }),

  analyticsDailyStats: defineTable({
    date: v.string(),
    count: v.number(),
  }).index("by_date", ["date"]),
});
