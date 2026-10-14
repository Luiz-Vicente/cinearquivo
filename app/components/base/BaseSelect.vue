<script setup lang="ts" generic="T extends string | number">
const model = defineModel<T>({ required: true })

defineProps<{
  options: { value: T, label: string }[]
  label: string
  icon?: string
}>()
</script>

<template>
  <label class="relative inline-flex h-10 items-center rounded-full bg-surface ring-1 ring-border-strong transition ring-inset focus-within:ring-accent hover:ring-border-strong">
    <span class="sr-only">{{ label }}</span>
    <BaseIcon
      v-if="icon"
      :name="icon"
      class="pointer-events-none absolute left-3.5 text-text-muted"
    />
    <select
      v-model="model"
      class="h-full cursor-pointer appearance-none rounded-full bg-transparent pr-9 text-sm font-medium text-text outline-none"
      :class="icon ? 'pl-10' : 'pl-4'"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="bg-surface text-text"
      >
        {{ option.label }}
      </option>
    </select>
    <BaseIcon
      name="chevron-down"
      class="pointer-events-none absolute right-3 text-text-muted"
    />
  </label>
</template>
