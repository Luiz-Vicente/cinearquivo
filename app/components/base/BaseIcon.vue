<script setup lang="ts">
withDefaults(defineProps<{
  /** Lucide icon name without prefix, e.g. "play". */
  name: string
  size?: string | number
}>(), { size: '1.25em' })
</script>

<template>
  <Icon
    :name="`lucide:${name}`"
    :size="typeof size === 'number' ? `${size}px` : size"
    class="shrink-0"
    aria-hidden="true"
  />
</template>
