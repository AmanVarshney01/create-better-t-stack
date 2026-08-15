import { AnalyticsEventSchema, normalizeAnalyticsSelection } from "@better-t-stack/types";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { buildDailyWindow } from "./analytics_date_utils";
import {
  adjustAnalyticsStats,
  createEmptyAnalyticsStats,
  type AnalyticsStatsFields,
} from "./analytics_helpers";

const MAX_DAILY_STATS_WINDOW = 366;
const ANALYTICS_REPAIR_BATCH_SIZE = 512;

function incrementDistribution(distribution: Record<string, number>, keys: string[]): void {
  for (const key of keys) {
    distribution[key] = (distribution[key] || 0) + 1;
  }
}

function normalizeStats(stats: {
  totalProjects: number;
  lastEventTime: number;
  backend: Record<string, number>;
  frontend: Record<string, number>;
  database: Record<string, number>;
  orm: Record<string, number>;
  api: Record<string, number>;
  auth: Record<string, number>;
  runtime: Record<string, number>;
  packageManager: Record<string, number>;
  platform: Record<string, number>;
  addons: Record<string, number>;
  examples: Record<string, number>;
  dbSetup: Record<string, number>;
  webDeploy: Record<string, number>;
  serverDeploy: Record<string, number>;
  payments: Record<string, number>;
  git: Record<string, number>;
  install: Record<string, number>;
  nodeVersion: Record<string, number>;
  cliVersion: Record<string, number>;
  hourlyDistribution?: Record<string, number>;
  stackCombinations?: Record<string, number>;
  dbOrmCombinations?: Record<string, number>;
}): AnalyticsStatsFields {
  return {
    ...stats,
    hourlyDistribution: stats.hourlyDistribution || {},
    stackCombinations: stats.stackCombinations || {},
    dbOrmCombinations: stats.dbOrmCombinations || {},
  };
}

export const ingestEvent = internalMutation({
  args: {
    database: v.optional(v.string()),
    orm: v.optional(v.string()),
    backend: v.optional(v.string()),
    runtime: v.optional(v.string()),
    frontend: v.optional(v.array(v.string())),
    addons: v.optional(v.array(v.string())),
    examples: v.optional(v.array(v.string())),
    auth: v.optional(v.string()),
    payments: v.optional(v.string()),
    git: v.optional(v.boolean()),
    packageManager: v.optional(v.string()),
    install: v.optional(v.boolean()),
    dbSetup: v.optional(v.string()),
    api: v.optional(v.string()),
    webDeploy: v.optional(v.string()),
    serverDeploy: v.optional(v.string()),
    cli_version: v.string(),
    node_version: v.string(),
    platform: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const parsed = AnalyticsEventSchema.safeParse(args);
    if (!parsed.success) {
      throw new Error("Invalid analytics event");
    }

    const id = await ctx.db.insert("analyticsEvents", parsed.data);
    const event = await ctx.db.get(id);
    const now = event!._creationTime;
    const existingStats = await ctx.db.query("analyticsStats").first();
    const nextStats = adjustAnalyticsStats(
      existingStats ? normalizeStats(existingStats) : createEmptyAnalyticsStats(),
      [{ event: parsed.data, creationTime: now }],
      1,
    );

    if (existingStats) {
      await ctx.db.patch("analyticsStats", existingStats._id, nextStats);
    } else {
      await ctx.db.insert("analyticsStats", nextStats);
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
      backend: distributionValidator,
      frontend: distributionValidator,
      database: distributionValidator,
      orm: distributionValidator,
      api: distributionValidator,
      auth: distributionValidator,
      runtime: distributionValidator,
      packageManager: distributionValidator,
      platform: distributionValidator,
      addons: distributionValidator,
      examples: distributionValidator,
      dbSetup: distributionValidator,
      webDeploy: distributionValidator,
      serverDeploy: distributionValidator,
      payments: distributionValidator,
      git: distributionValidator,
      install: distributionValidator,
      nodeVersion: distributionValidator,
      cliVersion: distributionValidator,
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
      backend: stats.backend,
      frontend: stats.frontend,
      database: stats.database,
      orm: stats.orm,
      api: stats.api,
      auth: stats.auth,
      runtime: stats.runtime,
      packageManager: stats.packageManager,
      platform: stats.platform,
      addons: stats.addons,
      examples: stats.examples,
      dbSetup: stats.dbSetup,
      webDeploy: stats.webDeploy,
      serverDeploy: stats.serverDeploy,
      payments: stats.payments,
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
    const now = Date.now();
    const today = new Date(now).toISOString().slice(0, 10);
    const requestedDays = args.days;
    const sanitizedDays =
      requestedDays !== undefined && Number.isFinite(requestedDays) && requestedDays > 0
        ? Math.min(Math.floor(requestedDays), MAX_DAILY_STATS_WINDOW)
        : 30;
    const cutoffDate = new Date(now - (sanitizedDays - 1) * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const dailyStats = await ctx.db
      .query("analyticsDailyStats")
      .withIndex("by_date", (q) => q.gte("date", cutoffDate).lte("date", today))
      .order("asc")
      .collect();

    return buildDailyWindow(
      dailyStats.map((d) => ({ date: d.date, count: d.count })),
      cutoffDate,
      today,
    );
  },
});

export const getMonthlyStats = query({
  args: {},
  returns: v.object({
    monthly: v.array(
      v.object({
        month: v.string(),
        totalProjects: v.number(),
      }),
    ),
    firstDate: v.union(v.string(), v.null()),
    lastDate: v.union(v.string(), v.null()),
  }),
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const allDaily = await ctx.db
      .query("analyticsDailyStats")
      .withIndex("by_date", (q) => q.lte("date", today))
      .order("asc")
      .collect();

    if (allDaily.length === 0) {
      return { monthly: [], firstDate: null, lastDate: null };
    }

    const byMonth = new Map<string, number>();
    for (const d of allDaily) {
      const month = d.date.slice(0, 7);
      byMonth.set(month, (byMonth.get(month) || 0) + d.count);
    }

    const monthly = Array.from(byMonth.entries())
      .map(([month, totalProjects]) => ({ month, totalProjects }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      monthly,
      firstDate: allDaily[0]?.date ?? null,
      lastDate: allDaily[allDaily.length - 1]?.date ?? null,
    };
  },
});

export const getRecentEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("analyticsEvents"),
      _creationTime: v.number(),
      database: v.optional(v.string()),
      orm: v.optional(v.string()),
      backend: v.optional(v.string()),
      runtime: v.optional(v.string()),
      frontend: v.optional(v.array(v.string())),
      addons: v.optional(v.array(v.string())),
      examples: v.optional(v.array(v.string())),
      auth: v.optional(v.string()),
      payments: v.optional(v.string()),
      git: v.optional(v.boolean()),
      packageManager: v.optional(v.string()),
      install: v.optional(v.boolean()),
      dbSetup: v.optional(v.string()),
      api: v.optional(v.string()),
      webDeploy: v.optional(v.string()),
      serverDeploy: v.optional(v.string()),
      cli_version: v.optional(v.string()),
      node_version: v.optional(v.string()),
      platform: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const limit =
      args.limit !== undefined && Number.isFinite(args.limit) && args.limit > 0
        ? Math.min(Math.floor(args.limit), 50)
        : 20;

    return await ctx.db
      .query("analyticsEvents")
      .withIndex("by_quarantined", (q) => q.eq("quarantinedAt", undefined))
      .order("desc")
      .take(limit);
  },
});

