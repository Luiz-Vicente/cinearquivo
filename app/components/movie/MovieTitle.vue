<script setup lang="ts">
/** Title logo when TMDB has one, falling back to poster-style type. */
defineProps<{
  title: string
  logoPath: string | null
  as?: 'h1' | 'h2'
  size?: 'md' | 'lg'
}>()
</script>

<template>
  <component
    :is="as ?? 'h2'"
    class="font-display text-text"
  >
    <img
      v-if="logoPath"
      :src="tmdbImageUrl(logoPath, 500)"
      :alt="title"
      class="w-auto max-w-[min(80%,26rem)] object-contain object-left drop-shadow-[0_2px_12px_rgb(251_243_228/0.9)]"
      :class="size === 'lg' ? 'max-h-24 md:max-h-36' : 'max-h-16 md:max-h-24'"
    >
    <span
      v-else
      class="block text-balance"
      :class="size === 'lg' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'"
    >{{ title }}</span>
  </component>
</template>
