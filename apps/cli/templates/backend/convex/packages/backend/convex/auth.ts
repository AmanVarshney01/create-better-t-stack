import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        // Validate and ensure params have required fields
        if (!params.email || typeof params.email !== 'string') {
          throw new Error("Email is required and must be a string");
        }
        if (!params.name || typeof params.name !== 'string') {
          throw new Error("Name is required and must be a string");
        }

        return {
          email: params.email,
          name: params.name,
        };
      },
    }),
  ],
});

// Export the auth configuration for use in other files
export { isAuthenticated, getAuthUserId } from "@convex-dev/auth/server";
