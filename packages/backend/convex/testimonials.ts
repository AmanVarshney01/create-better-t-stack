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
      order: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    const rows = await ctx.db.query("tweets").collect();
    return rows.sort((a, b) => {
      const aHas = a.order !== undefined;
      const bHas = b.order !== undefined;
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return b._creationTime - a._creationTime;
    });
  },
});
