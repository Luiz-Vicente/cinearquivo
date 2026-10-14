<script setup lang="ts">
defineProps<{ label: string }>()

const { t } = useI18n()
const track = useTemplateRef('track')
const { arrivedState, x } = useScroll(track, { behavior: 'smooth' })

// Re-evaluates edge state when items render after mount.
useResizeObserver(track, () => track.value?.dispatchEvent(new Event('scroll')))

function scrollPage(direction: 1 | -1) {
  if (!track.value) return
  x.value = track.value.scrollLeft + direction * track.value.clientWidth * 0.85
}
</script>

<template>
  <div class="group/carousel relative">
    <!-- Extra vertical padding (offset by negative margin) keeps hover glows from being clipped by overflow-x. -->
    <div
      ref="track"
      role="region"
      :aria-label="label"
      class="container-page flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain scrollbar-none -my-8 py-12 md:scroll-px-10 md:gap-4 2xl:scroll-px-16"
    >
      <slot />
    </div>

    <template
      v-for="direction in ([-1, 1] as const)"
      :key="direction"
    >
      <button
        v-show="direction === -1 ? !arrivedState.left : !arrivedState.right"
        type="button"
        class="absolute inset-y-12 z-10 hidden w-10 items-center justify-center text-text opacity-0 transition group-hover/carousel:opacity-100 focus-visible:opacity-100 md:flex md:w-12"
        :class="direction === -1
          ? 'left-0 bg-linear-to-r from-bg via-bg/80 to-transparent'
          : 'right-0 bg-linear-to-l from-bg via-bg/80 to-transparent'"
        :aria-label="direction === -1 ? t('actions.scrollLeft') : t('actions.scrollRight')"
        @click="scrollPage(direction)"
      >
        <span class="flex size-9 items-center justify-center rounded-full bg-surface-raised shadow-card ring-1 ring-border hover:bg-accent hover:text-on-accent">
          <BaseIcon
            :name="direction === -1 ? 'chevron-left' : 'chevron-right'"
            size="1.25rem"
          />
        </span>
      </button>
    </template>
  </div>
</template>
