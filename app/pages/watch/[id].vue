<script setup lang="ts">
definePageMeta({
  layout: 'player',
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const { t } = useI18n()
const route = useRoute('watch-id')
const router = useRouter()
const continueWatching = useContinueWatching()

const id = computed(() => Number(route.params.id))
const { data: movie, status } = useMovieDetails(id, { lazy: true })
const failed = ref(false)
watch(id, () => (failed.value = false))

watch(movie, (value) => {
  if (value) continueWatching.record(value.id)
}, { immediate: true })

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push({ path: '/', query: { details: id.value } })
}

useSeoMeta({
  title: () => movie.value?.title ?? '',
  robots: 'noindex',
})
</script>

<template>
  <div class="group/player relative size-full">
    <BaseEmptyState
      v-if="failed || (status === 'error')"
      icon="film"
      :title="t('watch.unavailable')"
      :description="t('watch.unavailableHint')"
      class="flex h-full flex-col justify-center [&_h2]:text-on-player [&_p]:text-on-player/70"
    >
      <BaseButton
        icon="arrow-left"
        :label="t('actions.back')"
        @click="goBack"
      />
      <BaseButton
        v-if="movie"
        :href="movie.video.pageUrl"
        target="_blank"
        rel="noopener"
        icon="archive"
        variant="secondary"
        :label="t('watch.openOnArchive')"
      />
    </BaseEmptyState>

    <MovieVideoPlayer
      v-else-if="movie"
      :src="movie.video.url"
      :title="movie.title"
      :start-at="continueWatching.resumePosition(movie.id)"
      :page-url="movie.video.pageUrl"
      @progress="continueWatching.saveProgress(movie.id, $event)"
      @error="failed = true"
    />

    <div
      v-else
      class="flex h-full items-center justify-center"
    >
      <BaseSpinner size="lg" />
    </div>

    <!-- Overlay bar: visible on hover / focus so it doesn't cover the film. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-linear-to-b from-player/90 to-transparent p-3 opacity-100 transition md:p-5 md:opacity-0 md:group-hover/player:opacity-100 md:focus-within:opacity-100">
      <div class="pointer-events-auto">
        <BaseButton
          icon="arrow-left"
          icon-only
          variant="secondary"
          :label="t('actions.back')"
          @click="goBack"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate font-display text-2xl leading-none tracking-wide text-on-player">
          {{ movie?.title }}
        </p>
        <p
          v-if="movie"
          class="mt-1 text-xs text-on-player/70"
        >
          {{ [movie.year, formatRuntime(movie.runtime)].filter(Boolean).join(' · ') }} ·
          <a
            :href="movie.video.pageUrl"
            target="_blank"
            rel="noopener"
            class="pointer-events-auto underline-offset-2 hover:text-on-player hover:underline"
          >{{ t('watch.source') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>
