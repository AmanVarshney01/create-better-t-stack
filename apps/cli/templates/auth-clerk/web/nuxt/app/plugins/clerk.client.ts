import { clerkPlugin } from '@clerk/vue'

export default defineNuxtPlugin(nuxtApp => {
  const runtimeConfig = useRuntimeConfig()
  const publishableKey = runtimeConfig.public.clerkPublishableKey

  if (!publishableKey) {
    throw new Error('Missing NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables')
  }

  nuxtApp.vueApp.use(clerkPlugin, {
    publishableKey
  })
})