import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Require authentication for a function
 * Throws an error if the user is not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

/**
 * Get the current user if authenticated, null otherwise
 */
export async function getCurrentUserId(ctx: QueryCtx | MutationCtx) {
  return await getAuthUserId(ctx);
}

/**
 * Check if the current user owns a resource
 */
export async function requireOwnership(
  ctx: QueryCtx | MutationCtx,
  resourceUserId: string | undefined
) {
  const currentUserId = await requireAuth(ctx);

  // Handle case where resourceUserId is undefined
  if (resourceUserId === undefined) {
    throw new Error("Resource has no owner - access denied");
  }

  if (resourceUserId !== currentUserId) {
    throw new Error("Access denied: You don't own this resource");
  }
  return currentUserId;
}
