import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, getCurrentUserId } from "./lib/auth";

/**
 * Get the current authenticated user's profile
 */
export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.string(),
      emailVerified: v.optional(v.number()),
      image: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

/**
 * Update the current user's profile
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.string(),
      emailVerified: v.optional(v.number()),
      image: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Validate input fields
    if (args.name !== undefined) {
      if (args.name.length > 100) {
        throw new Error("Name cannot exceed 100 characters");
      }
    }

    if (args.image !== undefined) {
      try {
        new URL(args.image);
      } catch {
        throw new Error("Image must be a valid URL");
      }
    }

    const updates: { name?: string; image?: string } = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.image !== undefined) updates.image = args.image;

    await ctx.db.patch(userId, updates);
    return await ctx.db.get(userId);
  },
});

/**
 * Get a user by ID (internal function)
 */
export const getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.string(),
      emailVerified: v.optional(v.number()),
      image: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * List public user profiles (returns limited public information)
 */
export const listPublicUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const limit = args.limit ?? 50;
    const users = await ctx.db.query("users").take(limit);

    // Return only public information (exclude email and emailVerified)
    return users.map(user => ({
      _id: user._id,
      _creationTime: user._creationTime,
      name: user.name,
      image: user.image,
    }));
  },
});
