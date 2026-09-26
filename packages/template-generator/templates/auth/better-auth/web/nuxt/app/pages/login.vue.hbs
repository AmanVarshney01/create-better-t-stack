<script setup lang="ts">
const { $authClient } = useNuxtApp();
import SignInForm from "~/components/SignInForm.vue";
import SignUpForm from "~/components/SignUpForm.vue";

const session = $authClient.useSession();
const showSignIn = ref(true);

watchEffect(() => {
  if (!session?.value.isPending && session?.value.data) {
    navigateTo("/dashboard", { replace: true });
  }
});
</script>

<template>
  <UContainer class="py-8">
    <div v-if="session.isPending" class="flex flex-col items-center justify-center gap-4 py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl text-primary" />
      <span class="text-muted">Loading...</span>
    </div>
    <div v-else-if="!session.data">
      <SignInForm v-if="showSignIn" @switch-to-sign-up="showSignIn = false" />
      <SignUpForm v-else @switch-to-sign-in="showSignIn = true" />
    </div>
  </UContainer>
</template>
