import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  comments: defineTable({
    author: v.string(),
    content: v.string(),
  }),
});
