<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  title: string
  items: MovieSummary[] | null | undefined
  loading?: boolean
  variant?: 'backdrop' | 'poster'
  to?: RouteLocationRaw
  removable?: boolean
}>(), { variant: 'poster', to: undefined })

const emit = defineEmits<{ remove: [item: MovieSummary] }>()

const cardWidth = computed(() => props.variant === 'poster'
  ? 'w-[38vw] sm:w-[26vw] md:w-[19vw] lg:w-[15vw] xl:w-[12.5vw]'
  : 'w-[72vw] sm:w-[44vw] md:w-[31vw] lg:w-[23vw] xl:w-[18.5vw]')
</script>

<template>
  <section
    v-if="loading || items?.length"
    class="py-2"
  >
    <BaseSectionHeader
      :title="title"
      :to="to"
      class="container-page relative z-[2]"
    />
    <BaseCarousel :label="title">
      <template v-if="loading && !items?.length">
        <BaseSkeleton
          v-for="n in 7"
          :key="n"
          :class="[cardWidth, variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video']"
          class="shrink-0"
        />
      </template>
      <MovieCard
        v-for="item in items ?? []"
        :key="item.id"
        :item="item"
        :variant="variant"
        :removable="removable"
        :class="cardWidth"
        @remove="emit('remove', item)"
      />
    </BaseCarousel>
  </section>
</template>
