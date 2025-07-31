import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, getCurrentUserId, requireOwnership } from "./lib/auth";

export const getAll = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("todos"),
    _creationTime: v.number(),
    text: v.string(),
    completed: v.boolean(),
    userId: v.optional(v.id("users")),
  })),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      // Return empty array for unauthenticated users
      return [];
    }

    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
  },
  returns: v.union(v.object({
    _id: v.id("todos"),
    _creationTime: v.number(),
    text: v.string(),
    completed: v.boolean(),
    userId: v.optional(v.id("users")),
  }), v.null()),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const newTodoId = await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      userId,
    });
    return await ctx.db.get(newTodoId);
  },
});

export const toggle = mutation({
  args: {
    id: v.id("todos"),
    completed: v.boolean(),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    await requireOwnership(ctx, todo.userId);

    await ctx.db.patch(args.id, { completed: args.completed });
    return { success: true };
  },
});

export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    await requireOwnership(ctx, todo.userId);

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
