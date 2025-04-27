<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { Chat } from '@ai-sdk/svelte';

	const chat = new Chat({
		api: `${PUBLIC_SERVER_URL}/ai`,
	});

	let messagesEndElement: HTMLDivElement | null = null;

	$effect(() => {
		const messageCount = chat.messages.length;
		if (messageCount > 0) {
			setTimeout(() => {
				messagesEndElement?.scrollIntoView({ behavior: 'smooth' });
			}, 0);
		}
	});

</script>

<div class="mx-auto grid h-full w-full max-w-2xl grid-rows-[1fr_auto] overflow-hidden p-4">
	<div class="mb-4 space-y-4 overflow-y-auto pb-4">
		{#if chat.messages.length === 0}
			<div class="mt-8 text-center text-neutral-500">Ask the AI anything to get started!</div>
		{/if}

		{#each chat.messages as message (message.id)}
			<div
				class="w-fit max-w-[85%] rounded-lg p-3 text-sm md:text-base"
				class:ml-auto={message.role === 'user'}
				class:bg-indigo-600={message.role === 'user'}
				class:text-white={message.role === 'user'}
				class:bg-neutral-700={message.role === 'assistant'}
				class:text-neutral-100={message.role === 'assistant'}
			>
				<p
					class="mb-1 text-xs font-semibold uppercase tracking-wide"
					class:text-indigo-200={message.role === 'user'}
					class:text-neutral-400={message.role === 'assistant'}
				>
					{message.role === 'user' ? 'You' : 'AI Assistant'}
				</p>
				<div class="whitespace-pre-wrap break-words">
					{#each message.parts as part, partIndex (partIndex)}
						{#if part.type === 'text'}
							{part.text}
						{:else if part.type === 'tool-invocation'}
							<pre class="mt-2 rounded bg-neutral-800 p-2 text-xs text-neutral-300"
								>{JSON.stringify(part.toolInvocation, null, 2)}</pre
							>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
		<div bind:this={messagesEndElement}></div>
	</div>

	<form
		onsubmit={chat.handleSubmit}
		class="flex w-full items-center space-x-2 border-t border-neutral-700 pt-4"
	>
		<input
			name="prompt"
			bind:value={chat.input}
			placeholder="Type your message..."
			class="flex-1 rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
			autocomplete="off"
			onkeydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					chat.handleSubmit(e);
				}
			}}
		/>
		<button
			type="submit"
			disabled={!chat.input.trim()}
			class="inline-flex h-10 w-10 items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Send message"
		>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
				</svg>
		</button>
	</form>
</div>
