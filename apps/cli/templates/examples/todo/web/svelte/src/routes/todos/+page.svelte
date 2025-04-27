<script lang="ts">
	import { orpc } from '$lib/orpc';
	import { createQuery, createMutation } from '@tanstack/svelte-query';

	let newTodoText = $state('');

	const todosQuery = createQuery(orpc.todo.getAll.queryOptions());

	const addMutation = createMutation(
		orpc.todo.create.mutationOptions({
			onSuccess: () => {
				$todosQuery.refetch();
				newTodoText = '';
			},
			onError: (error) => {
				console.error('Failed to create todo:', error?.message ?? error);
			},
		})
	);

	const toggleMutation = createMutation(
		orpc.todo.toggle.mutationOptions({
			onSuccess: () => {
				$todosQuery.refetch();
			},
			onError: (error) => {
				console.error('Failed to toggle todo:', error?.message ?? error);
			},
		})
	);

	const deleteMutation = createMutation(
		orpc.todo.delete.mutationOptions({
			onSuccess: () => {
				$todosQuery.refetch();
			},
			onError: (error) => {
				console.error('Failed to delete todo:', error?.message ?? error);
			},
		})
	);

	function handleAddTodo(event: SubmitEvent) {
		event.preventDefault();
		const text = newTodoText.trim();
		if (text) {
			$addMutation.mutate({ text });
		}
	}

	function handleToggleTodo(id: number, completed: boolean) {
		$toggleMutation.mutate({ id, completed: !completed });
	}

	function handleDeleteTodo(id: number) {
		$deleteMutation.mutate({ id });
	}

	const isAdding = $derived($addMutation.isPending);
	const canAdd = $derived(!isAdding && newTodoText.trim().length > 0);
	const isLoadingTodos = $derived($todosQuery.isLoading);
	const todos = $derived($todosQuery.data ?? []);
	const hasTodos = $derived(todos.length > 0);

</script>

<div class="p-4">
	<h1 class="text-xl mb-4">Todos</h1>

	<form onsubmit={handleAddTodo} class="flex gap-2 mb-4">
		<input
			type="text"
			bind:value={newTodoText}
			placeholder="New task..."
			disabled={isAdding}
			class=" p-1 flex-grow"
		/>
		<button
			type="submit"
			disabled={!canAdd}
			class="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
		>
			{#if isAdding}Adding...{:else}Add{/if}
		</button>
	</form>

	{#if isLoadingTodos}
		<p>Loading...</p>
	{:else if !hasTodos}
		<p>No todos yet.</p>
	{:else}
		<ul class="space-y-1">
			{#each todos as todo (todo.id)}
				{@const isToggling = $toggleMutation.isPending && $toggleMutation.variables?.id === todo.id}
				{@const isDeleting = $deleteMutation.isPending && $deleteMutation.variables?.id === todo.id}
				{@const isDisabled = isToggling || isDeleting}
				<li
					class="flex items-center justify-between p-2 "
					class:opacity-50={isDisabled}
				>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							id={`todo-${todo.id}`}
							checked={todo.completed}
							onchange={() => handleToggleTodo(todo.id, todo.completed)}
							disabled={isDisabled}
						/>
						<label
							for={`todo-${todo.id}`}
							class:line-through={todo.completed}
						>
							{todo.text}
						</label>
					</div>
					<button
						type="button"
						onclick={() => handleDeleteTodo(todo.id)}
						disabled={isDisabled}
						aria-label="Delete todo"
						class="text-red-500 px-1 disabled:opacity-50"
					>
						{#if isDeleting}Deleting...{:else}X{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if $todosQuery.isError}
		<p class="mt-4 text-red-500">
			Error loading: {$todosQuery.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if $addMutation.isError}
		<p class="mt-4 text-red-500">
			Error adding: {$addMutation.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if $toggleMutation.isError}
		<p class="mt-4 text-red-500">
			Error updating: {$toggleMutation.error?.message ?? 'Unknown error'}
		</p>
	{/if}
	{#if $deleteMutation.isError}
		<p class="mt-4 text-red-500">
			Error deleting: {$deleteMutation.error?.message ?? 'Unknown error'}
		</p>
	{/if}
</div>
