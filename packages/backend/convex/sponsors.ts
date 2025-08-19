import { v } from "convex/values";
import { query } from "./_generated/server";

export const getSponsors = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("sponsors"),
			_creationTime: v.number(),
			sponsor: v.object({
				login: v.string(),
				name: v.string(),
				avatarUrl: v.string(),
				websiteUrl: v.optional(v.string()),
				linkUrl: v.string(),
				customLogoUrl: v.optional(v.string()),
				type: v.string(),
			}),
			isOneTime: v.boolean(),
			monthlyDollars: v.number(),
			privacyLevel: v.string(),
			tierName: v.string(),
			createdAt: v.string(),
			provider: v.string(),
		}),
	),
	handler: async (ctx) => {
		return await ctx.db.query("sponsors").collect();
	},
});
