import { createFileRoute } from "@tanstack/solid-router";
import { Loader2, Trash2 } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { orpc } from "@/utils/orpc";
import { useQuery, useMutation } from "@tanstack/solid-query";

export const Route = createFileRoute("/todos")({
  component: TodosRoute,
});

function TodosRoute() {
  const [newTodoText, setNewTodoText] = createSignal("");

  const todos = useQuery(() => orpc.todo.getAll.queryOptions());

  const createMutation = useMutation(() =>
    orpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    }),
  );

  const toggleMutation = useMutation(() =>
    orpc.todo.toggle.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );

  const deleteMutation = useMutation(() =>
    orpc.todo.delete.mutationOptions({
      onSuccess: () => { todos.refetch() },
    }),
  );

  const handleAddTodo = (e: Event) => {
    e.preventDefault();
    if (newTodoText().trim()) {
      createMutation.mutate({ text: newTodoText() });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate({ id });
  };

  return (
    <div class="mx-auto w-full max-w-md py-10">
      <div class="rounded-lg border p-6 shadow-sm">
        <div class="mb-4">
          <h2 class="text-xl font-semibold">Todo List</h2>
          <p class="text-sm">Manage your tasks efficiently</p>
        </div>
        <div>
          <form
            onSubmit={handleAddTodo}
            class="mb-6 flex items-center space-x-2"
          >
            <input
              type="text"
              value={newTodoText()}
              onInput={(e) => setNewTodoText(e.currentTarget.value)}
              placeholder="Add a new task..."
              disabled={createMutation.isPending}
              class="w-full rounded-md border p-2 text-sm"
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !newTodoText().trim()}
              class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              <Show when={createMutation.isPending} fallback="Add">
                <Loader2 class="h-4 w-4 animate-spin" />
              </Show>
            </button>
          </form>

          <Show when={todos.isLoading}>
            <div class="flex justify-center py-4">
              <Loader2 class="h-6 w-6 animate-spin" />
            </div>
          </Show>

          <Show when={!todos.isLoading && todos.data?.length === 0}>
            <p class="py-4 text-center">No todos yet. Add one above!</p>
          </Show>

          <Show when={!todos.isLoading}>
            <ul class="space-y-2">
              <For each={todos.data}>
                {(todo) => (
                  <li class="flex items-center justify-between rounded-md border p-2">
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleTodo(todo.id, todo.completed)
                        }
                        id={`todo-${todo.id}`}
                        class="h-4 w-4"
                      />
                      <label
                        for={`todo-${todo.id}`}
                        class={todo.completed ? "line-through" : ""}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label="Delete todo"
                      class="ml-2 rounded-md p-1"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
}
