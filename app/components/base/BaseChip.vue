<script setup lang="ts">
defineProps<{ active?: boolean }>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    class="h-9 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap ring-1 transition duration-200 ring-inset"
    :class="active
      ? 'bg-accent text-on-accent ring-accent'
      : 'bg-surface text-text-muted ring-border-strong hover:text-text hover:ring-accent'"
  >
    <slot />
  </button>
</template>
