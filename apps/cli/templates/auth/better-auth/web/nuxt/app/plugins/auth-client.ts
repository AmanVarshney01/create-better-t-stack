import { createAuthClient } from "better-auth/vue";

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const serverUrl = config.public.serverURL

  const authClient = createAuthClient({
    baseURL: serverUrl
  })

  return {
    provide: {
      authClient: authClient
    }
  }
})
