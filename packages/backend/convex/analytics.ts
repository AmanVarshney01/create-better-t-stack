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
		event: v.string(),
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
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const now = Date.now();
		await ctx.db.insert("analyticsEvents", args);

		const existingStats = await ctx.db.query("analyticsStats").first();

		if (existingStats) {
			await ctx.db.patch(existingStats._id, {
				totalProjects: existingStats.totalProjects + 1,
				lastEventTime: now,
				backend: incrementKey(existingStats.backend, args.backend),
				frontend: incrementKeys(existingStats.frontend, args.frontend),
				database: incrementKey(existingStats.database, args.database),
				orm: incrementKey(existingStats.orm, args.orm),
				api: incrementKey(existingStats.api, args.api),
				auth: incrementKey(existingStats.auth, args.auth),
				runtime: incrementKey(existingStats.runtime, args.runtime),
				packageManager: incrementKey(
					existingStats.packageManager,
					args.packageManager,
				),
				platform: incrementKey(existingStats.platform, args.platform),
				addons: incrementKeys(existingStats.addons, args.addons),
				examples: incrementKeys(existingStats.examples, args.examples),
				dbSetup: incrementKey(existingStats.dbSetup, args.dbSetup),
				webDeploy: incrementKey(existingStats.webDeploy, args.webDeploy),
				serverDeploy: incrementKey(
					existingStats.serverDeploy,
					args.serverDeploy,
				),
				payments: incrementKey(existingStats.payments, args.payments),
				git: incrementBool(existingStats.git, args.git),
				install: incrementBool(existingStats.install, args.install),
				nodeVersion: incrementKey(
					existingStats.nodeVersion,
					getMajorVersion(args.node_version),
				),
				cliVersion: incrementKey(existingStats.cliVersion, args.cli_version),
			});
		} else {
			const emptyDist: Record<string, number> = {};
			await ctx.db.insert("analyticsStats", {
				totalProjects: 1,
				lastEventTime: now,
				backend: incrementKey(emptyDist, args.backend),
				frontend: incrementKeys(emptyDist, args.frontend),
				database: incrementKey(emptyDist, args.database),
				orm: incrementKey(emptyDist, args.orm),
				api: incrementKey(emptyDist, args.api),
				auth: incrementKey(emptyDist, args.auth),
				runtime: incrementKey(emptyDist, args.runtime),
				packageManager: incrementKey(emptyDist, args.packageManager),
				platform: incrementKey(emptyDist, args.platform),
				addons: incrementKeys(emptyDist, args.addons),
				examples: incrementKeys(emptyDist, args.examples),
				dbSetup: incrementKey(emptyDist, args.dbSetup),
				webDeploy: incrementKey(emptyDist, args.webDeploy),
				serverDeploy: incrementKey(emptyDist, args.serverDeploy),
				payments: incrementKey(emptyDist, args.payments),
				git: incrementBool(emptyDist, args.git),
				install: incrementBool(emptyDist, args.install),
				nodeVersion: incrementKey(
					emptyDist,
					getMajorVersion(args.node_version),
				),
				cliVersion: incrementKey(emptyDist, args.cli_version),
			});
		}

		const today = new Date(now).toISOString().slice(0, 10);
		const dailyStats = await ctx.db
			.query("analyticsDailyStats")
			.withIndex("by_date", (q) => q.eq("date", today))
			.first();

		if (dailyStats) {
			await ctx.db.patch(dailyStats._id, { count: dailyStats.count + 1 });
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
		const cutoffDate = new Date(now - days * 24 * 60 * 60 * 1000)
			.toISOString()
			.slice(0, 10);

		const allDaily = await ctx.db
			.query("analyticsDailyStats")
			.withIndex("by_date")
			.order("asc")
			.collect();

		return allDaily
			.filter((d) => d.date >= cutoffDate)
			.map((d) => ({ date: d.date, count: d.count }));
	},
});

export const getAllEvents = query({
	args: {
		range: v.optional(
			v.union(
				v.literal("all"),
				v.literal("30d"),
				v.literal("7d"),
				v.literal("1d"),
			),
		),
	},
	returns: v.array(
		v.object({
			_id: v.id("analyticsEvents"),
			_creationTime: v.number(),
			event: v.string(),
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
		const events = await ctx.db
			.query("analyticsEvents")
			.order("desc")
			.collect();
		if (!args.range || args.range === "all") {
			return events;
		}

		const now = Date.now();
		const days =
			args.range === "30d"
				? 30
				: args.range === "7d"
					? 7
					: args.range === "1d"
						? 1
						: 0;
		if (days === 0) {
			return events;
		}

		const cutoff = now - days * 24 * 60 * 60 * 1000;
		return events.filter((e) => e._creationTime >= cutoff);
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
			await ctx.db.delete(existing._id);
		}

		const existingDaily = await ctx.db.query("analyticsDailyStats").collect();
		for (const d of existingDaily) {
			await ctx.db.delete(d._id);
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
		};

		const dailyCounts = new Map<string, number>();

		for (const ev of events) {
			stats.totalProjects++;
			if (ev._creationTime > stats.lastEventTime) {
				stats.lastEventTime = ev._creationTime;
			}

			stats.backend = incrementKey(stats.backend, ev.backend);
			stats.frontend = incrementKeys(stats.frontend, ev.frontend);
			stats.database = incrementKey(stats.database, ev.database);
			stats.orm = incrementKey(stats.orm, ev.orm);
			stats.api = incrementKey(stats.api, ev.api);
			stats.auth = incrementKey(stats.auth, ev.auth);
			stats.runtime = incrementKey(stats.runtime, ev.runtime);
			stats.packageManager = incrementKey(
				stats.packageManager,
				ev.packageManager,
			);
			stats.platform = incrementKey(stats.platform, ev.platform);
			stats.addons = incrementKeys(stats.addons, ev.addons);
			stats.examples = incrementKeys(stats.examples, ev.examples);
			stats.dbSetup = incrementKey(stats.dbSetup, ev.dbSetup);
			stats.webDeploy = incrementKey(stats.webDeploy, ev.webDeploy);
			stats.serverDeploy = incrementKey(stats.serverDeploy, ev.serverDeploy);
			stats.payments = incrementKey(stats.payments, ev.payments);
			stats.git = incrementBool(stats.git, ev.git);
			stats.install = incrementBool(stats.install, ev.install);
			stats.nodeVersion = incrementKey(
				stats.nodeVersion,
				getMajorVersion(ev.node_version),
			);
			stats.cliVersion = incrementKey(stats.cliVersion, ev.cli_version);

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
