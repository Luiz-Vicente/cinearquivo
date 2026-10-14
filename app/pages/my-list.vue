<script setup lang="ts">
const { t } = useI18n()
const myList = useMyList()
const { items, status } = useMoviesByIds(myList.ids)

useSeoMeta({ title: () => t('myList.title'), robots: 'noindex' })
</script>

<template>
  <div class="container-page space-y-8 pt-28 pb-10 md:pt-32">
    <BaseSectionHeader
      as="h1"
      :title="t('myList.title')"
    />
    <MovieGrid
      v-if="!myList.ready.value || myList.ids.value.length"
      :items="items ?? []"
      :loading="!myList.ready.value || (status === 'pending' && !items?.length)"
    />
    <BaseEmptyState
      v-else
      icon="bookmark"
      :title="t('myList.empty')"
      :description="t('myList.emptyHint')"
    >
      <BaseButton
        to="/movies"
        icon="popcorn"
        :label="t('actions.browse')"
      />
    </BaseEmptyState>
  </div>
</template>
