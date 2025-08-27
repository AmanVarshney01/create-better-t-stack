import { authClient } from "@/lib/auth-client";
import { createForm } from "@tanstack/solid-form";
import { useNavigate } from "@tanstack/solid-router";
import z from "zod";
import { For } from "solid-js";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const navigate = useNavigate({
    from: "/",
  });

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            console.log("Sign up successful");
          },
          onError: (error) => {
            console.error(error.error.message);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  }));

  return (
    <div class="mx-auto w-full mt-10 max-w-md p-6">
      <h1 class="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Name</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => (
                    <p class="text-sm text-red-600">{error?.message}</p>
                  )}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Email</label>
                <input
                  id={field().name}
                  name={field().name}
                  type="email"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => (
                    <p class="text-sm text-red-600">{error?.message}</p>
                  )}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div class="space-y-2">
                <label for={field().name}>Password</label>
                <input
                  id={field().name}
                  name={field().name}
                  type="password"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                  class="w-full rounded border p-2"
                />
                <For each={field().state.meta.errors}>
                  {(error) => (
                    <p class="text-sm text-red-600">{error?.message}</p>
                  )}
                </For>
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <button
              type="submit"
              class="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={!state().canSubmit || state().isSubmitting}
            >
              {state().isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          )}
        </form.Subscribe>
      </form>

      <div class="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
}
