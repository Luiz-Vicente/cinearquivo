<script setup lang="ts">
const props = defineProps<{
  id: number
  /** Rendered as a full page (h1, SEO) instead of inside the modal. */
  page?: boolean
}>()

const { t } = useI18n()
const continueWatching = useContinueWatching()
const { data: movie, status } = useMovieDetails(() => props.id, { lazy: !props.page })

const progress = computed(() => continueWatching.progressOf(props.id))
const facts = computed(() => {
  if (!movie.value) return []
  return [
    { label: t('details.directors'), value: movie.value.directors.join(', ') },
    { label: t('details.cast'), value: movie.value.cast.join(', ') },
    { label: t('details.originalTitle'), value: movie.value.originalTitle !== movie.value.title ? movie.value.originalTitle : '' },
  ].filter(fact => fact.value)
})

if (props.page) {
  useSeoMeta({
    title: () => movie.value?.title ?? '',
    description: () => movie.value?.overview ?? '',
    ogImage: () => movie.value?.backdropPath ? tmdbImageUrl(movie.value.backdropPath, 1280) : undefined,
  })
}
</script>

<template>
  <div
    v-if="status === 'pending' && !movie"
    class="space-y-6 pb-10"
  >
    <BaseSkeleton class="aspect-video w-full !rounded-none" />
    <div class="space-y-3 px-6 md:px-10">
      <BaseSkeleton class="h-8 w-1/2" />
      <BaseSkeleton class="h-24 w-full" />
    </div>
  </div>

  <BaseEmptyState
    v-else-if="!movie"
    icon="circle-alert"
    :title="t('details.notFound')"
  />

  <article
    v-else
    class="pb-10"
  >
    <!-- Hero -->
    <div class="relative aspect-video max-h-[70svh] w-full overflow-hidden bg-surface-sunken">
      <BaseImage
        :path="movie.backdropPath ?? movie.posterPath"
        kind="backdrop"
        :alt="movie.title"
        sizes="(min-width: 896px) 896px, 100vw"
        eager
        class="sepia-[0.15]"
      />
      <div class="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent" />
      <div class="absolute inset-x-0 bottom-0 space-y-4 px-6 pb-6 md:px-10 md:pb-8">
        <MovieTitle
          :title="movie.title"
          :logo-path="movie.logoPath"
          :as="page ? 'h1' : 'h2'"
        />
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton
            icon="play"
            :to="`/watch/${movie.id}`"
            :label="progress ? t('actions.resume') : t('actions.play')"
          />
          <MovieListToggle :id="movie.id" />
        </div>
        <BaseProgress
          v-if="progress"
          :value="progress"
          :label="t('meta.watched', { percent: Math.round(progress * 100) })"
          class="max-w-xs"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="grid gap-8 px-6 pt-6 md:grid-cols-[1fr_16rem] md:px-10">
      <div class="space-y-4">
        <MovieMeta
          :year="movie.year"
          :runtime="movie.runtime"
          :rating="movie.rating"
        >
          <BaseBadge
            variant="soft"
            icon="ticket"
          >
            {{ t('meta.publicDomain') }}
          </BaseBadge>
          <BaseBadge
            v-if="movie.kind === 'short'"
            variant="accent"
            icon="clapperboard"
          >
            {{ t('meta.short') }}
          </BaseBadge>
        </MovieMeta>
        <p
          v-if="movie.tagline"
          class="font-display text-2xl text-accent"
        >
          {{ movie.tagline }}
        </p>
        <p class="leading-relaxed text-text">
          {{ movie.overview || t('details.noOverview') }}
        </p>
        <p
          v-if="movie.partial"
          class="flex items-start gap-2 rounded-xl bg-surface-sunken p-3 text-sm text-text-muted"
        >
          <BaseIcon
            name="scissors"
            class="mt-0.5 shrink-0 text-accent"
          />
          {{ t('details.partial', { minutes: Math.max(1, Math.round(movie.video.duration / 60)), runtime: movie.runtime }) }}
        </p>
      </div>
      <dl class="space-y-4 text-sm">
        <div
          v-for="fact in facts"
          :key="fact.label"
        >
          <dt class="font-semibold text-text-subtle">
            {{ fact.label }}
          </dt>
          <dd class="mt-1 text-text-muted">
            {{ fact.value }}
          </dd>
        </div>
        <div v-if="movie.genres.length">
          <dt class="font-semibold text-text-subtle">
            {{ t('details.genres') }}
          </dt>
          <dd class="mt-2 flex flex-wrap gap-1.5">
            <BaseBadge
              v-for="genre in movie.genres"
              :key="genre.id"
              variant="outline"
            >
              {{ genre.name }}
            </BaseBadge>
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-text-subtle">
            {{ t('details.source') }}
          </dt>
          <dd class="mt-1">
            <a
              :href="movie.video.pageUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-hover hover:underline"
            >
              <BaseIcon name="archive" />
              Internet Archive
              <span
                v-if="movie.video.height"
                class="font-normal text-text-muted"
              >· {{ movie.video.height }}p</span>
            </a>
          </dd>
        </div>
      </dl>
    </div>

    <!-- Similar -->
    <section
      v-if="movie.similar.length"
      class="mt-10 space-y-4 px-6 md:px-10"
    >
      <BaseSectionHeader :title="t('details.similar')" />
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <MovieCard
          v-for="entry in movie.similar"
          :key="entry.id"
          :item="entry"
        />
      </div>
    </section>
  </article>
</template>
