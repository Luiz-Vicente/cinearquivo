<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** TMDB score from 0 to 10. */
  score: number
  size?: 'sm' | 'md'
  /** `ring` shows a progress ring; `inline` is a compact star + score for tight spaces like cards. */
  variant?: 'ring' | 'inline'
}>(), { size: 'sm', variant: 'ring' })

const { t } = useI18n()
const RADIUS = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const offset = computed(() => CIRCUMFERENCE * (1 - Math.min(props.score, 10) / 10))
const label = computed(() => props.score.toFixed(1))
</script>

<template>
  <span
    v-if="score > 0 && variant === 'inline'"
    class="inline-flex shrink-0 items-center gap-1 font-semibold text-text"
    role="img"
    :aria-label="t('meta.rating', { score: label })"
  >
    <svg
      viewBox="0 0 24 24"
      class="size-3.5 fill-accent"
      aria-hidden="true"
    >
      <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.1 5.51.44a.56.56 0 0 1 .32.99l-4.2 3.6 1.28 5.38a.56.56 0 0 1-.84.61L12 16.73l-4.72 2.89a.56.56 0 0 1-.84-.61l1.28-5.38-4.2-3.6a.56.56 0 0 1 .32-.99l5.51-.44 2.13-5.1Z" />
    </svg>
    {{ label }}
  </span>
  <span
    v-else-if="score > 0"
    class="relative inline-flex shrink-0 items-center justify-center font-display font-bold text-text"
    :class="size === 'sm' ? 'size-8 text-[0.625rem]' : 'size-11 text-xs'"
    role="img"
    :aria-label="t('meta.rating', { score: label })"
  >
    <svg
      viewBox="0 0 36 36"
      class="absolute inset-0 -rotate-90"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        :r="RADIUS"
        fill="rgb(255 253 248 / 0.92)"
        stroke="rgb(42 26 20 / 0.15)"
        stroke-width="3"
      />
      <circle
        cx="18"
        cy="18"
        :r="RADIUS"
        fill="none"
        class="stroke-accent"
        stroke-width="3"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="offset"
      />
    </svg>
    <span class="relative">{{ label }}</span>
  </span>
</template>
