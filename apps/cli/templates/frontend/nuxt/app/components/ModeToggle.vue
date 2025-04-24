<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set (value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>

<template>
  <div class="flex items-center">
    <USwitch
      v-model="isDark"
      :checked-icon="isDark ? 'i-lucide-moon' : ''"
      :unchecked-icon="!isDark ? 'i-lucide-sun' : ''"
      class="mr-2"
    />
  </div>
</template>
