export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return

  const { $authClient } = useNuxtApp()
  const session = $authClient.useSession()

  if (session.value.isPending || !session.value) {
    if (to.path === "/dashboard") {
      return navigateTo("/login");
    }
  }
});
