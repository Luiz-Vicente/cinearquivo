<script setup lang="ts">
/** `responsive` shows the stacked pocket logo on small screens and the wordmark from md up. */
withDefaults(defineProps<{
  variant?: 'full' | 'pocket' | 'responsive'
}>(), { variant: 'responsive' })
</script>

<template>
  <NuxtLink
    to="/"
    class="inline-flex shrink-0 items-center rounded-lg transition-opacity hover:opacity-85"
    aria-label="CineArquivo"
  >
    <img
      v-if="variant !== 'full'"
      src="/logo-pocket.png"
      alt=""
      width="153"
      height="192"
      class="h-11 w-auto"
      :class="{ 'md:hidden': variant === 'responsive' }"
    >
    <img
      v-if="variant !== 'pocket'"
      src="/logo.png"
      alt=""
      width="1063"
      height="160"
      class="h-7 w-auto md:h-8"
      :class="{ 'max-md:hidden': variant === 'responsive' }"
    >
  </NuxtLink>
</template>
