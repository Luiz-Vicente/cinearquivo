<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'

const badge = tv({
  base: 'inline-flex items-center gap-1 rounded-md font-semibold uppercase tracking-wider',
  variants: {
    variant: {
      accent: 'bg-accent text-on-accent',
      soft: 'bg-accent/15 text-accent-hover',
      neutral: 'bg-surface-sunken text-text',
      outline: 'text-text-muted ring-1 ring-border-strong ring-inset',
    },
    size: {
      sm: 'px-1.5 py-0.5 text-[0.625rem]',
      md: 'px-2 py-1 text-xs',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'sm' },
})

type BadgeVariants = VariantProps<typeof badge>

const props = defineProps<{
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  icon?: string
}>()
</script>

<template>
  <span :class="badge({ variant: props.variant, size: props.size })">
    <BaseIcon
      v-if="icon"
      :name="icon"
    />
    <slot />
  </span>
</template>
