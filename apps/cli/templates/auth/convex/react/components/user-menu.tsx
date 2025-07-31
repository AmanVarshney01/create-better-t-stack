import { useCurrentUser } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function UserMenu() {
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
          {(user.name && user.name.length > 0) ? user.name.charAt(0).toUpperCase() :
           (user.email && user.email.length > 0) ? user.email.charAt(0).toUpperCase() : '?'}
        </div>
        <span>{user.name || user.email}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-500">{user.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
