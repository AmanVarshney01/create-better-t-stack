<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import z from 'zod';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { switchToSignIn } = $props<{ switchToSignIn: () => void }>();

	const validationSchema = z.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	});


	const form = createForm(() => ({
		defaultValues: { name: '', email: '', password: '' },
		onSubmit: async ({ value }) => {
				await authClient.signUp.email(
					{
						email: value.email,
						password: value.password,
						name: value.name,
					},
					{
						onSuccess: () => {
							goto('/dashboard');
						},
						onError: (error) => {
							console.log(error.error.message || 'Sign up failed. Please try again.');
						},
					}
				);

		},
		validators: {
			onSubmit: validationSchema,
		},
	}));
</script>

<div class="mx-auto mt-10 w-full max-w-md p-6">
	<h1 class="mb-6 text-center font-bold text-3xl">Create Account</h1>

	<form
		id="form"
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}
	>
		<form.Field name="name">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Name</label>
					<input
						id={field.name}
						name={field.name}
						class="w-full border"
						onblur={field.handleBlur}
					 value={field.state.value}
      oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Field name="email">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Email</label>
					<input
						id={field.name}
						name={field.name}
						type="email"
						class="w-full border"
						onblur={field.handleBlur}
      value={field.state.value}
      oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
					/>
					{#if field.state.meta.isTouched}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Field name="password">
			{#snippet children(field)}
				<div class="space-y-1">
					<label for={field.name}>Password</label>
					<input
						id={field.name}
						name={field.name}
						type="password"
						class="w-full border"
						onblur={field.handleBlur}
					 value={field.state.value}
      oninput={(e: Event) => {
            const target = e.target as HTMLInputElement
            field.handleChange(target.value)
          }}
					/>
					{#if field.state.meta.errors}
						{#each field.state.meta.errors as error}
							<p class="text-sm text-red-500" role="alert">{error}</p>
						{/each}
					{/if}
				</div>
			{/snippet}
		</form.Field>

		<form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
			{#snippet children(state)}
				<button type="submit" class="w-full" disabled={!state.canSubmit || state.isSubmitting}>
					{state.isSubmitting ? 'Submitting...' : 'Sign Up'}
				</button>
			{/snippet}
		</form.Subscribe>
	</form>

	<div class="mt-4 text-center">
		<button type="button" class="text-indigo-600 hover:text-indigo-800" onclick={switchToSignIn}>
			Already have an account? Sign In
		</button>
	</div>
</div>
