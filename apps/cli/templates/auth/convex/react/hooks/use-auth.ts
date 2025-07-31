import { useCurrentUser } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export function useAuth() {
  const user = useCurrentUser();
  const { signIn, signOut } = useAuthActions();

  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
    signIn,
    signOut,
  };
}
