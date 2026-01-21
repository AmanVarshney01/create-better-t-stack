import { v } from "convex/values";

import { internalMutation, query } from "./_generated/server";

export const insertProjectCreation = internalMutation({
  args: {
    ecosystem: v.string(),
    database: v.string(),
    orm: v.string(),
    backend: v.string(),
    runtime: v.string(),
    frontend: v.array(v.string()),
    api: v.string(),
    auth: v.string(),
    payments: v.string(),
    addons: v.array(v.string()),
    examples: v.array(v.string()),
    dbSetup: v.string(),
    webDeploy: v.string(),
    serverDeploy: v.string(),
    cssFramework: v.string(),
    uiLibrary: v.string(),
    animation: v.string(),
    stateManagement: v.string(),
    forms: v.string(),
    validation: v.string(),
    realtime: v.string(),
    caching: v.string(),
    ai: v.string(),
    effect: v.string(),
    email: v.string(),
    fileUpload: v.string(),
    jobQueue: v.string(),
    logging: v.string(),
    observability: v.string(),
    cms: v.string(),
    testing: v.string(),
    rustWebFramework: v.optional(v.string()),
    rustFrontend: v.optional(v.string()),
    rustOrm: v.optional(v.string()),
    rustApi: v.optional(v.string()),
    rustCli: v.optional(v.string()),
    rustLibraries: v.optional(v.array(v.string())),
    astroIntegration: v.optional(v.string()),
    git: v.boolean(),
    packageManager: v.string(),
    install: v.boolean(),
    cli_version: v.optional(v.string()),
    node_version: v.optional(v.string()),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("projectCreations", args);
  },
});

// Query to get all project creations (for dashboard)
export const listProjectCreations = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    return await ctx.db.query("projectCreations").order("desc").take(limit);
  },
});

// Query to get stats
export const getStats = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("projectCreations").collect();

    const stats = {
      total: all.length,
      byEcosystem: {} as Record<string, number>,
      byBackend: {} as Record<string, number>,
      byDatabase: {} as Record<string, number>,
      byAuth: {} as Record<string, number>,
      byAI: {} as Record<string, number>,
      byPackageManager: {} as Record<string, number>,
      byPlatform: {} as Record<string, number>,
    };

    for (const project of all) {
      // Ecosystem
      stats.byEcosystem[project.ecosystem] = (stats.byEcosystem[project.ecosystem] ?? 0) + 1;
      // Backend
      stats.byBackend[project.backend] = (stats.byBackend[project.backend] ?? 0) + 1;
      // Database
      stats.byDatabase[project.database] = (stats.byDatabase[project.database] ?? 0) + 1;
      // Auth
      stats.byAuth[project.auth] = (stats.byAuth[project.auth] ?? 0) + 1;
      // AI
      stats.byAI[project.ai] = (stats.byAI[project.ai] ?? 0) + 1;
      // Package Manager
      stats.byPackageManager[project.packageManager] =
        (stats.byPackageManager[project.packageManager] ?? 0) + 1;
      // Platform
      if (project.platform) {
        stats.byPlatform[project.platform] = (stats.byPlatform[project.platform] ?? 0) + 1;
      }
    }

    return stats;
  },
});
