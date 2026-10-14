<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const input = ref(typeof route.query.q === 'string' ? route.query.q : '')
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

watchDebounced(input, (value) => {
  router.replace({ query: value.trim() ? { q: value.trim() } : {} })
}, { debounce: 300 })

// Without a query the page shows the best known films instead.
const results = useMovieList(() => ({ q: query.value || undefined }))

const heading = computed(() => (query.value ? t('search.resultsFor', { query: query.value }) : t('search.discover')))
const isEmpty = computed(() => query.value && results.status.value === 'success' && !results.items.value.length)

useSeoMeta({ title: () => t('search.title'), robots: 'noindex' })
</script>

<template>
  <div class="container-page space-y-8 pt-28 pb-10 md:pt-32">
    <BaseInput
      v-model="input"
      icon="search"
      :label="t('search.title')"
      :placeholder="t('search.placeholder')"
      clearable
      autofocus
      type="search"
      class="mx-auto max-w-2xl !h-14 text-base"
    />

    <BaseEmptyState
      v-if="isEmpty"
      icon="search-x"
      :title="t('search.noResults', { query })"
      :description="t('search.noResultsHint')"
    />

    <section
      v-else
      class="space-y-6"
    >
      <BaseSectionHeader
        as="h1"
        :title="heading"
      />
      <MovieGrid
        :items="results.items.value"
        :loading="results.status.value === 'pending'"
      />
      <div
        v-if="results.hasMore.value"
        class="flex justify-center"
      >
        <BaseButton
          variant="outline"
          icon="chevrons-down"
          :loading="results.status.value === 'pending'"
          :label="t('actions.loadMore')"
          @click="results.loadMore"
        />
      </div>
    </section>
  </div>
</template>
