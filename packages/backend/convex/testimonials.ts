import { v } from "convex/values";
import { query } from "./_generated/server";

export const getVideos = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("videos"),
			_creationTime: v.number(),
			embedId: v.string(),
			title: v.string(),
		}),
	),
	handler: async (ctx) => {
		return await ctx.db.query("videos").collect();
	},
});

export const getTweets = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("tweets"),
			_creationTime: v.number(),
			tweetId: v.string(),
		}),
	),
	handler: async (ctx) => {
		return await ctx.db.query("tweets").collect();
	},
});
