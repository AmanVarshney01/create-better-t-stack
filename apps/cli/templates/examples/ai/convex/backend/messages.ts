import { query, mutation, internalAction, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
{{#if auth}}
import { requireAuth, getCurrentUserId } from "./lib/auth";
{{/if}}
import { internal } from "./_generated/api";

/**
 * Get all messages for a conversation
 */
export const getMessages = query({
  args: {
    conversationId: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id("messages"),
    _creationTime: v.number(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    conversationId: v.string(),
    {{#if auth}}
    userId: v.optional(v.id("users")),
    {{/if}}
  })),
  handler: async (ctx, args) => {
    {{#if auth}}
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }
    {{/if}}

    const conversationId = args.conversationId || "default";
    
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", conversationId)
        {{#if auth}}.eq("userId", userId){{/if}}
      )
      .order("asc")
      .collect();
  },
});

/**
 * Send a message and trigger AI response
 */
export const sendMessage = mutation({
  args: {
    content: v.string(),
    conversationId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    {{#if auth}}
    const userId = await requireAuth(ctx);
    {{/if}}

    const conversationId = args.conversationId || "default";

    // Insert user message
    await ctx.db.insert("messages", {
      content: args.content,
      role: "user",
      conversationId,
      {{#if auth}}
      userId,
      {{/if}}
    });

    // Schedule AI response generation
    await ctx.scheduler.runAfter(0, internal.messages.generateAIResponse, {
      conversationId,
      {{#if auth}}
      userId,
      {{/if}}
    });

    return null;
  },
});

/**
 * Generate AI response (internal action)
 */
export const generateAIResponse = internalAction({
  args: {
    conversationId: v.string(),
    {{#if auth}}
    userId: v.id("users"),
    {{/if}}
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get recent messages for context
    const messages = await ctx.runQuery(internal.messages.getConversationContext, {
      conversationId: args.conversationId,
      {{#if auth}}
      userId: args.userId,
      {{/if}}
    });

    // Simple AI response (you can integrate with OpenAI, Anthropic, etc.)
    const aiResponse = generateSimpleResponse(messages);

    // Insert AI response
    await ctx.runMutation(internal.messages.insertAIMessage, {
      content: aiResponse,
      conversationId: args.conversationId,
      {{#if auth}}
      userId: args.userId,
      {{/if}}
    });

    return null;
  },
});

/**
 * Get conversation context (internal query)
 */
export const getConversationContext = internalQuery({
  args: {
    conversationId: v.string(),
    {{#if auth}}
    userId: v.id("users"),
    {{/if}}
  },
  returns: v.array(v.object({
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  })),
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
        {{#if auth}}.eq("userId", args.userId){{/if}}
      )
      .order("desc")
      .take(10);

    return messages.reverse().map(msg => ({
      content: msg.content,
      role: msg.role,
    }));
  },
});

/**
 * Insert AI message (internal mutation)
 */
export const insertAIMessage = internalMutation({
  args: {
    content: v.string(),
    conversationId: v.string(),
    {{#if auth}}
    userId: v.id("users"),
    {{/if}}
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      content: args.content,
      role: "assistant",
      conversationId: args.conversationId,
      {{#if auth}}
      userId: args.userId,
      {{/if}}
    });
    return null;
  },
});

// Simple AI response generator (replace with actual AI service)
function generateSimpleResponse(messages: Array<{ content: string; role: string }>): string {
  const responses = [
    "That's an interesting point! Can you tell me more?",
    "I understand what you're saying. Here's my perspective...",
    "Thanks for sharing that with me. What would you like to explore next?",
    "That's a great question! Let me think about that...",
    "I appreciate you bringing that up. Here's what I think...",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
