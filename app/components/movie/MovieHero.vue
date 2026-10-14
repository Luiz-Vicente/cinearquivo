<script setup lang="ts">
import type { MovieDetails } from '#shared/types/movie'

defineProps<{ movie: MovieDetails }>()

const { t } = useI18n()
const detailsModal = useDetailsModal()
</script>

<template>
  <section class="relative isolate flex min-h-[32rem] items-end overflow-hidden h-[78svh] max-h-[52rem]">
    <div class="absolute inset-y-0 right-0 -z-10 w-full md:w-[68%]">
      <BaseImage
        :path="movie.backdropPath"
        kind="backdrop"
        :alt="movie.title"
        sizes="(min-width: 768px) 68vw, 100vw"
        eager
        class="animate-fade-in sepia-[0.15]"
      />
      <div class="absolute inset-0 bg-linear-to-r from-bg via-bg/60 to-transparent max-md:hidden" />
      <div class="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-bg/10 md:via-transparent" />
    </div>

    <div class="container-page pb-24 md:pb-32">
      <div class="max-w-xl animate-rise-in space-y-4 md:space-y-5">
        <div class="flex flex-wrap gap-2">
          <BaseBadge
            variant="accent"
            size="md"
            icon="ticket"
          >
            {{ t('meta.publicDomain') }}
          </BaseBadge>
          <BaseBadge
            v-if="movie.year"
            variant="neutral"
            size="md"
          >
            {{ t('meta.decade', { decade: decadeOf(movie.year) }) }}
          </BaseBadge>
        </div>

        <MovieTitle
          :title="movie.title"
          :logo-path="movie.logoPath"
          as="h1"
          size="lg"
        />

        <MovieMeta
          :year="movie.year"
          :runtime="movie.runtime"
          :rating="movie.rating"
          :extra="movie.directors.slice(0, 1).map(name => t('meta.directedBy', { name }))"
          class="font-medium !text-text"
        />

        <p class="line-clamp-3 max-w-xl text-sm text-text md:text-base">
          {{ movie.overview }}
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <BaseButton
            size="lg"
            icon="play"
            :to="`/watch/${movie.id}`"
            :label="t('actions.play')"
          />
          <BaseButton
            size="lg"
            variant="secondary"
            icon="info"
            :label="t('actions.moreInfo')"
            @click="detailsModal.open(movie.id)"
          />
          <MovieListToggle
            :id="movie.id"
            size="lg"
          />
        </div>
      </div>
    </div>
  </section>
</template>
