import { authClient } from "@/lib/auth-client";
import { useNavigate, Link } from "@tanstack/solid-router";
import { createSignal, Show } from "solid-js";

export default function UserMenu() {
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <div class="relative inline-block text-left">
      <Show when={session().isPending}>
        <div class="h-9 w-24 animate-pulse rounded" />
      </Show>

      <Show when={!session().isPending && !session().data}>
        <Link to="/login" class="inline-block border rounded px-4  text-sm">
          Sign In
        </Link>
      </Show>

      <Show when={!session().isPending && session().data}>
        <button
          type="button"
          class="inline-block border rounded px-4  text-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen())}
        >
          {session().data?.user.name}
        </button>

        <Show when={isMenuOpen()}>
          <div class="absolute right-0 mt-2 w-56 rounded p-1 shadow-sm">
            <div class="px-4  text-sm">{session().data?.user.email}</div>
            <button
              type="button"
              class="mt-1 w-full border rounded px-4  text-center text-sm"
              onClick={() => {
                setIsMenuOpen(false);
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      navigate({ to: "/" });
                    },
                  },
                });
              }}
            >
              Sign Out
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
