<script setup lang="ts">
const props = defineProps<{
  year?: number | null
  runtime?: number
  rating?: number
  /** Extra labels, e.g. director or genres. */
  extra?: string[]
}>()

const parts = computed(() => [
  props.year ? String(props.year) : null,
  props.runtime ? formatRuntime(props.runtime) : null,
  ...(props.extra ?? []),
].filter(Boolean) as string[])
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
    <BaseRating
      v-if="rating"
      :score="rating"
    />
    <template
      v-for="(part, index) in parts"
      :key="part"
    >
      <span
        v-if="index > 0"
        class="size-1 rounded-full bg-current opacity-50"
        aria-hidden="true"
      />
      <span>{{ part }}</span>
    </template>
    <slot />
  </div>
</template>
