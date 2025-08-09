<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'
</script>

<template>
  <div>
    <SignedOut>
      <SignInButton>
        <UButton variant="outline">
          Sign In
        </UButton>
      </SignInButton>
    </SignedOut>
    
    <SignedIn>
      <UserButton />
    </SignedIn>
  </div>
</template>