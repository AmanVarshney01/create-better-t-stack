/**
 * Once you have your authentication type defined (e.g. Cookie, OAuth, etc.),
 * you can add auth to your API functions by importing this file
 * and calling `isAuthenticated()` and `hasRole()` in your handler functions.
 *
 * @see https://redwoodjs.com/docs/authentication
 */
import type { Decoded } from "@redwoodjs/api";

/**
 * Represents the user attributes returned by the decoding the
 * Authentication provider's JWT token together with any additional
 * attributes that you wish to add to the user's context.
 */
export interface CurrentUser {
  id: string;
  email?: string;
  roles?: string[];
}

/**
 * The session object sent in as the first argument to getCurrentUser() will
 * have a single key `id` containing the unique ID of the logged in user
 * (whatever field you set as `authFields.id` in your auth function config).
 */
export const getCurrentUser = async (
  decoded: Decoded,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { _token, _type }: { _token: string; _type: string },
): Promise<CurrentUser | null> => {
  if (!decoded) {
    return null;
  }

  // Add your custom user lookup logic here
  return {
    id: decoded.sub || decoded.id || "user",
    email: decoded.email,
    roles: decoded.roles || [],
  };
};

/**
 * The user is authenticated if there is a currentUser in the context
 */
export const isAuthenticated = (): boolean => {
  return !!context.currentUser;
};

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enum types if you have defined them.
 */
export const hasRole = (roles: string | string[]): boolean => {
  if (!isAuthenticated()) {
    return false;
  }

  const currentUserRoles = context.currentUser?.roles;

  if (typeof roles === "string") {
    if (typeof currentUserRoles === "string") {
      return currentUserRoles === roles;
    } else if (Array.isArray(currentUserRoles)) {
      return currentUserRoles?.some((allowedRole) => roles === allowedRole);
    }
  }

  if (Array.isArray(roles)) {
    if (Array.isArray(currentUserRoles)) {
      return currentUserRoles?.some((allowedRole) => roles.includes(allowedRole));
    } else if (typeof currentUserRoles === "string") {
      return roles.some((allowedRole) => currentUserRoles === allowedRole);
    }
  }

  return false;
};

/**
 * Use requireAuth in your services to check that a user is logged in
 *
 * @example
 *
 * export const createPost = ({ input }: { input: CreatePostInput }) => {
 *   requireAuth({ roles: ['admin'] })
 *
 *   return db.post.create({ data: input })
 * }
 *
 */
export const requireAuth = ({ roles }: { roles?: string | string[] } = {}) => {
  if (!isAuthenticated()) {
    throw new Error("You must be logged in to access this");
  }

  if (roles && !hasRole(roles)) {
    throw new Error("You do not have permission to access this");
  }
};
