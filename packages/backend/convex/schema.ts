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
	}).index("by_event", ["event"]),

	analyticsStats: defineTable({
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

	analyticsDailyStats: defineTable({
		date: v.string(),
		count: v.number(),
	}).index("by_date", ["date"]),
});
