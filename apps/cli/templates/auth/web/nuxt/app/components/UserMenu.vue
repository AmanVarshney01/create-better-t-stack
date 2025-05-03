<script setup lang="ts">

const {$authClient} = useNuxtApp()
const session = $authClient.useSession()
const toast = useToast()

const handleSignOut = async () => {
  try {
    await $authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          toast.add({ title: 'Signed out successfully' })
          await navigateTo('/', { replace: true, external: true })
        },
        onError: (error) => {
           toast.add({ title: 'Sign out failed', description: error?.error?.message || 'Unknown error'})
        }
      },
    })
  } catch (error: any) {
     toast.add({ title: 'An unexpected error occurred during sign out', description: error.message || 'Please try again.'})
  }
}
</script>

<template>
  <div>
    <USkeleton v-if="session.isPending" class="h-9 w-24" />

    <UButton v-else-if="!session.data" variant="outline" to="/login">
      Sign In
    </UButton>

    <UButton
      v-else
      variant="solid"
      icon="i-lucide-log-out"
      label="Sign out"
      @click="handleSignOut()"
    />
  </div>
</template>
