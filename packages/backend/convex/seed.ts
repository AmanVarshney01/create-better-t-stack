import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";

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

const databases = ["none", "sqlite", "postgres", "mysql", "mongodb"] as const;
const orms = ["drizzle", "prisma", "mongoose", "none"] as const;
const backends = ["hono", "express", "fastify", "elysia", "convex", "self", "none"] as const;
const runtimes = ["bun", "node", "workers", "none"] as const;
const frontends = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
  "nuxt",
  "native-bare",
  "native-uniwind",
  "native-unistyles",
  "svelte",
  "solid",
  "none",
] as const;
const addonOptions = [
  "pwa",
  "tauri",
  "starlight",
  "biome",
  "husky",
  "ruler",
  "turborepo",
  "fumadocs",
  "ultracite",
  "oxlint",
  "opentui",
  "wxt",
] as const;
const exampleOptions = ["todo", "ai", "none"] as const;
const packageManagers = ["npm", "pnpm", "bun"] as const;
const dbSetups = [
  "turso",
  "neon",
  "prisma-postgres",
  "planetscale",
  "mongodb-atlas",
  "supabase",
  "d1",
  "docker",
  "none",
] as const;
const apis = ["trpc", "orpc", "none"] as const;
const auths = ["better-auth", "clerk", "none"] as const;
const paymentsOptions = ["polar", "none"] as const;
const deploys = ["cloudflare", "none"] as const;
const platforms = ["darwin", "linux", "win32"] as const;
const cliVersions = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0"] as const;
const nodeVersions = ["v18.0.0", "v20.0.0", "v22.0.0", "v23.0.0"] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: readonly T[], maxCount: number): T[] {
  const count = Math.floor(Math.random() * (maxCount + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateRandomEvent() {
  const database = randomFrom(databases);
  const backend = randomFrom(backends);

  let orm: (typeof orms)[number] = "none";
  if (database !== "none" && database !== "mongodb") {
    orm = randomFrom(["drizzle", "prisma", "none"] as const);
  } else if (database === "mongodb") {
    orm = randomFrom(["mongoose", "none"] as const);
  }

  let runtime: (typeof runtimes)[number] = "none";
  if (backend !== "none" && backend !== "convex") {
    runtime = randomFrom(["bun", "node", "workers"] as const);
  }

  let api: (typeof apis)[number] = "none";
  if (backend !== "none" && backend !== "convex") {
    api = randomFrom(apis);
  }

  const frontend = [randomFrom(frontends)];
  const addons = randomSubset(addonOptions, 4);
  const examples = randomSubset(
    exampleOptions.filter((e) => e !== "none"),
    2,
  );
  const auth = randomFrom(auths);
  const payments = randomFrom(paymentsOptions);
  const packageManager = randomFrom(packageManagers);

  let dbSetup: (typeof dbSetups)[number] = "none";
  if (database !== "none") {
    dbSetup = randomFrom(dbSetups);
  }

  const webDeploy = randomFrom(deploys);
  const serverDeploy = randomFrom(deploys);

  return {
    database,
    orm,
    backend,
    runtime,
    frontend,
    addons,
    examples,
    auth,
    payments,
    git: Math.random() > 0.2,
    packageManager,
    install: Math.random() > 0.3,
    dbSetup,
    api,
    webDeploy,
    serverDeploy,
    cli_version: randomFrom(cliVersions),
    node_version: randomFrom(nodeVersions),
    platform: randomFrom(platforms),
  };
}

export const seedAnalytics = mutation({
  args: {
    count: v.optional(v.number()),
    days: v.optional(v.number()),
    clearExisting: v.optional(v.boolean()),
  },
  returns: v.object({
    seeded: v.number(),
  }),
  handler: async (ctx, args) => {
    const count = args.count ?? 100;
    const days = args.days ?? 60;

    if (args.clearExisting) {
      const existingEvents = await ctx.db.query("analyticsEvents").collect();
      for (const event of existingEvents) {
        await ctx.db.delete(event._id);
      }

      const existingStats = await ctx.db.query("analyticsStats").first();
      if (existingStats) {
        await ctx.db.delete(existingStats._id);
      }

      const existingDaily = await ctx.db.query("analyticsDailyStats").collect();
      for (const daily of existingDaily) {
        await ctx.db.delete(daily._id);
      }
    }

    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * days);
      const hourOfDay = Math.floor(Math.random() * 24);

      await ctx.scheduler.runAfter(i * 10, internal.seed.ingestSeedEvent, {
        event: generateRandomEvent(),
        daysAgo,
        hourOfDay,
      });
    }

    return { seeded: count };
  },
});

export const ingestSeedEvent = internalMutation({
  args: {
    event: v.object({
      database: v.string(),
      orm: v.string(),
      backend: v.string(),
      runtime: v.string(),
      frontend: v.array(v.string()),
      addons: v.array(v.string()),
      examples: v.array(v.string()),
      auth: v.string(),
      payments: v.string(),
      git: v.boolean(),
      packageManager: v.string(),
      install: v.boolean(),
      dbSetup: v.string(),
      api: v.string(),
      webDeploy: v.string(),
      serverDeploy: v.string(),
      cli_version: v.string(),
      node_version: v.string(),
      platform: v.string(),
    }),
    daysAgo: v.number(),
    hourOfDay: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { event, daysAgo, hourOfDay } = args;

    await ctx.db.insert("analyticsEvents", {
      database: event.database,
      orm: event.orm,
      backend: event.backend,
      runtime: event.runtime,
      frontend: event.frontend,
      addons: event.addons,
      examples: event.examples,
      auth: event.auth,
      payments: event.payments,
      git: event.git,
      packageManager: event.packageManager,
      install: event.install,
      dbSetup: event.dbSetup,
      api: event.api,
      webDeploy: event.webDeploy,
      serverDeploy: event.serverDeploy,
      cli_version: event.cli_version,
      node_version: event.node_version,
      platform: event.platform,
    });

    const now = Date.now();
    const eventTime = now - daysAgo * 24 * 60 * 60 * 1000;
    const date = new Date(eventTime).toISOString().slice(0, 10);

    const dailyStats = await ctx.db
      .query("analyticsDailyStats")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();

    if (dailyStats) {
      await ctx.db.patch(dailyStats._id, { count: dailyStats.count + 1 });
    } else {
      await ctx.db.insert("analyticsDailyStats", { date, count: 1 });
    }

    const hourKey = String(hourOfDay).padStart(2, "0");
    const existingStats = await ctx.db.query("analyticsStats").first();

    if (existingStats) {
      const fe = event.frontend[0] || "none";
      const be = event.backend || "none";
      const stackKey = `${be} + ${fe}`;
      const db = event.database || "none";
      const o = event.orm || "none";
      const dbOrmKey = `${db} + ${o}`;

      await ctx.db.patch(existingStats._id, {
        totalProjects: existingStats.totalProjects + 1,
        lastEventTime: Date.now(),
        backend: incrementKey(existingStats.backend, event.backend),
        frontend: incrementKeys(existingStats.frontend, event.frontend),
        database: incrementKey(existingStats.database, event.database),
        orm: incrementKey(existingStats.orm, event.orm),
        api: incrementKey(existingStats.api, event.api),
        auth: incrementKey(existingStats.auth, event.auth),
        runtime: incrementKey(existingStats.runtime, event.runtime),
        packageManager: incrementKey(existingStats.packageManager, event.packageManager),
        platform: incrementKey(existingStats.platform, event.platform),
        addons: incrementKeys(existingStats.addons, event.addons),
        examples: incrementKeys(existingStats.examples, event.examples),
        dbSetup: incrementKey(existingStats.dbSetup, event.dbSetup),
        webDeploy: incrementKey(existingStats.webDeploy, event.webDeploy),
        serverDeploy: incrementKey(existingStats.serverDeploy, event.serverDeploy),
        payments: incrementKey(existingStats.payments, event.payments),
        git: incrementBool(existingStats.git, event.git),
        install: incrementBool(existingStats.install, event.install),
        nodeVersion: incrementKey(existingStats.nodeVersion, getMajorVersion(event.node_version)),
        cliVersion: incrementKey(existingStats.cliVersion, event.cli_version),
        hourlyDistribution: incrementKey(existingStats.hourlyDistribution || {}, hourKey),
        stackCombinations: incrementKey(existingStats.stackCombinations || {}, stackKey),
        dbOrmCombinations: incrementKey(existingStats.dbOrmCombinations || {}, dbOrmKey),
      });
    } else {
      const emptyDist: Record<string, number> = {};
      const fe = event.frontend[0] || "none";
      const be = event.backend || "none";
      const stackKey = `${be} + ${fe}`;
      const db = event.database || "none";
      const o = event.orm || "none";
      const dbOrmKey = `${db} + ${o}`;

      await ctx.db.insert("analyticsStats", {
        totalProjects: 1,
        lastEventTime: Date.now(),
        backend: incrementKey(emptyDist, event.backend),
        frontend: incrementKeys(emptyDist, event.frontend),
        database: incrementKey(emptyDist, event.database),
        orm: incrementKey(emptyDist, event.orm),
        api: incrementKey(emptyDist, event.api),
        auth: incrementKey(emptyDist, event.auth),
        runtime: incrementKey(emptyDist, event.runtime),
        packageManager: incrementKey(emptyDist, event.packageManager),
        platform: incrementKey(emptyDist, event.platform),
        addons: incrementKeys(emptyDist, event.addons),
        examples: incrementKeys(emptyDist, event.examples),
        dbSetup: incrementKey(emptyDist, event.dbSetup),
        webDeploy: incrementKey(emptyDist, event.webDeploy),
        serverDeploy: incrementKey(emptyDist, event.serverDeploy),
        payments: incrementKey(emptyDist, event.payments),
        git: incrementBool(emptyDist, event.git),
        install: incrementBool(emptyDist, event.install),
        nodeVersion: incrementKey(emptyDist, getMajorVersion(event.node_version)),
        cliVersion: incrementKey(emptyDist, event.cli_version),
        hourlyDistribution: incrementKey(emptyDist, hourKey),
        stackCombinations: incrementKey(emptyDist, stackKey),
        dbOrmCombinations: incrementKey(emptyDist, dbOrmKey),
      });
    }

    return null;
  },
});

export const rebuildStats = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existingStats = await ctx.db.query("analyticsStats").first();
    if (existingStats) {
      await ctx.db.delete(existingStats._id);
    }

    const events = await ctx.db.query("analyticsEvents").collect();

    const emptyDist: Record<string, number> = {};
    const stats = {
      totalProjects: 0,
      lastEventTime: 0,
      backend: { ...emptyDist },
      frontend: { ...emptyDist },
      database: { ...emptyDist },
      orm: { ...emptyDist },
      api: { ...emptyDist },
      auth: { ...emptyDist },
      runtime: { ...emptyDist },
      packageManager: { ...emptyDist },
      platform: { ...emptyDist },
      addons: { ...emptyDist },
      examples: { ...emptyDist },
      dbSetup: { ...emptyDist },
      webDeploy: { ...emptyDist },
      serverDeploy: { ...emptyDist },
      payments: { ...emptyDist },
      git: { ...emptyDist },
      install: { ...emptyDist },
      nodeVersion: { ...emptyDist },
      cliVersion: { ...emptyDist },
      hourlyDistribution: { ...emptyDist },
      stackCombinations: { ...emptyDist },
      dbOrmCombinations: { ...emptyDist },
    };

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

      if (ev.backend) stats.backend[ev.backend] = (stats.backend[ev.backend] || 0) + 1;
      if (ev.frontend) {
        for (const f of ev.frontend) {
          stats.frontend[f] = (stats.frontend[f] || 0) + 1;
        }
      }
      if (ev.database) stats.database[ev.database] = (stats.database[ev.database] || 0) + 1;
      if (ev.orm) stats.orm[ev.orm] = (stats.orm[ev.orm] || 0) + 1;
      if (ev.api) stats.api[ev.api] = (stats.api[ev.api] || 0) + 1;
      if (ev.auth) stats.auth[ev.auth] = (stats.auth[ev.auth] || 0) + 1;
      if (ev.runtime) stats.runtime[ev.runtime] = (stats.runtime[ev.runtime] || 0) + 1;
      if (ev.packageManager)
        stats.packageManager[ev.packageManager] =
          (stats.packageManager[ev.packageManager] || 0) + 1;
      if (ev.platform) stats.platform[ev.platform] = (stats.platform[ev.platform] || 0) + 1;
      if (ev.addons) {
        for (const a of ev.addons) {
          stats.addons[a] = (stats.addons[a] || 0) + 1;
        }
      }
      if (ev.examples) {
        for (const e of ev.examples) {
          stats.examples[e] = (stats.examples[e] || 0) + 1;
        }
      }
      if (ev.dbSetup) stats.dbSetup[ev.dbSetup] = (stats.dbSetup[ev.dbSetup] || 0) + 1;
      if (ev.webDeploy) stats.webDeploy[ev.webDeploy] = (stats.webDeploy[ev.webDeploy] || 0) + 1;
      if (ev.serverDeploy)
        stats.serverDeploy[ev.serverDeploy] = (stats.serverDeploy[ev.serverDeploy] || 0) + 1;
      if (ev.payments) stats.payments[ev.payments] = (stats.payments[ev.payments] || 0) + 1;

      const gitKey = ev.git === true ? "Yes" : ev.git === false ? "No" : null;
      if (gitKey) stats.git[gitKey] = (stats.git[gitKey] || 0) + 1;

      const installKey = ev.install === true ? "Yes" : ev.install === false ? "No" : null;
      if (installKey) stats.install[installKey] = (stats.install[installKey] || 0) + 1;

      if (ev.node_version) {
        const major = `v${ev.node_version.replace("v", "").split(".")[0]}`;
        stats.nodeVersion[major] = (stats.nodeVersion[major] || 0) + 1;
      }
      if (ev.cli_version)
        stats.cliVersion[ev.cli_version] = (stats.cliVersion[ev.cli_version] || 0) + 1;

      stats.hourlyDistribution[hourKey] = (stats.hourlyDistribution[hourKey] || 0) + 1;
      stats.stackCombinations[stackKey] = (stats.stackCombinations[stackKey] || 0) + 1;
      stats.dbOrmCombinations[dbOrmKey] = (stats.dbOrmCombinations[dbOrmKey] || 0) + 1;
    }

    if (stats.totalProjects > 0) {
      await ctx.db.insert("analyticsStats", stats);
    }

    return null;
  },
});
