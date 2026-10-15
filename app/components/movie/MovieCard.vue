<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'

const props = withDefaults(defineProps<{
  item: MovieSummary
  variant?: 'backdrop' | 'poster'
  removable?: boolean
}>(), { variant: 'poster' })

const emit = defineEmits<{ remove: [] }>()

const { t } = useI18n()
const details = useDetailsModal()

const image = computed(() => props.variant === 'poster'
  ? { path: props.item.posterPath ?? props.item.backdropPath, kind: 'poster' as const }
  : { path: props.item.backdropPath ?? props.item.posterPath, kind: 'backdrop' as const })
</script>

<template>
  <article class="group/card relative shrink-0 snap-start">
    <div
      class="relative w-full overflow-hidden rounded-xl bg-surface-sunken shadow-card ring-1 ring-border transition duration-300 ease-snappy group-hover/card:-translate-y-1 group-hover/card:shadow-pop group-focus-within/card:shadow-pop"
      :class="variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video'"
    >
      <BaseImage
        :path="image.path"
        :kind="image.kind"
        :alt="item.title"
        :sizes="variant === 'poster' ? '(min-width: 1024px) 15vw, 40vw' : '(min-width: 1024px) 22vw, 70vw'"
        class="transition duration-500 group-hover/card:scale-105"
      />

      <div
        class="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/90 via-ink/25 to-transparent transition-opacity"
        :class="variant === 'poster' ? 'opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100' : 'opacity-100'"
      />

      <!-- Primary action: the whole card opens the details. -->
      <button
        type="button"
        class="absolute inset-0 z-[1] cursor-pointer focus-visible:outline-none"
        :aria-label="`${t('actions.moreInfo')}: ${item.title}`"
        @click="details.open(item.id)"
      />

      <div
        v-if="item.kind === 'short' || item.partial"
        class="pointer-events-none absolute top-2 left-2 z-[2] flex flex-wrap gap-1"
      >
        <BaseBadge
          v-if="item.kind === 'short'"
          variant="accent"
          icon="clapperboard"
        >
          {{ t('meta.short') }}
        </BaseBadge>
        <BaseBadge
          v-if="item.partial"
          icon="scissors"
        >
          {{ t('meta.partial') }}
        </BaseBadge>
      </div>

      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-2 p-3 text-cream"
        :class="variant === 'poster' ? 'translate-y-2 opacity-0 transition group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100' : ''"
      >
        <div class="min-w-0">
          <h3 class="truncate text-sm font-bold md:text-base">
            {{ item.title }}
          </h3>
          <MovieMeta
            :year="item.year"
            :runtime="item.runtime"
            class="!text-xs !text-straw"
          >
            <BaseRating
              :score="item.rating"
              variant="inline"
              class="!text-cream"
            />
          </MovieMeta>
        </div>

        <div class="pointer-events-auto flex shrink-0 gap-1.5 opacity-100 transition md:opacity-0 md:group-hover/card:opacity-100 md:group-focus-within/card:opacity-100">
          <BaseButton
            size="sm"
            icon-only
            icon="play"
            :label="t('actions.play')"
            :to="`/watch/${item.id}`"
          />
          <BaseButton
            v-if="removable"
            size="sm"
            icon-only
            variant="secondary"
            icon="x"
            :label="t('actions.removeFromHistory')"
            @click.stop="emit('remove')"
          />
          <MovieListToggle
            v-else
            :id="item.id"
            size="sm"
          />
        </div>
      </div>

      <BaseProgress
        v-if="item.progress"
        :value="item.progress"
        :label="t('meta.watched', { percent: Math.round(item.progress * 100) })"
        class="pointer-events-none absolute inset-x-0 bottom-0 z-[2] !rounded-none"
      />
    </div>
  </article>
</template>
