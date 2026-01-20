import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

function incrementKey(
  dist: Record<string, number>,
  key: string | undefined,
): Record<string, number> {
  if (!key) return dist;
  return { ...dist, [key]: (dist[key] || 0) + 1 };
}

function incrementKeys(
  dist: Record<string, number>,
  keys: string[] | undefined,
): Record<string, number> {
  if (!keys) return dist;
  const result = { ...dist };
  for (const key of keys) {
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

function incrementBool(
  dist: Record<string, number>,
  val: boolean | undefined,
): Record<string, number> {
  if (val === undefined) return dist;
  const key = val ? "Yes" : "No";
  return { ...dist, [key]: (dist[key] || 0) + 1 };
}

function getMajorVersion(version: string | undefined): string | undefined {
  if (!version) return undefined;
  const clean = version.startsWith("v") ? version.slice(1) : version;
  return `v${clean.split(".")[0]}`;
}

export const ingestEvent = internalMutation({
  args: {
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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("analyticsEvents", args);
    const event = await ctx.db.get(id);
    const now = event!._creationTime;

    const hourKey = String(new Date(now).getUTCHours()).padStart(2, "0");
    const fe = args.frontend?.[0] || "none";
    const be = args.backend || "none";
    const stackKey = `${be} + ${fe}`;
    const db = args.database || "none";
    const o = args.orm || "none";
    const dbOrmKey = `${db} + ${o}`;

    const existingStats = await ctx.db.query("analyticsStats").first();

    if (existingStats) {
      await ctx.db.patch("analyticsStats", existingStats._id, {
        totalProjects: existingStats.totalProjects + 1,
        lastEventTime: now,
        // Core
        ecosystem: incrementKey(existingStats.ecosystem, args.ecosystem),
        backend: incrementKey(existingStats.backend, args.backend),
        frontend: incrementKeys(existingStats.frontend, args.frontend),
        database: incrementKey(existingStats.database, args.database),
        orm: incrementKey(existingStats.orm, args.orm),
        api: incrementKey(existingStats.api, args.api),
        auth: incrementKey(existingStats.auth, args.auth),
        runtime: incrementKey(existingStats.runtime, args.runtime),
        // Deployment
        dbSetup: incrementKey(existingStats.dbSetup, args.dbSetup),
        webDeploy: incrementKey(existingStats.webDeploy, args.webDeploy),
        serverDeploy: incrementKey(existingStats.serverDeploy, args.serverDeploy),
        // Addons & Examples
        addons: incrementKeys(existingStats.addons, args.addons),
        examples: incrementKeys(existingStats.examples, args.examples),
        // Integrations
        payments: incrementKey(existingStats.payments, args.payments),
        email: incrementKey(existingStats.email, args.email),
        fileUpload: incrementKey(existingStats.fileUpload, args.fileUpload),
        // Frontend extras
        astroIntegration: incrementKey(existingStats.astroIntegration, args.astroIntegration),
        cssFramework: incrementKey(existingStats.cssFramework, args.cssFramework),
        uiLibrary: incrementKey(existingStats.uiLibrary, args.uiLibrary),
        stateManagement: incrementKey(existingStats.stateManagement, args.stateManagement),
        forms: incrementKey(existingStats.forms, args.forms),
        animation: incrementKey(existingStats.animation, args.animation),
        validation: incrementKey(existingStats.validation, args.validation),
        // Backend extras
        realtime: incrementKey(existingStats.realtime, args.realtime),
        jobQueue: incrementKey(existingStats.jobQueue, args.jobQueue),
        caching: incrementKey(existingStats.caching, args.caching),
        logging: incrementKey(existingStats.logging, args.logging),
        observability: incrementKey(existingStats.observability, args.observability),
        // AI & CMS
        ai: incrementKey(existingStats.ai, args.ai),
        cms: incrementKey(existingStats.cms, args.cms),
        // Testing
        testing: incrementKey(existingStats.testing, args.testing),
        // Effect
        effect: incrementKey(existingStats.effect, args.effect),
        // Rust ecosystem
        rustWebFramework: incrementKey(existingStats.rustWebFramework, args.rustWebFramework),
        rustFrontend: incrementKey(existingStats.rustFrontend, args.rustFrontend),
        rustOrm: incrementKey(existingStats.rustOrm, args.rustOrm),
        rustApi: incrementKey(existingStats.rustApi, args.rustApi),
        rustCli: incrementKey(existingStats.rustCli, args.rustCli),
        rustLibraries: incrementKeys(existingStats.rustLibraries, args.rustLibraries),
        // Setup options
        packageManager: incrementKey(existingStats.packageManager, args.packageManager),
        platform: incrementKey(existingStats.platform, args.platform),
        git: incrementBool(existingStats.git, args.git),
        install: incrementBool(existingStats.install, args.install),
        // Meta
        nodeVersion: incrementKey(existingStats.nodeVersion, getMajorVersion(args.node_version)),
        cliVersion: incrementKey(existingStats.cliVersion, args.cli_version),
        // Aggregations
        hourlyDistribution: incrementKey(existingStats.hourlyDistribution || {}, hourKey),
        stackCombinations: incrementKey(existingStats.stackCombinations || {}, stackKey),
        dbOrmCombinations: incrementKey(existingStats.dbOrmCombinations || {}, dbOrmKey),
      });
    } else {
      const emptyDist: Record<string, number> = {};
      await ctx.db.insert("analyticsStats", {
        totalProjects: 1,
        lastEventTime: now,
        // Core
        ecosystem: incrementKey(emptyDist, args.ecosystem),
        backend: incrementKey(emptyDist, args.backend),
        frontend: incrementKeys(emptyDist, args.frontend),
        database: incrementKey(emptyDist, args.database),
        orm: incrementKey(emptyDist, args.orm),
        api: incrementKey(emptyDist, args.api),
        auth: incrementKey(emptyDist, args.auth),
        runtime: incrementKey(emptyDist, args.runtime),
        // Deployment
        dbSetup: incrementKey(emptyDist, args.dbSetup),
        webDeploy: incrementKey(emptyDist, args.webDeploy),
        serverDeploy: incrementKey(emptyDist, args.serverDeploy),
        // Addons & Examples
        addons: incrementKeys(emptyDist, args.addons),
        examples: incrementKeys(emptyDist, args.examples),
        // Integrations
        payments: incrementKey(emptyDist, args.payments),
        email: incrementKey(emptyDist, args.email),
        fileUpload: incrementKey(emptyDist, args.fileUpload),
        // Frontend extras
        astroIntegration: incrementKey(emptyDist, args.astroIntegration),
        cssFramework: incrementKey(emptyDist, args.cssFramework),
        uiLibrary: incrementKey(emptyDist, args.uiLibrary),
        stateManagement: incrementKey(emptyDist, args.stateManagement),
        forms: incrementKey(emptyDist, args.forms),
        animation: incrementKey(emptyDist, args.animation),
        validation: incrementKey(emptyDist, args.validation),
        // Backend extras
        realtime: incrementKey(emptyDist, args.realtime),
        jobQueue: incrementKey(emptyDist, args.jobQueue),
        caching: incrementKey(emptyDist, args.caching),
        logging: incrementKey(emptyDist, args.logging),
        observability: incrementKey(emptyDist, args.observability),
        // AI & CMS
        ai: incrementKey(emptyDist, args.ai),
        cms: incrementKey(emptyDist, args.cms),
        // Testing
        testing: incrementKey(emptyDist, args.testing),
        // Effect
        effect: incrementKey(emptyDist, args.effect),
        // Rust ecosystem
        rustWebFramework: incrementKey(emptyDist, args.rustWebFramework),
        rustFrontend: incrementKey(emptyDist, args.rustFrontend),
        rustOrm: incrementKey(emptyDist, args.rustOrm),
        rustApi: incrementKey(emptyDist, args.rustApi),
        rustCli: incrementKey(emptyDist, args.rustCli),
        rustLibraries: incrementKeys(emptyDist, args.rustLibraries),
        // Setup options
        packageManager: incrementKey(emptyDist, args.packageManager),
        platform: incrementKey(emptyDist, args.platform),
        git: incrementBool(emptyDist, args.git),
        install: incrementBool(emptyDist, args.install),
        // Meta
        nodeVersion: incrementKey(emptyDist, getMajorVersion(args.node_version)),
        cliVersion: incrementKey(emptyDist, args.cli_version),
        // Aggregations
        hourlyDistribution: incrementKey(emptyDist, hourKey),
        stackCombinations: incrementKey(emptyDist, stackKey),
        dbOrmCombinations: incrementKey(emptyDist, dbOrmKey),
      });
    }

    const today = new Date(now).toISOString().slice(0, 10);
    const dailyStats = await ctx.db
      .query("analyticsDailyStats")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (dailyStats) {
      await ctx.db.patch("analyticsDailyStats", dailyStats._id, { count: dailyStats.count + 1 });
    } else {
      await ctx.db.insert("analyticsDailyStats", { date: today, count: 1 });
    }

    return null;
  },
});

const distributionValidator = v.record(v.string(), v.number());

export const getStats = query({
  args: {},
  returns: v.union(
    v.object({
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
      hourlyDistribution: distributionValidator,
      stackCombinations: distributionValidator,
      dbOrmCombinations: distributionValidator,
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const stats = await ctx.db.query("analyticsStats").first();
    if (!stats) return null;
    return {
      totalProjects: stats.totalProjects,
      lastEventTime: stats.lastEventTime,
      // Core
      ecosystem: stats.ecosystem,
      backend: stats.backend,
      frontend: stats.frontend,
      database: stats.database,
      orm: stats.orm,
      api: stats.api,
      auth: stats.auth,
      runtime: stats.runtime,
      // Deployment
      dbSetup: stats.dbSetup,
      webDeploy: stats.webDeploy,
      serverDeploy: stats.serverDeploy,
      // Addons & Examples
      addons: stats.addons,
      examples: stats.examples,
      // Integrations
      payments: stats.payments,
      email: stats.email,
      fileUpload: stats.fileUpload,
      // Frontend extras
      astroIntegration: stats.astroIntegration,
      cssFramework: stats.cssFramework,
      uiLibrary: stats.uiLibrary,
      stateManagement: stats.stateManagement,
      forms: stats.forms,
      animation: stats.animation,
      validation: stats.validation,
      // Backend extras
      realtime: stats.realtime,
      jobQueue: stats.jobQueue,
      caching: stats.caching,
      logging: stats.logging,
      observability: stats.observability,
      // AI & CMS
      ai: stats.ai,
      cms: stats.cms,
      // Testing
      testing: stats.testing,
      // Effect
      effect: stats.effect,
      // Rust ecosystem
      rustWebFramework: stats.rustWebFramework,
      rustFrontend: stats.rustFrontend,
      rustOrm: stats.rustOrm,
      rustApi: stats.rustApi,
      rustCli: stats.rustCli,
      rustLibraries: stats.rustLibraries,
      // Setup options
      packageManager: stats.packageManager,
      platform: stats.platform,
      git: stats.git,
      install: stats.install,
      nodeVersion: stats.nodeVersion,
      cliVersion: stats.cliVersion,
      hourlyDistribution: stats.hourlyDistribution || {},
      stackCombinations: stats.stackCombinations || {},
      dbOrmCombinations: stats.dbOrmCombinations || {},
    };
  },
});

export const getDailyStats = query({
  args: {
    days: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      date: v.string(),
      count: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const now = Date.now();
    const today = new Date(now).toISOString().slice(0, 10);
    const cutoffDate = new Date(now - (days - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const allDaily = await ctx.db
      .query("analyticsDailyStats")
      .withIndex("by_date")
      .order("asc")
      .collect();

    return allDaily
      .filter((d) => d.date >= cutoffDate && d.date <= today)
      .map((d) => ({ date: d.date, count: d.count }));
  },
});

export const getRecentEvents = query({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 30 * 60 * 1000;
    return await ctx.db
      .query("analyticsEvents")
      .order("desc")
      .filter((q) => q.gte(q.field("_creationTime"), cutoff))
      .collect();
  },
});

export const backfillStats = mutation({
  args: {},
  returns: v.object({
    totalProcessed: v.number(),
    dailyDates: v.number(),
  }),
  handler: async (ctx) => {
    const existing = await ctx.db.query("analyticsStats").first();
    if (existing) {
      await ctx.db.delete("analyticsStats", existing._id);
    }

    const existingDaily = await ctx.db.query("analyticsDailyStats").collect();
    for (const d of existingDaily) {
      await ctx.db.delete("analyticsDailyStats", d._id);
    }

    const events = await ctx.db.query("analyticsEvents").collect();

    const emptyDist: Record<string, number> = {};
    const stats = {
      totalProjects: 0,
      lastEventTime: 0,
      // Core
      ecosystem: { ...emptyDist },
      backend: { ...emptyDist },
      frontend: { ...emptyDist },
      database: { ...emptyDist },
      orm: { ...emptyDist },
      api: { ...emptyDist },
      auth: { ...emptyDist },
      runtime: { ...emptyDist },
      // Deployment
      dbSetup: { ...emptyDist },
      webDeploy: { ...emptyDist },
      serverDeploy: { ...emptyDist },
      // Addons & Examples
      addons: { ...emptyDist },
      examples: { ...emptyDist },
      // Integrations
      payments: { ...emptyDist },
      email: { ...emptyDist },
      fileUpload: { ...emptyDist },
      // Frontend extras
      astroIntegration: { ...emptyDist },
      cssFramework: { ...emptyDist },
      uiLibrary: { ...emptyDist },
      stateManagement: { ...emptyDist },
      forms: { ...emptyDist },
      animation: { ...emptyDist },
      validation: { ...emptyDist },
      // Backend extras
      realtime: { ...emptyDist },
      jobQueue: { ...emptyDist },
      caching: { ...emptyDist },
      logging: { ...emptyDist },
      observability: { ...emptyDist },
      // AI & CMS
      ai: { ...emptyDist },
      cms: { ...emptyDist },
      // Testing
      testing: { ...emptyDist },
      // Effect
      effect: { ...emptyDist },
      // Rust ecosystem
      rustWebFramework: { ...emptyDist },
      rustFrontend: { ...emptyDist },
      rustOrm: { ...emptyDist },
      rustApi: { ...emptyDist },
      rustCli: { ...emptyDist },
      rustLibraries: { ...emptyDist },
      // Setup options
      packageManager: { ...emptyDist },
      platform: { ...emptyDist },
      git: { ...emptyDist },
      install: { ...emptyDist },
      // Meta
      nodeVersion: { ...emptyDist },
      cliVersion: { ...emptyDist },
      // Aggregations
      hourlyDistribution: { ...emptyDist },
      stackCombinations: { ...emptyDist },
      dbOrmCombinations: { ...emptyDist },
    };

    const dailyCounts = new Map<string, number>();

    for (const ev of events) {
      stats.totalProjects++;
      if (ev._creationTime > stats.lastEventTime) {
        stats.lastEventTime = ev._creationTime;
      }

      const hourKey = String(new Date(ev._creationTime).getUTCHours()).padStart(2, "0");
      const fe = ev.frontend?.[0] || "none";
      const be = ev.backend || "none";
      const stackKey = `${be} + ${fe}`;
      const db = ev.database || "none";
      const o = ev.orm || "none";
      const dbOrmKey = `${db} + ${o}`;

      // Core
      stats.ecosystem = incrementKey(stats.ecosystem, ev.ecosystem);
      stats.backend = incrementKey(stats.backend, ev.backend);
      stats.frontend = incrementKeys(stats.frontend, ev.frontend);
      stats.database = incrementKey(stats.database, ev.database);
      stats.orm = incrementKey(stats.orm, ev.orm);
      stats.api = incrementKey(stats.api, ev.api);
      stats.auth = incrementKey(stats.auth, ev.auth);
      stats.runtime = incrementKey(stats.runtime, ev.runtime);
      // Deployment
      stats.dbSetup = incrementKey(stats.dbSetup, ev.dbSetup);
      stats.webDeploy = incrementKey(stats.webDeploy, ev.webDeploy);
      stats.serverDeploy = incrementKey(stats.serverDeploy, ev.serverDeploy);
      // Addons & Examples
      stats.addons = incrementKeys(stats.addons, ev.addons);
      stats.examples = incrementKeys(stats.examples, ev.examples);
      // Integrations
      stats.payments = incrementKey(stats.payments, ev.payments);
      stats.email = incrementKey(stats.email, ev.email);
      stats.fileUpload = incrementKey(stats.fileUpload, ev.fileUpload);
      // Frontend extras
      stats.astroIntegration = incrementKey(stats.astroIntegration, ev.astroIntegration);
      stats.cssFramework = incrementKey(stats.cssFramework, ev.cssFramework);
      stats.uiLibrary = incrementKey(stats.uiLibrary, ev.uiLibrary);
      stats.stateManagement = incrementKey(stats.stateManagement, ev.stateManagement);
      stats.forms = incrementKey(stats.forms, ev.forms);
      stats.animation = incrementKey(stats.animation, ev.animation);
      stats.validation = incrementKey(stats.validation, ev.validation);
      // Backend extras
      stats.realtime = incrementKey(stats.realtime, ev.realtime);
      stats.jobQueue = incrementKey(stats.jobQueue, ev.jobQueue);
      stats.caching = incrementKey(stats.caching, ev.caching);
      stats.logging = incrementKey(stats.logging, ev.logging);
      stats.observability = incrementKey(stats.observability, ev.observability);
      // AI & CMS
      stats.ai = incrementKey(stats.ai, ev.ai);
      stats.cms = incrementKey(stats.cms, ev.cms);
      // Testing
      stats.testing = incrementKey(stats.testing, ev.testing);
      // Effect
      stats.effect = incrementKey(stats.effect, ev.effect);
      // Rust ecosystem
      stats.rustWebFramework = incrementKey(stats.rustWebFramework, ev.rustWebFramework);
      stats.rustFrontend = incrementKey(stats.rustFrontend, ev.rustFrontend);
      stats.rustOrm = incrementKey(stats.rustOrm, ev.rustOrm);
      stats.rustApi = incrementKey(stats.rustApi, ev.rustApi);
      stats.rustCli = incrementKey(stats.rustCli, ev.rustCli);
      stats.rustLibraries = incrementKeys(stats.rustLibraries, ev.rustLibraries);
      // Setup options
      stats.packageManager = incrementKey(stats.packageManager, ev.packageManager);
      stats.platform = incrementKey(stats.platform, ev.platform);
      stats.git = incrementBool(stats.git, ev.git);
      stats.install = incrementBool(stats.install, ev.install);
      // Meta
      stats.nodeVersion = incrementKey(stats.nodeVersion, getMajorVersion(ev.node_version));
      stats.cliVersion = incrementKey(stats.cliVersion, ev.cli_version);
      // Aggregations
      stats.hourlyDistribution = incrementKey(stats.hourlyDistribution, hourKey);
      stats.stackCombinations = incrementKey(stats.stackCombinations, stackKey);
      stats.dbOrmCombinations = incrementKey(stats.dbOrmCombinations, dbOrmKey);

      const date = new Date(ev._creationTime).toISOString().slice(0, 10);
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
    }

    if (stats.totalProjects > 0) {
      await ctx.db.insert("analyticsStats", stats);
    }

    for (const [date, count] of dailyCounts) {
      await ctx.db.insert("analyticsDailyStats", { date, count });
    }

    return {
      totalProcessed: stats.totalProjects,
      dailyDates: dailyCounts.size,
    };
  },
});
