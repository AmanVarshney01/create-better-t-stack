import { v } from "convex/values";
import { query } from "./_generated/server";

export const getShowcaseProjects = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("showcase"),
			_creationTime: v.number(),
			title: v.string(),
			description: v.string(),
			imageUrl: v.string(),
			liveUrl: v.string(),
			tags: v.array(v.string()),
		}),
	),
	handler: async (ctx) => {
		return await ctx.db.query("showcase").collect();
	},
});
