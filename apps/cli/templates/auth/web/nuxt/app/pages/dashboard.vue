<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
const {$authClient} = useNuxtApp()

definePageMeta({
  middleware: ['auth']
})

const { $orpc } = useNuxtApp()

const session = $authClient.useSession()

const privateData = useQuery($orpc.privateData.queryOptions())

</script>

<template>
  <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
     <div v-if="session?.data?.user">
        <p class="mb-2">Welcome {{ session.data.user.name }}</p>
     </div>
        <div v-if="privateData.status.value === 'pending'">Loading private data...</div>
        <div v-else-if="privateData.status.value === 'error'">Error loading private data: {{ privateData.error.value?.message }}</div>
        <p v-else-if="privateData.data.value">Private Data: {{ privateData.data.value.message }}</p>
  </div>
</template>
