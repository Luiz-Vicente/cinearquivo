<script setup lang="ts" generic="T extends string | number">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

/**
 * Styled, accessible select (Reka UI): keyboard navigation, typeahead and
 * a listbox that matches the design system instead of the native dropdown.
 * Option values can't be empty strings.
 */
const model = defineModel<T>({ required: true })

const props = defineProps<{
  options: { value: T, label: string }[]
  label: string
  icon?: string
  /** Stretches the trigger to the full width (forms). */
  block?: boolean
}>()

// Rendered by us so the server markup already shows the current choice.
const selectedLabel = computed(() => props.options.find(option => option.value === model.value)?.label)
</script>

<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      :aria-label="label"
      class="group inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-text ring-1 ring-border-strong transition ring-inset hover:ring-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none data-[state=open]:ring-accent"
      :class="block ? 'flex w-full' : ''"
    >
      <BaseIcon
        v-if="icon"
        :name="icon"
        class="shrink-0 text-text-muted"
      />
      <SelectValue
        class="flex-1 truncate text-left"
        :placeholder="label"
      >
        {{ selectedLabel ?? label }}
      </SelectValue>
      <SelectIcon as-child>
        <BaseIcon
          name="chevron-down"
          class="shrink-0 text-text-muted transition group-data-[state=open]:rotate-180"
        />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="8"
        class="z-[60] max-h-[min(var(--reka-select-content-available-height),20rem)] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-2xl bg-surface-raised shadow-card ring-1 ring-border data-[state=open]:animate-fade-in"
      >
        <SelectScrollUpButton class="flex h-7 items-center justify-center text-text-muted">
          <BaseIcon name="chevron-up" />
        </SelectScrollUpButton>
        <SelectViewport class="p-1.5">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="relative flex h-9 cursor-pointer items-center rounded-xl pr-4 pl-9 text-sm text-text outline-none select-none data-[highlighted]:bg-accent/15 data-[highlighted]:text-accent-hover data-[state=checked]:font-semibold"
          >
            <SelectItemIndicator class="absolute left-3 inline-flex text-accent">
              <BaseIcon name="check" />
            </SelectItemIndicator>
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
        <SelectScrollDownButton class="flex h-7 items-center justify-center text-text-muted">
          <BaseIcon name="chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
