<script setup lang="ts">
/** `responsive` hides the wordmark on small screens, keeping the popcorn box. */
withDefaults(defineProps<{
  variant?: 'full' | 'icon' | 'responsive'
}>(), { variant: 'responsive' })
</script>

<template>
  <NuxtLink
    to="/"
    class="inline-flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-90"
    aria-label="CineArquivo"
  >
    <img
      src="/icon.svg"
      alt=""
      width="64"
      height="64"
      class="size-10 rounded-xl"
    >
    <span
      v-if="variant !== 'icon'"
      class="font-display text-3xl leading-none tracking-wide text-text"
      :class="{ 'max-sm:hidden': variant === 'responsive' }"
      aria-hidden="true"
    >Cine<span class="text-accent">Arquivo</span></span>
  </NuxtLink>
</template>
