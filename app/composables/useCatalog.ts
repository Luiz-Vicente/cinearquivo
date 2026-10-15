import type { Facets, HomeFeed, MovieDetails, MovieKind, MovieQuery, MovieSummary, Paged } from '#shared/types/movie'

type Query = Record<string, string | number | boolean | undefined>

/** Catalog API call in the current language; refetches when the language or query changes. */
export function useCatalogFetch<T>(
  url: MaybeRefOrGetter<string>,
  query: MaybeRefOrGetter<Query> = {},
  options: { lazy?: boolean, server?: boolean, immediate?: boolean } = {},
) {
  const { locale } = useI18n()
  return useFetch<T>(() => toValue(url), {
    query: computed(() => ({ ...toValue(query), lang: locale.value })),
    ...options,
  })
}

export function useHomeFeed() {
  return useCatalogFetch<HomeFeed>('/api/home')
}

export function useFacets(kind: MaybeRefOrGetter<MovieKind | undefined>, lusophone: MaybeRefOrGetter<boolean> = false) {
  return useCatalogFetch<Facets>('/api/facets', () => ({ kind: toValue(kind), lusophone: toValue(lusophone) || undefined }))
}

export function useMovieDetails(id: MaybeRefOrGetter<number>, options: { lazy?: boolean } = {}) {
  return useCatalogFetch<MovieDetails>(() => `/api/movies/${toValue(id)}`, {}, options)
}

/** Films by id, in that order. Used for the lists kept in localStorage. */
export function useMoviesByIds(ids: MaybeRefOrGetter<number[]>) {
  const { locale } = useI18n()
  const { data, status } = useAsyncData(
    () => `movies-by-ids:${locale.value}:${toValue(ids).join(',')}`,
    async () => {
      const list = toValue(ids)
      if (!list.length) return []
      const page = await $fetch<Paged<MovieSummary>>('/api/movies', {
        query: { ids: list.join(','), pageSize: list.length, lang: locale.value },
      })
      return page.results
    },
    { server: false, lazy: true, default: () => [] },
  )
  return { items: data, status }
}

/**
 * Paginated list with "load more". Starts over when the query changes.
 * Items are derived (not accumulated in a watcher) so server and client render the same list.
 */
export function useMovieList(query: MaybeRefOrGetter<MovieQuery>) {
  const page = ref(1)
  const previous = ref<MovieSummary[]>([])
  watch(() => JSON.stringify(toValue(query)), () => {
    page.value = 1
    previous.value = []
  })

  const request = useCatalogFetch<Paged<MovieSummary>>('/api/movies', () => ({ ...toValue(query), page: page.value }), { lazy: true })

  const items = computed(() => {
    const data = request.data.value
    if (!data) return previous.value
    if (data.page === 1) return data.results
    const seen = new Set(previous.value.map(item => item.id))
    return [...previous.value, ...data.results.filter(item => !seen.has(item.id))]
  })

  const hasMore = computed(() => (request.data.value?.page ?? 0) < (request.data.value?.totalPages ?? 0))
  const total = computed(() => request.data.value?.totalResults ?? 0)

  function loadMore() {
    if (!hasMore.value || request.status.value === 'pending') return
    previous.value = items.value
    page.value++
  }

  return { items, hasMore, total, loadMore, status: request.status }
}
