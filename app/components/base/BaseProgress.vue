<script setup lang="ts">
const props = defineProps<{
  /** Value between 0 and 1. */
  value: number
  label?: string
}>()

const percent = computed(() => Math.round(Math.min(Math.max(props.value, 0), 1) * 100))
</script>

<template>
  <div
    class="h-1 w-full overflow-hidden rounded-full bg-ink/15"
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div
      class="h-full rounded-full bg-accent transition-[width] duration-500"
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>
