<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })

defineProps<{
  label: string
  placeholder?: string
  rows?: number
}>()

const attrs = useAttrs()
const id = useId()
const fieldAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <div :class="attrs.class">
    <label
      :for="id"
      class="sr-only"
    >{{ label }}</label>
    <textarea
      :id="id"
      v-model="model"
      v-bind="fieldAttrs"
      :placeholder="placeholder"
      :rows="rows ?? 4"
      class="block w-full resize-y rounded-2xl bg-surface px-4 py-3 text-sm text-text ring-1 ring-border-strong transition outline-none ring-inset placeholder:text-text-subtle focus:bg-surface-raised focus:ring-accent"
    />
  </div>
</template>