export const getSelectionDistributionsBatch = internalQuery({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    continueCursor: v.string(),
    isDone: v.boolean(),
    scanned: v.number(),
    frontend: distributionValidator,
    addons: distributionValidator,
    examples: distributionValidator,
  }),
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_quarantined", (q) => q.eq("quarantinedAt", undefined))
      .order("asc")
      .paginate(args.paginationOpts);
    const frontend: Record<string, number> = {};
    const addons: Record<string, number> = {};
    const examples: Record<string, number> = {};

    for (const event of page.page) {
      incrementDistribution(frontend, normalizeAnalyticsSelection(event.frontend));
      incrementDistribution(addons, normalizeAnalyticsSelection(event.addons));
      incrementDistribution(examples, normalizeAnalyticsSelection(event.examples));
    }

    return {
      continueCursor: page.continueCursor,
      isDone: page.isDone,
      scanned: page.page.length,
      frontend,
      addons,
      examples,
    };
  },
});

export const replaceSelectionDistributions = internalMutation({
  args: {
    expectedTotal: v.number(),
    frontend: distributionValidator,
    addons: distributionValidator,
    examples: distributionValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const stats = await ctx.db.query("analyticsStats").first();
    if (!stats) {
      throw new Error("Cannot rebuild missing analytics stats");
    }
    if (stats.totalProjects !== args.expectedTotal) {
      throw new Error(
        `Expected ${args.expectedTotal} active events, stats contain ${stats.totalProjects}`,
      );
    }

    await ctx.db.patch(stats._id, {
      frontend: args.frontend,
      addons: args.addons,
      examples: args.examples,
    });
    return null;
  },
});

