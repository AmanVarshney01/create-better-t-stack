import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	sponsors: defineTable({
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

	videos: defineTable({
		embedId: v.string(),
		title: v.string(),
	}),

	tweets: defineTable({
		tweetId: v.string(),
	}),

	showcase: defineTable({
		title: v.string(),
		description: v.string(),
		imageUrl: v.string(),
		liveUrl: v.string(),
		tags: v.array(v.string()),
	}),
});
