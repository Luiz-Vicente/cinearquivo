<script setup lang="ts">
import type { HomeRow } from '#shared/types/movie'
import type { RouteLocationRaw } from 'vue-router'

const { t } = useI18n()
const myList = useMyList()
const continueWatching = useContinueWatching()
const { items: myListItems } = useMoviesByIds(myList.ids)
const { items: watchingItems } = useMoviesByIds(continueWatching.ids)
const watching = computed(() => continueWatching.withProgress(watchingItems.value ?? []))

const { data: feed, status } = useHomeFeed()

useSeoMeta({ title: () => t('nav.home') })

function rowTitle(row: HomeRow): string {
  if (row.type === 'decade') return t('rows.decade', { decade: row.decade })
  if (row.type === 'genre') return row.genre.name
  return t(`rows.${row.type}`)
}

function rowLink(row: HomeRow): RouteLocationRaw {
  if (row.type === 'decade') return `/decades/${row.decade}`
  if (row.type === 'genre') return { path: '/movies', query: { genre: row.genre.id } }
  if (row.type === 'portuguese') return '/portuguese'
  return row.type === 'shorts' ? '/shorts' : '/movies'
}

function rowKey(row: HomeRow): string {
  if (row.type === 'decade') return `decade-${row.decade}`
  if (row.type === 'genre') return `genre-${row.genre.id}`
  return row.type
}
</script>

<template>
  <div>
    <MovieHero
      v-if="feed?.hero"
      :movie="feed.hero"
    />
    <MovieHeroSkeleton v-else-if="status === 'pending'" />
    <div
      v-else
      class="h-28"
    />

    <div class="relative z-10 -mt-10 space-y-2 md:-mt-16 md:space-y-4">
      <MovieRow
        :title="t('rows.continueWatching')"
        :items="watching"
        variant="backdrop"
        removable
        @remove="item => continueWatching.remove(item.id)"
      />
      <MovieRow
        :title="t('rows.myList')"
        :items="myListItems"
        to="/my-list"
      />
      <MovieRow
        v-for="(row, index) in feed?.rows"
        :key="rowKey(row)"
        :title="rowTitle(row)"
        :items="row.items"
        :variant="index === 0 ? 'backdrop' : 'poster'"
        :to="rowLink(row)"
      />
    </div>
  </div>
</template>
