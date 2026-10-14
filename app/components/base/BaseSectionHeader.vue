<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  to?: RouteLocationRaw
  as?: 'h1' | 'h2' | 'h3'
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-end justify-between gap-4">
    <component
      :is="as ?? 'h2'"
      class="flex items-center gap-3 font-display text-text"
      :class="as === 'h1' ? 'text-5xl md:text-6xl' : 'text-2xl md:text-3xl'"
    >
      <!-- A tiny popcorn box. -->
      <span
        class="stripes-thin shrink-0 rounded-sm ring-1 ring-accent"
        :class="as === 'h1' ? 'size-7 md:size-9' : 'size-4 md:size-5'"
        aria-hidden="true"
      />
      {{ title }}
    </component>
    <NuxtLink
      v-if="to"
      :to="to"
      class="group inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-text-muted uppercase hover:text-accent"
    >
      {{ t('actions.seeAll') }}
      <BaseIcon
        name="arrow-right"
        class="transition group-hover:translate-x-0.5"
      />
    </NuxtLink>
    <slot name="actions" />
  </div>
</template>
