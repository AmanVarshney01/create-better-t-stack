import { Clerk } from '@clerk/clerk-js'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const publishableKey = config.public.clerkPublishableKey

  if (!publishableKey) {
    throw new Error('Missing Clerk Publishable Key')
  }

  const clerk = new Clerk(publishableKey)
  await clerk.load()

  return {
    provide: {
      clerk
    }
  }
})
