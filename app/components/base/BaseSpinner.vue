<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

const sizes = { sm: 'size-4', md: 'size-8', lg: 'size-12' }
</script>

<template>
  <svg
    :class="sizes[size]"
    class="animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    role="status"
  >
    <circle
      cx="12"
      cy="12"
      r="9.5"
      stroke="currentColor"
      stroke-opacity="0.2"
      stroke-width="3"
    />
    <path
      d="M21.5 12A9.5 9.5 0 0 0 12 2.5"
      class="stroke-accent"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>
