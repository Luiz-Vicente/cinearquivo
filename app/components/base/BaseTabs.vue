<script setup lang="ts" generic="T extends string | number">
const model = defineModel<T>({ required: true })

defineProps<{
  tabs: { value: T, label: string }[]
  label: string
}>()
</script>

<template>
  <div
    role="tablist"
    :aria-label="label"
    class="inline-flex gap-1 rounded-full bg-surface-sunken p-1 ring-1 ring-border ring-inset"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="model === tab.value"
      class="h-8 rounded-full px-4 text-sm font-semibold transition duration-200"
      :class="model === tab.value ? 'bg-accent text-on-accent' : 'text-text-muted hover:text-text'"
      @click="model = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
