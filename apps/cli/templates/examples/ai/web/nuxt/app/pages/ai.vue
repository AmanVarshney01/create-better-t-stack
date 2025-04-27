<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { nextTick, ref, watch } from 'vue'

const config = useRuntimeConfig()
const serverUrl = config.public.serverURL

const { messages, input, handleSubmit } = useChat({
  api: `${serverUrl}/ai`,
})

const messagesEndRef = ref<null | HTMLDivElement>(null)

watch(messages, async () => {
  await nextTick()
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
})

function getMessageText(message: any) {
  return message.parts
    .filter((part: any) => part.type === 'text')
    .map((part: any) => part.text)
    .join('')
}
</script>

<template>
  <div class="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
    <div class="overflow-y-auto space-y-4 pb-4">
      <div v-if="messages.length === 0" class="text-center text-muted-foreground mt-8">
        Ask me anything to get started!
      </div>
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'p-3 rounded-lg',
          message.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-secondary/20 mr-8'
        ]"
      >
        <p class="text-sm font-semibold mb-1">
          {{ message.role === 'user' ? 'You' : 'AI Assistant' }}
        </p>
        <div class="whitespace-pre-wrap">{{ getMessageText(message) }}</div>
      </div>
      <div ref="messagesEndRef" />
    </div>

    <form @submit.prevent="handleSubmit" class="w-full flex items-center space-x-2 pt-2 border-t">
      <UInput
        name="prompt"
        v-model="input"
        placeholder="Type your message..."
        class="flex-1"
        autocomplete="off"
        autofocus
      />
      <UButton type="submit" color="primary" size="md" square>
        <UIcon name="i-lucide-send" class="w-5 h-5" />
      </UButton>
    </form>
  </div>
</template>
