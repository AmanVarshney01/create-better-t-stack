import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

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
		await ctx.db.insert("analyticsEvents", args);
		return null;
	},
});

export const getAllEvents = query({
	args: {},
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
	handler: async (ctx) => {
		return await ctx.db.query("analyticsEvents").order("desc").collect();
	},
});
