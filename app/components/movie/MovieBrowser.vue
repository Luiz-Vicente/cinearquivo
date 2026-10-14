<script setup lang="ts">
import type { MovieKind, MovieSort } from '#shared/types/movie'

/** Filterable, paginated grid. Filters live in the URL so results are shareable. */
const props = defineProps<{
  title: string
  description?: string
  kind?: MovieKind
  /** Fixed decade (decade pages); otherwise the viewer can pick one. */
  decade?: number
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

function queryParam(name: string) {
  return computed<number | null>({
    get: () => Number(route.query[name]) || null,
    set: value => router.replace({ query: { ...route.query, [name]: value ?? undefined } }),
  })
}

const selectedGenre = queryParam('genre')
const selectedDecade = queryParam('decade')
const sort = computed<MovieSort>({
  get: () => isMovieSort(route.query.sort) ? route.query.sort : 'popular',
  set: value => router.replace({ query: { ...route.query, sort: value === 'popular' ? undefined : value } }),
})

const { data: facets } = useFacets(() => props.kind)
const sortOptions = computed(() => MOVIE_SORTS.map(value => ({ value, label: t(`sort.${value}`) })))

const movies = useMovieList(() => ({
  kind: props.kind,
  genre: selectedGenre.value ?? undefined,
  decade: props.decade ?? selectedDecade.value ?? undefined,
  sort: sort.value,
}))
</script>

<template>
  <div class="container-page space-y-6 pt-28 pb-10 md:pt-32">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="space-y-2">
        <BaseSectionHeader
          as="h1"
          :title="title"
        />
        <p
          v-if="description"
          class="max-w-2xl text-text-muted"
        >
          {{ description }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <span
          v-if="movies.total.value"
          class="text-sm text-text-muted"
        >
          {{ t('catalog.count', { n: movies.total.value }, movies.total.value) }}
        </span>
        <BaseSelect
          v-model="sort"
          :options="sortOptions"
          :label="t('catalog.sortBy')"
          icon="arrow-down-wide-narrow"
        />
      </div>
    </div>

    <div
      v-if="!decade && facets?.decades.length"
      class="-mx-4 flex gap-2 overflow-x-auto scrollbar-none px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
      role="group"
      :aria-label="t('catalog.decades')"
    >
      <BaseChip
        :active="!selectedDecade"
        @click="selectedDecade = null"
      >
        {{ t('catalog.allDecades') }}
      </BaseChip>
      <BaseChip
        v-for="entry in facets.decades"
        :key="entry.decade"
        :active="selectedDecade === entry.decade"
        @click="selectedDecade = entry.decade"
      >
        {{ t('meta.decade', { decade: entry.decade }) }}
      </BaseChip>
    </div>

    <div
      class="-mx-4 flex gap-2 overflow-x-auto scrollbar-none px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
      role="group"
      :aria-label="t('catalog.genres')"
    >
      <BaseChip
        :active="!selectedGenre"
        @click="selectedGenre = null"
      >
        {{ t('catalog.allGenres') }}
      </BaseChip>
      <BaseChip
        v-for="genre in facets?.genres"
        :key="genre.id"
        :active="selectedGenre === genre.id"
        @click="selectedGenre = genre.id"
      >
        {{ genre.name }}
      </BaseChip>
    </div>

    <MovieGrid
      v-if="movies.status.value === 'pending' || movies.items.value.length"
      :items="movies.items.value"
      :loading="movies.status.value === 'pending'"
    />
    <BaseEmptyState
      v-else
      icon="popcorn"
      :title="t('catalog.empty')"
      :description="t('catalog.emptyHint')"
    />

    <div
      v-if="movies.hasMore.value"
      class="flex justify-center"
    >
      <BaseButton
        variant="outline"
        icon="chevrons-down"
        :loading="movies.status.value === 'pending'"
        :label="t('actions.loadMore')"
        @click="movies.loadMore"
      />
    </div>
  </div>
</template>
