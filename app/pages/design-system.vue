<script setup lang="ts">
import type { MovieSummary } from '#shared/types/movie'

useSeoMeta({ title: 'Design system', robots: 'noindex' })

const swatches = [
  { name: 'popcorn', token: '--color-popcorn', hex: '#C8102E', role: 'Accent / CTA' },
  { name: 'cherry', token: '--color-cherry', hex: '#8E0F1F', role: 'Accent hover' },
  { name: 'cream', token: '--color-cream', hex: '#FBF3E4', role: 'App background' },
  { name: 'straw', token: '--color-straw', hex: '#F3E3C3', role: 'Sunken surfaces' },
  { name: 'butter', token: '--color-butter', hex: '#F2C14E', role: 'Highlights' },
  { name: 'ink', token: '--color-ink', hex: '#2A1A14', role: 'Primary text' },
]

const buttonVariants = ['primary', 'secondary', 'outline', 'ghost'] as const
const buttonSizes = ['sm', 'md', 'lg'] as const

const text = ref('')
const select = ref(1)
const tab = ref<'a' | 'b' | 'c'>('a')
const chip = ref(1)

const sample: MovieSummary = {
  id: 0,
  title: 'Sample title',
  originalTitle: 'Sample title',
  year: 1927,
  runtime: 94,
  kind: 'feature',
  genreIds: [],
  rating: 8.1,
  posterPath: null,
  backdropPath: null,
  partial: false,
  progress: 0.4,
}
</script>

<template>
  <div class="container-page space-y-14 pt-24 pb-16 md:pt-28">
    <BaseSectionHeader
      as="h1"
      title="Design system"
    />

    <section class="space-y-4">
      <BaseSectionHeader title="Color tokens" />
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="swatch in swatches"
          :key="swatch.name"
          class="overflow-hidden rounded-2xl bg-surface ring-1 ring-border"
        >
          <div
            class="h-20"
            :style="{ background: swatch.hex }"
          />
          <div class="space-y-0.5 p-3 text-xs">
            <p class="font-semibold text-text">
              {{ swatch.name }}
            </p>
            <p class="font-mono text-text-muted">
              {{ swatch.hex }}
            </p>
            <p class="text-text-subtle">
              {{ swatch.role }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <BaseSectionHeader title="Typography" />
      <p class="font-display text-6xl">
        Bebas Neue display
      </p>
      <p class="max-w-2xl text-text-muted">
        DM Sans for body copy. Short, readable paragraphs with muted color for secondary information.
      </p>
      <div
        class="stripes h-3 max-w-md rounded-full"
        aria-hidden="true"
      />
    </section>

    <section class="space-y-4">
      <BaseSectionHeader title="Buttons" />
      <div
        v-for="variant in buttonVariants"
        :key="variant"
        class="flex flex-wrap items-center gap-3"
      >
        <BaseButton
          v-for="size in buttonSizes"
          :key="size"
          :variant="variant"
          :size="size"
          icon="play"
          :label="`${variant} ${size}`"
        />
        <BaseButton
          :variant="variant"
          icon="plus"
          icon-only
          label="Icon only"
        />
        <BaseButton
          :variant="variant"
          loading
          label="Loading"
        />
      </div>
    </section>

    <section class="space-y-4">
      <BaseSectionHeader title="Badges, chips, rating, progress" />
      <div class="flex flex-wrap items-center gap-3">
        <BaseBadge variant="accent">
          Accent
        </BaseBadge>
        <BaseBadge variant="soft">
          Soft
        </BaseBadge>
        <BaseBadge>Neutral</BaseBadge>
        <BaseBadge variant="outline">
          Outline
        </BaseBadge>
        <BaseRating :score="7.6" />
        <BaseRating
          :score="9.1"
          size="md"
        />
        <BaseRating
          :score="8.4"
          variant="inline"
        />
        <BaseSpinner />
      </div>
      <div class="flex flex-wrap gap-2">
        <BaseChip
          v-for="n in 4"
          :key="n"
          :active="chip === n"
          @click="chip = n"
        >
          Genre {{ n }}
        </BaseChip>
      </div>
      <BaseProgress
        :value="0.42"
        label="Progress"
        class="max-w-sm"
      />
    </section>

    <section class="space-y-4">
      <BaseSectionHeader title="Form controls" />
      <div class="flex max-w-2xl flex-wrap items-center gap-3">
        <BaseInput
          v-model="text"
          icon="search"
          label="Search"
          placeholder="Search…"
          clearable
          class="max-w-xs"
        />
        <BaseSelect
          v-model="select"
          label="Sort"
          :options="[{ value: 1, label: 'Popular' }, { value: 2, label: 'Oldest' }]"
        />
        <BaseTabs
          v-model="tab"
          label="Tabs"
          :tabs="[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }, { value: 'c', label: 'Three' }]"
        />
      </div>
    </section>

    <section class="space-y-4">
      <BaseSectionHeader title="Cards & skeletons" />
      <div class="flex flex-wrap items-end gap-4">
        <MovieCard
          :item="sample"
          variant="backdrop"
          class="w-72"
        />
        <MovieCard
          :item="{ ...sample, kind: 'short', progress: undefined }"
          class="w-40"
        />
        <BaseSkeleton class="aspect-video w-72" />
      </div>
    </section>

    <section class="space-y-4">
      <BaseSectionHeader title="Empty state" />
      <BaseEmptyState
        icon="popcorn"
        title="Nothing here yet"
        description="Empty states use an icon, a title and a short hint."
      >
        <BaseButton label="Call to action" />
      </BaseEmptyState>
    </section>
  </div>
</template>
