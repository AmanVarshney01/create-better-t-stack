<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { orpc } from '$lib/orpc';
	import { createQuery } from '@tanstack/svelte-query';
	import { get } from 'svelte/store';

	const sessionQuery = authClient.useSession();

	const privateDataQuery = createQuery(orpc.privateData.queryOptions());

	onMount(() => {
		const { data: session, isPending } = get(sessionQuery);
		if (!session && !isPending) {
			goto('/login');
		}
	});
</script>

{#if $sessionQuery.isPending}
	<div>Loading...</div>
{:else if !$sessionQuery.data}
	<!-- Redirecting... -->
{:else}
	<div>
		<h1>Dashboard</h1>
		<p>Welcome {$sessionQuery.data.user.name}</p>
		<p>privateData: {$privateDataQuery.data?.message}</p>
	</div>
{/if}
