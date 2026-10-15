<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })

defineProps<{
  icon?: string
  placeholder?: string
  label: string
  clearable?: boolean
  autofocus?: boolean
  type?: string
}>()

const { t } = useI18n()
const input = useTemplateRef('input')

// Native attributes (required, name, autocomplete…) belong on the <input>; classes on the wrapper.
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <label
    :class="attrs.class"
    class="group relative flex h-11 w-full items-center gap-2 rounded-full bg-surface px-4 ring-1 ring-border-strong transition ring-inset focus-within:bg-surface-raised focus-within:ring-accent"
  >
    <span class="sr-only">{{ label }}</span>
    <BaseIcon
      v-if="icon"
      :name="icon"
      class="text-text-muted group-focus-within:text-accent"
    />
    <input
      ref="input"
      v-model="model"
      v-bind="inputAttrs"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :autofocus="autofocus"
      class="h-full min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle [&::-webkit-search-cancel-button]:hidden"
    >
    <button
      v-if="clearable && model"
      type="button"
      class="flex size-6 items-center justify-center rounded-full text-text-muted hover:bg-surface-sunken hover:text-text"
      :aria-label="t('actions.clear')"
      @click="model = ''; input?.focus()"
    >
      <BaseIcon name="x" />
    </button>
  </label>
</template>