export const rebuildSelectionDistributions = internalAction({
  args: {
    dryRun: v.boolean(),
  },
  returns: v.object({
    scanned: v.number(),
    frontend: distributionValidator,
    addons: distributionValidator,
    examples: distributionValidator,
  }),
  handler: async (ctx, args) => {
    let cursor: string | null = null;
    let scanned = 0;
    const frontend: Record<string, number> = {};
    const addons: Record<string, number> = {};
    const examples: Record<string, number> = {};

    while (true) {
      const result: {
        continueCursor: string;
        isDone: boolean;
        scanned: number;
        frontend: Record<string, number>;
        addons: Record<string, number>;
        examples: Record<string, number>;
      } = await ctx.runQuery(internal.analytics.getSelectionDistributionsBatch, {
        paginationOpts: {
          numItems: ANALYTICS_REPAIR_BATCH_SIZE,
          cursor,
        },
      });

      scanned += result.scanned;
      for (const [key, count] of Object.entries(result.frontend)) {
        frontend[key] = (frontend[key] || 0) + count;
      }
      for (const [key, count] of Object.entries(result.addons)) {
        addons[key] = (addons[key] || 0) + count;
      }
      for (const [key, count] of Object.entries(result.examples)) {
        examples[key] = (examples[key] || 0) + count;
      }

      if (result.isDone) break;
      cursor = result.continueCursor;
    }

    if (!args.dryRun) {
      await ctx.runMutation(internal.analytics.replaceSelectionDistributions, {
        expectedTotal: scanned,
        frontend,
        addons,
        examples,
      });
    }

    return { scanned, frontend, addons, examples };
  },
});

export const quarantineInvalidEventsBatch = internalMutation({
  args: {
    paginationOpts: paginationOptsValidator,
    dryRun: v.boolean(),
  },
  returns: v.object({
    continueCursor: v.string(),
    isDone: v.boolean(),
    scanned: v.number(),
    invalid: v.number(),
    quarantined: v.number(),
  }),
  handler: async (ctx, args) => {
    const page = await ctx.db.query("analyticsEvents").order("asc").paginate(args.paginationOpts);
    const invalidEvents = page.page.filter(
      (event) =>
        event.quarantinedAt === undefined && !AnalyticsEventSchema.safeParse(event).success,
    );

    if (!args.dryRun && invalidEvents.length > 0) {
      const stats = await ctx.db.query("analyticsStats").first();
      if (!stats) {
        throw new Error("Cannot repair analytics events without aggregate stats");
      }

      const nextStats = adjustAnalyticsStats(
        normalizeStats(stats),
        invalidEvents.map((event) => ({ event, creationTime: event._creationTime })),
        -1,
        { legacyVersionKeys: true },
      );
      const dailyDecrements = new Map<string, number>();

      for (const event of invalidEvents) {
        const date = new Date(event._creationTime).toISOString().slice(0, 10);
        dailyDecrements.set(date, (dailyDecrements.get(date) || 0) + 1);
        await ctx.db.patch(event._id, {
          quarantinedAt: Date.now(),
          quarantineReason: "invalid_payload",
        });
      }

      await ctx.db.patch(stats._id, nextStats);

      for (const [date, decrement] of dailyDecrements) {
        const dailyStats = await ctx.db
          .query("analyticsDailyStats")
          .withIndex("by_date", (q) => q.eq("date", date))
          .first();
        if (!dailyStats || dailyStats.count < decrement) {
          throw new Error(`Cannot safely decrement analytics for ${date}`);
        }

        const nextCount = dailyStats.count - decrement;
        await ctx.db.patch(dailyStats._id, { count: nextCount });
      }
    }

    return {
      continueCursor: page.continueCursor,
      isDone: page.isDone,
      scanned: page.page.length,
      invalid: invalidEvents.length,
      quarantined: args.dryRun ? 0 : invalidEvents.length,
    };
  },
});

export const syncLastEventTime = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const stats = await ctx.db.query("analyticsStats").first();
    if (!stats) return null;

    const latestEvent = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_quarantined", (q) => q.eq("quarantinedAt", undefined))
      .order("desc")
      .first();
    if (!latestEvent) {
      await ctx.db.patch(stats._id, { lastEventTime: 0 });
      return null;
    }

    await ctx.db.patch(stats._id, { lastEventTime: latestEvent._creationTime });
    return null;
  },
});

export const quarantineInvalidEvents = internalAction({
  args: {
    dryRun: v.boolean(),
  },
  returns: v.object({
    scanned: v.number(),
    invalid: v.number(),
    quarantined: v.number(),
  }),
  handler: async (ctx, args) => {
    let cursor: string | null = null;
    let scanned = 0;
    let invalid = 0;
    let quarantined = 0;

    while (true) {
      const result: {
        continueCursor: string;
        isDone: boolean;
        scanned: number;
        invalid: number;
        quarantined: number;
      } = await ctx.runMutation(internal.analytics.quarantineInvalidEventsBatch, {
        paginationOpts: {
          numItems: ANALYTICS_REPAIR_BATCH_SIZE,
          cursor,
        },
        dryRun: args.dryRun,
      });

      scanned += result.scanned;
      invalid += result.invalid;
      quarantined += result.quarantined;

      if (result.isDone) break;
      cursor = result.continueCursor;
    }

    if (!args.dryRun) {
      await ctx.runMutation(internal.analytics.syncLastEventTime, {});
    }

    return { scanned, invalid, quarantined };
  },
});
