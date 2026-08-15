export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const { $authClient } = useNuxtApp();
  const session = $authClient.useSession();

  if (session.value.isPending) {
    return;
  }

  if (!session.value.data) {
    return navigateTo("/login");
  }
});
