import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Authentication tables
  ...authTables,

  // Application tables
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.optional(v.id("users")), // Link todos to users
  }).index("by_user", ["userId"]),

  {{#if (includes examples "ai")}}
  // AI Chat messages
  messages: defineTable({
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    conversationId: v.string(),
    userId: v.optional(v.id("users")),
  }).index("by_conversation", ["conversationId", "userId"]),
  {{/if}}
});
