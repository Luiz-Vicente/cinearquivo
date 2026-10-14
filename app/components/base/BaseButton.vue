<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: [
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold',
    'transition duration-200 ease-snappy active:scale-[0.96]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: 'bg-accent text-on-accent shadow-pop-sm hover:bg-accent-hover',
      secondary: 'bg-surface-raised text-text ring-1 ring-border-strong ring-inset hover:bg-straw',
      outline: 'text-text ring-1 ring-border-strong ring-inset hover:text-accent hover:ring-accent',
      ghost: 'text-text hover:bg-surface-sunken',
    },
    size: {
      sm: 'h-8 px-3.5 text-xs',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-base',
    },
    iconOnly: { true: 'px-0' },
    block: { true: 'w-full' },
  },
  compoundVariants: [
    { iconOnly: true, size: 'sm', class: 'w-8' },
    { iconOnly: true, size: 'md', class: 'w-10' },
    { iconOnly: true, size: 'lg', class: 'w-12' },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})

type ButtonVariants = VariantProps<typeof button>

const props = defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  /** Leading Lucide icon. */
  icon?: string
  trailingIcon?: string
  /** Renders a square icon button; `label` becomes its accessible name. */
  iconOnly?: boolean
  label?: string
  to?: RouteLocationRaw
  href?: string
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>()

const NuxtLink = resolveComponent('NuxtLink')
const isLink = computed(() => Boolean(props.to || props.href))
const classes = computed(() => button({
  variant: props.variant,
  size: props.size,
  iconOnly: props.iconOnly,
  block: props.block,
}))
</script>

<template>
  <component
    :is="isLink ? NuxtLink : 'button'"
    :to="to"
    :href="href"
    :type="isLink ? undefined : (type ?? 'button')"
    :disabled="isLink ? undefined : (disabled || loading)"
    :aria-label="iconOnly ? label : undefined"
    :title="iconOnly ? label : undefined"
    :aria-busy="loading || undefined"
    :class="classes"
  >
    <BaseSpinner
      v-if="loading"
      size="sm"
    />
    <BaseIcon
      v-else-if="icon"
      :name="icon"
    />
    <slot v-if="!iconOnly">
      {{ label }}
    </slot>
    <BaseIcon
      v-if="trailingIcon && !iconOnly"
      :name="trailingIcon"
    />
  </component>
</template>
