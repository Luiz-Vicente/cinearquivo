<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'

defineProps<{
  items: MovieSummary[]
  loading?: boolean
  removable?: boolean
}>()

const emit = defineEmits<{ remove: [item: MovieSummary] }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
    <MovieCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      :removable="removable"
      @remove="emit('remove', item)"
    />
    <template v-if="loading">
      <BaseSkeleton
        v-for="n in 12"
        :key="`skeleton-${n}`"
        class="aspect-[2/3]"
      />
    </template>
  </div>
</template>
