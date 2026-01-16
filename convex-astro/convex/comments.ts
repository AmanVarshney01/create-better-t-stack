import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    author: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      author: args.author,
      content: args.content,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("comments").order("desc").collect();
  },
});
